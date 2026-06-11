import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  CollaborationWorkspace,
  ScreenplayReviewStatus,
  Task,
  WorkspaceMember,
  WorkspaceRole
} from '../../types/Collaboration';
import CollaborativeTasksHub from '../CollaborativeTasks/CollaborativeTasksHub';
import ScreenplayBreakdown from '../ScreenplayBreakdown';
import BreakdownReports from '../BreakdownReports';
import './CollaborationHub.scss';
import UserAutocomplete, { UserAutocompleteOption } from './UserAutocomplete';
import { toast } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, orderBy, limit, getDocs, getDoc, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp, Timestamp, QuerySnapshot, Unsubscribe, writeBatch } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, db, storage } from '../../firebase';
import ScreenplayViewer from './ScreenplayViewer';
import FountainEditor from './FountainEditor';
import { logWorkspaceActivity, WorkspaceActivityVerb } from '../../services/workspaceActivityService';
import { useTranslation } from 'react-i18next';

const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

interface CollaborationHubProps {
  projectId?: string;
}

// User search interface
interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  company?: string;
}

// Screenplay interface
interface Screenplay {
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

// Screenplay Annotation interface
interface ScreenplayAnnotation {
  id: string;
  userId: string;
  userName: string;
  annotation: string;
  timestamp: Date;
  page?: string;
  scene?: string;
  screenplayId?: string;
}

// Workspace creation step
type WorkspaceCreationStep = 'details' | 'members' | 'settings';

// Define TabType at the top of the file
type TabType = 'workspaces' | 'tasks' | 'screenplays';

const WORKSPACE_DELETE_RECOVERY_DAYS = 7;
// Labels + descriptions are resolved via i18n at render time (collaboration.roles.*)
// so the invite dropdown matches the active language.
const INVITABLE_WORKSPACE_ROLES: Array<{
  value: Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>;
}> = [
  { value: 'member' },
  { value: 'supervisor' },
  { value: 'viewer' }
];

const REVIEW_STATUS_ORDER: ScreenplayReviewStatus[] = ['draft', 'submitted', 'changes_requested', 'approved'];
const isScreenplayReviewStatus = (value: unknown): value is ScreenplayReviewStatus =>
  typeof value === 'string' && REVIEW_STATUS_ORDER.includes(value as ScreenplayReviewStatus);

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class CollaborationErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('CollaborationHub Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong with the Collaboration Hub.</h2>
          <p>Please refresh the page or try again later.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Screenplay/document upload size cap. Kept equal to the Storage rule's
// `isDocumentUpload` limit (25MB) so the client rejects oversized files with a
// clear message instead of letting them fail later with an opaque Storage
// permission error. Raise BOTH this and storage.rules together if needed.
const MAX_UPLOAD_MB = 25;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const CollaborationHub: React.FC<CollaborationHubProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('workspaces');
  const [workspaces, setWorkspaces] = useState<CollaborationWorkspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<CollaborationWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // Video call functionality will be added in a future update
  const [showScreenplayViewer, setShowScreenplayViewer] = useState(false);
  const [showScreenplayModal, setShowScreenplayModal] = useState(false);

  // Workspace creation state
  const [workspaceCreationStep, setWorkspaceCreationStep] = useState<WorkspaceCreationStep>('details');
  const [newWorkspaceData, setNewWorkspaceData] = useState({
    name: '',
    description: '',
    type: 'project' as const,
    selectedMembers: [] as UserSearchResult[],
    selectedMemberRoles: {} as Record<string, Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>>,
    settings: {
      allowGuestAccess: false,
      requireApproval: true,
      autoArchive: false,
      retentionDays: 365,
      maxFileSize: MAX_UPLOAD_BYTES,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
    }
  });

  // User search state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [pendingMembersToAdd, setPendingMembersToAdd] = useState<UserAutocompleteOption[]>([]);
  const [pendingMemberRole, setPendingMemberRole] = useState<Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>>('member');
  const [isAddingMembers, setIsAddingMembers] = useState(false);

  // Settings state
  const [workspaceSettings, setWorkspaceSettings] = useState(newWorkspaceData.settings);
  const [workspaceDetails, setWorkspaceDetails] = useState({
    name: '',
    description: '',
    type: 'project' as CollaborationWorkspace['type']
  });

  // Screenplay upload state
  const [uploadingScreenplay, setUploadingScreenplay] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [uploadedScreenplay, setUploadedScreenplay] = useState<Screenplay | null>(null);
  const [uploadWorkspaceId, setUploadWorkspaceId] = useState('');

  // Screenplay collaboration state
  const [screenplayAnnotations, setScreenplayAnnotations] = useState<ScreenplayAnnotation[]>([]);
  const [newAnnotation, setNewAnnotation] = useState('');

  const [teamMembers, setTeamMembers] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    isOnline?: boolean;
  }[]>([]);

  const [userScreenplays, setUserScreenplays] = useState<Screenplay[]>([]);
  const [showStartWritingModal, setShowStartWritingModal] = useState(false);
  const [newFountainTitle, setNewFountainTitle] = useState('');
  const [creatingFountain, setCreatingFountain] = useState(false);
  const [editingFountain, setEditingFountain] = useState<Screenplay | null>(null);
  const [unresolvedCountByScreenplay, setUnresolvedCountByScreenplay] = useState<Record<string, number>>({});
  const [unresolvedFromTeacherCountByScreenplay, setUnresolvedFromTeacherCountByScreenplay] = useState<Record<string, number>>({});
  const [selectedScreenplayId, setSelectedScreenplayId] = useState<string | null>(null);

