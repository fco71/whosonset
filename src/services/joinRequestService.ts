import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  Unsubscribe,
  where
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, db } from '../firebase';

// Student-initiated "request to join a group" — the reverse of workspaceInvitations.
// A student discovers the other groups in their class through the server-maintained
// `classDirectory` (built by Cloud Functions), files a `workspaceJoinRequests` doc, and the
// group owner OR the class teacher approves/denies via the `approveJoinRequest` callable.
// All writes are gated by firestore.rules; callers own validation and user-facing toasts.

export interface ClassDirectoryGroup {
  workspaceId: string;
  name: string;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  memberNames: string[];
  memberIds: string[];
}

export interface ClassDirectory {
  id: string;          // == classId
  classId: string;
  className: string;
  groups: ClassDirectoryGroup[];
  groupWorkspaceIds: string[];
  memberIds: string[];
}

export type JoinRequestStatus = 'pending' | 'approved' | 'denied';

export interface WorkspaceJoinRequest {
  id: string;
  workspaceId: string;
  workspaceName: string;
  classId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  message?: string;
  status: JoinRequestStatus;
  createdAt?: any;
  respondedAt?: any;
}

const MAX_MESSAGE_LENGTH = 1000; // mirrors the firestore.rules cap

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');
const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

const normalizeDirectory = (id: string, data: any): ClassDirectory => ({
  id,
  classId: asString(data?.classId) || id,
  className: asString(data?.className),
  groups: Array.isArray(data?.groups)
    ? data.groups
        .filter((g: any) => g && typeof g.workspaceId === 'string')
        .map((g: any): ClassDirectoryGroup => ({
          workspaceId: g.workspaceId,
          name: asString(g.name) || 'Group',
          ownerId: asString(g.ownerId),
          ownerName: asString(g.ownerName),
          memberCount: typeof g.memberCount === 'number' ? g.memberCount : asStringArray(g.memberIds).length,
          memberNames: asStringArray(g.memberNames),
          memberIds: asStringArray(g.memberIds)
        }))
    : [],
  groupWorkspaceIds: asStringArray(data?.groupWorkspaceIds),
  memberIds: asStringArray(data?.memberIds)
});

const normalizeRequest = (id: string, data: any): WorkspaceJoinRequest => ({
  id,
  workspaceId: asString(data?.workspaceId),
  workspaceName: asString(data?.workspaceName),
  classId: asString(data?.classId),
  requesterId: asString(data?.requesterId),
  requesterName: asString(data?.requesterName),
  requesterEmail: asString(data?.requesterEmail),
  message: asString(data?.message) || undefined,
  status: (['pending', 'approved', 'denied'].includes(data?.status) ? data.status : 'pending') as JoinRequestStatus,
  createdAt: data?.createdAt,
  respondedAt: data?.respondedAt
});

/**
 * Live subscription to the class directories the user can see — one per class they belong
 * to (a student is usually in exactly one). The `array-contains` query matches the
 * classDirectory read rule (memberIds.hasAny([uid])), so it only ever returns readable docs.
 */
export function subscribeToClassDirectory(
  uid: string,
  onChange: (directories: ClassDirectory[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'classDirectory'), where('memberIds', 'array-contains', uid)),
    snapshot => onChange(snapshot.docs.map(d => normalizeDirectory(d.id, d.data()))),
    err => {
      console.error('Error subscribing to class directory:', err);
      onError?.(err);
    }
  );
}

/**
 * File a pending join request for a group in the student's class. Skips creation if the
 * student already has a pending request for that group (mirrors the dedupe in
 * createWorkspaceInvitations). Returns 'created' or 'duplicate'.
 */
