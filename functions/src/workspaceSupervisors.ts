import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

async function isTeacherProfile(db: admin.firestore.Firestore, uid: string): Promise<boolean> {
  const directProfile = await db.collection("crewProfiles").doc(uid).get();
  if (directProfile.exists) {
    const data = directProfile.data() || {};
    if (data.isTeacher === true || data.profileType === "teacher") {
      return true;
    }
  }

  const uidProfiles = await db.collection("crewProfiles").where("uid", "==", uid).limit(3).get();
  return uidProfiles.docs.some((profile) => {
    const data = profile.data();
    return data.isTeacher === true || data.profileType === "teacher";
  });
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

  if (!await isTeacherProfile(db, uid)) {
    throw new HttpsError("permission-denied", "Only teacher profiles can change supervisor mode.");
  }

  await workspaceRef.update({
    selfElectedSupervisors: enabled
      ? admin.firestore.FieldValue.arrayUnion(uid)
      : admin.firestore.FieldValue.arrayRemove(uid),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { workspaceId, enabled };
});
