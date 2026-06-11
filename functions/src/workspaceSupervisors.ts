import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// SECURITY: teacher privilege is granted ONLY via an admin-written
// teacherRoles/{uid} doc (scripts/grant-teacher-role.cjs) — the same source of
// truth as isVerifiedTeacher() in firestore.rules. This callable runs with the
// Admin SDK, which BYPASSES Firestore rules, so it must enforce the check
// itself. The previous implementation read crewProfiles.isTeacher / profileType,
// which are USER-WRITABLE profile fields: any student could self-label as a
// teacher and then call this function to self-elect as workspace supervisor,
// completely bypassing the 2026-06-11 rules/client hardening (which only covered
// direct writes the client no longer makes). Never gate privilege on
// crewProfiles fields again.
async function isVerifiedTeacher(db: admin.firestore.Firestore, uid: string): Promise<boolean> {
  const grant = await db.collection("teacherRoles").doc(uid).get();
  return grant.exists;
}

function isWorkspaceMember(workspace: admin.firestore.DocumentData, uid: string): boolean {
  const memberIds = Array.isArray(workspace.memberIds) ? workspace.memberIds : [];
  const members = Array.isArray(workspace.members) ? workspace.members : [];
  return memberIds.includes(uid) || members.some((member: any) => member?.userId === uid);
}

export const setWorkspaceSupervisorMode = onCall({ region: "us-central1" }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Must be signed in to change supervisor mode.");
  }

  const workspaceId = typeof request.data?.workspaceId === "string" ? request.data.workspaceId.trim() : "";
  const enabled = request.data?.enabled === true;

  if (!workspaceId) {
    throw new HttpsError("invalid-argument", "Missing workspaceId.");
  }

  const db = admin.firestore();
  const workspaceRef = db.collection("workspaces").doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists) {
    throw new HttpsError("not-found", "Workspace not found.");
  }

  const workspace = workspaceSnap.data() || {};
  if (workspace.ownerId === uid) {
    throw new HttpsError("failed-precondition", "Workspace owners do not need supervisor mode.");
  }

  if (!isWorkspaceMember(workspace, uid)) {
    throw new HttpsError("permission-denied", "Only workspace members can change supervisor mode.");
  }

  if (!await isVerifiedTeacher(db, uid)) {
    throw new HttpsError("permission-denied", "Only verified teachers can change supervisor mode.");
  }

  await workspaceRef.update({
    selfElectedSupervisors: enabled
      ? admin.firestore.FieldValue.arrayUnion(uid)
      : admin.firestore.FieldValue.arrayRemove(uid),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { workspaceId, enabled };
});