export async function createJoinRequest(params: {
  workspaceId: string;
  workspaceName: string;
  classId: string;
  requester: { uid: string; name?: string | null; email?: string | null };
  message?: string;
}): Promise<'created' | 'duplicate'> {
  const { workspaceId, workspaceName, classId, requester, message } = params;

  const existing = await getDocs(query(
    collection(db, 'workspaceJoinRequests'),
    where('workspaceId', '==', workspaceId),
    where('requesterId', '==', requester.uid),
    where('status', '==', 'pending'),
    limit(1)
  ));
  if (!existing.empty) return 'duplicate';

  const trimmedMessage = (message || '').trim().slice(0, MAX_MESSAGE_LENGTH);
  await addDoc(collection(db, 'workspaceJoinRequests'), {
    workspaceId,
    workspaceName,
    classId,
    requesterId: requester.uid,
    requesterName: requester.name || requester.email || 'A student',
    requesterEmail: requester.email || '',
    ...(trimmedMessage ? { message: trimmedMessage } : {}),
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return 'created';
}

/** Pending join requests for one group — owner/supervisor panel. Status filtered client-side. */
export function subscribeToJoinRequestsForWorkspace(
  workspaceId: string,
  onChange: (requests: WorkspaceJoinRequest[]) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'workspaceJoinRequests'), where('workspaceId', '==', workspaceId)),
    snapshot => onChange(
      snapshot.docs.map(d => normalizeRequest(d.id, d.data())).filter(r => r.status === 'pending')
    ),
    err => console.error('Error subscribing to workspace join requests:', err)
  );
}

/** Pending join requests across one class — teacher panel. Status filtered client-side. */
export function subscribeToJoinRequestsForClass(
  classId: string,
  onChange: (requests: WorkspaceJoinRequest[]) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'workspaceJoinRequests'), where('classId', '==', classId)),
    snapshot => onChange(
      snapshot.docs.map(d => normalizeRequest(d.id, d.data())).filter(r => r.status === 'pending')
    ),
    err => console.error('Error subscribing to class join requests:', err)
  );
}

/** The current user's own outgoing requests (any status) — drives per-group state in the UI. */
export function subscribeToMyJoinRequests(
  uid: string,
  onChange: (requests: WorkspaceJoinRequest[]) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'workspaceJoinRequests'), where('requesterId', '==', uid)),
    snapshot => onChange(snapshot.docs.map(d => normalizeRequest(d.id, d.data()))),
    err => console.error('Error subscribing to my join requests:', err)
  );
}

/**
 * Approve or deny a join request. Membership changes happen server-side in the
 * `approveJoinRequest` callable (Admin SDK) — the client never writes membership directly.
 */
export async function respondToJoinRequest(
  requestId: string,
  response: 'approve' | 'deny'
): Promise<void> {
  const functions = getFunctions(app, 'us-central1');
  const approveJoinRequest = httpsCallable(functions, 'approveJoinRequest');
  await approveJoinRequest({ requestId, response });
}

/**
 * Teacher (or group owner / supervisor) directly adds a user to a group as a member.
 * Membership is granted server-side by the `addStudentToWorkspace` callable (Admin SDK).
 * Returns 'added' or 'already_member'.
 */
export async function addStudentToWorkspace(
  workspaceId: string,
  userId: string
): Promise<'added' | 'already_member'> {
  const functions = getFunctions(app, 'us-central1');
  const addMember = httpsCallable(functions, 'addStudentToWorkspace');
  const result = await addMember({ workspaceId, userId });
  return (result.data as { status?: string })?.status === 'already_member' ? 'already_member' : 'added';
}

/**
 * Remove a member from a group (undo a wrong add). Server-side via the `removeWorkspaceMember`
 * callable (owner / supervisor / class teacher; the owner can't be removed).
 */
export async function removeWorkspaceMember(
  workspaceId: string,
  userId: string
): Promise<'removed' | 'not_member'> {
  const functions = getFunctions(app, 'us-central1');
  const removeMember = httpsCallable(functions, 'removeWorkspaceMember');
  const result = await removeMember({ workspaceId, userId });
  return (result.data as { status?: string })?.status === 'not_member' ? 'not_member' : 'removed';
}
