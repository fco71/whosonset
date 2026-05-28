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
exports.setWorkspaceSupervisorMode = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
async function isTeacherProfile(db, uid) {
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
function isWorkspaceMember(workspace, uid) {
    const memberIds = Array.isArray(workspace.memberIds) ? workspace.memberIds : [];
    const members = Array.isArray(workspace.members) ? workspace.members : [];
    return memberIds.includes(uid) || members.some((member) => (member === null || member === void 0 ? void 0 : member.userId) === uid);
}
exports.setWorkspaceSupervisorMode = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    var _a, _b, _c;
    const uid = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid) {
        throw new https_1.HttpsError("unauthenticated", "Must be signed in to change supervisor mode.");
    }
    const workspaceId = typeof ((_b = request.data) === null || _b === void 0 ? void 0 : _b.workspaceId) === "string" ? request.data.workspaceId.trim() : "";
    const enabled = ((_c = request.data) === null || _c === void 0 ? void 0 : _c.enabled) === true;
    if (!workspaceId) {
        throw new https_1.HttpsError("invalid-argument", "Missing workspaceId.");
    }
    const db = admin.firestore();
    const workspaceRef = db.collection("workspaces").doc(workspaceId);
    const workspaceSnap = await workspaceRef.get();
    if (!workspaceSnap.exists) {
        throw new https_1.HttpsError("not-found", "Workspace not found.");
    }
    const workspace = workspaceSnap.data() || {};
    if (workspace.ownerId === uid) {
        throw new https_1.HttpsError("failed-precondition", "Workspace owners do not need supervisor mode.");
    }
    if (!isWorkspaceMember(workspace, uid)) {
        throw new https_1.HttpsError("permission-denied", "Only workspace members can change supervisor mode.");
    }
    if (!await isTeacherProfile(db, uid)) {
        throw new https_1.HttpsError("permission-denied", "Only teacher profiles can change supervisor mode.");
    }
    await workspaceRef.update({
        selfElectedSupervisors: enabled
            ? admin.firestore.FieldValue.arrayUnion(uid)
            : admin.firestore.FieldValue.arrayRemove(uid),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { workspaceId, enabled };
});
//# sourceMappingURL=workspaceSupervisors.js.map