  const [approvedContacts, setApprovedContacts] = useState<string[]>([]);
  // Short-lived cache of all crew profiles for the member search (avoids re-fetching the
  // whole collection on every keystroke). 30s TTL so newly-created classmates still appear.
  const crewProfilesCacheRef = useRef<{ at: number; data: UserSearchResult[] } | null>(null);
  const [activityEvents, setActivityEvents] = useState<Array<{
    id: string;
    actorName?: string;
    verb: string;
    targetName?: string | null;
    detail?: string | null;
    createdAt?: any;
  }>>([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [toggleSupervisorPending, setToggleSupervisorPending] = useState(false);

  const getWorkspaceMemberIds = (workspace: CollaborationWorkspace): string[] => {
    const ids = workspace.memberIds?.length
      ? workspace.memberIds
      : workspace.members?.map(member => member.userId) || [];
    return Array.from(new Set(ids.filter(Boolean)));
  };

  const getWorkspaceSupervisorIds = (members: WorkspaceMember[]): string[] =>
    members.filter(member => member.role === 'supervisor').map(member => member.userId);

  const getWorkspaceViewerIds = (members: WorkspaceMember[]): string[] =>
    members.filter(member => member.role === 'viewer').map(member => member.userId);

  const getPermissionsForRole = (role: WorkspaceRole): string[] => {
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

  const normalizeScreenplay = (screenplayId: string, data: any): Screenplay => ({
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

  const normalizeWorkspace = (workspaceId: string, data: any): CollaborationWorkspace => {
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
      settings: data.settings || newWorkspaceData.settings
    };
  };

  const isWorkspaceCreator = (workspace: CollaborationWorkspace): boolean => {
    if (!currentUser) return false;
    if (workspace.ownerId) return workspace.ownerId === currentUser.uid;
    return workspace.members?.some(member => member.userId === currentUser.uid && member.role === 'owner') || false;
  };

  const canManageWorkspace = (workspace: CollaborationWorkspace): boolean => {
    return isWorkspaceCreator(workspace);
  };

  const isWorkspaceReadOnlyParticipant = (workspace: CollaborationWorkspace): boolean => {
    if (!currentUser) return true;
    const currentMember = workspace.members?.find(member => member.userId === currentUser.uid);
    return (
      currentMember?.role === 'supervisor' ||
      currentMember?.role === 'viewer' ||
      workspace.supervisorIds?.includes(currentUser.uid) ||
      workspace.viewerIds?.includes(currentUser.uid) ||
      workspace.selfElectedSupervisors?.includes(currentUser.uid)
    ) || false;
  };

  const canEditWorkspaceContent = (workspace: CollaborationWorkspace): boolean => {
    if (!currentUser || (workspace.status || 'active') !== 'active') return false;
    return getWorkspaceMemberIds(workspace).includes(currentUser.uid) && !isWorkspaceReadOnlyParticipant(workspace);
  };

  const canDeleteScreenplay = (screenplay: Screenplay): boolean => {
    if (!currentUser) return false;
    if (screenplay.uploadedBy === currentUser.uid) return true;
    const workspace = screenplay.workspaceId ? getWorkspaceById(screenplay.workspaceId) : null;
    return workspace ? isWorkspaceCreator(workspace) && !isWorkspaceReadOnlyParticipant(workspace) : false;
  };

  // Whether the current user may edit a screenplay's content (Fountain source).
  // The uploader can always edit their own; otherwise they must be a non-read-only
  // member of the screenplay's workspace. Mirrors the Firestore rule that blocks
  // supervisors from mutating screenplay docs.
  const canEditScreenplay = (screenplay: Screenplay): boolean => {
    if (!currentUser) return false;
    if (screenplay.uploadedBy === currentUser.uid) return true;
    const workspace = screenplay.workspaceId ? getWorkspaceById(screenplay.workspaceId) : null;
    return workspace ? canEditWorkspaceContent(workspace) : false;
  };

  const canReviewScreenplay = (screenplay: Screenplay): boolean => {
    if (!currentUser || !screenplay.workspaceId) return false;
    const workspace = getWorkspaceById(screenplay.workspaceId);
    return workspace ? getEffectiveRole(workspace) === 'supervisor' : false;
  };

  const updateLocalScreenplay = (screenplayId: string, updates: Partial<Screenplay>) => {
    setUserScreenplays(prev => prev.map(item => item.id === screenplayId ? { ...item, ...updates } : item));
    setUploadedScreenplay(prev => prev?.id === screenplayId ? { ...prev, ...updates } : prev);
    setEditingFountain(prev => prev?.id === screenplayId ? { ...prev, ...updates } : prev);
  };

  const toDate = (value: any): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
    return null;
  };

  const isDeleteRecoveryExpired = (workspace: CollaborationWorkspace): boolean => {
    const recoveryDate = toDate(workspace.deleteRecoverableUntil);
    return Boolean(recoveryDate && Date.now() > recoveryDate.getTime());
  };

  const getWorkspaceById = (workspaceId: string) => workspaces.find(workspace => workspace.id === workspaceId);

  const getWorkspaceLabel = (workspaceId?: string | null): string => {
    if (!workspaceId) return t('collaboration.personalNoWorkspace');
    return getWorkspaceById(workspaceId)?.name || 'Workspace';
  };

  const workspaceMembershipId = (workspaceId: string, userId: string) => `${workspaceId}_${userId}`;

  const writeWorkspaceMemberships = async (workspace: CollaborationWorkspace, members: WorkspaceMember[]) => {
    const validMembers = members.filter(member => member.userId);
    if (validMembers.length === 0) return;

    const batch = writeBatch(db);
    validMembers.forEach(member => {
      batch.set(doc(db, 'workspaceMemberships', workspaceMembershipId(workspace.id, member.userId)), {
        workspaceId: workspace.id,
        userId: member.userId,
        role: member.role,
        ownerId: workspace.ownerId || '',
        projectId: workspace.projectId || null,
        status: workspace.status || 'active',
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
    await batch.commit();
  };

  const createWorkspaceInvitations = async (
    workspace: CollaborationWorkspace,
    users: UserAutocompleteOption[],
    getRole: (user: UserAutocompleteOption) => Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>
  ) => {
    if (!currentUser || users.length === 0) return 0;

    const existingMemberIds = new Set(getWorkspaceMemberIds(workspace));
    const invitees = users.filter(user => user.id && !existingMemberIds.has(user.id));
    if (invitees.length === 0) return 0;

    const inviterName = currentUser.displayName || t('collaboration.notifications.someone');

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
      const notificationRef = doc(collection(db, 'notifications'));

      batch.set(invitationRef, {
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        inviterId: currentUser.uid,
        inviterName,
        inviteeId: user.id,
        inviteeName: user.name || user.email || 'Collaborator',
        inviteeEmail: user.email || '',
        role,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      batch.set(notificationRef, {
        userId: user.id,
        type: 'workspace_invitation',
        // Stored title/body are a fallback (sender locale); titleKey/bodyKey/i18nParams let
        // the recipient's client render in their own language.
        title: t('collaboration.notifications.invitedToWorkspace.title', { inviter: inviterName, workspace: workspace.name }),
        body: t('collaboration.notifications.invitedToWorkspace.body', { role: t(`collaboration.roles.${role}`), workspace: workspace.name }),
        message: t('collaboration.notifications.invitedToWorkspace.body', { role: t(`collaboration.roles.${role}`), workspace: workspace.name }),
        titleKey: 'collaboration.notifications.invitedToWorkspace.title',
        bodyKey: 'collaboration.notifications.invitedToWorkspace.body',
        i18nParams: { inviter: inviterName, workspace: workspace.name, roleKey: `collaboration.roles.${role}` },
        isRead: false,
        read: false,
        createdAt: serverTimestamp(),
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        senderName: inviterName,
        relatedId: workspace.id,
        link: '/collaboration',
        metadata: {
          invitationId: invitationRef.id,
          workspaceId: workspace.id,
          role
        }
      });

      await batch.commit();
      return true;
    }));

    return sentInvites.filter(Boolean).length;
  };

  const updateWorkspaceState = (workspace: CollaborationWorkspace) => {
    setWorkspaces(prev => prev.map(item => item.id === workspace.id ? workspace : item));
    setSelectedWorkspace(prev => prev?.id === workspace.id ? workspace : prev);
  };

  const isSelfElectedSupervisor = (workspace: CollaborationWorkspace): boolean => {
    if (!currentUser) return false;
    return workspace.selfElectedSupervisors?.includes(currentUser.uid) || false;
  };

  const getEffectiveRole = (workspace: CollaborationWorkspace): WorkspaceRole | null => {
    if (!currentUser) return null;
    if (isSelfElectedSupervisor(workspace)) return 'supervisor';
    const currentMember = workspace.members?.find(member => member.userId === currentUser.uid);
    return currentMember?.role ?? null;
  };

  const canSelfElectSupervisor = (workspace: CollaborationWorkspace): boolean => {
    if (!currentUser || !isTeacher) return false;
    if ((workspace.status || 'active') !== 'active') return false;
    if (workspace.ownerId === currentUser.uid) return false;
    return getWorkspaceMemberIds(workspace).includes(currentUser.uid);
  };

  // Whether to show the self-elect toggle at all. Eligible (teacher member, not owner,
  // active) AND either already self-elected (so they can step down) or NOT already an
  // owner-assigned supervisor — we don't offer "Act as supervisor" to someone the creator
  // already made a supervisor (their role is the owner's to change, not self-toggled).
  const canToggleSupervisor = (workspace: CollaborationWorkspace): boolean => {
    if (!canSelfElectSupervisor(workspace)) return false;
    if (isSelfElectedSupervisor(workspace)) return true;
    const currentMember = workspace.members?.find(member => member.userId === currentUser?.uid);
    return currentMember?.role !== 'supervisor';
  };

  const toggleSelfElectedSupervisor = async (workspace: CollaborationWorkspace) => {
    if (!currentUser || !canSelfElectSupervisor(workspace) || toggleSupervisorPending) return;
    const enabling = !isSelfElectedSupervisor(workspace);
    setToggleSupervisorPending(true);
    try {
      const functions = getFunctions(app, 'us-central1');
      const setSupervisorMode = httpsCallable(functions, 'setWorkspaceSupervisorMode');
      await setSupervisorMode({ workspaceId: workspace.id, enabled: enabling });

      const updatedSelfElected = enabling
        ? Array.from(new Set([...(workspace.selfElectedSupervisors || []), currentUser.uid]))
        : (workspace.selfElectedSupervisors || []).filter(uid => uid !== currentUser.uid);
      updateWorkspaceState({
        ...workspace,
        selfElectedSupervisors: updatedSelfElected,
        updatedAt: new Date()
      });

      toast.success(enabling
        ? t('collaboration.supervisor.enabled')
        : t('collaboration.supervisor.disabled'));
      if (enabling) {
        logWorkspaceActivity({
          workspaceId: workspace.id,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName,
          verb: 'member_self_promoted'
        });
      }
    } catch (err) {
      console.error('Failed to toggle supervisor mode:', err);
      toast.error(t('collaboration.supervisor.toggleError'));
    } finally {
      setToggleSupervisorPending(false);
    }
  };

  const openAddMemberModalForWorkspace = (workspace: CollaborationWorkspace) => {
    setSelectedWorkspace(workspace);
    setPendingMembersToAdd([]);
    setPendingMemberRole('member');
    setUserSearchQuery('');
    setUserSearchResults([]);
    setShowAddMemberModal(true);
  };

  const getDeleteRecoveryDate = () =>
    Timestamp.fromDate(new Date(Date.now() + WORKSPACE_DELETE_RECOVERY_DAYS * 24 * 60 * 60 * 1000));

  useEffect(() => {
    if (!currentUser) {
      setWorkspaces([]);
      setSelectedWorkspace(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let cancelled = false;
    const membershipsRef = collection(db, 'workspaceMemberships');
    const membershipsQuery = query(membershipsRef, where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(
      membershipsQuery,
      async snapshot => {
        const workspaceIds = Array.from(new Set(
          snapshot.docs
            .map(document => document.data().workspaceId)
            .filter((workspaceId): workspaceId is string => typeof workspaceId === 'string' && workspaceId.length > 0)
        ));

        const workspaceSnapshots = await Promise.all(
          workspaceIds.map(workspaceId => getDoc(doc(db, 'workspaces', workspaceId)))
        );

        if (cancelled) return;

        const workspaceList = workspaceSnapshots
          .filter(documentSnapshot => documentSnapshot.exists())
          .map(documentSnapshot => normalizeWorkspace(documentSnapshot.id, documentSnapshot.data()))
          .filter(workspace => !projectId || workspace.projectId === projectId)
          .sort((a, b) => {
            const statusOrder = { active: 0, archived: 1, deleted: 2 };
            return statusOrder[a.status || 'active'] - statusOrder[b.status || 'active'];
          });

        setWorkspaces(workspaceList);

        setSelectedWorkspace(prev => {
          const fresh = prev ? workspaceList.find(workspace => workspace.id === prev.id) : null;
          if (fresh) return fresh;
          if (prev) return null;
          return workspaceList.find(workspace => (workspace.status || 'active') === 'active') || workspaceList[0] || null;
        });

        setLoading(false);
      },
      err => {
        console.error('Error subscribing to workspaces:', err);
        setError('Failed to load workspaces');
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [currentUser, projectId]);

  const accessibleWorkspaceIds = workspaces
    .filter(workspace => (workspace.status || 'active') !== 'deleted')
    .filter(workspace => currentUser ? getWorkspaceMemberIds(workspace).includes(currentUser.uid) : false)
    .map(workspace => workspace.id);
  const accessibleWorkspaceIdsKey = [...accessibleWorkspaceIds].sort().join(',');

  useEffect(() => {
    if (!currentUser) {
      setUserScreenplays([]);
      return;
    }

    const screenplaysRef = collection(db, 'screenplays');
    const subscriptionResults = new Map<string, Map<string, Screenplay>>();

    const recompute = () => {
      const merged = new Map<string, Screenplay>();
      subscriptionResults.forEach(subMap => {
        subMap.forEach((screenplay, id) => {
          merged.set(id, screenplay);
        });
      });
      setUserScreenplays(Array.from(merged.values()));
    };

    const handleSnapshot = (key: string) => (snapshot: QuerySnapshot) => {
      const subMap = new Map<string, Screenplay>();
      snapshot.docs.forEach(documentSnapshot => {
        subMap.set(documentSnapshot.id, normalizeScreenplay(documentSnapshot.id, documentSnapshot.data()));
      });
      subscriptionResults.set(key, subMap);
      recompute();
    };

    const handleError = (label: string) => (err: Error) => {
      console.error(`Error subscribing to screenplays (${label}):`, err);
    };

    const unsubscribes: Unsubscribe[] = [];

    unsubscribes.push(onSnapshot(
      query(screenplaysRef, where('uploadedBy', '==', currentUser.uid)),
      handleSnapshot('uploadedBy'),
      handleError('uploadedBy')
    ));

    const ids = accessibleWorkspaceIdsKey ? accessibleWorkspaceIdsKey.split(',') : [];
    for (let i = 0; i < ids.length; i += 10) {
      const chunk = ids.slice(i, i + 10);
      const chunkKey = `workspaceChunk_${i}`;
      unsubscribes.push(onSnapshot(
        query(screenplaysRef, where('workspaceId', 'in', chunk)),
        handleSnapshot(chunkKey),
        handleError(chunkKey)
      ));
    }

    return () => {
      unsubscribes.forEach(fn => fn());
    };
  }, [currentUser, accessibleWorkspaceIdsKey]);

  const userScreenplaysKey = [...userScreenplays].map(item => item.id).sort().join(',');

  useEffect(() => {
    if (!currentUser || userScreenplaysKey === '') {
      setUnresolvedCountByScreenplay({});
      setUnresolvedFromTeacherCountByScreenplay({});
      return;
    }

    const screenplayIds = userScreenplaysKey.split(',');
    const annotationsRef = collection(db, 'screenplayAnnotations');
    const tagsRef = collection(db, 'screenplayTags');
    // Two collections feed both counts; key by `${collection}-${chunkIndex}`
    // so a snapshot only replaces its own slice.
    const chunkAnnotations = new Map<string, Array<{ screenplayId?: string; resolved?: boolean; supervisorAtAuthorTime?: boolean }>>();

    const recompute = () => {
      const open: Record<string, number> = {};
      const fromTeacher: Record<string, number> = {};
      chunkAnnotations.forEach(list => {
        list.forEach(annotation => {
          const id = annotation.screenplayId;
          if (!id || annotation.resolved) return;
          open[id] = (open[id] || 0) + 1;
          if (annotation.supervisorAtAuthorTime) {
            fromTeacher[id] = (fromTeacher[id] || 0) + 1;
          }
        });
      });
      setUnresolvedCountByScreenplay(open);
      setUnresolvedFromTeacherCountByScreenplay(fromTeacher);
    };

    const unsubs: Unsubscribe[] = [];
    for (let i = 0; i < screenplayIds.length; i += 10) {
      const chunkIndex = i;
      const chunk = screenplayIds.slice(i, i + 10);
      const annKey = `ann-${chunkIndex}`;
      const tagKey = `tag-${chunkIndex}`;
      unsubs.push(onSnapshot(
        query(annotationsRef, where('screenplayId', 'in', chunk)),
        snapshot => {
          chunkAnnotations.set(annKey, snapshot.docs.map(d => d.data() as { screenplayId?: string; resolved?: boolean; supervisorAtAuthorTime?: boolean }));
          recompute();
        },
        err => console.error('Annotation count subscription error:', err)
      ));
      unsubs.push(onSnapshot(
        query(tagsRef, where('screenplayId', 'in', chunk)),
        snapshot => {
          chunkAnnotations.set(tagKey, snapshot.docs.map(d => d.data() as { screenplayId?: string; resolved?: boolean; supervisorAtAuthorTime?: boolean }));
          recompute();
        },
        err => console.error('Tag count subscription error:', err)
      ));
    }

    return () => {
      unsubs.forEach(u => u());
    };
  }, [currentUser, userScreenplaysKey]);

  useEffect(() => {
    loadTeamMembers();
  }, [selectedWorkspace?.id]);

  // G5 — live "Recent activity" feed for the selected workspace, paginated.
  // The page grows in 25-event chunks via the "Load more" CTA; switching
  // workspaces resets the page so we don't carry an unbounded snapshot across.
  const ACTIVITY_PAGE_SIZE = 25;
  const [activityLimit, setActivityLimit] = useState(ACTIVITY_PAGE_SIZE);
  const [activityHasMore, setActivityHasMore] = useState(false);
  // Reset pagination whenever the selected workspace changes.
  useEffect(() => { setActivityLimit(ACTIVITY_PAGE_SIZE); }, [selectedWorkspace?.id]);
  useEffect(() => {
    const workspaceId = selectedWorkspace?.id;
    if (!currentUser || !workspaceId) {
      setActivityEvents([]);
      setActivityHasMore(false);
      return;
    }
    // Fetch one beyond the displayed window so we know whether there's a next
    // page without having to make a second query. We slice the extra off
    // before handing it to state.
    const activityQuery = query(
      collection(db, 'workspaceActivity'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc'),
      limit(activityLimit + 1)
    );
    const unsubscribe = onSnapshot(
      activityQuery,
      snapshot => {
        const all = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            actorName: data.actorName,
            verb: data.verb,
            targetName: data.targetName ?? null,
            detail: data.detail ?? null,
            createdAt: data.createdAt
          };
        });
        setActivityHasMore(all.length > activityLimit);
        setActivityEvents(all.slice(0, activityLimit));
      },
      err => {
        console.error('Activity feed subscription error:', err);
        setActivityEvents([]);
        setActivityHasMore(false);
      }
    );
    return () => unsubscribe();
  }, [currentUser, selectedWorkspace?.id, activityLimit]);

  useEffect(() => {
    if (selectedWorkspace && (selectedWorkspace.status || 'active') === 'active') {
      setUploadWorkspaceId(selectedWorkspace.id);
    }
  }, [selectedWorkspace?.id, selectedWorkspace?.status]);

  useEffect(() => {
    if (!currentUser) {
      setIsTeacher(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        // Privilege source of truth: admin-granted teacherRoles/{uid} doc.
        // crewProfiles.isTeacher / profileType are user-writable display fields and
        // must NOT gate teacher actions (students could set them on themselves).
        const snap = await getDoc(doc(db, 'teacherRoles', currentUser.uid));
        if (cancelled) return;
        setIsTeacher(snap.exists());
      } catch (err) {
        console.error('Failed to load teacher flag:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchApprovedContacts = async () => {
      try {
        const connectionsQuery = query(
          collection(db, 'connections'),
          where('status', '==', 'accepted'),
          where('userId', '==', currentUser.uid)
        );
        const reverseConnectionsQuery = query(
          collection(db, 'connections'),
          where('status', '==', 'accepted'),
          where('connectedUserId', '==', currentUser.uid)
        );
        const [directSnap, reverseSnap] = await Promise.all([
          getDocs(connectionsQuery),
          getDocs(reverseConnectionsQuery)
        ]);
        const directContacts = directSnap.docs.map(doc => doc.data().connectedUserId);
        const reverseContacts = reverseSnap.docs.map(doc => doc.data().userId);
        setApprovedContacts([...new Set([...directContacts, ...reverseContacts])]);
      } catch (error) {
        setApprovedContacts([]);
      }
    };
    fetchApprovedContacts();
  }, [currentUser]);

  // User search functionality
  const searchUsers = async (queryStr: string) => {
    if (!queryStr.trim()) {
      setUserSearchResults([]);
      return;
    }
    setIsSearchingUsers(true);
    // Do NOT clear userSearchResults here; keep previous results while loading
    try {
      // Search ALL crew profiles, not just the user's approved contacts.
      // The collaboration assignment requires students to add arbitrary classmates and the
      // teacher — people they are NOT necessarily connected to. crewProfiles is public-read,
      // so this is allowed. Approved contacts are ranked first as a convenience. Results are
      // cached briefly (30s) so typing doesn't re-fetch the whole collection on every key.
      const now = Date.now();
      const cache = crewProfilesCacheRef.current;
      let allResults: UserSearchResult[];
      if (cache && now - cache.at < 30000) {
        allResults = cache.data;
      } else {
        const snap = await getDocs(collection(db, 'crewProfiles'));
        allResults = snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
          email: doc.data().email || '',
          avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
          role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
          company: doc.data().company || ''
        }));
        crewProfilesCacheRef.current = { at: now, data: allResults };
        if (allResults.length === 0) {
          console.warn('[CollabModal] No crew profiles found in Firestore crewProfiles collection.');
        }
      }

      const needle = queryStr.toLowerCase();
      const filtered = allResults
        .filter(user => user.id !== currentUser?.uid) // can't add yourself
        .filter(user =>
          (user.name || '').toLowerCase().includes(needle) ||
          (user.email || '').toLowerCase().includes(needle) ||
          (user.role || '').toLowerCase().includes(needle) ||
          (user.company || '').toLowerCase().includes(needle)
        )
        .sort((a, b) => {
          // Approved contacts first, then alphabetical.
          const aContact = approvedContacts.includes(a.id) ? 0 : 1;
          const bContact = approvedContacts.includes(b.id) ? 0 : 1;
          if (aContact !== bContact) return aContact - bContact;
          return (a.name || '').localeCompare(b.name || '');
        });
      debugLog('[CollabModal] Filtered users after search:', filtered.length, filtered.map(u => u.name));
      setUserSearchResults(filtered);
    } catch (error) {
      console.error('[CollabModal] Error searching users:', error);
      setUserSearchResults([]);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  const handleUserSearchChange = (query: string) => {
    setUserSearchQuery(query);
    if (query.trim()) {
      setTimeout(() => searchUsers(query), 300);
    } else {
      setUserSearchResults([]);
    }
  };

  const inviteUsersToWorkspace = async (
    users: UserAutocompleteOption[],
    role: Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>,
    workspace: CollaborationWorkspace | null = selectedWorkspace
  ) => {
    if (!workspace || users.length === 0) return;

    if (!canManageWorkspace(workspace)) {
      toast.error(t('collaboration.onlyCreatorCanInvite'));
      return;
    }

    setIsAddingMembers(true);

    try {
      const invitedCount = await createWorkspaceInvitations(workspace, users, () => role);

      if (invitedCount === 0) {
        toast.error('Those users are already in this workspace or could not be invited.');
        return;
      }

      if (currentUser) {
        const invitedNames = users.map(user => user.name || user.email || 'a collaborator').join(', ');
        logWorkspaceActivity({
          workspaceId: workspace.id,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName,
          verb: 'member_added',
          detail: invitedNames
        });
      }

      setShowAddMemberModal(false);
      setPendingMembersToAdd([]);
      setPendingMemberRole('member');
      setUserSearchQuery('');
      setUserSearchResults([]);
      toast.success(`Sent ${invitedCount} invitation${invitedCount === 1 ? '' : 's'} for ${workspace.name}.`);
    } catch (error) {
      console.error('Error inviting users to workspace:', error);
      toast.error('Failed to send invitations. Please try again.');
    } finally {
      setIsAddingMembers(false);
    }
  };

  // Workspace creation handlers
  const handleCreateWorkspaceStep = () => {
    if (workspaceCreationStep === 'details') {
      if (!newWorkspaceData.name.trim()) {
        toast.error('Please enter a workspace name');
        return;
      }
      setWorkspaceCreationStep('members');
    } else if (workspaceCreationStep === 'members') {
      setWorkspaceCreationStep('settings');
    } else if (workspaceCreationStep === 'settings') {
      handleCreateWorkspace();
    }
  };

  const handleCreateWorkspace = async () => {
    if (!currentUser) {
      toast.error('Please sign in to create a workspace.');
      return;
    }

    try {
      debugLog('Creating workspace with data:', newWorkspaceData);

      const members: WorkspaceMember[] = [
        {
          userId: currentUser.uid,
          email: currentUser.email || '',
          role: 'owner',
          joinedAt: new Date(),
          permissions: getPermissionsForRole('owner'),
          isOnline: true,
          lastSeen: new Date()
        }
      ];
      const memberIds = Array.from(new Set(members.map(member => member.userId).filter(Boolean)));
      const supervisorIds = getWorkspaceSupervisorIds(members);
      const viewerIds = getWorkspaceViewerIds(members);
      const workspacePayload = {
        projectId: projectId || null,
        ownerId: currentUser.uid,
        name: newWorkspaceData.name.trim(),
        description: newWorkspaceData.description.trim(),
        type: newWorkspaceData.type,
        members,
        memberIds,
        supervisorIds,
        viewerIds,
        selfElectedSupervisors: [],
        status: 'active' as const,
        archivedAt: null,
        deletedAt: null,
        deleteRecoverableUntil: null,
        settings: newWorkspaceData.settings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'workspaces'), workspacePayload);
      const newWorkspace: CollaborationWorkspace = {
        ...workspacePayload,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await writeWorkspaceMemberships(newWorkspace, members);
      const invitedCount = await createWorkspaceInvitations(
        newWorkspace,
        newWorkspaceData.selectedMembers,
        user => newWorkspaceData.selectedMemberRoles[user.id] || 'member'
      );

      setWorkspaces(prev => [...prev, newWorkspace]);
      setSelectedWorkspace(newWorkspace);
      setUploadWorkspaceId(newWorkspace.id);

      // Reset form
      setNewWorkspaceData({
        name: '',
        description: '',
        type: 'project',
        selectedMembers: [],
        selectedMemberRoles: {},
        settings: {
          allowGuestAccess: false,
          requireApproval: true,
          autoArchive: false,
          retentionDays: 365,
          maxFileSize: MAX_UPLOAD_BYTES,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
        }
      });
      setWorkspaceCreationStep('details');
      setShowCreateWorkspaceModal(false);
      toast.success(invitedCount > 0
        ? `Workspace "${newWorkspaceData.name.trim()}" created and ${invitedCount} invitation${invitedCount === 1 ? '' : 's'} sent.`
        : `Workspace "${newWorkspaceData.name.trim()}" created successfully!`);
    } catch (error) {
      console.error('Error in handleCreateWorkspace:', error);
      toast.error('Failed to create workspace. Please try again.');
    }
  };

  const handleAddMemberToCreation = (user: UserSearchResult) => {
    if (!newWorkspaceData.selectedMembers.find(m => m.id === user.id)) {
      setNewWorkspaceData(prev => ({
        ...prev,
        selectedMembers: [...prev.selectedMembers, user],
        selectedMemberRoles: {
          ...prev.selectedMemberRoles,
          [user.id]: prev.selectedMemberRoles[user.id] || 'member'
        }
      }));
    }
  };

  const handleRemoveMemberFromCreation = (userId: string) => {
    setNewWorkspaceData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.filter(m => m.id !== userId),
      selectedMemberRoles: Object.fromEntries(
        Object.entries(prev.selectedMemberRoles).filter(([id]) => id !== userId)
      ) as Record<string, Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>>
    }));
  };

  const handleUpdateWorkspaceSettings = async () => {
    if (!selectedWorkspace) return;

    if (!canManageWorkspace(selectedWorkspace)) {
      toast.error('Only the workspace creator can update settings.');
      return;
    }

    const nextName = workspaceDetails.name.trim();
    if (!nextName) {
      toast.error('Workspace name is required.');
      return;
    }

    const nextDetails = {
      name: nextName,
      description: workspaceDetails.description.trim(),
      type: workspaceDetails.type
    };

    try {
      await updateDoc(doc(db, 'workspaces', selectedWorkspace.id), {
        ...nextDetails,
        settings: workspaceSettings,
        updatedAt: serverTimestamp()
      });

      const updatedWorkspace = {
        ...selectedWorkspace,
        ...nextDetails,
        settings: workspaceSettings,
        updatedAt: new Date()
      };
      updateWorkspaceState(updatedWorkspace);
      setShowSettingsModal(false);
      toast.success('Workspace updated successfully!');
    } catch (error) {
      console.error('Error updating workspace settings:', error);
      toast.error('Failed to update workspace.');
    }
  };

  // Video call functionality will be added in a future update

  // Handle joining a workspace
  const handleJoinWorkspace = (workspaceId: string) => {
    try {
      debugLog('Join workspace clicked:', workspaceId);
      const workspace = workspaces.find(ws => ws.id === workspaceId);
      if (workspace) {
        setSelectedWorkspace(workspace);
        toast.success(`Successfully joined workspace: ${workspace.name}`);
      }
    } catch (error) {
      console.error('Error in handleJoinWorkspace:', error);
    }
  };

  // Handle workspace settings
  const handleWorkspaceSettings = (workspaceId: string) => {
    try {
      debugLog('Workspace settings clicked:', workspaceId);
      const workspace = workspaces.find(ws => ws.id === workspaceId);
      if (workspace) {
        setSelectedWorkspace(workspace);
        setWorkspaceSettings(workspace.settings);
        setWorkspaceDetails({
          name: workspace.name,
          description: workspace.description || '',
          type: workspace.type
        });
        setShowSettingsModal(true);
      }
    } catch (error) {
      console.error('Error in handleWorkspaceSettings:', error);
    }
  };

  // Accepted screenplay file extensions for the button-driven upload flow.
  const SCREENPLAY_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'] as const;
  const isAcceptedScreenplayFile = (file: File): boolean => {
    const lower = file.name.toLowerCase();
    return SCREENPLAY_FILE_EXTENSIONS.some(ext => lower.endsWith(ext));
  };

  // Per-file upload — Storage + Firestore write. Returns the created screenplay or
  // null on failure (so the multi-file loop can keep going after a single bad file).
  const uploadSingleScreenplay = async (file: File): Promise<Screenplay | null> => {
    if (!currentUser) return null;
    const uploadWorkspace = uploadWorkspaceId
      ? workspaces.find(workspace => workspace.id === uploadWorkspaceId && (workspace.status || 'active') === 'active') || null
      : null;
    if (uploadWorkspaceId && !uploadWorkspace) {
      toast.error('Choose an active workspace before uploading.');
      return null;
    }
    if (uploadWorkspace && !canEditWorkspaceContent(uploadWorkspace)) {
      toast.error('Your role in this workspace can view and comment, but cannot upload screenplays.');
      return null;
    }
    // Reject oversized files up front with a clear message — otherwise the
    // upload reaches Storage and fails with an opaque permission error.
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(t('collaboration.screenplaysTab.fileTooLarge', { name: file.name, max: MAX_UPLOAD_MB }));
      return null;
    }

    try {
      const storageRef = ref(storage, `screenplays/${currentUser.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const workspaceMemberIds = uploadWorkspace ? getWorkspaceMemberIds(uploadWorkspace) : [];
      const teamMemberIds = Array.from(new Set([
        currentUser.uid,
        ...workspaceMemberIds
      ]));

      const now = new Date();
      const screenplayData: Omit<Screenplay, 'id'> = {
        name: file.name,
        type: file.type || 'application/octet-stream',
        url: downloadURL,
        uploadedBy: currentUser.uid,
        teamMembers: teamMemberIds,
        workspaceId: uploadWorkspace?.id || null,
        projectId: projectId || uploadWorkspace?.projectId || null,
        size: file.size,
        reviewStatus: 'draft',
        uploadedAt: now,
        lastModified: now
      };

      const docRef = await addDoc(collection(db, 'screenplays'), screenplayData);
      if (uploadWorkspace?.id) {
        logWorkspaceActivity({
          workspaceId: uploadWorkspace.id,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName,
          verb: 'screenplay_uploaded',
          targetId: docRef.id,
          targetName: file.name
        });
      }
      return { ...screenplayData, id: docRef.id };
    } catch (err) {
      console.error(`Failed to upload ${file.name}:`, err);
      return null;
    }
  };

  // Multi-file upload from the upload button. Filters unsupported file types, uploads
  // sequentially, shows a progress counter, and rolls up a per-batch toast at the end.
  const handleMultiUpload = async (rawFiles: FileList | File[]) => {
    if (!currentUser) {
      toast.error('Please sign in to upload screenplays.');
      return;
    }
    const files = Array.from(rawFiles);
    if (files.length === 0) return;

    const validFiles = files.filter(isAcceptedScreenplayFile);
    const rejectedCount = files.length - validFiles.length;
    if (rejectedCount > 0) {
      toast(`${rejectedCount} file${rejectedCount === 1 ? '' : 's'} ignored — only PDF, DOC, DOCX, and TXT are supported.`);
    }
    if (validFiles.length === 0) return;

    setUploadingScreenplay(true);
    setUploadProgress({ current: 0, total: validFiles.length });

    let successCount = 0;
    let failureCount = 0;
    let lastSuccess: Screenplay | null = null;

    for (let i = 0; i < validFiles.length; i++) {
      setUploadProgress({ current: i + 1, total: validFiles.length });
      const file = validFiles[i];
      const uploaded = await uploadSingleScreenplay(file);
      if (uploaded) {
        successCount++;
        lastSuccess = uploaded;
      } else {
        failureCount++;
      }
    }

    if (lastSuccess) {
      setUploadedScreenplay(lastSuccess);
    }
    setUploadingScreenplay(false);
    setUploadProgress(null);

    if (successCount > 0 && failureCount === 0) {
      toast.success(successCount === 1
        ? `${validFiles[0].name} ${t('collaboration.screenplaysTab.uploadSuccess')}`
        : `${successCount} screenplays uploaded.`);
    } else if (successCount > 0 && failureCount > 0) {
      toast(`Uploaded ${successCount} of ${validFiles.length}. ${failureCount} failed.`);
    } else if (failureCount > 0) {
      toast.error(t('collaboration.screenplaysTab.uploadFailed'));
    }

    loadTeamMembers();
  };

  // B2 — create a new in-browser Fountain screenplay (no file upload). Seeds the doc with
  // format: 'fountain' + an empty source, scoped to the selected workspace so collaborators
  // inherit access, then opens the editor on it.
  const handleCreateFountainScreenplay = async () => {
    if (!currentUser) {
      toast.error('Please sign in to start writing.');
      return;
    }
    const title = newFountainTitle.trim();
    if (!title) {
      toast.error(t('fountain.titleRequired'));
      return;
    }

    const uploadWorkspace = uploadWorkspaceId
      ? workspaces.find(workspace => workspace.id === uploadWorkspaceId && (workspace.status || 'active') === 'active') || null
      : null;
    if (uploadWorkspace && !canEditWorkspaceContent(uploadWorkspace)) {
      toast.error('Your role in this workspace can view and comment, but cannot create screenplays.');
      return;
    }

    setCreatingFountain(true);
    try {
      const workspaceMemberIds = uploadWorkspace ? getWorkspaceMemberIds(uploadWorkspace) : [];
      const teamMemberIds = Array.from(new Set([currentUser.uid, ...workspaceMemberIds]));
      const now = new Date();
      const screenplayData: Omit<Screenplay, 'id'> = {
        name: title,
        type: 'fountain',
        url: '',
        format: 'fountain',
        fountainSource: '',
        uploadedBy: currentUser.uid,
        teamMembers: teamMemberIds,
        workspaceId: uploadWorkspace?.id || null,
        projectId: projectId || uploadWorkspace?.projectId || null,
        reviewStatus: 'draft',
        uploadedAt: now,
        lastModified: now
      };
      const docRef = await addDoc(collection(db, 'screenplays'), screenplayData);
      const created: Screenplay = { ...screenplayData, id: docRef.id };

      if (uploadWorkspace?.id) {
        logWorkspaceActivity({
          workspaceId: uploadWorkspace.id,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName,
          verb: 'screenplay_created',
          targetId: created.id,
          targetName: title
        });
      }

      setShowStartWritingModal(false);
      setNewFountainTitle('');
      setEditingFountain(created);
    } catch (err) {
      console.error('Error creating Fountain screenplay:', err);
      toast.error(t('fountain.createError'));
    } finally {
      setCreatingFountain(false);
    }
  };

  // Backwards-compatible name kept for the file <input>'s onChange wiring.
  const handleScreenplayUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    await handleMultiUpload(files);
    e.target.value = '';
  };

  const loadTeamMembers = async () => {
    try {
      if (!selectedWorkspace) {
        setTeamMembers([]);
        return;
      }
      // Load real team members from Firestore crewProfiles collection
      const memberIds = selectedWorkspace.members?.map(m => m.userId) || [];
      if (memberIds.length === 0) {
        setTeamMembers([]);
        return;
      }
      // Resolve member profiles by crewProfile DOCUMENT ID (doc id == uid).
      // crewProfiles created at signup omit the `uid` field, so a
      // where('uid','in',...) query misses them and names fall back to
      // "Crew Member <last4>". Doc-id gets are correct regardless.
      const allMembers = (await Promise.all(memberIds.map(async (uid: string) => {
        const snap = await getDoc(doc(db, 'crewProfiles', uid));
        const data: any = snap.exists() ? snap.data() : {};
        return {
          id: uid,
          name: data.name || data.displayName || `Crew Member ${uid.slice(-4)}`,
          email: data.email || '',
          role: data.jobTitles?.[0]?.title || 'Crew Member',
          avatar: data.profileImageUrl || data.avatarUrl || '',
          isOnline: data.isOnline || false
        };
      })));
      setTeamMembers(allMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
      setTeamMembers([]);
    }
  };

  // Add annotation to screenplay (reference version)
  const addAnnotation = async () => {
    if (!newAnnotation.trim() || !uploadedScreenplay) return;
    try {
      const annotationData = {
        screenplayId: uploadedScreenplay.id,
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        annotation: newAnnotation.trim(),
        timestamp: new Date(),
        projectId: projectId || 'default-project'
      };
      await addDoc(collection(db, 'screenplayAnnotations'), annotationData);
      setScreenplayAnnotations(prev => [...prev, {
        id: Date.now().toString(),
        userId: currentUser?.uid || 'unknown',
        userName: currentUser?.displayName || 'Anonymous',
        annotation: newAnnotation.trim(),
        timestamp: new Date()
      }]);
      setNewAnnotation('');
      setShowScreenplayViewer(true);
      toast.success('Annotation added successfully!');
    } catch (error) {
      console.error('Error adding annotation:', error);
      toast.error('Failed to add annotation');
    }
  };

  // Load screenplay annotations (reference version)
  const loadAnnotations = async () => {
    if (!uploadedScreenplay) return;
    try {
      const q = query(
        collection(db, 'screenplayAnnotations'),
        where('screenplayId', '==', uploadedScreenplay.id),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const annotations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setScreenplayAnnotations(annotations);
    } catch (error) {
      console.error('Error loading annotations:', error);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleGenerateReport = () => {
    // Navigate to the breakdown reports component
    setActiveTab('screenplays');
    // You can add additional logic here to generate a comprehensive report
    // For now, we'll just show a toast notification
    toast.success('Generating screenplay breakdown report...');

    // In a real implementation, you might want to:
    // 1. Collect all annotations and tags
    // 2. Generate a PDF report
    // 3. Include breakdown elements
    // 4. Add analytics and insights
  };

  // No-op: upload is handled by handleScreenplayUpload
  function handleUploadScreenplay() {
    // Upload is handled by handleScreenplayUpload via file input
  }

  // Workspace-level grading export: one CSV per workspace that combines every
  // student's screenplay + the supervisor + peer notes left on each. Used by
  // teachers at grading time so they don't have to walk into each screenplay
  // and export individually. Visible only to workspace owners / supervisors.
  const [exportingGradingReportFor, setExportingGradingReportFor] = useState<string | null>(null);
  const canExportGradingReport = (workspace: CollaborationWorkspace | null | undefined): boolean => {
    if (!currentUser || !workspace) return false;
    if (isWorkspaceCreator(workspace)) return true;
    if (workspace.supervisorIds?.includes(currentUser.uid)) return true;
    if (workspace.selfElectedSupervisors?.includes(currentUser.uid)) return true;
    return false;
  };
  const handleExportGradingReport = async (workspaceId: string) => {
    const workspace = getWorkspaceById(workspaceId);
    if (!workspace || !canExportGradingReport(workspace)) {
      toast.error(t('collaboration.gradingReport.notAllowed'));
      return;
    }
    const sectionScreenplays = (screenplaysByWorkspaceForExport(workspaceId) || []);
    if (!sectionScreenplays.length) {
      toast(t('collaboration.gradingReport.empty'));
      return;
    }
    setExportingGradingReportFor(workspaceId);
    try {
      const screenplayIds = sectionScreenplays.map(s => s.id);
      // 1. Pull annotations + tags across all screenplays in the workspace
      //    (chunked by 10 — Firestore `in` limit).
      const annotationsRef = collection(db, 'screenplayAnnotations');
      const tagsRef = collection(db, 'screenplayTags');
      type RawNote = { screenplayId?: string; userName?: string; userId?: string; pageNumber?: number; content?: string; annotation?: string; supervisorAtAuthorTime?: boolean; resolved?: boolean; timestamp?: unknown; tagType?: string };
      const allAnnotations: RawNote[] = [];
      const allTags: RawNote[] = [];
      for (let i = 0; i < screenplayIds.length; i += 10) {
        const chunk = screenplayIds.slice(i, i + 10);
        const [annSnap, tagSnap] = await Promise.all([
          getDocs(query(annotationsRef, where('screenplayId', 'in', chunk))),
          getDocs(query(tagsRef, where('screenplayId', 'in', chunk)))
        ]);
        annSnap.docs.forEach(d => allAnnotations.push(d.data() as RawNote));
        tagSnap.docs.forEach(d => allTags.push(d.data() as RawNote));
      }
      // 2. Resolve student names by crewProfile DOCUMENT ID (doc id == uid).
      // crewProfiles created at signup omit the `uid` field on purpose, so a
      // where('uid','in',...) query misses them and the Student column falls
      // back to "Crew Member <last4>". A doc-id get is robust either way.
      const uploaderUids = Array.from(new Set(sectionScreenplays.map(s => s.uploadedBy).filter((u): u is string => Boolean(u))));
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
        t('collaboration.gradingReport.columns.content'),
        t('collaboration.gradingReport.columns.author'),
        t('collaboration.gradingReport.columns.supervisor'),
        t('collaboration.gradingReport.columns.resolved'),
        t('collaboration.gradingReport.columns.timestamp')
      ].map(escapeCsv).join(',');
      const yes = t('collaboration.gradingReport.boolean.yes');
      const no = t('collaboration.gradingReport.boolean.no');
      const screenplayById = new Map(sectionScreenplays.map(s => [s.id, s]));
      const toIso = (ts: unknown): string => {
        if (!ts) return '';
        try {
          const d = (ts as any)?.toDate ? (ts as any).toDate() : new Date(ts as any);
          return isNaN(d.getTime()) ? '' : d.toISOString();
        } catch { return ''; }
      };
      type Row = { student: string; screenplay: string; reviewStatus: string; reviewNote: string; type: string; category: string; page: number; content: string; author: string; supervisor: string; resolved: string; timestamp: string };
      const rowsFromNotes = (notes: RawNote[], type: string, category: (note: RawNote) => string, content: (note: RawNote) => string): Row[] =>
        notes.map(n => {
          const sp = n.screenplayId ? screenplayById.get(n.screenplayId) : undefined;
          const student = sp?.uploadedBy ? (uidToName.get(sp.uploadedBy) || `Crew Member ${sp.uploadedBy.slice(-4)}`) : '';
          const reviewStatus = sp?.reviewStatus ? t(`collaboration.reviewStatus.labels.${sp.reviewStatus}`) : '';
          return {
            student,
            screenplay: sp?.name || '',
            reviewStatus,
            reviewNote: sp?.reviewStatusNote || '',
            type,
            category: category(n),
            page: n.pageNumber ?? 0,
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
      const csv = '﻿' + [headers, ...allRows.map(r => [r.student, r.screenplay, r.reviewStatus, r.reviewNote, r.type, r.category, r.page, r.content, r.author, r.supervisor, r.resolved, r.timestamp].map(escapeCsv).join(','))].join('\r\n');
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
      toast.success(t('collaboration.gradingReport.success'));
    } catch (err) {
      console.error('Grading report export failed:', err);
      toast.error(t('collaboration.gradingReport.failed'));
    } finally {
      setExportingGradingReportFor(null);
    }
  };
  const screenplaysByWorkspaceForExport = (workspaceId: string) =>
    userScreenplays.filter(s => s.workspaceId === workspaceId);

  const handleDeleteScreenplay = async (screenplayId: string) => {
    const screenplay = userScreenplays.find(item => item.id === screenplayId);
    if (!screenplay || !canDeleteScreenplay(screenplay)) {
      toast.error(t('collaboration.screenplaysTab.deleteNotAllowed'));
      return;
    }

    if (window.confirm(t('collaboration.screenplaysTab.deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, 'screenplays', screenplayId));
        toast.success(t('collaboration.screenplaysTab.deleteSuccess'));
        if (screenplay.workspaceId && currentUser) {
          logWorkspaceActivity({
            workspaceId: screenplay.workspaceId,
            actorUid: currentUser.uid,
            actorName: currentUser.displayName,
            verb: 'screenplay_deleted',
            targetId: screenplay.id,
            targetName: screenplay.name
          });
        }
      } catch (error) {
        console.error('Error deleting screenplay:', error);
        toast.error(t('collaboration.screenplaysTab.deleteFailed'));
      }
    }
  };

  const getReviewStatus = (screenplay: Screenplay): ScreenplayReviewStatus =>
    screenplay.reviewStatus || 'draft';

  const getReviewActivityVerb = (status: ScreenplayReviewStatus): WorkspaceActivityVerb => {
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

  const handleReviewStatusChange = async (screenplay: Screenplay, nextStatus: ScreenplayReviewStatus) => {
    if (!currentUser) {
      toast.error('Please sign in to update review status.');
      return;
    }

    const currentStatus = getReviewStatus(screenplay);
    if (currentStatus === nextStatus) return;

    const creatorAllowed = canEditScreenplay(screenplay) && (nextStatus === 'draft' || nextStatus === 'submitted');
    const reviewerAllowed = canReviewScreenplay(screenplay) && (nextStatus === 'changes_requested' || nextStatus === 'approved');
    if (!creatorAllowed && !reviewerAllowed) {
      toast.error('You cannot change this screenplay review status.');
      return;
    }

    const updates: Partial<Screenplay> = {
      reviewStatus: nextStatus,
      reviewStatusUpdatedAt: new Date(),
      reviewStatusUpdatedBy: currentUser.uid,
      reviewStatusNote: ''
    };

    try {
      await updateDoc(doc(db, 'screenplays', screenplay.id), {
        reviewStatus: nextStatus,
        reviewStatusUpdatedAt: serverTimestamp(),
        reviewStatusUpdatedBy: currentUser.uid,
        reviewStatusNote: '',
        lastModified: serverTimestamp()
      });
      updateLocalScreenplay(screenplay.id, updates);
      if (screenplay.workspaceId) {
        logWorkspaceActivity({
          workspaceId: screenplay.workspaceId,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName,
          verb: getReviewActivityVerb(nextStatus),
          targetId: screenplay.id,
          targetName: screenplay.name
        });
      }
      toast.success(t(`collaboration.reviewStatus.toasts.${nextStatus}`));
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error(t('collaboration.reviewStatus.toasts.failed'));
    }
  };

  // Open screenplay viewer modal (reference version)
  const openScreenplayViewer = (screenplay: any) => {
    setSelectedScreenplayId(screenplay.id);
    setShowScreenplayModal(true);
  };

  const handleArchiveWorkspace = async (workspaceId: string) => {
    const workspace = getWorkspaceById(workspaceId);
    if (!workspace || !isWorkspaceCreator(workspace)) return;

    try {
      await updateDoc(doc(db, 'workspaces', workspaceId), {
        status: 'archived',
        archivedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      updateWorkspaceState({
        ...workspace,
        status: 'archived',
        archivedAt: new Date(),
        updatedAt: new Date()
      });
      await writeWorkspaceMemberships(
        {
          ...workspace,
          status: 'archived',
          archivedAt: new Date(),
          updatedAt: new Date()
        },
        workspace.members
      );
      toast.success(`Archived ${workspace.name}.`);
    } catch (error) {
      console.error('Error archiving workspace:', error);
      toast.error('Failed to archive workspace.');
    }
  };

  const handleRestoreWorkspace = async (workspaceId: string) => {
    const workspace = getWorkspaceById(workspaceId);
    if (!workspace || !isWorkspaceCreator(workspace)) return;

    try {
      await updateDoc(doc(db, 'workspaces', workspaceId), {
        status: 'active',
        archivedAt: null,
        deletedAt: null,
        deleteRecoverableUntil: null,
        updatedAt: serverTimestamp()
      });
      const updatedWorkspace = {
        ...workspace,
        status: 'active' as const,
        archivedAt: null,
        deletedAt: null,
        deleteRecoverableUntil: null,
        updatedAt: new Date()
      };
      updateWorkspaceState(updatedWorkspace);
      setSelectedWorkspace(updatedWorkspace);
      await writeWorkspaceMemberships(updatedWorkspace, workspace.members);
      toast.success(`Restored ${workspace.name}.`);
    } catch (error) {
      console.error('Error restoring workspace:', error);
      toast.error('Failed to restore workspace.');
    }
  };

  // Soft-delete workspace handler. The document remains recoverable for 30 days.
  const handleDeleteWorkspace = async (workspaceId: string) => {
    const workspace = getWorkspaceById(workspaceId);
    if (!workspace || !isWorkspaceCreator(workspace)) return;

    if (window.confirm('Delete this workspace? It can be restored for 30 days.')) {
      try {
        const deleteRecoverableUntil = getDeleteRecoveryDate();
        await updateDoc(doc(db, 'workspaces', workspaceId), {
          status: 'deleted',
          deletedAt: serverTimestamp(),
          deleteRecoverableUntil,
          updatedAt: serverTimestamp()
        });
        const updatedWorkspace = {
          ...workspace,
          status: 'deleted' as const,
          deletedAt: new Date(),
          deleteRecoverableUntil: deleteRecoverableUntil.toDate(),
          updatedAt: new Date()
        };
        updateWorkspaceState(updatedWorkspace);
        if (selectedWorkspace?.id === workspaceId) {
          setSelectedWorkspace(updatedWorkspace);
        }
        await writeWorkspaceMemberships(updatedWorkspace, workspace.members);
        toast.success(`${workspace.name} moved to recently deleted.`);
      } catch (error) {
        console.error('Error deleting workspace:', error);
        toast.error('Failed to delete workspace.');
      }
    }
  };

  const handlePermanentDeleteWorkspace = async (workspaceId: string) => {
    const workspace = getWorkspaceById(workspaceId);
    if (!workspace || !isWorkspaceCreator(workspace)) return;

    // The owner can permanently delete a soft-deleted workspace at any point during the
    // recovery window — no need to wait it out. (Firestore rule allows owner delete when
    // status == 'deleted'.)
    if (workspace.status !== 'deleted') {
      toast.error('Move the workspace to the deleted state first.');
      return;
    }

    if (window.confirm('Permanently delete this workspace? This cannot be undone.')) {
      try {
        // Best-effort membership cleanup, by CONSTRUCTED doc id — NOT a query.
        // Querying workspaceMemberships by workspaceId is denied (the list rule only permits
        // listing your OWN memberships, by userId). The owner CAN delete each membership doc
        // by id though, so we build the ids from the workspace's memberIds. Wrapped so a
        // cleanup hiccup never blocks the actual workspace deletion; any leftover membership
        // docs are harmless (the discovery query filters out memberships whose workspace is
        // gone) and can be swept by scripts/cleanup-workspaces.cjs.
        try {
          const memberIds = getWorkspaceMemberIds(workspace);
          if (memberIds.length > 0) {
            const membershipBatch = writeBatch(db);
            memberIds.forEach(uid => membershipBatch.delete(
              doc(db, 'workspaceMemberships', `${workspaceId}_${uid}`)
            ));
            await membershipBatch.commit();
          }
        } catch (membershipError) {
          console.warn('Membership cleanup during permanent delete failed (non-fatal):', membershipError);
        }

        await deleteDoc(doc(db, 'workspaces', workspaceId));
        setWorkspaces(prev => prev.filter(item => item.id !== workspaceId));
        if (selectedWorkspace?.id === workspaceId) {
          setSelectedWorkspace(null);
        }
        toast.success(`${workspace.name} permanently deleted.`);
      } catch (error) {
        console.error('Error permanently deleting workspace:', error);
        toast.error('Failed to permanently delete workspace.');
      }
    }
  };

  const renderWorkspacesTab = () => {
    const workspaceList = [...workspaces].sort((a, b) => {
      const statusOrder = { active: 0, archived: 1, deleted: 2 };
      return statusOrder[a.status || 'active'] - statusOrder[b.status || 'active'];
    });

    return (
    <div className="workspaces-tab">
      <div className="workspaces-header">
        <h2>{t('collaboration.workspacesTab.title')}</h2>
        <button className="create-workspace-btn" onClick={() => setShowCreateWorkspaceModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {t('collaboration.workspacesTab.createWorkspace')}
        </button>
      </div>

      <div className="workspaces-grid">
        {workspaceList.map(workspace => (
	          <div
	            key={workspace.id}
	            className={`workspace-card ${selectedWorkspace?.id === workspace.id ? 'selected' : ''} ${workspace.status || 'active'}`}
	            onClick={() => setSelectedWorkspace(workspace)}
	          >
            {/* Settings gear icon in top-right */}
	            {canManageWorkspace(workspace) && workspace.status !== 'deleted' && (
	              <button
	                className="workspace-settings-gear"
	                title="Settings"
	                aria-label="Settings"
	                onClick={e => { e.stopPropagation(); handleWorkspaceSettings(workspace.id); }}
	                style={{ position: 'absolute', top: 16, right: isWorkspaceCreator(workspace) ? 48 : 16, background: 'none', border: 'none', padding: 0, cursor: 'pointer', zIndex: 2 }}
	              >
	                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
	                  <circle cx="12" cy="12" r="3" />
	                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
	                </svg>
	              </button>
	            )}
	            {/* Delete workspace button */}
	            {isWorkspaceCreator(workspace) && workspace.status !== 'deleted' && (
	              <button
	                className="workspace-delete-btn"
	                title="Delete Workspace"
	                aria-label="Delete Workspace"
	                onClick={e => { e.stopPropagation(); handleDeleteWorkspace(workspace.id); }}
	                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', padding: 0, cursor: 'pointer', zIndex: 2 }}
	              >
	                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
	                  <polyline points="3 6 5 6 21 6" />
	                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
	                  <line x1="10" y1="11" x2="10" y2="17" />
	                  <line x1="14" y1="11" x2="14" y2="17" />
	                </svg>
	              </button>
	            )}
            {/* Card content */}
            <div className="workspace-header">
              <div className="workspace-title-section">
                <div className="workspace-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                </div>
	                <div className="workspace-info">
	                  <h3 className="workspace-title" style={{ color: '#1a1a1a', fontWeight: 600 }}>{workspace.name}</h3>
	                  <span className={`workspace-type ${workspace.type}`} style={{ color: '#666', background: '#f0f0f0' }}>{workspace.type}</span>
	                  {workspace.status && workspace.status !== 'active' && (
	                    <span className={`workspace-status ${workspace.status}`}>{workspace.status === 'deleted' ? 'Recently deleted' : 'Archived'}</span>
	                  )}
	                </div>
              </div>
            </div>

            <p className="workspace-description" style={{ color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{workspace.description}</p>

            <div className="workspace-stats">
              <div className="stat" style={{ color: '#666' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span className="stat-value" style={{ color: '#333', fontWeight: 600 }}>{workspace.members.length}</span>
                <span className="stat-label" style={{ color: '#666' }}>Members</span>
              </div>
              <div className="stat" style={{ color: '#666' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span className="stat-value" style={{ color: '#333', fontWeight: 600 }}>{workspace.members.filter(m => m.isOnline).length}</span>
                <span className="stat-label" style={{ color: '#666' }}>Online</span>
              </div>
            </div>

            {(getEffectiveRole(workspace) || canToggleSupervisor(workspace)) && (
              <div className="workspace-self-role" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px', flexWrap: 'wrap' }}>
                {getEffectiveRole(workspace) && (
                  <span
                    className={`role-chip role-chip--${getEffectiveRole(workspace)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '2px 10px',
                      borderRadius: 999,
                      fontSize: '0.78em',
                      fontWeight: 600,
                      background: isSelfElectedSupervisor(workspace) ? '#fde68a' : '#e0e7ff',
                      color: isSelfElectedSupervisor(workspace) ? '#92400e' : '#3730a3'
                    }}
                    title={isSelfElectedSupervisor(workspace) ? t('collaboration.supervisor.tooltipSelf') : t('collaboration.supervisor.tooltipRole')}
                  >
                    {t('collaboration.supervisor.yourRole', { role: t(`collaboration.roles.${getEffectiveRole(workspace)}`) })}
                    {isSelfElectedSupervisor(workspace) ? ` ${t('collaboration.supervisor.selfTag')}` : ''}
                  </span>
                )}
                {canToggleSupervisor(workspace) && (
                  <button
                    type="button"
                    className="btn-text"
                    disabled={toggleSupervisorPending}
                    onClick={e => { e.stopPropagation(); toggleSelfElectedSupervisor(workspace); }}
                    style={{
                      background: 'transparent',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: '0.8em',
                      color: '#1e293b',
                      cursor: toggleSupervisorPending ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSelfElectedSupervisor(workspace) ? t('collaboration.supervisor.stepDown') : t('collaboration.supervisor.actAs')}
                  </button>
                )}
              </div>
            )}

	            <div className="workspace-actions">
	              {workspace.status !== 'deleted' && (
	                <button
	                  className="btn-primary"
	                  onClick={(e) => {
	                    e.stopPropagation();
	                    handleJoinWorkspace(workspace.id);
	                  }}
	                >
	                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
	                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
	                    <polyline points="10,17 15,12 10,7"/>
	                    <line x1="15" y1="12" x2="3" y2="12"/>
	                  </svg>
	                  Open
	                </button>
	              )}
	              {canManageWorkspace(workspace) && (workspace.status || 'active') === 'active' && (
	                <button
	                  className="btn-secondary"
	                  onClick={(e) => {
	                    e.stopPropagation();
	                    openAddMemberModalForWorkspace(workspace);
	                  }}
	                >
	                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
	                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
	                    <circle cx="8.5" cy="7" r="4"/>
	                    <line x1="20" y1="8" x2="20" y2="14"/>
	                    <line x1="23" y1="11" x2="17" y2="11"/>
	                  </svg>
	                  Invite
	                </button>
	              )}
	              {isWorkspaceCreator(workspace) && (workspace.status || 'active') === 'active' && (
	                <button
	                  className="btn-secondary"
	                  onClick={(e) => {
	                    e.stopPropagation();
	                    handleArchiveWorkspace(workspace.id);
	                  }}
	                >
	                  Archive
	                </button>
	              )}
	              {isWorkspaceCreator(workspace) && workspace.status === 'archived' && (
	                <button
	                  className="btn-secondary"
	                  onClick={(e) => {
	                    e.stopPropagation();
	                    handleRestoreWorkspace(workspace.id);
	                  }}
	                >
	                  Restore
	                </button>
	              )}
	              {isWorkspaceCreator(workspace) && workspace.status === 'deleted' && (
	                <>
	                  <button
	                    className="btn-secondary"
	                    onClick={(e) => {
	                      e.stopPropagation();
	                      handleRestoreWorkspace(workspace.id);
	                    }}
	                  >
	                    Restore
	                  </button>
	                  <button
	                    className="btn-danger"
	                    onClick={(e) => {
	                      e.stopPropagation();
	                      handlePermanentDeleteWorkspace(workspace.id);
	                    }}
	                  >
	                    Delete permanently
	                  </button>
	                  <span className="workspace-recovery-note">
	                    {isDeleteRecoveryExpired(workspace)
	                      ? 'Recovery period ended'
	                      : `Auto-deletes after ${WORKSPACE_DELETE_RECOVERY_DAYS} days`}
	                  </span>
	                </>
	              )}
	            </div>
          </div>
        ))}
      </div>

      {/* G5 — Recent activity for the selected workspace */}
      {selectedWorkspace && (selectedWorkspace.status || 'active') !== 'deleted' && (
        <div className="workspace-activity" style={{ marginTop: 24, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '16px 20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.05em', color: '#1e293b' }}>
            {t('collaboration.activity.title')} — {selectedWorkspace.name}
          </h3>
          {activityEvents.length === 0 ? (
            <p style={{ color: '#94a3b8', margin: 0 }}>{t('collaboration.activity.empty')}</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {activityEvents.map(ev => {
                const when = toDate(ev.createdAt);
                return (
                  <li key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#334155', minWidth: 0 }}>
                      <strong>{ev.actorName || t('collaboration.activity.someone')}</strong>{' '}
                      {t(`collaboration.activity.verbs.${ev.verb}`, {
                        target: ev.targetName || t('collaboration.activity.aScreenplay'),
                        detail: ev.detail || ''
                      })}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.85em', whiteSpace: 'nowrap' }}>
                      {when ? formatTimeAgo(when) : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          {activityHasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActivityLimit(prev => prev + ACTIVITY_PAGE_SIZE)}
                style={{ padding: '0.3rem 0.9rem', fontSize: '0.85em' }}
              >
                {t('collaboration.activity.loadMore')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Workspace Modal - 2-Step Process */}
      {showCreateWorkspaceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{t('collaboration.createWorkspaceModal.title')}</h3>
              <button onClick={() => {
                setShowCreateWorkspaceModal(false);
                setWorkspaceCreationStep('details');
                setNewWorkspaceData({
                  name: '',
                  description: '',
	                  type: 'project',
	                  selectedMembers: [],
	                  selectedMemberRoles: {},
	                  settings: {
                    allowGuestAccess: false,
                    requireApproval: true,
                    autoArchive: false,
                    retentionDays: 365,
                    maxFileSize: MAX_UPLOAD_BYTES,
                    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
                  }
                });
              }} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              {/* Step 1: Workspace Details */}
              {workspaceCreationStep === 'details' && (
                <div className="step-content">
                  <h4>{t('collaboration.createWorkspaceModal.step1')}</h4>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.workspaceName')} *</label>
                    <input
                      type="text"
                      value={newWorkspaceData.name}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('collaboration.createWorkspaceModal.workspaceNamePlaceholder')}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.description')}</label>
                    <textarea
                      value={newWorkspaceData.description}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t('collaboration.createWorkspaceModal.descriptionPlaceholder')}
                      className="form-input"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.workspaceType')}</label>
                    <select
                      value={newWorkspaceData.type}
                      onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="form-input"
                    >
                      <option value="project">{t('collaboration.workspaceTypes.project')}</option>
                      <option value="department">{t('collaboration.workspaceTypes.department')}</option>
                      <option value="general">{t('collaboration.workspaceTypes.general')}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Add Members */}
              {workspaceCreationStep === 'members' && (
                <div className="step-content">
                  <h4>{t('collaboration.createWorkspaceModal.step2')}</h4>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.searchUsers')}</label>
	                    <UserAutocomplete
	                      value={newWorkspaceData.selectedMembers}
	                      onChange={(users: UserAutocompleteOption[]) => setNewWorkspaceData(prev => {
	                        const nextRoles = { ...prev.selectedMemberRoles };
	                        users.forEach(user => {
	                          if (!nextRoles[user.id]) nextRoles[user.id] = 'member';
	                        });
	                        Object.keys(nextRoles).forEach(userId => {
	                          if (!users.some(user => user.id === userId)) delete nextRoles[userId];
	                        });
	                        return { ...prev, selectedMembers: users, selectedMemberRoles: nextRoles };
	                      })}
	                      onSearch={handleUserSearchChange}
	                      options={userSearchResults}
	                      loading={isSearchingUsers}
	                      placeholder={t('collaboration.createWorkspaceModal.searchPlaceholder')}
	                    />
	                    {newWorkspaceData.selectedMembers.length > 0 && (
	                      <div className="selected-members">
	                        <h5>Invite roles</h5>
	                        {newWorkspaceData.selectedMembers.map(member => (
	                          <div className="selected-member" key={member.id}>
	                            <div>
	                              <div className="member-name">{member.name}</div>
	                              <div className="user-email">{member.email}</div>
	                            </div>
	                            <select
	                              className="form-input role-select"
	                              value={newWorkspaceData.selectedMemberRoles[member.id] || 'member'}
	                              onChange={event => setNewWorkspaceData(prev => ({
	                                ...prev,
	                                selectedMemberRoles: {
	                                  ...prev.selectedMemberRoles,
	                                  [member.id]: event.target.value as Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>
	                                }
	                              }))}
	                            >
	                              {INVITABLE_WORKSPACE_ROLES.map(role => (
	                                <option key={role.value} value={role.value}>{t(`collaboration.roles.${role.value}`)}</option>
	                              ))}
	                            </select>
	                          </div>
	                        ))}
	                      </div>
	                    )}
	                  </div>
	                </div>
	              )}

              {/* Step 3: Settings */}
              {workspaceCreationStep === 'settings' && (
                <div className="step-content">
                  <h4>{t('collaboration.createWorkspaceModal.step3')}</h4>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newWorkspaceData.settings.allowGuestAccess}
                        onChange={(e) => setNewWorkspaceData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, allowGuestAccess: e.target.checked }
                        }))}
                      />
                      {t('collaboration.createWorkspaceModal.allowGuestAccess')}
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newWorkspaceData.settings.requireApproval}
                        onChange={(e) => setNewWorkspaceData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, requireApproval: e.target.checked }
                        }))}
                      />
                      {t('collaboration.createWorkspaceModal.requireApproval')}
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newWorkspaceData.settings.autoArchive}
                        onChange={(e) => setNewWorkspaceData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, autoArchive: e.target.checked }
                        }))}
                      />
                      {t('collaboration.createWorkspaceModal.autoArchive')}
                    </label>
                  </div>
                  <div className="form-group">
                    <label>{t('collaboration.createWorkspaceModal.retentionPeriod')}</label>
                    <input
                      type="number"
                      value={newWorkspaceData.settings.retentionDays}
                      onChange={(e) => setNewWorkspaceData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, retentionDays: parseInt(e.target.value) || 365 }
                      }))}
                      className="form-input"
                      min="30"
                      max="3650"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2rem 1rem 2rem' }}>
              <button className="btn-secondary" onClick={() => {
                if (workspaceCreationStep === 'details') {
                  setShowCreateWorkspaceModal(false);
                  setWorkspaceCreationStep('details');
                } else if (workspaceCreationStep === 'members') {
                  setWorkspaceCreationStep('details');
                } else if (workspaceCreationStep === 'settings') {
                  setWorkspaceCreationStep('members');
                }
              }}>{t('collaboration.createWorkspaceModal.cancel')}</button>
              <button className="btn-primary" onClick={handleCreateWorkspaceStep}>{workspaceCreationStep === 'settings' ? t('collaboration.createWorkspaceModal.createWorkspace') : t('collaboration.createWorkspaceModal.next')}</button>
            </div>
          </div>
        </div>
      )}

	      {/* Add Member Modal */}
	      {showAddMemberModal && (
	        <div className="modal-overlay">
	          <div className="modal-content">
	            <div className="modal-header">
	              <h3>Add members to {selectedWorkspace?.name || 'workspace'}</h3>
	              <button onClick={() => {
	                setShowAddMemberModal(false);
	                setPendingMembersToAdd([]);
	                setPendingMemberRole('member');
	                setUserSearchQuery('');
	                setUserSearchResults([]);
	              }} className="close-btn" aria-label="Close">×</button>
	            </div>
	            <div className="modal-body">
	              <div className="form-group">
	                <label>Search Users</label>
	                <UserAutocomplete
	                  value={pendingMembersToAdd}
	                  onChange={(users: UserAutocompleteOption[]) => {
	                    const existingIds = new Set(selectedWorkspace ? getWorkspaceMemberIds(selectedWorkspace) : []);
	                    setPendingMembersToAdd(users.filter(user => !existingIds.has(user.id)));
	                  }}
	                  onSearch={handleUserSearchChange}
	                  options={userSearchResults}
	                  loading={isSearchingUsers}
	                  placeholder="Search by name, email, or role..."
	                />
                {/* Live feedback for search */}
                {isSearchingUsers && <div className="searching-indicator">Searching...</div>}
	                {!isSearchingUsers && userSearchQuery.trim() && userSearchResults.length === 0 && <div className="searching-indicator">No friends found.</div>}
	                {!isSearchingUsers && !userSearchQuery.trim() && <div className="searching-indicator">Start typing to search for users</div>}
	              </div>
	              <div className="form-group">
	                <label>Workspace role</label>
	                <select
	                  className="form-input"
	                  value={pendingMemberRole}
	                  onChange={event => setPendingMemberRole(event.target.value as Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>)}
	                >
	                  {INVITABLE_WORKSPACE_ROLES.map(role => (
	                    <option key={role.value} value={role.value}>
	                      {t(`collaboration.roles.${role.value}`)} — {t(`collaboration.roles.${role.value}Desc`)}
	                    </option>
	                  ))}
	                </select>
	              </div>
	              {selectedWorkspace && selectedWorkspace.members.length > 0 && (
	                <div className="selected-members">
	                  <h5>Current members</h5>
	                  {selectedWorkspace.members.map(member => (
	                    <div className="selected-member" key={member.userId}>
	                      <div>
	                        <div className="member-name">{member.email || member.userId}</div>
	                        <div className="user-email">{member.role}</div>
	                      </div>
	                    </div>
	                  ))}
	                </div>
	              )}
	            </div>
	            <div className="modal-footer">
	              <button
	                className="btn-secondary"
	                onClick={() => {
	                  setShowAddMemberModal(false);
	                  setPendingMembersToAdd([]);
	                  setPendingMemberRole('member');
	                }}
	              >
	                Cancel
	              </button>
	              <button
	                className="btn-primary"
	                disabled={isAddingMembers || pendingMembersToAdd.length === 0 || !selectedWorkspace}
	                onClick={() => inviteUsersToWorkspace(pendingMembersToAdd, pendingMemberRole)}
	              >
	                {isAddingMembers ? 'Sending...' : 'Send invitations'}
	              </button>
	            </div>
	          </div>
	        </div>
	      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{t('collaboration.workspaceSettings.title')}</h3>
              <button onClick={() => setShowSettingsModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="step-content">
                <h4>{t('collaboration.workspaceSettings.detailsSection')}</h4>
                <div className="form-group">
                  <label>{t('collaboration.workspaceSettings.workspaceName')} *</label>
                  <input
                    type="text"
                    value={workspaceDetails.name}
                    onChange={(e) => setWorkspaceDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('collaboration.createWorkspaceModal.workspaceNamePlaceholder')}
                    className="form-input"
                    maxLength={80}
                  />
                </div>
                <div className="form-group">
                  <label>{t('collaboration.workspaceSettings.description')}</label>
                  <textarea
                    value={workspaceDetails.description}
                    onChange={(e) => setWorkspaceDetails(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('collaboration.createWorkspaceModal.descriptionPlaceholder')}
                    className="form-input"
                    rows={3}
                    maxLength={500}
                  />
                </div>
                <div className="form-group">
                  <label>{t('collaboration.workspaceSettings.workspaceType')}</label>
                  <select
                    value={workspaceDetails.type}
                    onChange={(e) => setWorkspaceDetails(prev => ({ ...prev, type: e.target.value as CollaborationWorkspace['type'] }))}
                    className="form-input"
                  >
                    <option value="project">{t('collaboration.workspaceTypes.project')}</option>
                    <option value="department">{t('collaboration.workspaceTypes.department')}</option>
                    <option value="general">{t('collaboration.workspaceTypes.general')}</option>
                  </select>
                </div>
              </div>
              <div className="step-content">
                <h4>{t('collaboration.workspaceSettings.preferencesSection')}</h4>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={workspaceSettings.allowGuestAccess}
                    onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, allowGuestAccess: e.target.checked }))}
                  />
                  Allow Guest Access
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={workspaceSettings.requireApproval}
                    onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, requireApproval: e.target.checked }))}
                  />
                  Require Approval for New Members
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={workspaceSettings.autoArchive}
                    onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, autoArchive: e.target.checked }))}
                  />
                  Auto-archive Inactive Content
                </label>
              </div>
              <div className="form-group">
                <label>Retention Period (days)</label>
                <input
                  type="number"
                  value={workspaceSettings.retentionDays}
                  onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) || 365 }))}
                  className="form-input"
                  min="30"
                  max="3650"
                />
              </div>
              <div className="form-group">
                <label>Max File Size (MB)</label>
                <input
                  type="number"
                  value={Math.round(workspaceSettings.maxFileSize / (1024 * 1024))}
                  onChange={(e) => setWorkspaceSettings(prev => ({
                    ...prev,
                    maxFileSize: (parseInt(e.target.value) || MAX_UPLOAD_MB) * 1024 * 1024
                  }))}
                  className="form-input"
                  min="1"
                  max="1000"
                />
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2rem 1rem 2rem' }}>
              <button className="btn-secondary" onClick={() => setShowSettingsModal(false)}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handleUpdateWorkspaceSettings}
                disabled={!workspaceDetails.name.trim()}
              >
                {t('collaboration.workspaceSettings.saveSettings')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video call functionality will be added in a future update */}
    </div>
    );
  };

  const renderTasksTab = () => (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h2>{t('collaboration.tasksTab.title')}</h2>
        <p>{t('collaboration.tasksTab.subtitle')}</p>
      </div>

      <div className="tasks-content">
        <CollaborativeTasksHub projectId={projectId || 'default-project'} />
      </div>
    </div>
  );

  const renderScreenplaysTab = () => {
    const uploadableWorkspaces = workspaces.filter(workspace => canEditWorkspaceContent(workspace));
    const selectedUploadWorkspace = uploadableWorkspaces.find(workspace => workspace.id === uploadWorkspaceId) || null;
    const screenplaysByWorkspace = userScreenplays.reduce<Record<string, Screenplay[]>>((groups, screenplay) => {
      const key = screenplay.workspaceId || 'personal';
      if (!groups[key]) groups[key] = [];
      groups[key].push(screenplay);
      return groups;
    }, {});
    const sectionKeys = [
      ...workspaces
        .filter(workspace => screenplaysByWorkspace[workspace.id]?.length)
        .map(workspace => workspace.id),
      ...(screenplaysByWorkspace.personal?.length ? ['personal'] : [])
    ];

    const renderScreenplayRows = (screenplays: Screenplay[]) => (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {screenplays.map(screenplay => {
          const openCount = unresolvedCountByScreenplay[screenplay.id] || 0;
          const teacherCount = unresolvedFromTeacherCountByScreenplay[screenplay.id] || 0;
          const reviewStatus = getReviewStatus(screenplay);
          const canSubmitReview = canEditScreenplay(screenplay) && (reviewStatus === 'draft' || reviewStatus === 'changes_requested');
          const canReturnToDraft = canEditScreenplay(screenplay) && reviewStatus !== 'draft';
          const canTeacherReview = canReviewScreenplay(screenplay) && reviewStatus === 'submitted';
          return (
            <li key={screenplay.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              padding: '0.75rem 0',
              borderBottom: '1px solid #eee'
            }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <span style={{ fontWeight: 600, color: '#222' }}>{screenplay.name}</span>
                <span style={{ color: '#888', fontSize: '0.95em' }}>{screenplay.type}</span>
                <span style={{ color: '#666', fontSize: '0.85em' }}>{getWorkspaceLabel(screenplay.workspaceId)}</span>
                <span
                  className={`review-status-chip review-status-chip--${reviewStatus}`}
                  title={t(`collaboration.reviewStatus.descriptions.${reviewStatus}`)}
                  aria-label={t(`collaboration.reviewStatus.labels.${reviewStatus}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: '0.76em',
                    fontWeight: 700,
                    background: reviewStatus === 'approved' ? '#dcfce7' : reviewStatus === 'changes_requested' ? '#ffedd5' : reviewStatus === 'submitted' ? '#dbeafe' : '#f1f5f9',
                    color: reviewStatus === 'approved' ? '#166534' : reviewStatus === 'changes_requested' ? '#9a3412' : reviewStatus === 'submitted' ? '#1e40af' : '#475569'
                  }}
                >
                  {t(`collaboration.reviewStatus.labels.${reviewStatus}`)}
                </span>
                {openCount > 0 && (
                  <span
                    title={t('collaboration.badges.unresolvedTooltip', { count: openCount })}
                    aria-label={t('collaboration.badges.unresolvedTooltip', { count: openCount })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      borderRadius: 999,
                      fontSize: '0.78em',
                      fontWeight: 600,
                      background: '#fee2e2',
                      color: '#991b1b'
                    }}
                  >
                    💬 {openCount}
                  </span>
                )}
                {teacherCount > 0 && (
                  <span
                    title={t('collaboration.badges.unresolvedSupervisorTooltip', { count: teacherCount })}
                    aria-label={t('collaboration.badges.unresolvedSupervisorTooltip', { count: teacherCount })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      borderRadius: 999,
                      fontSize: '0.78em',
                      fontWeight: 700,
                      background: '#fde68a',
                      color: '#92400e'
                    }}
                  >
                    🎓 {teacherCount}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {screenplay.format === 'fountain' && canEditScreenplay(screenplay) && (
                  <button
                    className="btn-primary"
                    style={{ padding: '0.4rem 1rem', fontSize: '0.95em' }}
                    onClick={() => setEditingFountain(screenplay)}
                  >
                    ✍️ {t('fountain.write')}
                  </button>
                )}
                <button
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.95em' }}
                  onClick={() => openScreenplayViewer(screenplay)}
                >
                  {t('collaboration.view')}
                </button>
                {canDeleteScreenplay(screenplay) && (
                  <button
                    className="btn-danger"
                    style={{ padding: '0.4rem 1rem', fontSize: '0.95em' }}
                    onClick={() => handleDeleteScreenplay(screenplay.id)}
                  >
                    {t('collaboration.delete')}
                  </button>
                )}
              </div>
              {(canSubmitReview || canReturnToDraft || canTeacherReview) && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {canSubmitReview && (
                    <button
                      className="btn-primary"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.85em' }}
                      onClick={() => handleReviewStatusChange(screenplay, 'submitted')}
                    >
                      {t('collaboration.reviewStatus.actions.submit')}
                    </button>
                  )}
                  {canTeacherReview && (
                    <>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.85em' }}
                        onClick={() => handleReviewStatusChange(screenplay, 'changes_requested')}
                      >
                        {t('collaboration.reviewStatus.actions.requestChanges')}
                      </button>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.85em' }}
                        onClick={() => handleReviewStatusChange(screenplay, 'approved')}
                      >
                        {t('collaboration.reviewStatus.actions.approve')}
                      </button>
                    </>
                  )}
                  {canReturnToDraft && (
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.85em' }}
                      onClick={() => handleReviewStatusChange(screenplay, 'draft')}
                    >
                      {t('collaboration.reviewStatus.actions.returnToDraft')}
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );

    return (
      <div className="screenplays-tab">
        <div className="screenplays-header">
          <h2>{t('collaboration.screenplaysTab.title')}</h2>
          <p>{t('collaboration.screenplaysTab.subtitle')}</p>
        </div>
        <div className="screenplays-content">
          <div className="screenplay-upload-card bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="form-group">
              <label>{t('collaboration.uploadToWorkspace')}</label>
              <select
                className="form-input"
                value={selectedUploadWorkspace?.id || ''}
                onChange={event => setUploadWorkspaceId(event.target.value)}
              >
                <option value="">{t('collaboration.personalNoWorkspace')}</option>
                {uploadableWorkspaces.map(workspace => (
                  <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
                ))}
              </select>
              <p className="form-help">
                {t('collaboration.uploadHelp')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('screenplay-upload') as HTMLInputElement | null;
                  input?.click();
                }}
                disabled={uploadingScreenplay}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#1976d2',
                  color: '#fff',
                  padding: '0.75rem 2rem',
                  borderRadius: '6px',
                  border: 0,
                  fontWeight: 600,
                  cursor: uploadingScreenplay ? 'not-allowed' : 'pointer',
                  opacity: uploadingScreenplay ? 0.6 : 1,
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)'
                }}
              >
                {uploadingScreenplay
                  ? (uploadProgress
                    ? t('collaboration.uploadProgress', { current: uploadProgress.current, total: uploadProgress.total })
                    : t('collaboration.screenplaysTab.uploading'))
                  : t('collaboration.screenplaysTab.uploadScreenplay')}
              </button>
              <input
                id="screenplay-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
                onChange={handleScreenplayUpload}
                disabled={uploadingScreenplay}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setNewFountainTitle(''); setShowStartWritingModal(true); }}
                style={{ padding: '0.75rem 1.5rem', fontWeight: 600 }}
              >
                ✍️ {t('fountain.startWriting')}
              </button>
            </div>
            {selectedUploadWorkspace && canManageWorkspace(selectedUploadWorkspace) && (
              <div className="optional-invite" style={{ marginTop: 16 }}>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => openAddMemberModalForWorkspace(selectedUploadWorkspace)}
                >
                  {t('collaboration.inviteMembersOptional')}
                </button>
              </div>
            )}
          </div>
          <div className="screenplays-list bg-white rounded-lg shadow-md p-6">
            {userScreenplays.length === 0 ? (
              <div
                className="screenplays-empty-state"
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1.5rem',
                  color: '#475569'
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }} aria-hidden="true">🎬</div>
                <h3 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '1.15em' }}>
                  {t('collaboration.emptyState.title')}
                </h3>
                <p style={{ margin: '0 auto 20px', maxWidth: 460, lineHeight: 1.5 }}>
                  {t('collaboration.emptyState.body')}
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      const input = document.getElementById('screenplay-upload') as HTMLInputElement | null;
                      input?.click();
                    }}
                  >
                    {t('collaboration.emptyState.uploadCta')}
                  </button>
                  {selectedUploadWorkspace && canManageWorkspace(selectedUploadWorkspace) && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => openAddMemberModalForWorkspace(selectedUploadWorkspace)}
                    >
                      {t('collaboration.emptyState.inviteCta')}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              sectionKeys.map(sectionKey => {
                const sectionWorkspace = sectionKey === 'personal' ? null : getWorkspaceById(sectionKey);
                const showGradingExport = sectionWorkspace && canExportGradingReport(sectionWorkspace);
                const exporting = exportingGradingReportFor === sectionKey;
                return (
                  <section key={sectionKey} className="screenplay-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0 }}>{sectionKey === 'personal' ? t('collaboration.personalNoWorkspace') : getWorkspaceLabel(sectionKey)}</h3>
                      {showGradingExport && (
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => handleExportGradingReport(sectionKey)}
                          disabled={exporting}
                          style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                          title={t('collaboration.gradingReport.tooltip')}
                        >
                          {exporting ? `⏳ ${t('collaboration.gradingReport.generating')}` : `📊 ${t('collaboration.gradingReport.button')}`}
                        </button>
                      )}
                    </div>
                    {renderScreenplayRows(screenplaysByWorkspace[sectionKey] || [])}
                  </section>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workspaces':
        return renderWorkspacesTab();
      case 'tasks':
        return renderTasksTab();
      case 'screenplays':
        return renderScreenplaysTab();
      default:
        return (
          <div className="error-content">
            <p>Please try refreshing the page.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="collaboration-hub loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collaboration-hub error">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  debugLog('Rendering CollaborationHub with:', {
    activeTab,
    workspacesCount: workspaces.length,
    selectedWorkspace: selectedWorkspace?.name
  });

  return (
    <CollaborationErrorBoundary>
      <div className="collaboration-hub">
        <div className="collaboration-header">
          <h1>{t('collaboration.title')}</h1>
          <div className="header-actions">
            {/* Video call functionality will be added in a future update */}
          </div>
        </div>

        <div className="collaboration-content">
          <div className="collaboration-sidebar">
            <nav className="collaboration-nav">
              <button 
                className={`nav-item ${activeTab === 'workspaces' ? 'active' : ''}`}
                onClick={() => setActiveTab('workspaces')}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                <span className="nav-label">{t('collaboration.workspaces')}</span>
              </button>
              

              <button 
                className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                <span className="nav-label">{t('collaboration.tasks')}</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'screenplays' ? 'active' : ''}`}
                onClick={() => setActiveTab('screenplays')}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                <span className="nav-label">{t('collaboration.screenplays')}</span>
              </button>
            </nav>
          </div>

          <div className="collaboration-main">
            {renderTabContent()}
          </div>
        </div>

        {/* Screenplay Viewer Modal */}
        {showScreenplayViewer && uploadedScreenplay && (
          <ScreenplayViewer
            screenplay={{
              id: uploadedScreenplay.id || '',
              name: uploadedScreenplay.name,
              url: uploadedScreenplay.url,
              type: uploadedScreenplay.type,
              format: uploadedScreenplay.format,
              fountainSource: uploadedScreenplay.fountainSource,
              reviewStatus: uploadedScreenplay.reviewStatus
            }}
            projectId={projectId || 'default-project'}
            onClose={() => setShowScreenplayViewer(false)}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {/* Full-Screen Screenplay Modal */}
        {showScreenplayModal && selectedScreenplayId && (
          <div 
            className="screenplay-modal-overlay"
            onScroll={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="screenplay-modal">
              <div className="modal-content">
                {(() => {
                  const selectedScreenplay = userScreenplays.find(s => s.id === selectedScreenplayId);
                  if (!selectedScreenplay) return null;
                  
                  return (
                    <ScreenplayViewer
                      screenplay={{
                        id: selectedScreenplay.id,
                        name: selectedScreenplay.name,
                        url: selectedScreenplay.url,
                        type: selectedScreenplay.type,
                        format: selectedScreenplay.format,
                        fountainSource: selectedScreenplay.fountainSource,
                        reviewStatus: selectedScreenplay.reviewStatus
                      }}
                      projectId={projectId || 'default-project'}
                      onClose={() => {
                        setShowScreenplayModal(false);
                        setSelectedScreenplayId(null);
                      }}
                      onGenerateReport={handleGenerateReport}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* In-browser Fountain editor (B3) */}
        {editingFountain && (
          <FountainEditor
            screenplay={{
              id: editingFountain.id,
              name: editingFountain.name,
              fountainSource: editingFountain.fountainSource
            }}
            onClose={() => setEditingFountain(null)}
          />
        )}

        {/* Start Writing modal (B2) */}
        {showStartWritingModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{t('fountain.startWriting')}</h3>
                <button
                  className="close-btn"
                  aria-label={t('fountain.close')}
                  onClick={() => { setShowStartWritingModal(false); setNewFountainTitle(''); }}
                >×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>{t('fountain.titleLabel')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newFountainTitle}
                    autoFocus
                    placeholder={t('fountain.titlePlaceholder')}
                    onChange={e => setNewFountainTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateFountainScreenplay(); }}
                  />
                </div>
                <div className="form-group">
                  <label>{t('collaboration.uploadToWorkspace')}</label>
                  <select
                    className="form-input"
                    value={workspaces.find(w => w.id === uploadWorkspaceId && canEditWorkspaceContent(w)) ? uploadWorkspaceId : ''}
                    onChange={e => setUploadWorkspaceId(e.target.value)}
                  >
                    <option value="">{t('collaboration.personalNoWorkspace')}</option>
                    {workspaces.filter(canEditWorkspaceContent).map(workspace => (
                      <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2rem 1rem 2rem' }}>
                <button
                  className="btn-secondary"
                  onClick={() => { setShowStartWritingModal(false); setNewFountainTitle(''); }}
                >
                  {t('fountain.cancel')}
                </button>
                <button
                  className="btn-primary"
                  disabled={creatingFountain || !newFountainTitle.trim()}
                  onClick={handleCreateFountainScreenplay}
                >
                  {creatingFountain ? t('fountain.creating') : t('fountain.create')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CollaborationErrorBoundary>
  );
};

export default CollaborationHub;
