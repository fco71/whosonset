import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

// Student-initiated "request to join a group" — the reverse of the owner-driven
// workspaceInvitations flow. A student discovers the other groups in their class via the
// server-maintained `classDirectory` (built here), creates a `workspaceJoinRequests` doc,
// and the group OWNER or the class TEACHER approves/denies through `approveJoinRequest`.
//
// SAFETY: the membership-grant logic below is DELIBERATELY DUPLICATED from
// workspaceInvitations.ts `respondToWorkspaceInvitation` (its accept branch) rather than
// shared, so this future-phase feature cannot destabilise the live invitation path. The
// notification helpers mirror createInAppNotification / notifyInviter for an identical doc
// shape (so NotificationCenter renders these the same way). Keep the two in sync by hand;
// extracting a shared helper is a future cleanup. Admin SDK BYPASSES firestore.rules, so
// every callable here enforces its own authorization.

type WorkspaceRole = "member" | "supervisor" | "viewer";
type JoinResponse = "approve" | "deny";

const BATCH_LIMIT = 450;

// --- Helpers mirrored from workspaceInvitations.ts (kept local on purpose) -------------

async function getUserDisplayName(
  db: admin.firestore.Firestore,
  uid: string,
  fallback: string
): Promise<string> {
  const [crewSnapshot, userSnapshot] = await Promise.all([
    db.collection("crewProfiles").doc(uid).get(),
    db.collection("users").doc(uid).get()
  ]);
  const crew = crewSnapshot.data() || {};
  const user = userSnapshot.data() || {};
  const candidates = [crew.name, crew.displayName, user.name, user.displayName, fallback];
  const resolved = candidates.find((value) => typeof value === "string" && value.trim());
  return typeof resolved === "string" ? resolved.trim() : "A collaborator";
}

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

