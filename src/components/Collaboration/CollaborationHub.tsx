import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  CollaborationWorkspace,
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
import { collection, addDoc, query, where, orderBy, getDocs, getDoc, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp, Timestamp, arrayUnion, arrayRemove, QuerySnapshot, Unsubscribe, writeBatch } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import ScreenplayViewer from './ScreenplayViewer';
import FountainEditor from './FountainEditor';
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

const WORKSPACE_DELETE_RECOVERY_DAYS = 30;
// Labels + descriptions are resolved via i18n at render time (collaboration.roles.*)
// so the invite dropdown matches the active language.
const INVITABLE_WORKSPACE_ROLES: Array<{
  value: Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>;
}> = [
  { value: 'member' },
  { value: 'supervisor' },
  { value: 'viewer' }
];

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
      maxFileSize: 100 * 1024 * 1024,
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

  const toggleSelfElectedSupervisor = async (workspace: CollaborationWorkspace) => {
    if (!currentUser || !canSelfElectSupervisor(workspace) || toggleSupervisorPending) return;
    const enabling = !isSelfElectedSupervisor(workspace);
    setToggleSupervisorPending(true);
    try {
      await updateDoc(doc(db, 'workspaces', workspace.id), {
        selfElectedSupervisors: enabling ? arrayUnion(currentUser.uid) : arrayRemove(currentUser.uid),
        updatedAt: serverTimestamp()
      });
      toast.success(enabling
        ? t('collaboration.supervisor.enabled')
        : t('collaboration.supervisor.disabled'));
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
    unsubscribes.push(onSnapshot(
      query(screenplaysRef, where('teamMembers', 'array-contains', currentUser.uid)),
      handleSnapshot('teamMembers'),
      handleError('teamMembers')
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
    const chunkAnnotations = new Map<number, Array<{ screenplayId?: string; resolved?: boolean; supervisorAtAuthorTime?: boolean }>>();

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
      const q = query(annotationsRef, where('screenplayId', 'in', chunk));
      unsubs.push(onSnapshot(
        q,
        snapshot => {
          const list = snapshot.docs.map(d => d.data() as { screenplayId?: string; resolved?: boolean; supervisorAtAuthorTime?: boolean });
          chunkAnnotations.set(chunkIndex, list);
          recompute();
        },
        err => console.error('Annotation count subscription error:', err)
      ));
    }

    return () => {
      unsubs.forEach(u => u());
    };
  }, [currentUser, userScreenplaysKey]);

  useEffect(() => {
    loadTeamMembers();
  }, [selectedWorkspace?.id]);

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
        const snap = await getDoc(doc(db, 'crewProfiles', currentUser.uid));
        if (cancelled || !snap.exists()) return;
        const data = snap.data();
        setIsTeacher(data?.isTeacher === true || data?.profileType === 'teacher');
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
      let allResults: UserSearchResult[] = [];
      if (approvedContacts.length > 0) {
        // Fetch all approved contacts' crew profiles in chunks of 10
        const crewProfilesRef = collection(db, 'crewProfiles');
        const approvedChunks = [];
        for (let i = 0; i < approvedContacts.length; i += 10) {
          approvedChunks.push(approvedContacts.slice(i, i + 10));
        }
        for (const chunk of approvedChunks) {
          const q = query(crewProfilesRef, where('uid', 'in', chunk));
          const snap = await getDocs(q);
          allResults = allResults.concat(
            snap.docs.map(doc => ({
              id: doc.id,
              name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
              email: doc.data().email || '',
              avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
              role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
              company: doc.data().company || ''
            }))
          );
        }
      } else {
        // Fallback: search all crew profiles
        const crewProfilesRef = collection(db, 'crewProfiles');
        const snap = await getDocs(crewProfilesRef);
        debugLog('[CollabModal] Fallback: found', snap.docs.length, 'crew profiles in Firestore');
        allResults = snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
          email: doc.data().email || '',
          avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
          role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
          company: doc.data().company || ''
        }));
        if (allResults.length === 0) {
          console.warn('[CollabModal] No crew profiles found in Firestore crewProfiles collection.');
        }
      }
      // Filter by search query
      const filtered = allResults.filter(user =>
        (user.name || '').toLowerCase().includes(queryStr.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(queryStr.toLowerCase()) ||
        (user.role || '').toLowerCase().includes(queryStr.toLowerCase()) ||
        (user.company || '').toLowerCase().includes(queryStr.toLowerCase())
      );
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

  const buildWorkspaceMember = (
    user: Pick<UserSearchResult, 'id' | 'email'>,
    role: Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>
  ): WorkspaceMember => ({
      userId: user.id,
      email: user.email,
      role,
      joinedAt: new Date(),
      permissions: getPermissionsForRole(role),
      isOnline: false,
      lastSeen: new Date()
  });

  const syncWorkspaceScreenplayAccess = async (workspaceId: string, memberIds: string[]) => {
    const screenplaysQuery = query(
      collection(db, 'screenplays'),
      where('workspaceId', '==', workspaceId)
    );
    const snapshot = await getDocs(screenplaysQuery);

    await Promise.all(snapshot.docs.map(screenplayDoc => {
      const data = screenplayDoc.data();
      const currentTeamMembers = Array.isArray(data.teamMembers) ? data.teamMembers : [];
      const mergedTeamMembers = Array.from(new Set([...currentTeamMembers, ...memberIds]));
      return updateDoc(doc(db, 'screenplays', screenplayDoc.id), {
        teamMembers: mergedTeamMembers,
        lastModified: serverTimestamp()
      });
    }));
  };

  const addUsersToWorkspace = async (
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
      const existingIds = new Set(getWorkspaceMemberIds(workspace));
      const newMembers = users
        .filter(user => !existingIds.has(user.id))
        .map(user => buildWorkspaceMember(user, role));

      if (newMembers.length === 0) {
        toast.error('Those users are already in this workspace.');
        return;
      }

      const updatedMembers = [...(workspace.members || []), ...newMembers];
      const memberIds = Array.from(new Set(updatedMembers.map(member => member.userId).filter(Boolean)));
      const supervisorIds = getWorkspaceSupervisorIds(updatedMembers);
      const viewerIds = getWorkspaceViewerIds(updatedMembers);

      await updateDoc(doc(db, 'workspaces', workspace.id), {
        members: updatedMembers,
        memberIds,
        supervisorIds,
        viewerIds,
        updatedAt: serverTimestamp()
      });

      await writeWorkspaceMemberships({
        ...workspace,
        members: updatedMembers,
        memberIds,
        supervisorIds,
        viewerIds
      }, newMembers);

      await syncWorkspaceScreenplayAccess(workspace.id, memberIds);

      const updatedWorkspace: CollaborationWorkspace = {
        ...workspace,
        members: updatedMembers,
        memberIds,
        supervisorIds,
        viewerIds,
        updatedAt: new Date()
      };

      updateWorkspaceState(updatedWorkspace);

      setShowAddMemberModal(false);
      setPendingMembersToAdd([]);
      setPendingMemberRole('member');
      setUserSearchQuery('');
      setUserSearchResults([]);
      toast.success(`Added ${newMembers.length} member${newMembers.length === 1 ? '' : 's'} to ${workspace.name}.`);
    } catch (error) {
      console.error('Error adding users to workspace:', error);
      toast.error('Failed to add members. Please try again.');
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
        },
        ...newWorkspaceData.selectedMembers.map(user => buildWorkspaceMember(
          user,
          newWorkspaceData.selectedMemberRoles[user.id] || 'member'
        ))
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
          maxFileSize: 100 * 1024 * 1024,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
        }
      });
      setWorkspaceCreationStep('details');
      setShowCreateWorkspaceModal(false);
      toast.success(`Workspace "${newWorkspaceData.name.trim()}" created successfully!`);
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

    try {
      await updateDoc(doc(db, 'workspaces', selectedWorkspace.id), {
        settings: workspaceSettings,
        updatedAt: serverTimestamp()
      });

      const updatedWorkspace = {
        ...selectedWorkspace,
        settings: workspaceSettings,
        updatedAt: new Date()
      };
      updateWorkspaceState(updatedWorkspace);
      setShowSettingsModal(false);
      toast.success('Workspace settings updated successfully!');
    } catch (error) {
      console.error('Error updating workspace settings:', error);
      toast.error('Failed to update workspace settings.');
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
        uploadedAt: now,
        lastModified: now
      };

      const docRef = await addDoc(collection(db, 'screenplays'), screenplayData);
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
        uploadedAt: now,
        lastModified: now
      };
      const docRef = await addDoc(collection(db, 'screenplays'), screenplayData);
      const created: Screenplay = { ...screenplayData, id: docRef.id };

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
      const crewProfilesRef = collection(db, 'crewProfiles');
      const chunks = [];
      for (let i = 0; i < memberIds.length; i += 10) {
        chunks.push(memberIds.slice(i, i + 10));
      }
      let allMembers: any[] = [];
      for (const chunk of chunks) {
        const q = query(crewProfilesRef, where('uid', 'in', chunk));
        const snap = await getDocs(q);
        allMembers = allMembers.concat(snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
          email: doc.data().email || '',
          role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
          avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
          isOnline: doc.data().isOnline || false
        })));
      }
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

  const handleDeleteScreenplay = async (screenplayId: string) => {
    const screenplay = userScreenplays.find(item => item.id === screenplayId);
    if (!screenplay || !canDeleteScreenplay(screenplay)) {
      toast.error('Only the screenplay uploader or workspace creator can delete this screenplay.');
      return;
    }

    if (window.confirm(t('collaboration.screenplaysTab.deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, 'screenplays', screenplayId));
        toast.success(t('collaboration.screenplaysTab.deleteSuccess'));
      } catch (error) {
        console.error('Error deleting screenplay:', error);
        toast.error(t('collaboration.screenplaysTab.deleteFailed'));
      }
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

    if (!isDeleteRecoveryExpired(workspace)) {
      toast.error(`This workspace can be restored for ${WORKSPACE_DELETE_RECOVERY_DAYS} days before permanent deletion.`);
      return;
    }

    if (window.confirm('Permanently delete this workspace? This cannot be undone.')) {
      try {
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

            {(getEffectiveRole(workspace) || canSelfElectSupervisor(workspace)) && (
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
                {canSelfElectSupervisor(workspace) && (
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
	                  {isDeleteRecoveryExpired(workspace) ? (
	                    <button
	                      className="btn-danger"
	                      onClick={(e) => {
	                        e.stopPropagation();
	                        handlePermanentDeleteWorkspace(workspace.id);
	                      }}
	                    >
	                      Delete forever
	                    </button>
	                  ) : (
	                    <span className="workspace-recovery-note">
	                      Recoverable for {WORKSPACE_DELETE_RECOVERY_DAYS} days
	                    </span>
	                  )}
	                </>
	              )}
	            </div>
          </div>
        ))}
      </div>

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
                    maxFileSize: 100 * 1024 * 1024,
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
	                onClick={() => addUsersToWorkspace(pendingMembersToAdd, pendingMemberRole)}
	              >
	                {isAddingMembers ? 'Adding...' : 'Add members'}
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
              <h3>Workspace Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
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
                    maxFileSize: (parseInt(e.target.value) || 100) * 1024 * 1024
                  }))}
                  className="form-input"
                  min="1"
                  max="1000"
                />
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2rem 1rem 2rem' }}>
              <button className="btn-secondary" onClick={() => setShowSettingsModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateWorkspaceSettings}>Save Settings</button>
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
          return (
            <li key={screenplay.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: '0.75rem 0',
              borderBottom: '1px solid #eee'
            }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <span style={{ fontWeight: 600, color: '#222' }}>{screenplay.name}</span>
                <span style={{ color: '#888', fontSize: '0.95em' }}>{screenplay.type}</span>
                <span style={{ color: '#666', fontSize: '0.85em' }}>{getWorkspaceLabel(screenplay.workspaceId)}</span>
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
              <div style={{ display: 'flex', gap: 12 }}>
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
              sectionKeys.map(sectionKey => (
                <section key={sectionKey} className="screenplay-section">
                  <h3>{sectionKey === 'personal' ? t('collaboration.personalNoWorkspace') : getWorkspaceLabel(sectionKey)}</h3>
                  {renderScreenplayRows(screenplaysByWorkspace[sectionKey] || [])}
                </section>
              ))
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
              fountainSource: uploadedScreenplay.fountainSource
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
                        fountainSource: selectedScreenplay.fountainSource
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
