import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

type WorkspaceRole = "member" | "supervisor" | "viewer";
type InvitationResponse = "accept" | "decline";

const VALID_ROLES = new Set<WorkspaceRole>(["member", "supervisor", "viewer"]);
const BATCH_LIMIT = 450;

function permissionsForRole(role: WorkspaceRole): string[] {
  switch (role) {
    case "supervisor":
      return ["read", "comment", "annotate"];
    case "viewer":
      return ["read"];
    case "member":
    default:
      return ["read", "write", "comment"];
  }
}

async function addUserToWorkspaceScreenplays(
  db: admin.firestore.Firestore,
  workspaceId: string,
  uid: string
): Promise<void> {
  const snapshot = await db.collection("screenplays").where("workspaceId", "==", workspaceId).get();
  for (let i = 0; i < snapshot.docs.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    snapshot.docs.slice(i, i + BATCH_LIMIT).forEach((screenplay) => {
      batch.update(screenplay.ref, {
        teamMembers: admin.firestore.FieldValue.arrayUnion(uid),
        lastModified: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    await batch.commit();
  }
}

async function notifyInviter(
  db: admin.firestore.Firestore,
  workspaceId: string,
  inviterId: string,
  inviteeName: string,
  workspaceName: string,
  accepted: boolean
): Promise<void> {
  await db.collection("notifications").add({
    userId: inviterId,
    type: accepted ? "workspace_invitation_accepted" : "workspace_invitation_declined",
    title: accepted ? "Workspace invitation accepted" : "Workspace invitation declined",
    body: `${inviteeName || "Someone"} ${accepted ? "accepted" : "declined"} the invitation to ${workspaceName}.`,
    message: `${inviteeName || "Someone"} ${accepted ? "accepted" : "declined"} the invitation to ${workspaceName}.`,
    isRead: false,
    read: false,
    relatedId: workspaceId,
    link: "/collaboration",
    metadata: { workspaceId },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
}

export const respondToWorkspaceInvitation = onCall({ region: "us-central1" }, async (request) => {
  const auth = request.auth;
  const uid = auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Must be signed in to respond to a workspace invitation.");
  }

  const invitationId = typeof request.data?.invitationId === "string" ? request.data.invitationId.trim() : "";
  const response = request.data?.response as InvitationResponse;

  if (!invitationId) {
    throw new HttpsError("invalid-argument", "Missing invitationId.");
  }
  if (response !== "accept" && response !== "decline") {
    throw new HttpsError("invalid-argument", "Response must be accept or decline.");
  }

  const db = admin.firestore();
  const invitationRef = db.collection("workspaceInvitations").doc(invitationId);
  let workspaceId = "";
  let inviterId = "";
  let inviteeName = "";
  let workspaceName = "";
  let accepted = false;

  await db.runTransaction(async (transaction) => {
    const invitationSnap = await transaction.get(invitationRef);
    if (!invitationSnap.exists) {
      throw new HttpsError("not-found", "Workspace invitation not found.");
    }

    const invitation = invitationSnap.data() || {};
    if (invitation.inviteeId !== uid) {
      throw new HttpsError("permission-denied", "This invitation belongs to another user.");
    }
    if (invitation.status !== "pending") {
      throw new HttpsError("failed-precondition", "This invitation has already been handled.");
    }

    workspaceId = typeof invitation.workspaceId === "string" ? invitation.workspaceId : "";
    inviterId = typeof invitation.inviterId === "string" ? invitation.inviterId : "";
    inviteeName = typeof invitation.inviteeName === "string" ? invitation.inviteeName : "";
    workspaceName = typeof invitation.workspaceName === "string" ? invitation.workspaceName : "workspace";

    if (response === "decline") {
      transaction.update(invitationRef, {
        status: "declined",
        respondedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return;
    }

    const role = VALID_ROLES.has(invitation.role) ? invitation.role as WorkspaceRole : "member";
    const workspaceRef = db.collection("workspaces").doc(workspaceId);
    const workspaceSnap = await transaction.get(workspaceRef);
    if (!workspaceSnap.exists) {
      throw new HttpsError("not-found", "Workspace no longer exists.");
    }

    const workspace = workspaceSnap.data() || {};
    const members = Array.isArray(workspace.members) ? workspace.members : [];
    const memberIds = Array.isArray(workspace.memberIds) ? workspace.memberIds : [];
    const alreadyMember = memberIds.includes(uid) || members.some((member: any) => member?.userId === uid);
    const now = admin.firestore.Timestamp.now();

    const updatedMembers = alreadyMember
      ? members
      : [
          ...members,
          {
            userId: uid,
            email: invitation.inviteeEmail || auth.token.email || "",
            role,
            joinedAt: now,
            permissions: permissionsForRole(role),
            isOnline: false,
            lastSeen: now
          }
        ];

    transaction.update(workspaceRef, {
      members: updatedMembers,
      memberIds: admin.firestore.FieldValue.arrayUnion(uid),
      supervisorIds: role === "supervisor"
        ? admin.firestore.FieldValue.arrayUnion(uid)
        : admin.firestore.FieldValue.arrayRemove(uid),
      viewerIds: role === "viewer"
        ? admin.firestore.FieldValue.arrayUnion(uid)
        : admin.firestore.FieldValue.arrayRemove(uid),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    transaction.set(db.collection("workspaceMemberships").doc(`${workspaceId}_${uid}`), {
      workspaceId,
      userId: uid,
      role,
      ownerId: workspace.ownerId || "",
      projectId: workspace.projectId || null,
      status: workspace.status || "active",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    transaction.update(invitationRef, {
      status: "accepted",
      respondedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    accepted = true;
  });

  if (accepted) {
    await addUserToWorkspaceScreenplays(db, workspaceId, uid);
  }

  if (inviterId && inviterId !== uid) {
    await notifyInviter(db, workspaceId, inviterId, inviteeName || auth.token.name || "A collaborator", workspaceName, accepted);
  }

  return { status: accepted ? "accepted" : "declined", workspaceId };
});
