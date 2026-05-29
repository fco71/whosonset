"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondToWorkspaceInvitation = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const VALID_ROLES = new Set(["member", "supervisor", "viewer"]);
const BATCH_LIMIT = 450;
function permissionsForRole(role) {
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
async function addUserToWorkspaceScreenplays(db, workspaceId, uid) {
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
async function notifyInviter(db, workspaceId, inviterId, inviteeName, workspaceName, accepted) {
    const safeInvitee = inviteeName || "Someone";
    await db.collection("notifications").add({
        userId: inviterId,
        type: accepted ? "workspace_invitation_accepted" : "workspace_invitation_declined",
        // English fallback strings; titleKey/bodyKey/i18nParams let the recipient's client
        // render in their own locale (the function has no notion of the recipient's language).
        title: accepted ? "Workspace invitation accepted" : "Workspace invitation declined",
        body: `${safeInvitee} ${accepted ? "accepted" : "declined"} the invitation to ${workspaceName}.`,
        message: `${safeInvitee} ${accepted ? "accepted" : "declined"} the invitation to ${workspaceName}.`,
        titleKey: accepted
            ? "collaboration.notifications.invitationAccepted.title"
            : "collaboration.notifications.invitationDeclined.title",
        bodyKey: accepted
            ? "collaboration.notifications.invitationAccepted.body"
            : "collaboration.notifications.invitationDeclined.body",
        i18nParams: { invitee: safeInvitee, workspace: workspaceName },
        isRead: false,
        read: false,
        relatedId: workspaceId,
        link: "/collaboration",
        metadata: { workspaceId },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
}
exports.respondToWorkspaceInvitation = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    var _a, _b;
    const auth = request.auth;
    const uid = auth === null || auth === void 0 ? void 0 : auth.uid;
    if (!uid) {
        throw new https_1.HttpsError("unauthenticated", "Must be signed in to respond to a workspace invitation.");
    }
    const invitationId = typeof ((_a = request.data) === null || _a === void 0 ? void 0 : _a.invitationId) === "string" ? request.data.invitationId.trim() : "";
    const response = (_b = request.data) === null || _b === void 0 ? void 0 : _b.response;
    if (!invitationId) {
        throw new https_1.HttpsError("invalid-argument", "Missing invitationId.");
    }
    if (response !== "accept" && response !== "decline") {
        throw new https_1.HttpsError("invalid-argument", "Response must be accept or decline.");
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
            throw new https_1.HttpsError("not-found", "Workspace invitation not found.");
        }
        const invitation = invitationSnap.data() || {};
        if (invitation.inviteeId !== uid) {
            throw new https_1.HttpsError("permission-denied", "This invitation belongs to another user.");
        }
        if (invitation.status !== "pending") {
            throw new https_1.HttpsError("failed-precondition", "This invitation has already been handled.");
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
        const role = VALID_ROLES.has(invitation.role) ? invitation.role : "member";
        const workspaceRef = db.collection("workspaces").doc(workspaceId);
        const workspaceSnap = await transaction.get(workspaceRef);
        if (!workspaceSnap.exists) {
            throw new https_1.HttpsError("not-found", "Workspace no longer exists.");
        }
        const workspace = workspaceSnap.data() || {};
        const members = Array.isArray(workspace.members) ? workspace.members : [];
        const memberIds = Array.isArray(workspace.memberIds) ? workspace.memberIds : [];
        const alreadyMember = memberIds.includes(uid) || members.some((member) => (member === null || member === void 0 ? void 0 : member.userId) === uid);
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
//# sourceMappingURL=workspaceInvitations.js.map