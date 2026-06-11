import {
  CollaborationWorkspace,
  ScreenplayReviewStatus,
  WorkspaceMember,
  WorkspaceRole,
  WorkspaceSettings
} from '../../types/Collaboration';

// Pure capability + normalization helpers shared by CollaborationHub (the groups
// list) and WorkspaceDetailPage (a single group's page). Role semantics live here
// ONLY — both pages must agree on who can edit/review/manage, and these mirror the
// Firestore rules (see firestore.rules: isWorkspaceMemberData, canEditScreenplayData).

// Screenplay/document upload size cap. Kept equal to the Storage rule's
// `isDocumentUpload` limit (25MB) so the client rejects oversized files with a
// clear message instead of letting them fail later with an opaque Storage
// permission error. Raise BOTH this and storage.rules together if needed.
export const MAX_UPLOAD_MB = 25;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettings = {
  allowGuestAccess: false,
  requireApproval: true,
  autoArchive: false,
  retentionDays: 365,
  maxFileSize: MAX_UPLOAD_BYTES,
  allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
};

export interface Screenplay {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy?: string;
  teamMembers?: string[];
  workspaceId?: string | null;
  projectId?: string | null;
  uploadedAt?: Date | { seconds: number; nanoseconds: number };
  lastModified?: Date | { seconds: number; nanoseconds: number };
  size?: number;
  // Fountain (in-browser writing) support. format defaults to 'pdf' for legacy/uploaded
  // docs; 'fountain' docs have no Storage file (url is empty) and store their text inline.
  format?: 'pdf' | 'fountain';
  fountainSource?: string;
  reviewStatus?: ScreenplayReviewStatus;
  reviewStatusUpdatedAt?: Date | { seconds: number; nanoseconds: number };
  reviewStatusUpdatedBy?: string;
  reviewStatusNote?: string;
}

export const REVIEW_STATUS_ORDER: ScreenplayReviewStatus[] = ['draft', 'submitted', 'changes_requested', 'approved'];

export const isScreenplayReviewStatus = (value: unknown): value is ScreenplayReviewStatus =>
  typeof value === 'string' && REVIEW_STATUS_ORDER.includes(value as ScreenplayReviewStatus);

export const getReviewStatus = (screenplay: Screenplay): ScreenplayReviewStatus =>
  screenplay.reviewStatus || 'draft';

export const toDate = (value: any): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
  return null;
};

export const normalizeScreenplay = (screenplayId: string, data: any): Screenplay => ({
  id: screenplayId,
  name: data.name || 'Untitled Screenplay',
  type: data.type || 'pdf',
  url: data.url || '',
  uploadedBy: data.uploadedBy,
  teamMembers: data.teamMembers || [],
  workspaceId: data.workspaceId || null,
  projectId: data.projectId || null,
  size: data.size,
  format: data.format === 'fountain' ? 'fountain' : 'pdf',
  fountainSource: typeof data.fountainSource === 'string' ? data.fountainSource : '',
  reviewStatus: isScreenplayReviewStatus(data.reviewStatus) ? data.reviewStatus : 'draft',
  reviewStatusUpdatedAt: data.reviewStatusUpdatedAt?.toDate ? data.reviewStatusUpdatedAt.toDate() : data.reviewStatusUpdatedAt,
  reviewStatusUpdatedBy: typeof data.reviewStatusUpdatedBy === 'string' ? data.reviewStatusUpdatedBy : undefined,
  reviewStatusNote: typeof data.reviewStatusNote === 'string' ? data.reviewStatusNote : '',
  uploadedAt: data.uploadedAt?.toDate ? data.uploadedAt.toDate() : data.uploadedAt,
  lastModified: data.lastModified?.toDate ? data.lastModified.toDate() : data.lastModified
});

export const getWorkspaceSupervisorIds = (members: WorkspaceMember[]): string[] =>
  members.filter(member => member.role === 'supervisor').map(member => member.userId);

export const getWorkspaceViewerIds = (members: WorkspaceMember[]): string[] =>
  members.filter(member => member.role === 'viewer').map(member => member.userId);

export const normalizeWorkspace = (workspaceId: string, data: any): CollaborationWorkspace => {
  const members = (data.members || []) as WorkspaceMember[];
  const rawMemberIds: string[] = data.memberIds?.length ? data.memberIds : members.map(member => member.userId);
  const memberIds = Array.from(new Set(rawMemberIds.filter(Boolean)));

  return {
    id: workspaceId,
    projectId: data.projectId ?? null,
    ownerId: data.ownerId,
    name: data.name || 'Untitled Workspace',
    description: data.description || '',
    type: data.type || 'project',
    members,
    memberIds,
    supervisorIds: data.supervisorIds || getWorkspaceSupervisorIds(members),
    viewerIds: data.viewerIds || getWorkspaceViewerIds(members),
    selfElectedSupervisors: data.selfElectedSupervisors || [],
    status: data.status || 'active',
    archivedAt: data.archivedAt || null,
    deletedAt: data.deletedAt || null,
    deleteRecoverableUntil: data.deleteRecoverableUntil || null,
    channels: data.channels,
    documents: data.documents,
    whiteboards: data.whiteboards,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    settings: data.settings || DEFAULT_WORKSPACE_SETTINGS
  };
};

export const getWorkspaceMemberIds = (workspace: CollaborationWorkspace): string[] => {
  const ids = workspace.memberIds?.length
    ? workspace.memberIds
    : workspace.members?.map(member => member.userId) || [];
  return Array.from(new Set(ids.filter(Boolean)));
};

