import * as functionsV1 from "firebase-functions/v1";
import * as admin from "firebase-admin";

/**
 * Auth-deletion cleanup: when a Firebase Auth user is removed — including via the
 * Firebase Console, which the client-side in-app deletion flow never sees — strip
 * their footprint out of the web app so they stop showing up (e.g. in the Crew
 * directory backed by `crewProfiles`).
 *
 * This is a 1st-gen Auth trigger (`functions.auth.user().onDelete`). There is no
 * native 2nd-gen equivalent for Auth user lifecycle, and 1st- and 2nd-gen functions
 * coexist fine in one codebase. It fires for EVERY deletion path (Console, Admin SDK,
 * client self-delete), so it is the durable, source-agnostic fix.
 *
 * DATA-SAFETY SCOPE — this trigger runs automatically with no human confirming at
 * delete-time, so it is deliberately CONSERVATIVE and only removes data that is
 * unambiguously personal to the deleted user:
 *
 *   DELETES:
 *     - crewProfiles/{uid}            (the directory profile — the whole point)
 *     - UserCollections/{uid}
 *     - users/{uid} (+ its notifications / savedJobs / favoriteApplicants subcollections)
 *     - userPreferences/{uid}
 *     - emailTracking/{uid}
 *     - the user's own workspaceMemberships docs
 *     - the user's own top-level notifications (where userId == uid)
 *     - removes the uid from the member arrays of workspaces they were a MEMBER of
 *
 *   PRESERVES (intentionally — this is shared/collaborative data that other users
 *   may depend on, and auto-deleting it could erase a colleague's or student's work):
 *     - workspaces the deleted user OWNS (e.g. a teacher's workspace full of student
 *       screenplays). Instead of deleting, it logs a warning listing the workspace IDs
 *       so an admin can review and remove them manually if desired.
 *     - screenplays, annotations, and any other workspace content.
 *
 * This is MORE conservative than the in-app self-delete (cleanupUserWorkspaces), which
 * hard-deletes owned workspaces — that path is user-initiated with explicit consent,
 * whereas this one is admin/console-initiated and fires with no per-deletion review.
 *
 * Idempotent and best-effort: individual deletes that miss (already-gone docs) are
 * swallowed so one absent doc can't abort the rest.
 */

const REGION = "us-central1";
const COMMIT_CHUNK = 450; // Firestore batches cap at 500 ops.

// 1st-gen functions default to the App Engine service account
// (my-film-jobs@appspot.gserviceaccount.com), which on this project does NOT have
// Firestore access — the function deployed fine but every run died with
// `PERMISSION_DENIED` on its first `.get()` (the Admin SDK bypasses rules, so a
// denial there is an IAM problem, not a rules problem). Pin it to the SAME Compute
// Engine service account the Gen-2 functions already run as; that account has the
// Firestore roles the cleanup needs. Project number 403346239424.
const RUNTIME_SERVICE_ACCOUNT =
  "403346239424-compute@developer.gserviceaccount.com";

async function deleteRefsInChunks(
  db: admin.firestore.Firestore,
  refs: admin.firestore.DocumentReference[]
): Promise<number> {
  for (let i = 0; i < refs.length; i += COMMIT_CHUNK) {
    const batch = db.batch();
    refs.slice(i, i + COMMIT_CHUNK).forEach(ref => batch.delete(ref));
    await batch.commit();
  }
  return refs.length;
}

async function deleteSubcollection(
  db: admin.firestore.Firestore,
  parent: admin.firestore.DocumentReference,
  name: string
): Promise<number> {
  const snap = await parent.collection(name).get();
  if (snap.empty) return 0;
  return deleteRefsInChunks(db, snap.docs.map(d => d.ref));
}

