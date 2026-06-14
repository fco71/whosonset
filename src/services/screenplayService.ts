import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { CollaborationWorkspace, ScreenplayReviewStatus, WorkspaceRole } from '../types/Collaboration';
import { logWorkspaceActivity, WorkspaceActivityVerb } from './workspaceActivityService';
import {
  getWorkspaceMemberIds,
  getReviewStatus,
  Screenplay
} from '../components/Collaboration/workspaceAccess';
import { normalizeScene, sceneCsvMetadata, SceneMark } from './sceneService';

// Firestore/Storage mutations shared by CollaborationHub and WorkspaceDetailPage.
// Callers own validation, permission checks, and user-facing toasts; functions here
// throw on failure (except activity logging, which is best-effort by design) so the
// caller can report it. Document shapes written here are unchanged from the original
// hub implementation — keep it that way unless firestore.rules moves with you.

export interface ActorInfo {
  uid: string;
  displayName?: string | null;
}

// Accepted screenplay file extensions for the button-driven upload flow.
export const SCREENPLAY_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'] as const;
export const isAcceptedScreenplayFile = (file: File): boolean => {
  const lower = file.name.toLowerCase();
  return SCREENPLAY_FILE_EXTENSIONS.some(ext => lower.endsWith(ext));
};

/** Upload one screenplay file to Storage and create its Firestore doc. */
export async function uploadScreenplayFile(params: {
  file: File;
  actor: ActorInfo;
  workspace: CollaborationWorkspace | null;
  projectId?: string | null;
  assignmentId?: string | null;
}): Promise<Screenplay> {
  const { file, actor, workspace, projectId, assignmentId } = params;

  const storageRef = ref(storage, `screenplays/${actor.uid}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  const workspaceMemberIds = workspace ? getWorkspaceMemberIds(workspace) : [];
  const teamMemberIds = Array.from(new Set([actor.uid, ...workspaceMemberIds]));

  const now = new Date();
  const screenplayData: Omit<Screenplay, 'id'> = {
    name: file.name,
    type: file.type || 'application/octet-stream',
    url: downloadURL,
    uploadedBy: actor.uid,
    teamMembers: teamMemberIds,
    workspaceId: workspace?.id || null,
    projectId: projectId || workspace?.projectId || null,
    assignmentId: (workspace && assignmentId) || null,
    size: file.size,
    reviewStatus: 'draft',
    uploadedAt: now,
    lastModified: now
  };

  const docRef = await addDoc(collection(db, 'screenplays'), screenplayData);
  if (workspace?.id) {
    logWorkspaceActivity({
      workspaceId: workspace.id,
      actorUid: actor.uid,
      actorName: actor.displayName,
      verb: 'screenplay_uploaded',
      targetId: docRef.id,
      targetName: file.name
    });
  }
  return { ...screenplayData, id: docRef.id };
}

/** Create a new in-browser Fountain screenplay (no file upload). */
export async function createFountainScreenplay(params: {
  title: string;
  actor: ActorInfo;
  workspace: CollaborationWorkspace | null;
  projectId?: string | null;
  assignmentId?: string | null;
}): Promise<Screenplay> {
  const { title, actor, workspace, projectId, assignmentId } = params;

  const workspaceMemberIds = workspace ? getWorkspaceMemberIds(workspace) : [];
  const teamMemberIds = Array.from(new Set([actor.uid, ...workspaceMemberIds]));
  const now = new Date();
  const screenplayData: Omit<Screenplay, 'id'> = {
    name: title,
    type: 'fountain',
    url: '',
    format: 'fountain',
    fountainSource: '',
    uploadedBy: actor.uid,
    teamMembers: teamMemberIds,
    workspaceId: workspace?.id || null,
    projectId: projectId || workspace?.projectId || null,
    assignmentId: (workspace && assignmentId) || null,
    reviewStatus: 'draft',
    uploadedAt: now,
    lastModified: now
  };
  const docRef = await addDoc(collection(db, 'screenplays'), screenplayData);
  const created: Screenplay = { ...screenplayData, id: docRef.id };

  if (workspace?.id) {
    logWorkspaceActivity({
      workspaceId: workspace.id,
      actorUid: actor.uid,
      actorName: actor.displayName,
      verb: 'screenplay_created',
      targetId: created.id,
      targetName: title
    });
  }
  return created;
}

/** Delete a screenplay doc and log the activity. Caller checks permission first. */
export async function deleteScreenplayDoc(screenplay: Screenplay, actor: ActorInfo): Promise<void> {
  await deleteDoc(doc(db, 'screenplays', screenplay.id));
  if (screenplay.workspaceId) {
    logWorkspaceActivity({
      workspaceId: screenplay.workspaceId,
      actorUid: actor.uid,
      actorName: actor.displayName,
      verb: 'screenplay_deleted',
      targetId: screenplay.id,
      targetName: screenplay.name
    });
  }
}

export const getReviewActivityVerb = (status: ScreenplayReviewStatus): WorkspaceActivityVerb => {
  switch (status) {
    case 'submitted':
      return 'review_submitted';
    case 'changes_requested':
      return 'review_changes_requested';
    case 'approved':
      return 'review_approved';
    case 'draft':
    default:
      return 'review_returned_to_draft';
  }
};

/** Update a screenplay's review status. Caller checks permission first. */
export async function setScreenplayReviewStatus(
  screenplay: Screenplay,
  nextStatus: ScreenplayReviewStatus,
  actor: ActorInfo
): Promise<Partial<Screenplay>> {
  await updateDoc(doc(db, 'screenplays', screenplay.id), {
    reviewStatus: nextStatus,
    reviewStatusUpdatedAt: serverTimestamp(),
    reviewStatusUpdatedBy: actor.uid,
    reviewStatusNote: '',
    lastModified: serverTimestamp()
  });
  if (screenplay.workspaceId) {
    logWorkspaceActivity({
      workspaceId: screenplay.workspaceId,
      actorUid: actor.uid,
      actorName: actor.displayName,
      verb: getReviewActivityVerb(nextStatus),
      targetId: screenplay.id,
      targetName: screenplay.name
    });
  }
  return {
    reviewStatus: nextStatus,
    reviewStatusUpdatedAt: new Date(),
    reviewStatusUpdatedBy: actor.uid,
    reviewStatusNote: ''
  };
}

/**
 * Create pending invitations (+ notification docs) for users not already in the
 * workspace. Skips users with an existing pending invite. Returns how many were sent.
 * `t` is the caller's i18n translate function — stored title/body are a fallback in the
 * sender's locale; titleKey/bodyKey/i18nParams let the recipient render in their own.
 */
export async function createWorkspaceInvitations(params: {
  workspace: CollaborationWorkspace;
  users: Array<{ id: string; name?: string; email?: string }>;
  getRole: (user: { id: string }) => Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>;
  actor: ActorInfo;
  t: (key: string, options?: any) => string;
}): Promise<number> {
  const { workspace, users, getRole, actor, t } = params;
  if (users.length === 0) return 0;

  const existingMemberIds = new Set(getWorkspaceMemberIds(workspace));
  const invitees = users.filter(user => user.id && !existingMemberIds.has(user.id));
  if (invitees.length === 0) return 0;

  const inviterName = actor.displayName || t('collaboration.notifications.someone');

  const sentInvites = await Promise.all(invitees.map(async user => {
    const existingPendingInvite = await getDocs(query(
      collection(db, 'workspaceInvitations'),
      where('workspaceId', '==', workspace.id),
      where('inviteeId', '==', user.id),
      where('status', '==', 'pending'),
      limit(1)
    ));
    if (!existingPendingInvite.empty) return false;

    const role = getRole(user);
    const batch = writeBatch(db);
    const invitationRef = doc(collection(db, 'workspaceInvitations'));

    batch.set(invitationRef, {
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      inviterId: actor.uid,
      inviterName,
      inviteeId: user.id,
      inviteeName: user.name || user.email || 'Collaborator',
      inviteeEmail: user.email || '',
      role,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // The invitee notification is now written server-side by the
    // notifyWorkspaceInvitationCreated Cloud Function (Phase 2), which fires on the
    // invitation doc created above. The client only creates the invitation.
    await batch.commit();
    return true;
  }));

  return sentInvites.filter(Boolean).length;
}

/**
 * Workspace-level grading export: one CSV that combines every student's screenplay +
 * the supervisor + peer notes left on each. Used by teachers at grading time so they
 * don't have to walk into each screenplay and export individually. Caller gates this
 * behind canExportGradingReport. Triggers a browser download; throws on failure.
 */
export async function exportWorkspaceGradingCsv(params: {
  workspace: CollaborationWorkspace;
  screenplays: Screenplay[];
  t: (key: string, options?: any) => string;
}): Promise<void> {
  const { workspace, screenplays, t } = params;
  const screenplayIds = screenplays.map(s => s.id);
  // 1. Pull annotations + tags across all screenplays in the workspace
  //    (chunked by 10 — Firestore `in` limit).
  const annotationsRef = collection(db, 'screenplayAnnotations');
  const tagsRef = collection(db, 'screenplayTags');
  const scenesRef = collection(db, 'screenplayScenes');
  type RawNote = { screenplayId?: string; userName?: string; userId?: string; pageNumber?: number; position?: { y?: number }; content?: string; annotation?: string; supervisorAtAuthorTime?: boolean; resolved?: boolean; timestamp?: unknown; tagType?: string };
  const allAnnotations: RawNote[] = [];
  const allTags: RawNote[] = [];
  const scenesByScreenplay = new Map<string, SceneMark[]>();
  for (let i = 0; i < screenplayIds.length; i += 10) {
    const chunk = screenplayIds.slice(i, i + 10);
    const [annSnap, tagSnap, sceneSnap] = await Promise.all([
      getDocs(query(annotationsRef, where('screenplayId', 'in', chunk))),
      getDocs(query(tagsRef, where('screenplayId', 'in', chunk))),
      getDocs(query(scenesRef, where('screenplayId', 'in', chunk)))
    ]);
    annSnap.docs.forEach(d => allAnnotations.push(d.data() as RawNote));
    tagSnap.docs.forEach(d => allTags.push(d.data() as RawNote));
    sceneSnap.docs.forEach(d => {
      const scene = normalizeScene(d.id, d.data());
      const list = scenesByScreenplay.get(scene.screenplayId) || [];
      list.push(scene);
      scenesByScreenplay.set(scene.screenplayId, list);
    });
  }
  // 2. Resolve student names by crewProfile DOCUMENT ID (doc id == uid).
  // crewProfiles created at signup omit the `uid` field on purpose, so a
  // where('uid','in',...) query misses them and the Student column falls
  // back to "Crew Member <last4>". A doc-id get is robust either way.
  const uploaderUids = Array.from(new Set(screenplays.map(s => s.uploadedBy).filter((u): u is string => Boolean(u))));
  const uidToName = new Map<string, string>();
  await Promise.all(uploaderUids.map(async uid => {
    try {
      const snap = await getDoc(doc(db, 'crewProfiles', uid));
      if (snap.exists()) {
        const data: any = snap.data();
        uidToName.set(uid, data.name || data.displayName || `Crew Member ${uid.slice(-4)}`);
      }
    } catch {
      // Ignore — fallback name handles missing/unreadable profiles.
    }
  }));
  // 3. Build rows. One per note, with Student + Screenplay columns prepended.
  const escapeCsv = (v: unknown): string => `"${(v === null || v === undefined ? '' : String(v)).replace(/"/g, '""')}"`;
  const headers = [
    t('collaboration.gradingReport.columns.student'),
    t('collaboration.gradingReport.columns.screenplay'),
    t('collaboration.gradingReport.columns.reviewStatus'),
    t('collaboration.gradingReport.columns.reviewNote'),
    t('collaboration.gradingReport.columns.type'),
    t('collaboration.gradingReport.columns.category'),
    t('collaboration.gradingReport.columns.page'),
    t('collaboration.gradingReport.columns.scene'),
    t('collaboration.gradingReport.columns.scriptDay'),
    t('collaboration.gradingReport.columns.unit'),
    t('collaboration.gradingReport.columns.sequence'),
    t('collaboration.gradingReport.columns.estimatedTime'),
    t('collaboration.gradingReport.columns.pageEighths'),
    t('collaboration.gradingReport.columns.content'),
    t('collaboration.gradingReport.columns.author'),
    t('collaboration.gradingReport.columns.supervisor'),
    t('collaboration.gradingReport.columns.resolved'),
    t('collaboration.gradingReport.columns.timestamp')
  ].map(escapeCsv).join(',');
  const yes = t('collaboration.gradingReport.boolean.yes');
  const no = t('collaboration.gradingReport.boolean.no');
  const screenplayById = new Map(screenplays.map(s => [s.id, s]));
  const toIso = (ts: unknown): string => {
    if (!ts) return '';
    try {
      const d = (ts as any)?.toDate ? (ts as any).toDate() : new Date(ts as any);
      return isNaN(d.getTime()) ? '' : d.toISOString();
    } catch { return ''; }
  };
  type Row = { student: string; screenplay: string; reviewStatus: string; reviewNote: string; type: string; category: string; page: number; scene: string; scriptDay: string; unit: string; sequence: string; estimatedTime: string; pageEighths: string; content: string; author: string; supervisor: string; resolved: string; timestamp: string };
  const sceneDetails = (note: RawNote) => {
    if (!note.screenplayId) {
      return {
        scene: '',
        scriptDay: '',
        unit: '',
        sequence: '',
        estimatedTime: '',
        pageEighths: ''
      };
    }
    const scenes = scenesByScreenplay.get(note.screenplayId) || [];
    return sceneCsvMetadata(scenes, note.pageNumber ?? 0, note.position?.y || 0);
  };
  const rowsFromNotes = (notes: RawNote[], type: string, category: (note: RawNote) => string, content: (note: RawNote) => string): Row[] =>
    notes.map(n => {
      const sp = n.screenplayId ? screenplayById.get(n.screenplayId) : undefined;
      const student = sp?.uploadedBy ? (uidToName.get(sp.uploadedBy) || `Crew Member ${sp.uploadedBy.slice(-4)}`) : '';
      const reviewStatus = sp ? t(`collaboration.reviewStatus.labels.${getReviewStatus(sp)}`) : '';
      const metadata = sceneDetails(n);
      return {
        student,
        screenplay: sp?.name || '',
        reviewStatus,
        reviewNote: sp?.reviewStatusNote || '',
        type,
        category: category(n),
        page: n.pageNumber ?? 0,
        ...metadata,
        content: content(n) || '',
        author: n.userName || '',
        supervisor: n.supervisorAtAuthorTime ? yes : no,
        resolved: n.resolved ? yes : no,
        timestamp: toIso(n.timestamp)
      };
    });
  const allRows: Row[] = [
    ...rowsFromNotes(allAnnotations, t('collaboration.gradingReport.types.annotation'), () => '', n => n.annotation || ''),
    ...rowsFromNotes(allTags, t('collaboration.gradingReport.types.tag'), n => n.tagType ? t(`screenplay.categories.${n.tagType}`, { defaultValue: n.tagType }) : '', n => n.content || '')
  ];
  allRows.sort((a, b) => a.student.localeCompare(b.student) || a.screenplay.localeCompare(b.screenplay) || a.page - b.page || a.timestamp.localeCompare(b.timestamp));
  const csv = '﻿' + [headers, ...allRows.map(r => [r.student, r.screenplay, r.reviewStatus, r.reviewNote, r.type, r.category, r.page, r.scene, r.scriptDay, r.unit, r.sequence, r.estimatedTime, r.pageEighths, r.content, r.author, r.supervisor, r.resolved, r.timestamp].map(escapeCsv).join(','))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const safeName = (workspace.name || 'workspace').replace(/[^a-z0-9\-_]+/gi, '-').slice(0, 60) || 'workspace';
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}-grading-${date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
