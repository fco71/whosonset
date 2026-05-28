import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

/**
 * Admin cascade for the collaboration footprint of a departing user.
 *
 * Runs with admin privileges (bypasses security rules), so it can do the parts the client
 * cannot during account deletion:
 *   - remove the user from every workspace's members[] / memberIds[] / supervisorIds /
 *     viewerIds / selfElectedSupervisors arrays (the client can only do this for workspaces
 *     it owns),
 *   - delete the user's workspaceMemberships docs everywhere (client delete is owner-only),
 *   - hard-delete the workspaces the user OWNS (the client can only soft-delete, gated by
 *     the 30-day recovery window).
 *
 * Self-only: a caller can only clean up their OWN uid (request.auth.uid). There is no way to
 * target another user, so this can't be abused to tamper with others' workspaces.
 *
 * Invoked by the client (AuthContext) during account deletion, before the auth user is
 * removed. Idempotent — safe to call more than once.
 *
 * NOTE: screenplays owned by a deleted workspace are intentionally left in place; co-authors
 * keep access via the screenplay's own teamMembers list. A deeper screenplay cascade can be
 * added later if needed.
 */

const COMMIT_CHUNK = 450; // Firestore batches cap at 500 ops.

async function deleteRefsInChunks(
  db: admin.firestore.Firestore,
  refs: admin.firestore.DocumentReference[]
): Promise<void> {
  for (let i = 0; i < refs.length; i += COMMIT_CHUNK) {
    const batch = db.batch();
    refs.slice(i, i + COMMIT_CHUNK).forEach(ref => batch.delete(ref));
    await batch.commit();
  }
}

export const cleanupUserWorkspaces = onCall({ region: "us-central1" }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Must be signed in to clean up workspaces.");
  }

  const db = admin.firestore();
  const summary = {
    ownedWorkspacesDeleted: 0,
    workspacesLeft: 0,
    membershipDocsDeleted: 0
  };

  // 1. Discover every workspace the user touches — union of their membership docs and the
  // memberIds array (the latter catches workspaces created before the memberships migration).
  const workspaceIds = new Set<string>();

  const membershipSnap = await db.collection("workspaceMemberships").where("userId", "==", uid).get();
  membershipSnap.docs.forEach(d => {
    const wid = d.data().workspaceId;
    if (typeof wid === "string" && wid) workspaceIds.add(wid);
  });

  const memberArraySnap = await db.collection("workspaces").where("memberIds", "array-contains", uid).get();
  memberArraySnap.docs.forEach(d => workspaceIds.add(d.id));

  // 2. Process each workspace.
  for (const workspaceId of workspaceIds) {
    const wsRef = db.collection("workspaces").doc(workspaceId);
    const wsSnap = await wsRef.get();
    if (!wsSnap.exists) continue;
    const ws = wsSnap.data() || {};

    if (ws.ownerId === uid) {
      // Owner is leaving -> delete the workspace and all of its membership docs.
      const wsMembers = await db.collection("workspaceMemberships").where("workspaceId", "==", workspaceId).get();
      await deleteRefsInChunks(db, wsMembers.docs.map(d => d.ref));
      summary.membershipDocsDeleted += wsMembers.size;
      await wsRef.delete();
      summary.ownedWorkspacesDeleted += 1;
    } else {
      // Member is leaving -> strip them from the workspace's arrays + drop their membership.
      const members = Array.isArray(ws.members) ? ws.members : [];
      await wsRef.update({
        members: members.filter((m: any) => m && m.userId !== uid),
        memberIds: admin.firestore.FieldValue.arrayRemove(uid),
        supervisorIds: admin.firestore.FieldValue.arrayRemove(uid),
        viewerIds: admin.firestore.FieldValue.arrayRemove(uid),
        selfElectedSupervisors: admin.firestore.FieldValue.arrayRemove(uid),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      await db.collection("workspaceMemberships").doc(`${workspaceId}_${uid}`).delete().catch(() => undefined);
      summary.workspacesLeft += 1;
    }
  }

  // 3. Sweep any stray membership docs for this user (e.g. workspaces already gone).
  const strays = await db.collection("workspaceMemberships").where("userId", "==", uid).get();
  await deleteRefsInChunks(db, strays.docs.map(d => d.ref));
  summary.membershipDocsDeleted += strays.size;

  console.log(`[cleanupUserWorkspaces] uid=${uid}`, summary);
  return summary;
});