// Inverse of addUserToWorkspaceScreenplays: drop a removed member from the group's
// screenplays' teamMembers. Screenplays they uploaded stay reachable to them via
// uploadedBy; this only revokes the membership-granted access to the rest.
async function removeUserFromWorkspaceScreenplays(
  db: admin.firestore.Firestore,
  workspaceId: string,
  uid: string
): Promise<void> {
  const snapshot = await db.collection("screenplays").where("workspaceId", "==", workspaceId).get();
  for (let i = 0; i < snapshot.docs.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    snapshot.docs.slice(i, i + BATCH_LIMIT).forEach((screenplay) => {
      batch.update(screenplay.ref, {
        teamMembers: admin.firestore.FieldValue.arrayRemove(uid),
        lastModified: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    await batch.commit();
  }
}

// Shared by approveJoinRequest and addStudentToWorkspace: append a user to a workspace's
// members + memberIds and write the workspaceMemberships index doc, inside a caller-owned
// transaction. Returns whether they were ALREADY a member, so the caller can skip the
// post-commit screenplay-access grant + notification. Mirrors respondToWorkspaceInvitation's
// accept branch — the one proven membership-grant shape — kept local to this file.
function grantWorkspaceMembershipInTx(
  transaction: admin.firestore.Transaction,
  db: admin.firestore.Firestore,
  params: {
    workspaceRef: admin.firestore.DocumentReference;
    workspace: admin.firestore.DocumentData;
    uid: string;
    email: string;
    role: WorkspaceRole;
  }
): boolean {
  const { workspaceRef, workspace, uid, email, role } = params;
  const members = Array.isArray(workspace.members) ? workspace.members : [];
  const memberIds = Array.isArray(workspace.memberIds) ? workspace.memberIds : [];
  const alreadyMember = memberIds.includes(uid) || members.some((m: any) => m?.userId === uid);
  const now = admin.firestore.Timestamp.now();

  const updatedMembers = alreadyMember
    ? members
    : [
        ...members,
        {
          userId: uid,
          email,
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
    // Mirror respondToWorkspaceInvitation: keep the role arrays consistent with the granted
    // role. Without the arrayRemove, a uid left in supervisorIds/viewerIds from a prior
    // elevation would silently re-elevate the user when they're approved back as a member.
    supervisorIds: role === "supervisor"
      ? admin.firestore.FieldValue.arrayUnion(uid)
      : admin.firestore.FieldValue.arrayRemove(uid),
    viewerIds: role === "viewer"
      ? admin.firestore.FieldValue.arrayUnion(uid)
      : admin.firestore.FieldValue.arrayRemove(uid),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  transaction.set(db.collection("workspaceMemberships").doc(`${workspaceRef.id}_${uid}`), {
    workspaceId: workspaceRef.id,
    userId: uid,
    role,
    ownerId: workspace.ownerId || "",
    projectId: workspace.projectId || null,
    status: workspace.status || "active",
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  return alreadyMember;
}

// Writes a notification doc with the same shape as index.ts createInAppNotification /
// workspaceInvitations.ts notifyInviter — titleKey/bodyKey/i18nParams let each recipient
// render in their own locale; title/body are the sender-locale fallback.
interface NotificationInput {
  userId: string;
  type: string;
  title: string;
  body: string;
  titleKey?: string;
  bodyKey?: string;
  i18nParams?: Record<string, unknown>;
  link?: string;
  relatedId?: string;
  senderId?: string;
  senderName?: string;
  metadata?: Record<string, unknown>;
}

async function addNotification(db: admin.firestore.Firestore, input: NotificationInput): Promise<void> {
  if (!input.userId) return;
  const now = admin.firestore.FieldValue.serverTimestamp();
  const body = input.body || input.title || "You have a new notification.";
  const payload: Record<string, unknown> = {
    userId: input.userId,
    type: input.type || "system",
    title: input.title || "Notification",
    body,
    message: body,
    isRead: false,
    read: false,
    createdAt: now,
    timestamp: now
  };
  if (input.link) {
    payload.link = input.link;
    payload.actionUrl = input.link;
  }
  if (input.relatedId) payload.relatedId = input.relatedId;
  if (input.senderId) payload.senderId = input.senderId;
  if (input.senderName) payload.senderName = input.senderName;
  if (input.titleKey) payload.titleKey = input.titleKey;
  if (input.bodyKey) payload.bodyKey = input.bodyKey;
  if (input.i18nParams) payload.i18nParams = input.i18nParams;
  if (input.metadata) payload.metadata = input.metadata;
  await db.collection("notifications").add(payload);
}

async function notifyRequester(
  db: admin.firestore.Firestore,
  requesterId: string,
  workspaceId: string,
  workspaceName: string,
  approved: boolean
): Promise<void> {
  if (!requesterId) return;
  await addNotification(db, {
    userId: requesterId,
    type: approved ? "workspace_join_request_approved" : "workspace_join_request_denied",
    title: approved ? "Join request approved" : "Join request declined",
    body: approved
      ? `You're now a member of ${workspaceName}.`
      : `Your request to join ${workspaceName} was declined.`,
    titleKey: approved
      ? "collaboration.notifications.joinRequestApproved.title"
      : "collaboration.notifications.joinRequestDenied.title",
    bodyKey: approved
      ? "collaboration.notifications.joinRequestApproved.body"
      : "collaboration.notifications.joinRequestDenied.body",
    i18nParams: { workspace: workspaceName },
    // On approval, land the student on the group they just joined (they're a member, so
    // it's readable). Declines go to the hub — there's nothing to open.
    link: approved ? `/collaboration/${workspaceId}` : "/collaboration",
    relatedId: workspaceId,
    metadata: { workspaceId }
  });
}

// --- classDirectory: server-maintained, student-readable view of a class's groups ------

// Rebuild (full overwrite) the classDirectory doc for one class. Reads the teacherClass,
// then each ACTIVE group it contains, and denormalizes the group name/owner/members plus a
// flat `groupWorkspaceIds` and the union `memberIds` (drives the rules read gate). A
// per-rebuild name cache avoids re-fetching the same uid (the owner is also a member).
async function rebuildClassDirectory(db: admin.firestore.Firestore, classId: string): Promise<void> {
  const directoryRef = db.collection("classDirectory").doc(classId);
  const classSnap = await db.collection("teacherClasses").doc(classId).get();
  if (!classSnap.exists) {
    await directoryRef.delete().catch(() => undefined);
    return;
  }

  const classData = classSnap.data() || {};
  const workspaceIds: string[] = Array.isArray(classData.workspaceIds)
    ? classData.workspaceIds.filter((id: unknown): id is string => typeof id === "string")
    : [];

  const nameCache = new Map<string, string>();
  const resolveName = async (uid: string): Promise<string> => {
    if (nameCache.has(uid)) return nameCache.get(uid) as string;
    const name = await getUserDisplayName(db, uid, "Crew member");
    nameCache.set(uid, name);
    return name;
  };

  const groups: Array<Record<string, unknown>> = [];
  const memberIdUnion = new Set<string>();

  for (const wsId of workspaceIds) {
    const wsSnap = await db.collection("workspaces").doc(wsId).get();
    if (!wsSnap.exists) continue;
    const ws = wsSnap.data() || {};
    if (ws.status && ws.status !== "active") continue; // hide archived/deleted groups

    const memberIds: string[] = Array.isArray(ws.memberIds)
      ? ws.memberIds.filter((id: unknown): id is string => typeof id === "string")
      : [];
    memberIds.forEach((uid) => memberIdUnion.add(uid));

    const memberNames = await Promise.all(memberIds.map((uid) => resolveName(uid)));
    const ownerId = typeof ws.ownerId === "string" ? ws.ownerId : "";
    const ownerName = ownerId ? await resolveName(ownerId) : "";

    groups.push({
      workspaceId: wsId,
      name: typeof ws.name === "string" ? ws.name : "Group",
      ownerId,
      ownerName,
      memberCount: memberIds.length,
      memberNames,
      memberIds
    });
  }

  await directoryRef.set({
    classId,
    className: typeof classData.name === "string" ? classData.name : "",
    groups,
    groupWorkspaceIds: groups.map((g) => g.workspaceId as string),
    memberIds: Array.from(memberIdUnion),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

// Rebuild the directory when a class's groups (or name) change, or on class delete.
export const onTeacherClassWritten = onDocumentWritten({
  document: "teacherClasses/{classId}",
  region: "us-central1"
}, async (event) => {
  try {
    const before = event.data?.before;
    const after = event.data?.after;
    // Skip no-op updates: only group membership of the class (workspaceIds) or its name
    // affect the directory.
    if (before?.exists && after?.exists) {
      const b = before.data() || {};
      const a = after.data() || {};
      const sameWorkspaces =
        JSON.stringify(Array.isArray(b.workspaceIds) ? b.workspaceIds : []) ===
        JSON.stringify(Array.isArray(a.workspaceIds) ? a.workspaceIds : []);
      const sameName = (b.name || "") === (a.name || "");
      if (sameWorkspaces && sameName) return;
    }
    await rebuildClassDirectory(admin.firestore(), event.params.classId);
  } catch (error) {
    console.error("[onTeacherClassWritten] Error:", error);
  }
});

// Rebuild directories of every class containing a workspace when that workspace's
// membership / name / owner / status changes (or it is created/deleted).
export const onWorkspaceWrittenSyncDirectories = onDocumentWritten({
  document: "workspaces/{workspaceId}",
  region: "us-central1"
}, async (event) => {
  try {
    const before = event.data?.before;
    const after = event.data?.after;
    const b = before?.exists ? before.data() || {} : null;
    const a = after?.exists ? after.data() || {} : null;

    const signature = (x: admin.firestore.DocumentData | null) =>
      x
        ? JSON.stringify({
            m: (Array.isArray(x.memberIds) ? x.memberIds : []).slice().sort(),
            n: x.name || "",
            o: x.ownerId || "",
            s: x.status || "active"
          })
        : null;
    // Bail when nothing the directory cares about changed (e.g. a supervisor-only or
    // settings-only update, or an updatedAt bump).
    if (b && a && signature(b) === signature(a)) return;

    const db = admin.firestore();
    const classesSnap = await db
      .collection("teacherClasses")
      .where("workspaceIds", "array-contains", event.params.workspaceId)
      .get();
    for (const classDoc of classesSnap.docs) {
      await rebuildClassDirectory(db, classDoc.id);
    }
  } catch (error) {
    console.error("[onWorkspaceWrittenSyncDirectories] Error:", error);
  }
});

// --- Join requests ---------------------------------------------------------------------

// Notify the group OWNER when a student requests to join. Resolves the workspace's REAL
// owner (never trusts the client doc). Models notifyWorkspaceInvitationCreated.
export const notifyWorkspaceJoinRequestCreated = onDocumentCreated({
  document: "workspaceJoinRequests/{requestId}",
  region: "us-central1"
}, async (event) => {
  try {
    const data = event.data?.data();
    if (!data) return;
    if (typeof data.status === "string" && data.status !== "pending") return;

    const workspaceId = typeof data.workspaceId === "string" ? data.workspaceId : "";
    const requesterId = typeof data.requesterId === "string" ? data.requesterId : "";
    if (!workspaceId || !requesterId) return;

    const db = admin.firestore();
    const wsSnap = await db.collection("workspaces").doc(workspaceId).get();
    if (!wsSnap.exists) return;
    const ws = wsSnap.data() || {};
    const ownerId = typeof ws.ownerId === "string" ? ws.ownerId : "";
    if (!ownerId || ownerId === requesterId) return; // never self-notify

    // Throttle: only the FIRST pending request from this requester for this workspace
    // notifies the owner. The client dedupes pending requests, but a direct write could
    // bypass that and spam the owner; this guards the notification path server-side.
    const pendingDup = await db.collection("workspaceJoinRequests")
      .where("workspaceId", "==", workspaceId)
      .where("requesterId", "==", requesterId)
      .where("status", "==", "pending")
      .limit(2)
      .get();
    if (pendingDup.docs.some((d) => d.id !== event.params.requestId)) return;

    const workspaceName =
      typeof data.workspaceName === "string" && data.workspaceName
        ? data.workspaceName
        : (typeof ws.name === "string" ? ws.name : "your group");
    const requesterName = await getUserDisplayName(
      db,
      requesterId,
      typeof data.requesterName === "string" && data.requesterName ? data.requesterName : "A student"
    );

    await addNotification(db, {
      userId: ownerId,
      type: "workspace_join_request",
      title: "Request to join your group",
      body: `${requesterName} asked to join ${workspaceName}.`,
      titleKey: "collaboration.notifications.joinRequest.title",
      bodyKey: "collaboration.notifications.joinRequest.body",
      i18nParams: { requester: requesterName, workspace: workspaceName },
      link: `/collaboration/${workspaceId}`,
      relatedId: workspaceId,
      senderId: requesterId,
      senderName: requesterName,
      metadata: { joinRequestId: event.params.requestId, workspaceId }
    });
  } catch (error) {
    console.error("[notifyWorkspaceJoinRequestCreated] Error:", error);
  }
});

// Can `uid` approve/deny a request for `workspaceId`? Owner OR effective supervisor of the
// group, OR a verified teacher who owns a class containing this workspace.
async function canApproveJoinRequest(
  db: admin.firestore.Firestore,
  uid: string,
  workspaceId: string,
  workspace: admin.firestore.DocumentData
): Promise<boolean> {
  if (workspace.ownerId === uid) return true;
  const supervisorIds = Array.isArray(workspace.supervisorIds) ? workspace.supervisorIds : [];
  const selfElected = Array.isArray(workspace.selfElectedSupervisors) ? workspace.selfElectedSupervisors : [];
  if (supervisorIds.includes(uid) || selfElected.includes(uid)) return true;

  // Class-teacher path: an admin-granted teacherRoles doc AND ownership of a class that
  // contains this workspace. Single equality query (no composite index needed); a teacher
  // owns few classes.
  const teacherGrant = await db.collection("teacherRoles").doc(uid).get();
  if (!teacherGrant.exists) return false;
  const classesSnap = await db.collection("teacherClasses").where("ownerId", "==", uid).get();
  return classesSnap.docs.some((classDoc) => {
    const w = classDoc.data().workspaceIds;
    return Array.isArray(w) && w.includes(workspaceId);
  });
}

// Approve or deny a student's join request. On approve, grants membership exactly as
// respondToWorkspaceInvitation's accept branch does (members + memberIds +
// workspaceMemberships + screenplay teamMembers). Always grants role 'member'.
export const approveJoinRequest = onCall({ region: "us-central1" }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Must be signed in to respond to a join request.");
  }

  const requestId = typeof request.data?.requestId === "string" ? request.data.requestId.trim() : "";
  const response = request.data?.response as JoinResponse;
  if (!requestId) {
    throw new HttpsError("invalid-argument", "Missing requestId.");
  }
  if (response !== "approve" && response !== "deny") {
    throw new HttpsError("invalid-argument", "Response must be approve or deny.");
  }

  const db = admin.firestore();
  const requestRef = db.collection("workspaceJoinRequests").doc(requestId);

  const requestSnap = await requestRef.get();
  if (!requestSnap.exists) {
    throw new HttpsError("not-found", "Join request not found.");
  }
  const reqData = requestSnap.data() || {};
  if (reqData.status !== "pending") {
    throw new HttpsError("failed-precondition", "This request has already been handled.");
  }
  const workspaceId = typeof reqData.workspaceId === "string" ? reqData.workspaceId : "";
  const requesterId = typeof reqData.requesterId === "string" ? reqData.requesterId : "";
  if (!workspaceId || !requesterId) {
    throw new HttpsError("failed-precondition", "Malformed join request.");
  }

  const workspaceRef = db.collection("workspaces").doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists) {
    throw new HttpsError("not-found", "Group no longer exists.");
  }
  const workspaceData = workspaceSnap.data() || {};

  if (!await canApproveJoinRequest(db, uid, workspaceId, workspaceData)) {
    throw new HttpsError(
      "permission-denied",
      "Only the group owner or the class teacher can respond to join requests."
    );
  }

  const workspaceName =
    typeof reqData.workspaceName === "string" && reqData.workspaceName
      ? reqData.workspaceName
      : (typeof workspaceData.name === "string" ? workspaceData.name : "group");

  if (response === "deny") {
    await requestRef.update({
      status: "denied",
      respondedAt: admin.firestore.FieldValue.serverTimestamp(),
      respondedBy: uid
    });
    await notifyRequester(db, requesterId, workspaceId, workspaceName, false);
    return { status: "denied", workspaceId };
  }

  // approve — mirrors respondToWorkspaceInvitation accept (role is always 'member').
  const role: WorkspaceRole = "member";
  let approved = false;
  await db.runTransaction(async (transaction) => {
    const freshRequest = await transaction.get(requestRef);
    if (!freshRequest.exists || (freshRequest.data() || {}).status !== "pending") {
      throw new HttpsError("failed-precondition", "This request has already been handled.");
    }
    const freshWorkspace = await transaction.get(workspaceRef);
    if (!freshWorkspace.exists) {
      throw new HttpsError("not-found", "Group no longer exists.");
    }
    grantWorkspaceMembershipInTx(transaction, db, {
      workspaceRef,
      workspace: freshWorkspace.data() || {},
      uid: requesterId,
      email: typeof reqData.requesterEmail === "string" ? reqData.requesterEmail : "",
      role
    });

    transaction.update(requestRef, {
      status: "approved",
      respondedAt: admin.firestore.FieldValue.serverTimestamp(),
      respondedBy: uid
    });
    approved = true;
  });

  if (approved) {
    await addUserToWorkspaceScreenplays(db, workspaceId, requesterId);
    await notifyRequester(db, requesterId, workspaceId, workspaceName, true);
  }

  return { status: "approved", workspaceId };
});

// Teacher-initiated direct add: a verified teacher (or the group owner / effective
// supervisor) adds any user to a group in their class as a 'member'. This is what lets a
// teacher bring in a student who isn't in any group yet — once added they appear in the
// class roster and the classDirectory, breaking the "groupless student is invisible"
// catch-22. Grants membership through the same shared path as join-request approval; no
// request doc is involved. Authz mirrors canApproveJoinRequest, so the Admin SDK enforces it.
export const addStudentToWorkspace = onCall({ region: "us-central1" }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Must be signed in to add a group member.");
  }

  const workspaceId = typeof request.data?.workspaceId === "string" ? request.data.workspaceId.trim() : "";
  const userId = typeof request.data?.userId === "string" ? request.data.userId.trim() : "";
  if (!workspaceId || !userId) {
    throw new HttpsError("invalid-argument", "A group and a user are required.");
  }

  const db = admin.firestore();

  // The target must be a real account.
  let targetEmail = "";
  try {
    const targetUser = await admin.auth().getUser(userId);
    targetEmail = targetUser.email || "";
  } catch {
    throw new HttpsError("not-found", "That user account was not found.");
  }

  const workspaceRef = db.collection("workspaces").doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists) {
    throw new HttpsError("not-found", "Group no longer exists.");
  }
  const workspaceData = workspaceSnap.data() || {};

  // Owner / effective supervisor / teacher who owns a class containing this group — the same
  // set that may approve a join request.
  if (!await canApproveJoinRequest(db, uid, workspaceId, workspaceData)) {
    throw new HttpsError(
      "permission-denied",
      "Only the group owner or the class teacher can add members to this group."
    );
  }

  const role: WorkspaceRole = "member";
  const alreadyMember = await db.runTransaction(async (transaction) => {
    const fresh = await transaction.get(workspaceRef);
    if (!fresh.exists) {
      throw new HttpsError("not-found", "Group no longer exists.");
    }
    return grantWorkspaceMembershipInTx(transaction, db, {
      workspaceRef,
      workspace: fresh.data() || {},
      uid: userId,
      email: targetEmail,
      role
    });
  });

  if (!alreadyMember) {
    await addUserToWorkspaceScreenplays(db, workspaceId, userId);
    const actorName = await getUserDisplayName(db, uid, "Your teacher");
    const workspaceName = typeof workspaceData.name === "string" && workspaceData.name ? workspaceData.name : "a group";
    await addNotification(db, {
      userId,
      type: "collaborator_added",
      title: "Added to a group",
      body: `${actorName} added you to ${workspaceName}.`,
      titleKey: "collaboration.notifications.addedToWorkspace.title",
      bodyKey: "collaboration.notifications.addedToWorkspace.body",
      i18nParams: { inviter: actorName, workspace: workspaceName, role },
      link: `/collaboration/${workspaceId}`,
      relatedId: workspaceId,
      senderId: uid,
      senderName: actorName,
      metadata: { workspaceId }
    });
  }

  return { status: alreadyMember ? "already_member" : "added", workspaceId, userId };
});

// Remove a member from a workspace (undo a wrong add). Strips them from the member arrays,
// deletes the membership index doc, and revokes screenplay access. Same authz as add
// (owner / effective supervisor / class teacher). The owner cannot be removed.
export const removeWorkspaceMember = onCall({ region: "us-central1" }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Must be signed in to remove a group member.");
  }

  const workspaceId = typeof request.data?.workspaceId === "string" ? request.data.workspaceId.trim() : "";
  const userId = typeof request.data?.userId === "string" ? request.data.userId.trim() : "";
  if (!workspaceId || !userId) {
    throw new HttpsError("invalid-argument", "A group and a user are required.");
  }

  const db = admin.firestore();
  const workspaceRef = db.collection("workspaces").doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists) {
    throw new HttpsError("not-found", "Group no longer exists.");
  }
  const workspaceData = workspaceSnap.data() || {};

  if (!await canApproveJoinRequest(db, uid, workspaceId, workspaceData)) {
    throw new HttpsError(
      "permission-denied",
      "Only the group owner or the class teacher can remove members from this group."
    );
  }
  if (workspaceData.ownerId === userId) {
    throw new HttpsError("failed-precondition", "The group owner can't be removed.");
  }

  const removed = await db.runTransaction(async (transaction) => {
    const fresh = await transaction.get(workspaceRef);
    if (!fresh.exists) {
      throw new HttpsError("not-found", "Group no longer exists.");
    }
    const data = fresh.data() || {};
    const members = Array.isArray(data.members) ? data.members : [];
    const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];
    const wasMember = memberIds.includes(userId) || members.some((m: any) => m?.userId === userId);
    transaction.update(workspaceRef, {
      members: members.filter((m: any) => m?.userId !== userId),
      memberIds: admin.firestore.FieldValue.arrayRemove(userId),
      supervisorIds: admin.firestore.FieldValue.arrayRemove(userId),
      viewerIds: admin.firestore.FieldValue.arrayRemove(userId),
      selfElectedSupervisors: admin.firestore.FieldValue.arrayRemove(userId),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    transaction.delete(db.collection("workspaceMemberships").doc(`${workspaceId}_${userId}`));
    return wasMember;
  });

  // Revoke access to the group's screenplays (their own uploads stay reachable via uploadedBy).
  await removeUserFromWorkspaceScreenplays(db, workspaceId, userId);

  return { status: removed ? "removed" : "not_member", workspaceId, userId };
});