export const getPermissionsForRole = (role: WorkspaceRole): string[] => {
  switch (role) {
    case 'owner':
    case 'admin':
      return ['read', 'write', 'comment', 'manage'];
    case 'supervisor':
      return ['read', 'comment', 'annotate'];
    case 'viewer':
      return ['read'];
    case 'member':
    default:
      return ['read', 'write', 'comment'];
  }
};

export const isWorkspaceCreator = (workspace: CollaborationWorkspace, uid?: string | null): boolean => {
  if (!uid) return false;
  if (workspace.ownerId) return workspace.ownerId === uid;
  return workspace.members?.some(member => member.userId === uid && member.role === 'owner') || false;
};

export const canManageWorkspace = (workspace: CollaborationWorkspace, uid?: string | null): boolean =>
  isWorkspaceCreator(workspace, uid);

export const isWorkspaceReadOnlyParticipant = (workspace: CollaborationWorkspace, uid?: string | null): boolean => {
  if (!uid) return true;
  const currentMember = workspace.members?.find(member => member.userId === uid);
  return (
    currentMember?.role === 'supervisor' ||
    currentMember?.role === 'viewer' ||
    workspace.supervisorIds?.includes(uid) ||
    workspace.viewerIds?.includes(uid) ||
    workspace.selfElectedSupervisors?.includes(uid)
  ) || false;
};

export const canEditWorkspaceContent = (workspace: CollaborationWorkspace, uid?: string | null): boolean => {
  if (!uid || (workspace.status || 'active') !== 'active') return false;
  return getWorkspaceMemberIds(workspace).includes(uid) && !isWorkspaceReadOnlyParticipant(workspace, uid);
};

export const isSelfElectedSupervisor = (workspace: CollaborationWorkspace, uid?: string | null): boolean => {
  if (!uid) return false;
  return workspace.selfElectedSupervisors?.includes(uid) || false;
};

export const getEffectiveRole = (workspace: CollaborationWorkspace, uid?: string | null): WorkspaceRole | null => {
  if (!uid) return null;
  if (isSelfElectedSupervisor(workspace, uid)) return 'supervisor';
  const currentMember = workspace.members?.find(member => member.userId === uid);
  return currentMember?.role ?? null;
};

export const canSelfElectSupervisor = (
  workspace: CollaborationWorkspace,
  uid: string | null | undefined,
  isTeacher: boolean
): boolean => {
  if (!uid || !isTeacher) return false;
  if ((workspace.status || 'active') !== 'active') return false;
  if (workspace.ownerId === uid) return false;
  return getWorkspaceMemberIds(workspace).includes(uid);
};

// Whether to show the self-elect toggle at all. Eligible (teacher member, not owner,
// active) AND either already self-elected (so they can step down) or NOT already an
// owner-assigned supervisor — we don't offer "Act as supervisor" to someone the creator
// already made a supervisor (their role is the owner's to change, not self-toggled).
export const canToggleSupervisor = (
  workspace: CollaborationWorkspace,
  uid: string | null | undefined,
  isTeacher: boolean
): boolean => {
  if (!canSelfElectSupervisor(workspace, uid, isTeacher)) return false;
  if (isSelfElectedSupervisor(workspace, uid)) return true;
  const currentMember = workspace.members?.find(member => member.userId === uid);
  return currentMember?.role !== 'supervisor';
};

export const canExportGradingReport = (
  workspace: CollaborationWorkspace | null | undefined,
  uid?: string | null
): boolean => {
  if (!uid || !workspace) return false;
  if (isWorkspaceCreator(workspace, uid)) return true;
  if (workspace.supervisorIds?.includes(uid)) return true;
  if (workspace.selfElectedSupervisors?.includes(uid)) return true;
  return false;
};

export type WorkspaceLookup = (workspaceId: string) => CollaborationWorkspace | null | undefined;

export const canDeleteScreenplay = (
  screenplay: Screenplay,
  uid: string | null | undefined,
  getWorkspace: WorkspaceLookup
): boolean => {
  if (!uid) return false;
  if (screenplay.uploadedBy === uid) return true;
  const workspace = screenplay.workspaceId ? getWorkspace(screenplay.workspaceId) : null;
  return workspace ? isWorkspaceCreator(workspace, uid) && !isWorkspaceReadOnlyParticipant(workspace, uid) : false;
};

// Whether the user may edit a screenplay's content (Fountain source).
// The uploader can always edit their own; otherwise they must be a non-read-only
// member of the screenplay's workspace. Mirrors the Firestore rule that blocks
// supervisors from mutating screenplay docs.
export const canEditScreenplay = (
  screenplay: Screenplay,
  uid: string | null | undefined,
  getWorkspace: WorkspaceLookup
): boolean => {
  if (!uid) return false;
  if (screenplay.uploadedBy === uid) return true;
  const workspace = screenplay.workspaceId ? getWorkspace(screenplay.workspaceId) : null;
  return workspace ? canEditWorkspaceContent(workspace, uid) : false;
};

export const canReviewScreenplay = (
  screenplay: Screenplay,
  uid: string | null | undefined,
  getWorkspace: WorkspaceLookup
): boolean => {
  if (!uid || !screenplay.workspaceId) return false;
  const workspace = getWorkspace(screenplay.workspaceId);
  return workspace ? getEffectiveRole(workspace, uid) === 'supervisor' : false;
};

export const workspaceMembershipId = (workspaceId: string, userId: string) => `${workspaceId}_${userId}`;

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