export const onAuthUserDeleted = functionsV1
  .runWith({ serviceAccount: RUNTIME_SERVICE_ACCOUNT })
  .region(REGION)
  .auth.user()
  .onDelete(async (user) => {
    const uid = user.uid;
    const db = admin.firestore();

    const summary = {
      crewProfileDeleted: false,
      userCollectionsDeleted: false,
      userDocDeleted: false,
      userPreferencesDeleted: false,
      emailTrackingDeleted: false,
      userSubdocsDeleted: 0,
      membershipDocsDeleted: 0,
      workspacesStrippedAsMember: 0,
      ownedWorkspacesPreserved: 0,
      ownedWorkspaceIds: [] as string[],
      notificationsDeleted: 0,
    };

    // --- 1. Personal top-level docs (owner == this user; safe to hard-delete) ---
    const crewRef = db.collection("crewProfiles").doc(uid);
    if ((await crewRef.get()).exists) {
      await crewRef.delete().catch(() => undefined);
      summary.crewProfileDeleted = true;
    }
    // Remove the directory profile's notifications subcollection too.
    summary.userSubdocsDeleted += await deleteSubcollection(db, crewRef, "notifications").catch(() => 0);

    const collectionsRef = db.collection("UserCollections").doc(uid);
    if ((await collectionsRef.get()).exists) {
      await collectionsRef.delete().catch(() => undefined);
      summary.userCollectionsDeleted = true;
    }

    const userRef = db.collection("users").doc(uid);
    if ((await userRef.get()).exists) {
      // Best-effort sweep of the known per-user subcollections before the parent doc.
      for (const sub of ["notifications", "savedJobs", "favoriteApplicants"]) {
        summary.userSubdocsDeleted += await deleteSubcollection(db, userRef, sub).catch(() => 0);
      }
      await userRef.delete().catch(() => undefined);
      summary.userDocDeleted = true;
    }

    const prefsRef = db.collection("userPreferences").doc(uid);
    if ((await prefsRef.get()).exists) {
      await prefsRef.delete().catch(() => undefined);
      summary.userPreferencesDeleted = true;
    }

    const emailTrackingRef = db.collection("emailTracking").doc(uid);
    if ((await emailTrackingRef.get()).exists) {
      await emailTrackingRef.delete().catch(() => undefined);
      summary.emailTrackingDeleted = true;
    }

    // --- 2. Workspaces: strip membership, but NEVER auto-delete owned workspaces ---
    const workspaceIds = new Set<string>();

    const membershipSnap = await db
      .collection("workspaceMemberships")
      .where("userId", "==", uid)
      .get();
    membershipSnap.docs.forEach(d => {
      const wid = d.data().workspaceId;
      if (typeof wid === "string" && wid) workspaceIds.add(wid);
    });

    const memberArraySnap = await db
      .collection("workspaces")
      .where("memberIds", "array-contains", uid)
      .get();
    memberArraySnap.docs.forEach(d => workspaceIds.add(d.id));

    for (const workspaceId of workspaceIds) {
      const wsRef = db.collection("workspaces").doc(workspaceId);
      const wsSnap = await wsRef.get();
      if (!wsSnap.exists) continue;
      const ws = wsSnap.data() || {};

      if (ws.ownerId === uid) {
        // PRESERVE owned workspaces (shared content lives here). Log for manual review.
        summary.ownedWorkspacesPreserved += 1;
        summary.ownedWorkspaceIds.push(workspaceId);
        continue;
      }

      // Non-owner member leaving: remove them from every membership array.
      const members = Array.isArray(ws.members) ? ws.members : [];
      await wsRef
        .update({
          members: members.filter((m: any) => m && m.userId !== uid),
          memberIds: admin.firestore.FieldValue.arrayRemove(uid),
          supervisorIds: admin.firestore.FieldValue.arrayRemove(uid),
          viewerIds: admin.firestore.FieldValue.arrayRemove(uid),
          selfElectedSupervisors: admin.firestore.FieldValue.arrayRemove(uid),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        .catch(() => undefined);
      summary.workspacesStrippedAsMember += 1;
    }

    // Delete the user's own membership/discovery docs (keyed by userId).
    const strays = await db
      .collection("workspaceMemberships")
      .where("userId", "==", uid)
      .get();
    summary.membershipDocsDeleted += await deleteRefsInChunks(
      db,
      strays.docs.map(d => d.ref)
    ).catch(() => 0);

    // --- 3. The user's own top-level notifications ---
    const notifSnap = await db
      .collection("notifications")
      .where("userId", "==", uid)
      .get();
    summary.notificationsDeleted += await deleteRefsInChunks(
      db,
      notifSnap.docs.map(d => d.ref)
    ).catch(() => 0);

    if (summary.ownedWorkspacesPreserved > 0) {
      console.warn(
        `[onAuthUserDeleted] uid=${uid} owned ${summary.ownedWorkspacesPreserved} ` +
          `workspace(s) that were PRESERVED (may contain other users' work). ` +
          `Review manually: ${summary.ownedWorkspaceIds.join(", ")}`
      );
    }

    console.log(`[onAuthUserDeleted] uid=${uid} cleanup summary`, summary);
    return summary;
  });
