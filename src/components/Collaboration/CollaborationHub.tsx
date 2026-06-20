import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  CollaborationWorkspace,
  ScreenplayReviewStatus,
  WorkspaceMember,
  WorkspaceRole
} from '../../types/Collaboration';
import CollaborativeTasksHub from '../CollaborativeTasks/CollaborativeTasksHub';
import './CollaborationHub.scss';
import UserAutocomplete, { UserAutocompleteOption } from './UserAutocomplete';
import { toast } from 'react-hot-toast';
import { collection, addDoc, query, where, getDocs, getDoc, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp, Timestamp, QuerySnapshot, Unsubscribe, writeBatch } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, db } from '../../firebase';
import ScreenplayViewerModal from './ScreenplayViewerModal';
import FountainEditor from './FountainEditor';
import { logWorkspaceActivity } from '../../services/workspaceActivityService';
import {
  createFountainScreenplay,
  createWorkspaceInvitations as createWorkspaceInvitationsService,
  deleteScreenplayDoc,
  isAcceptedScreenplayFile,
  setScreenplayReviewStatus,
  uploadScreenplayFile
} from '../../services/screenplayService';
import * as access from './workspaceAccess';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB, Screenplay } from './workspaceAccess';
import ScreenplayList from './ScreenplayList';
import { searchCrewProfiles } from './crewSearch';
import { createTeacherClass, normalizeTeacherClass, updateTeacherClass, TeacherClass, CLASS_COLORS, getClassColor, getReadableTextColor } from '../../services/classService';
import {
  ClassDirectory,
  ClassDirectoryGroup,
  createJoinRequest,
  JoinRequestStatus,
  subscribeToClassDirectory,
  subscribeToMyJoinRequests,
  WorkspaceJoinRequest
} from '../../services/joinRequestService';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

const AVATAR_COLORS = ['#0a84ff', '#5e5ce6', '#0f9d6e', '#d97706', '#db2777', '#0891b2', '#e11d48'];
const avatarColor = (seed: string): string => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
};
// Initials from a display name ("Dana Velez" -> "DV") or, as a fallback, an email.
const nameInitials = (s: string): string => {
  const raw = s || '?';
  const base = raw.includes('@') ? raw.split('@')[0] : raw;
  const parts = base.trim().split(/[\s._\-]+/).filter(Boolean);
  const a = parts[0]?.[0] || base[0] || '?';
  const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (a + b).toUpperCase().slice(0, 2);
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

// Screenplay type + capability helpers live in ./workspaceAccess (shared with
// WorkspaceDetailPage, the single-group page this hub links to).

// Workspace creation step
type WorkspaceCreationStep = 'details' | 'members' | 'settings';

// Define TabType at the top of the file
type TabType = 'workspaces' | 'tasks' | 'screenplays' | 'classes';
const TAB_TYPES: TabType[] = ['workspaces', 'tasks', 'screenplays', 'classes'];

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
      // Class components can't use the useTranslation hook; the i18next instance
      // translates fine and re-evaluates on each crash render.
      return (
        <div className="error-boundary">
          <h2>{i18n.t('collaboration.errors.boundaryTitle')}</h2>
          <p>{i18n.t('collaboration.errors.boundaryBody')}</p>
          <button onClick={() => window.location.reload()}>{i18n.t('collaboration.errors.refreshPage')}</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  // Tab lives in the URL (?tab=), so each switch is its own browser-history entry —
  // browser Back/Forward and the detail pages' back buttons return to the right tab
  // instead of collapsing back to the default Workspaces tab.
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab') as TabType | null;
  const activeTab: TabType = requestedTab && TAB_TYPES.includes(requestedTab) ? requestedTab : 'workspaces';
  const setActiveTab = (tab: TabType) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next);
  };
  const [workspaces, setWorkspaces] = useState<CollaborationWorkspace[]>([]);
  // Student "request to join" — the other groups in the student's class (server-maintained
  // classDirectory) plus the student's own outgoing requests, for per-group state.
  const [classDirectories, setClassDirectories] = useState<ClassDirectory[]>([]);
  const [myJoinRequests, setMyJoinRequests] = useState<WorkspaceJoinRequest[]>([]);
  const [requestingGroupId, setRequestingGroupId] = useState<string | null>(null);
  const [joinRequestMessage, setJoinRequestMessage] = useState('');
  const [sendingJoinRequest, setSendingJoinRequest] = useState(false);
  const [joinDirectoryError, setJoinDirectoryError] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<CollaborationWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // Video call functionality will be added in a future update
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

  // Screenplay upload state (personal uploads only — group uploads happen on the
  // group's own page at /collaboration/:workspaceId)
  const [uploadingScreenplay, setUploadingScreenplay] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const [userScreenplays, setUserScreenplays] = useState<Screenplay[]>([]);
  // Resolved member display profiles (crewProfiles doc-id == uid), cached for the card avatars.
  const [memberProfilesById, setMemberProfilesById] = useState<Record<string, { name: string; avatar: string; disabled?: boolean }>>({});
  const [showStartWritingModal, setShowStartWritingModal] = useState(false);
  const [newFountainTitle, setNewFountainTitle] = useState('');
  const [creatingFountain, setCreatingFountain] = useState(false);
  const [editingFountain, setEditingFountain] = useState<Screenplay | null>(null);
  const [unresolvedCountByScreenplay, setUnresolvedCountByScreenplay] = useState<Record<string, number>>({});
  const [unresolvedFromTeacherCountByScreenplay, setUnresolvedFromTeacherCountByScreenplay] = useState<Record<string, number>>({});
  const [selectedScreenplayId, setSelectedScreenplayId] = useState<string | null>(null);
  // "All student work" status filter on the teacher review tab; 'all' shows everything.
  const [studentWorkFilter, setStudentWorkFilter] = useState<'all' | ScreenplayReviewStatus>('all');
  // Which class card's color menu is open (Classes tab); null = all closed.
  const [colorMenuClassId, setColorMenuClassId] = useState<string | null>(null);

  const [approvedContacts, setApprovedContacts] = useState<string[]>([]);
  const [isTeacher, setIsTeacher] = useState(false);

  // Teacher-only class organizer (teacherClasses collection, owner-scoped).
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [creatingClass, setCreatingClass] = useState(false);
  const [toggleSupervisorPending, setToggleSupervisorPending] = useState(false);

  // Capability + normalization helpers are shared with WorkspaceDetailPage via
  // ./workspaceAccess; these thin wrappers just bind the current user.
  const getWorkspaceMemberIds = access.getWorkspaceMemberIds;
  const getWorkspaceSupervisorIds = access.getWorkspaceSupervisorIds;
  const getWorkspaceViewerIds = access.getWorkspaceViewerIds;
  const getPermissionsForRole = access.getPermissionsForRole;
  const normalizeScreenplay = access.normalizeScreenplay;
  const normalizeWorkspace = access.normalizeWorkspace;
  const toDate = access.toDate;

  // Resolve member display name + avatar (crewProfiles, doc-id == uid) for the
  // workspace card avatar stack. Batched across all visible workspaces and cached.
  useEffect(() => {
    const ids = Array.from(new Set(workspaces.flatMap(w => getWorkspaceMemberIds(w))));
    const missing = ids.filter(id => id && !(id in memberProfilesById));
    if (missing.length === 0) return;
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(missing.map(async uid => {
        try {
          const snap = await getDoc(doc(db, 'crewProfiles', uid));
          const data: any = snap.exists() ? snap.data() : {};
          return [uid, { name: data.name || data.displayName || '', avatar: data.profileImageUrl || data.avatarUrl || '', disabled: data.disabled === true }] as const;
        } catch {
          return [uid, { name: '', avatar: '', disabled: false }] as const;
        }
      }));
      if (cancelled) return;
      setMemberProfilesById(prev => {
        const next = { ...prev };
        for (const [id, profile] of entries) next[id] = profile;
        return next;
      });
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaces]);

  const isWorkspaceCreator = (workspace: CollaborationWorkspace): boolean =>
    access.isWorkspaceCreator(workspace, currentUser?.uid);

  const canManageWorkspace = (workspace: CollaborationWorkspace): boolean =>
    access.canManageWorkspace(workspace, currentUser?.uid);

  const canEditWorkspaceContent = (workspace: CollaborationWorkspace): boolean =>
    access.canEditWorkspaceContent(workspace, currentUser?.uid);

  const canDeleteScreenplay = (screenplay: Screenplay): boolean =>
    access.canDeleteScreenplay(screenplay, currentUser?.uid, getWorkspaceById);

  const canEditScreenplay = (screenplay: Screenplay): boolean =>
    access.canEditScreenplay(screenplay, currentUser?.uid, getWorkspaceById);

  const canReviewScreenplay = (screenplay: Screenplay): boolean =>
    access.canReviewScreenplay(screenplay, currentUser?.uid, getWorkspaceById);

  const updateLocalScreenplay = (screenplayId: string, updates: Partial<Screenplay>) => {
    setUserScreenplays(prev => prev.map(item => item.id === screenplayId ? { ...item, ...updates } : item));
    setEditingFountain(prev => prev?.id === screenplayId ? { ...prev, ...updates } : prev);
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

  // Members minus soft-disabled ones (crewProfiles.disabled === true), for card counts/avatars.
  const visibleMembers = (workspace: CollaborationWorkspace) =>
    (workspace.members || []).filter(member => !memberProfilesById[member.userId]?.disabled);

  const workspaceMembershipId = access.workspaceMembershipId;

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
    const roleById = new Map(users.map(user => [user.id, getRole(user)]));
    return createWorkspaceInvitationsService({
      workspace,
      users,
      getRole: user => roleById.get(user.id) || 'member',
      actor: { uid: currentUser.uid, displayName: currentUser.displayName },
      t
    });
  };

  const updateWorkspaceState = (workspace: CollaborationWorkspace) => {
    setWorkspaces(prev => prev.map(item => item.id === workspace.id ? workspace : item));
    setSelectedWorkspace(prev => prev?.id === workspace.id ? workspace : prev);
  };

  const isSelfElectedSupervisor = (workspace: CollaborationWorkspace): boolean =>
    access.isSelfElectedSupervisor(workspace, currentUser?.uid);

  const getEffectiveRole = (workspace: CollaborationWorkspace): WorkspaceRole | null =>
    access.getEffectiveRole(workspace, currentUser?.uid);

  const canSelfElectSupervisor = (workspace: CollaborationWorkspace): boolean =>
    access.canSelfElectSupervisor(workspace, currentUser?.uid, isTeacher);

  const canToggleSupervisor = (workspace: CollaborationWorkspace): boolean =>
    access.canToggleSupervisor(workspace, currentUser?.uid, isTeacher);

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
        setError(t('collaboration.loadError'));
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [currentUser, projectId]);

  // Class directory (the other groups in the student's class) + the student's own outgoing
  // join requests. Drives the "Other groups in your class" panel. The directory query is
  // rules-safe (array-contains on the union memberIds). Teachers manage requests from the
  // class page, so the panel itself is rendered only to non-teachers in renderWorkspacesTab.
  useEffect(() => {
    if (!currentUser) {
      setClassDirectories([]);
      setMyJoinRequests([]);
      return;
    }
    const unsubDirectory = subscribeToClassDirectory(
      currentUser.uid,
      directories => { setClassDirectories(directories); setJoinDirectoryError(false); },
      () => setJoinDirectoryError(true)
    );
    const unsubRequests = subscribeToMyJoinRequests(currentUser.uid, setMyJoinRequests);
    return () => { unsubDirectory(); unsubRequests(); };
  }, [currentUser]);

  // File a join request for another group in the student's class.
  const handleSendJoinRequest = async (directory: ClassDirectory, group: ClassDirectoryGroup) => {
    if (!currentUser) return;
    setSendingJoinRequest(true);
    try {
      const result = await createJoinRequest({
        workspaceId: group.workspaceId,
        workspaceName: group.name,
        classId: directory.classId,
        requester: { uid: currentUser.uid, name: currentUser.displayName, email: currentUser.email },
        message: joinRequestMessage
      });
      if (result === 'duplicate') {
        toast(t('collaboration.joinRequests.requestDuplicate', { group: group.name }));
      } else {
        toast.success(t('collaboration.joinRequests.requestSent', { group: group.name }));
      }
      setRequestingGroupId(null);
      setJoinRequestMessage('');
    } catch (err) {
      console.error('Error sending join request:', err);
      toast.error(t('collaboration.joinRequests.requestFailed'));
    } finally {
      setSendingJoinRequest(false);
    }
  };

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

  // The per-group activity feed and member profiles moved to WorkspaceDetailPage
  // (/collaboration/:workspaceId) — the hub only lists groups now.

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

  // The teacher's classes (private organizer). Owner-scoped query, teacher-only.
  useEffect(() => {
    if (!currentUser || !isTeacher) {
      setTeacherClasses([]);
      return;
    }
    const unsubscribe = onSnapshot(
      query(collection(db, 'teacherClasses'), where('ownerId', '==', currentUser.uid)),
      snapshot => {
        const items = snapshot.docs.map(d => normalizeTeacherClass(d.id, d.data()));
        items.sort((a, b) => a.name.localeCompare(b.name));
        setTeacherClasses(items);
      },
      err => console.error('Error subscribing to classes:', err)
    );
    return () => unsubscribe();
  }, [currentUser, isTeacher]);

  const handleCreateClass = async () => {
    if (!currentUser) return;
    const name = newClassName.trim();
    if (!name) return;
    setCreatingClass(true);
    try {
      const classId = await createTeacherClass(currentUser.uid, name);
      setNewClassName('');
      navigate(`/collaboration/class/${classId}`);
    } catch (err) {
      console.error('Failed to create class:', err);
      toast.error(t('collaboration.classes.createFailed'));
    } finally {
      setCreatingClass(false);
    }
  };

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

  // User search for the invite/create modals — shared with WorkspaceDetailPage
  // via ./crewSearch (module-level 30s cache of crewProfiles).
  const searchUsers = async (queryStr: string) => {
    if (!queryStr.trim()) {
      setUserSearchResults([]);
      return;
    }
    setIsSearchingUsers(true);
    // Do NOT clear userSearchResults here; keep previous results while loading
    try {
      const filtered = await searchCrewProfiles(queryStr, {
        excludeUid: currentUser?.uid,
        approvedContacts
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
        toast.error(t('collaboration.groupPage.alreadyInvited'));
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
      toast.success(t('collaboration.groupPage.invitationsSent', { count: invitedCount, workspace: workspace.name }));
    } catch (error) {
      console.error('Error inviting users to workspace:', error);
      toast.error(t('collaboration.groupPage.invitationsFailed'));
    } finally {
      setIsAddingMembers(false);
    }
  };

  // Workspace creation handlers
  const handleCreateWorkspaceStep = () => {
    if (workspaceCreationStep === 'details') {
      if (!newWorkspaceData.name.trim()) {
        toast.error(t('collaboration.createWorkspaceModal.nameRequired'));
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
      toast.error(t('collaboration.auth.signInCreateGroup'));
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
        ? t('collaboration.createWorkspaceModal.createdWithInvites', { name: newWorkspaceData.name.trim(), count: invitedCount })
        : t('collaboration.createWorkspaceModal.createdSuccess', { name: newWorkspaceData.name.trim() }));
    } catch (error) {
      console.error('Error in handleCreateWorkspace:', error);
      toast.error(t('collaboration.createWorkspaceModal.createFailed'));
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
      toast.error(t('collaboration.workspaceSettings.onlyCreatorCanUpdate'));
      return;
    }

    const nextName = workspaceDetails.name.trim();
    if (!nextName) {
      toast.error(t('collaboration.workspaceSettings.nameRequired'));
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
      toast.success(t('collaboration.workspaceSettings.updateSuccess'));
    } catch (error) {
      console.error('Error updating workspace settings:', error);
      toast.error(t('collaboration.workspaceSettings.updateFailed'));
    }
  };

  // Video call functionality will be added in a future update

  // "Open" on a group card = go to the group's own page. (This used to only set
  // local selected-state and show a misleading "Successfully joined" toast.)
  const handleOpenWorkspace = (workspaceId: string) => {
    navigate(`/collaboration/${workspaceId}`);
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

  // Multi-file PERSONAL upload (no group). Group uploads happen on the group's own
  // page, where the workspace is implicit. Filters unsupported file types, uploads
  // sequentially, shows a progress counter, and rolls up a per-batch toast at the end.
  const handleMultiUpload = async (rawFiles: FileList | File[]) => {
    if (!currentUser) {
      toast.error(t('collaboration.auth.signInUpload'));
      return;
    }
    const files = Array.from(rawFiles);
    if (files.length === 0) return;

    const validFiles = files.filter(isAcceptedScreenplayFile);
    const rejectedCount = files.length - validFiles.length;
    if (rejectedCount > 0) {
      toast(t('collaboration.groupPage.filesIgnored', { count: rejectedCount }));
    }
    // Reject oversized files up front with a clear message — otherwise the
    // upload reaches Storage and fails with an opaque permission error.
    const sizedFiles = validFiles.filter(file => {
      if (file.size > MAX_UPLOAD_BYTES) {
        toast.error(t('collaboration.screenplaysTab.fileTooLarge', { name: file.name, max: MAX_UPLOAD_MB }));
        return false;
      }
      return true;
    });
    if (sizedFiles.length === 0) return;

    setUploadingScreenplay(true);
    setUploadProgress({ current: 0, total: sizedFiles.length });

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < sizedFiles.length; i++) {
      setUploadProgress({ current: i + 1, total: sizedFiles.length });
      try {
        await uploadScreenplayFile({
          file: sizedFiles[i],
          actor: { uid: currentUser.uid, displayName: currentUser.displayName },
          workspace: null,
          projectId
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to upload ${sizedFiles[i].name}:`, err);
        failureCount++;
      }
    }

    setUploadingScreenplay(false);
    setUploadProgress(null);

    if (successCount > 0 && failureCount === 0) {
      toast.success(successCount === 1
        ? `${sizedFiles[0].name} ${t('collaboration.screenplaysTab.uploadSuccess')}`
        : t('collaboration.groupPage.uploadedMany', { count: successCount }));
    } else if (successCount > 0 && failureCount > 0) {
      toast(t('collaboration.groupPage.uploadedPartial', { success: successCount, total: sizedFiles.length }));
    } else if (failureCount > 0) {
      toast.error(t('collaboration.screenplaysTab.uploadFailed'));
    }
  };

  // B2 — create a new PERSONAL in-browser Fountain screenplay (no file upload, no
  // group). Group writing starts from the group's page so collaborators inherit access.
  const handleCreateFountainScreenplay = async () => {
    if (!currentUser) {
      toast.error(t('collaboration.auth.signInWrite'));
      return;
    }
    const title = newFountainTitle.trim();
    if (!title) {
      toast.error(t('fountain.titleRequired'));
      return;
    }

    setCreatingFountain(true);
    try {
      const created = await createFountainScreenplay({
        title,
        actor: { uid: currentUser.uid, displayName: currentUser.displayName },
        workspace: null,
        projectId
      });
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

  const handleGenerateReport = () => {
    // Navigate to the breakdown reports component
    setActiveTab('screenplays');
    // You can add additional logic here to generate a comprehensive report
    // For now, we'll just show a toast notification
    toast.success(t('collaboration.generatingReport'));

    // In a real implementation, you might want to:
    // 1. Collect all annotations and tags
    // 2. Generate a PDF report
    // 3. Include breakdown elements
    // 4. Add analytics and insights
  };

  // Grading exports live on the group page now (/collaboration/:workspaceId),
  // next to the screenplays they cover.

  const handleDeleteScreenplay = async (screenplay: Screenplay) => {
    if (!currentUser || !canDeleteScreenplay(screenplay)) {
      toast.error(t('collaboration.screenplaysTab.deleteNotAllowed'));
      return;
    }

    if (window.confirm(t('collaboration.screenplaysTab.deleteConfirm'))) {
      try {
        await deleteScreenplayDoc(screenplay, { uid: currentUser.uid, displayName: currentUser.displayName });
        toast.success(t('collaboration.screenplaysTab.deleteSuccess'));
      } catch (error) {
        console.error('Error deleting screenplay:', error);
        toast.error(t('collaboration.screenplaysTab.deleteFailed'));
      }
    }
  };

  const handleReviewStatusChange = async (screenplay: Screenplay, nextStatus: ScreenplayReviewStatus) => {
    if (!currentUser) {
      toast.error(t('collaboration.auth.signInReview'));
      return;
    }

    const currentStatus = access.getReviewStatus(screenplay);
    if (currentStatus === nextStatus) return;

    const creatorAllowed = canEditScreenplay(screenplay) && (nextStatus === 'draft' || nextStatus === 'submitted');
    const reviewerAllowed = canReviewScreenplay(screenplay) && (nextStatus === 'changes_requested' || nextStatus === 'approved');
    if (!creatorAllowed && !reviewerAllowed) {
      toast.error(t('collaboration.groupPage.reviewNotAllowed'));
      return;
    }

    try {
      const updates = await setScreenplayReviewStatus(screenplay, nextStatus, {
        uid: currentUser.uid,
        displayName: currentUser.displayName
      });
      updateLocalScreenplay(screenplay.id, updates);
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
      toast.success(t('collaboration.groupLifecycle.archived', { name: workspace.name }));
    } catch (error) {
      console.error('Error archiving workspace:', error);
      toast.error(t('collaboration.groupLifecycle.archiveFailed'));
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
      toast.success(t('collaboration.groupLifecycle.restored', { name: workspace.name }));
    } catch (error) {
      console.error('Error restoring workspace:', error);
      toast.error(t('collaboration.groupLifecycle.restoreFailed'));
    }
  };

  // Soft-delete workspace handler. The document remains recoverable for 30 days.
  const handleDeleteWorkspace = async (workspaceId: string) => {
    const workspace = getWorkspaceById(workspaceId);
    if (!workspace || !isWorkspaceCreator(workspace)) return;

    if (window.confirm(t('collaboration.groupLifecycle.deleteConfirm'))) {
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
        toast.success(t('collaboration.groupLifecycle.movedToDeleted', { name: workspace.name }));
      } catch (error) {
        console.error('Error deleting workspace:', error);
        toast.error(t('collaboration.groupLifecycle.deleteFailed'));
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
      toast.error(t('collaboration.groupLifecycle.mustDeleteFirst'));
      return;
    }

    if (window.confirm(t('collaboration.groupLifecycle.permanentDeleteConfirm'))) {
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
        toast.success(t('collaboration.groupLifecycle.permanentlyDeleted', { name: workspace.name }));
      } catch (error) {
        console.error('Error permanently deleting workspace:', error);
        toast.error(t('collaboration.groupLifecycle.permanentDeleteFailed'));
      }
    }
  };

  const renderWorkspacesTab = () => {
    const workspaceList = [...workspaces].sort((a, b) => {
      const statusOrder = { active: 0, archived: 1, deleted: 2 };
      return statusOrder[a.status || 'active'] - statusOrder[b.status || 'active'];
    });

    // Per-group rollups for the cards, derived from the already-subscribed
    // screenplay list: total count + how many sit in "submitted" (supervisors
    // see the latter as an "awaiting review" badge).
    const screenplayCountByWorkspace: Record<string, number> = {};
    const submittedCountByWorkspace: Record<string, number> = {};
    userScreenplays.forEach(screenplay => {
      if (!screenplay.workspaceId) return;
      screenplayCountByWorkspace[screenplay.workspaceId] = (screenplayCountByWorkspace[screenplay.workspaceId] || 0) + 1;
      if (access.getReviewStatus(screenplay) === 'submitted') {
        submittedCountByWorkspace[screenplay.workspaceId] = (submittedCountByWorkspace[screenplay.workspaceId] || 0) + 1;
      }
    });

    // The teacher's own classes that include each workspace — drives the floating class
    // tag on the card. teacherClasses is owner-scoped, so this is empty for students and
    // the tag only ever shows on the class owner's cards.
    const classesByWorkspace: Record<string, TeacherClass[]> = {};
    teacherClasses.forEach(teacherClass => {
      teacherClass.workspaceIds.forEach(workspaceId => {
        (classesByWorkspace[workspaceId] = classesByWorkspace[workspaceId] || []).push(teacherClass);
      });
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
	            className={`workspace-card ${workspace.status || 'active'}`}
	            onClick={() => { if (workspace.status !== 'deleted') handleOpenWorkspace(workspace.id); }}
	            style={{ cursor: workspace.status !== 'deleted' ? 'pointer' : 'default' }}
	          >
            {(classesByWorkspace[workspace.id]?.length ?? 0) > 0 && (() => {
              const cardClasses = classesByWorkspace[workspace.id];
              const tagColor = getClassColor(cardClasses[0]);
              const names = cardClasses.map(c => c.name).join(', ');
              return (
                <span
                  className="workspace-class-tag"
                  style={{ background: tagColor, color: getReadableTextColor(tagColor) }}
                  title={t('collaboration.workspaceClassTag.label', { classes: names })}
                  aria-label={t('collaboration.workspaceClassTag.label', { classes: names })}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>
                  </svg>
                  <span className="workspace-class-tag__label">
                    {cardClasses[0].name}{cardClasses.length > 1 ? ` +${cardClasses.length - 1}` : ''}
                  </span>
                </span>
              );
            })()}
            {/* Settings gear icon in top-right */}
	            {canManageWorkspace(workspace) && workspace.status !== 'deleted' && (
	              <button
	                className="workspace-settings-gear"
	                title={t('collaboration.cardActions.settings')}
	                aria-label={t('collaboration.cardActions.settings')}
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
	                title={t('collaboration.cardActions.deleteGroup')}
	                aria-label={t('collaboration.cardActions.deleteGroup')}
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
                <div className={`workspace-icon ${workspace.status === 'archived' ? 'tile-amber' : workspace.status === 'deleted' ? 'tile-danger' : workspace.type === 'department' ? 'tile-violet' : ''}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
                  </svg>
                </div>
	                <div className="workspace-info">
                  <h3 className="workspace-title">{workspace.name}</h3>
                  <div className="workspace-meta">
                    {(workspace.status || 'active') === 'active' && (
                      <span className="workspace-status active">● {t('collaboration.groupLifecycle.statusActive', 'Active')}</span>
                    )}
                    {workspace.status && workspace.status !== 'active' && (
                      <span className={`workspace-status ${workspace.status}`}>{workspace.status === 'deleted' ? t('collaboration.groupLifecycle.statusDeleted') : t('collaboration.groupLifecycle.statusArchived')}</span>
                    )}
                    <span className={`workspace-type ${workspace.type}`}>{workspace.type}</span>
                    {getEffectiveRole(workspace) && (
                      <span className={`role-chip role-chip--${getEffectiveRole(workspace)}`} title={isSelfElectedSupervisor(workspace) ? t('collaboration.supervisor.tooltipSelf') : t('collaboration.supervisor.tooltipRole')}>
                        {t(`collaboration.roles.${getEffectiveRole(workspace)}`)}{isSelfElectedSupervisor(workspace) ? ` ${t('collaboration.supervisor.selfTag')}` : ''}
                      </span>
                    )}
                    {canToggleSupervisor(workspace) && (
                      <button type="button" className="btn-text" disabled={toggleSupervisorPending} onClick={e => { e.stopPropagation(); toggleSelfElectedSupervisor(workspace); }}>
                        {isSelfElectedSupervisor(workspace) ? t('collaboration.supervisor.stepDown') : t('collaboration.supervisor.actAs')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="workspace-description">{workspace.description}</p>

            <div className="workspace-stats">
              <div className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span className="stat-value">{visibleMembers(workspace).length}</span>
                <span className="stat-label">{t('collaboration.members')}</span>
              </div>
              <div className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                <span className="stat-value">{screenplayCountByWorkspace[workspace.id] || 0}</span>
                <span className="stat-label">{t('collaboration.screenplays')}</span>
              </div>
              {getEffectiveRole(workspace) === 'supervisor' && (submittedCountByWorkspace[workspace.id] || 0) > 0 && (
                <span
                  className="stat awaiting-review-chip"
                  title={t('collaboration.groupCard.awaitingReviewTooltip')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {t('collaboration.groupCard.awaitingReview', { count: submittedCountByWorkspace[workspace.id] })}
                </span>
              )}
            </div>

            <div className="workspace-actions">
              <div className="member-avatars">
                {visibleMembers(workspace).slice(0, 4).map(m => {
                  const profile = memberProfilesById[m.userId];
                  const display = profile?.name || m.email || m.userId;
                  return profile?.avatar ? (
                    <span className="av av-img" key={m.userId} title={display}>
                      <img src={profile.avatar} alt={display} loading="lazy" />
                    </span>
                  ) : (
                    <span className="av" key={m.userId} style={{ background: avatarColor(m.userId) }} title={display}>{nameInitials(display)}</span>
                  );
                })}
                {visibleMembers(workspace).length > 4 && <span className="av more">+{visibleMembers(workspace).length - 4}</span>}
              </div>
	              {workspace.status !== 'deleted' && (
	                <button
	                  className="btn-primary"
	                  onClick={(e) => {
	                    e.stopPropagation();
	                    handleOpenWorkspace(workspace.id);
	                  }}
	                >
	                  {t('collaboration.openGroup')}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
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
	                  {t('collaboration.cardActions.invite')}
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
	                  {t('collaboration.cardActions.archive')}
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
	                  {t('collaboration.cardActions.restore')}
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
	                    {t('collaboration.cardActions.restore')}
	                  </button>
	                  <button
	                    className="btn-danger"
	                    onClick={(e) => {
	                      e.stopPropagation();
	                      handlePermanentDeleteWorkspace(workspace.id);
	                    }}
	                  >
	                    {t('collaboration.cardActions.deletePermanently')}
	                  </button>
	                  <span className="workspace-recovery-note">
	                    {isDeleteRecoveryExpired(workspace)
	                      ? t('collaboration.groupLifecycle.recoveryEnded')
	                      : t('collaboration.groupLifecycle.autoDeletesAfter', { count: WORKSPACE_DELETE_RECOVERY_DAYS })}
	                  </span>
	                </>
	              )}
	            </div>
          </div>
        ))}
      </div>

      {/* Other groups in your class — student "request to join" discovery. Teachers manage
          requests from the class page, so this is shown only to non-teachers. */}
      {!isTeacher && currentUser && (() => {
        const myUid = currentUser.uid;
        // Most-relevant status per group: a pending request wins; otherwise the latest known.
        const statusByWorkspace: Record<string, JoinRequestStatus> = {};
        myJoinRequests.forEach(request => {
          if (request.status === 'pending') statusByWorkspace[request.workspaceId] = 'pending';
          else if (!statusByWorkspace[request.workspaceId]) statusByWorkspace[request.workspaceId] = request.status;
        });
        const sections = classDirectories
          .map(directory => ({ directory, requestable: directory.groups.filter(group => !group.memberIds.includes(myUid)) }))
          .filter(section => section.requestable.length > 0);
        // Don't fail silently: surface a read error, and if the student is in a class but
        // there's nothing to request, say so instead of rendering nothing.
        if (joinDirectoryError) {
          return (
            <div className="other-groups" style={{ marginTop: 32 }}>
              <h2 style={{ margin: '0 0 4px' }}>{t('collaboration.joinRequests.otherGroupsTitle')}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9em', margin: 0 }}>{t('collaboration.joinRequests.loadError')}</p>
            </div>
          );
        }
        if (classDirectories.length === 0) return null;
        if (sections.length === 0) {
          return (
            <div className="other-groups" style={{ marginTop: 32 }}>
              <h2 style={{ margin: '0 0 4px' }}>{t('collaboration.joinRequests.otherGroupsTitle')}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9em', margin: 0 }}>{t('collaboration.joinRequests.noOtherGroups')}</p>
            </div>
          );
        }
        return (
          <div className="other-groups" style={{ marginTop: 32 }}>
            {sections.map(({ directory, requestable }) => (
              <div key={directory.id} style={{ marginBottom: 24 }}>
                <h2 style={{ margin: '0 0 4px' }}>
                  {t('collaboration.joinRequests.otherGroupsTitle')}{directory.className ? ` · ${directory.className}` : ''}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9em', margin: '0 0 14px' }}>{t('collaboration.joinRequests.otherGroupsHint')}</p>
                <div className="workspaces-grid">
                  {requestable.map(group => {
                    const status = statusByWorkspace[group.workspaceId];
                    const expanded = requestingGroupId === group.workspaceId;
                    return (
                      <div key={group.workspaceId} className="workspace-card active" style={{ cursor: 'default' }}>
                        <div className="workspace-header">
                          <div className="workspace-title-section">
                            <div className="workspace-icon">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                              </svg>
                            </div>
                            <div className="workspace-info">
                              <h3 className="workspace-title">{group.name}</h3>
                              <div className="workspace-meta">
                                <span className="workspace-type general">{t('collaboration.joinRequests.membersLabel')}: {group.memberCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {group.memberNames.length > 0 && (
                          <p style={{ color: '#94a3b8', fontSize: '0.85em', margin: '10px 0 0' }}>{group.memberNames.join(', ')}</p>
                        )}
                        <div style={{ marginTop: 14 }}>
                          {status === 'pending' ? (
                            <span className="role-chip" style={{ background: '#1e293b', color: '#cbd5e1' }}>{t('collaboration.joinRequests.requestPending')}</span>
                          ) : expanded ? (
                            <div>
                              <textarea
                                className="form-input"
                                rows={2}
                                value={joinRequestMessage}
                                placeholder={t('collaboration.joinRequests.messagePlaceholder')}
                                maxLength={1000}
                                onChange={e => setJoinRequestMessage(e.target.value)}
                                style={{ width: '100%', marginBottom: 8, resize: 'vertical' }}
                              />
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button type="button" className="btn-primary" disabled={sendingJoinRequest} onClick={() => handleSendJoinRequest(directory, group)}>
                                  {t('collaboration.joinRequests.send')}
                                </button>
                                <button type="button" className="btn-secondary" disabled={sendingJoinRequest} onClick={() => { setRequestingGroupId(null); setJoinRequestMessage(''); }}>
                                  {t('collaboration.joinRequests.cancel')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {status === 'denied' && (
                                <span style={{ color: '#94a3b8', fontSize: '0.82em' }}>{t('collaboration.joinRequests.requestDenied')}</span>
                              )}
                              <button type="button" className="btn-primary" onClick={() => { setRequestingGroupId(group.workspaceId); setJoinRequestMessage(''); }}>
                                {t('collaboration.joinRequests.requestToJoin')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

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
	                        <h5>{t('collaboration.createWorkspaceModal.inviteRoles')}</h5>
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
	              <h3>{t('collaboration.addMemberModal.titleFor', { name: selectedWorkspace?.name ?? '' })}</h3>
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
	                <label>{t('collaboration.createWorkspaceModal.searchUsers')}</label>
	                <UserAutocomplete
	                  value={pendingMembersToAdd}
	                  onChange={(users: UserAutocompleteOption[]) => {
	                    const existingIds = new Set(selectedWorkspace ? getWorkspaceMemberIds(selectedWorkspace) : []);
	                    setPendingMembersToAdd(users.filter(user => !existingIds.has(user.id)));
	                  }}
	                  onSearch={handleUserSearchChange}
	                  options={userSearchResults}
	                  loading={isSearchingUsers}
	                  placeholder={t('collaboration.createWorkspaceModal.searchPlaceholder')}
	                />
                {/* Live feedback for search */}
                {isSearchingUsers && <div className="searching-indicator">{t('collaboration.createWorkspaceModal.searching')}</div>}
	                {!isSearchingUsers && userSearchQuery.trim() && userSearchResults.length === 0 && <div className="searching-indicator">{t('collaboration.createWorkspaceModal.noFriendsFound')}</div>}
	                {!isSearchingUsers && !userSearchQuery.trim() && <div className="searching-indicator">{t('collaboration.createWorkspaceModal.startTyping')}</div>}
	              </div>
	              <div className="form-group">
	                <label>{t('collaboration.addMemberModal.roleLabel')}</label>
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
	                  <h5>{t('collaboration.addMemberModal.currentMembers')}</h5>
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
	                {t('collaboration.createWorkspaceModal.cancel')}
	              </button>
	              <button
	                className="btn-primary"
	                disabled={isAddingMembers || pendingMembersToAdd.length === 0 || !selectedWorkspace}
	                onClick={() => inviteUsersToWorkspace(pendingMembersToAdd, pendingMemberRole)}
	              >
	                {isAddingMembers ? t('collaboration.groupPage.sending') : t('collaboration.groupPage.sendInvitations')}
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
                  {t('collaboration.createWorkspaceModal.allowGuestAccess')}
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={workspaceSettings.requireApproval}
                    onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, requireApproval: e.target.checked }))}
                  />
                  {t('collaboration.createWorkspaceModal.requireApproval')}
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={workspaceSettings.autoArchive}
                    onChange={(e) => setWorkspaceSettings(prev => ({ ...prev, autoArchive: e.target.checked }))}
                  />
                  {t('collaboration.createWorkspaceModal.autoArchive')}
                </label>
              </div>
              <div className="form-group">
                <label>{t('collaboration.createWorkspaceModal.retentionPeriod')}</label>
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
                <label>{t('collaboration.createWorkspaceModal.maxFileSize')}</label>
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
              <button className="btn-secondary" onClick={() => setShowSettingsModal(false)}>{t('collaboration.createWorkspaceModal.cancel')}</button>
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
    // Group screenplays live on each group's page now; this tab keeps personal
    // (no-group) work plus, for supervisors, a cross-group queue of submissions.
    const personalScreenplays = userScreenplays.filter(screenplay => !screenplay.workspaceId);

    // Everything across the workspaces this user supervises — the teacher's full
    // picture, not just the screenplays students explicitly submitted for review.
    const supervisedWorkspaceIds = new Set(
      workspaces.filter(workspace => getEffectiveRole(workspace) === 'supervisor').map(workspace => workspace.id)
    );
    const supervisesAnyWorkspace = supervisedWorkspaceIds.size > 0;
    const studentWork = userScreenplays.filter(
      screenplay => screenplay.workspaceId && supervisedWorkspaceIds.has(screenplay.workspaceId)
    );

    // The review inbox is the actionable slice: submitted, awaiting the teacher.
    const reviewQueue = studentWork.filter(screenplay => access.getReviewStatus(screenplay) === 'submitted');

    // Counts per status drive the "All student work" filter chips.
    const studentStatusCounts: Record<string, number> = {
      all: studentWork.length, submitted: 0, changes_requested: 0, draft: 0, approved: 0
    };
    studentWork.forEach(screenplay => {
      const status = access.getReviewStatus(screenplay);
      studentStatusCounts[status] = (studentStatusCounts[status] || 0) + 1;
    });
    const studentFilterOrder: Array<'all' | ScreenplayReviewStatus> = ['all', 'submitted', 'changes_requested', 'draft', 'approved'];
    const reviewSortPriority: Record<string, number> = { submitted: 0, changes_requested: 1, draft: 2, approved: 3 };
    const filteredStudentWork = (studentWorkFilter === 'all'
      ? studentWork
      : studentWork.filter(screenplay => access.getReviewStatus(screenplay) === studentWorkFilter)
    ).slice().sort((a, b) => {
      const pa = reviewSortPriority[access.getReviewStatus(a)] ?? 9;
      const pb = reviewSortPriority[access.getReviewStatus(b)] ?? 9;
      if (pa !== pb) return pa - pb;
      return (a.name || '').localeCompare(b.name || '');
    });

    const listProps = {
      unresolvedCounts: unresolvedCountByScreenplay,
      unresolvedFromTeacherCounts: unresolvedFromTeacherCountByScreenplay,
      canEdit: canEditScreenplay,
      canDelete: canDeleteScreenplay,
      canReview: canReviewScreenplay,
      onView: openScreenplayViewer,
      onEditFountain: setEditingFountain,
      onDelete: handleDeleteScreenplay,
      onReviewChange: handleReviewStatusChange
    };

    return (
      <div className="screenplays-tab">
        <div className="screenplays-header">
          <h2>{t('collaboration.myScreenplays.title')}</h2>
          <p>{t('collaboration.myScreenplays.subtitle')}</p>
        </div>
        <div className="screenplays-content" style={{ display: 'flex', flexDirection: 'column' }}>
          {supervisesAnyWorkspace && (
            // Student/collaboration work is moved below the teacher's own work (order: 2) and
            // collapsed by default (<details>) so the page stays focused on personal work.
            <details className="sp-zone" style={{ order: 2 }} aria-label={t('collaboration.studentZone.label')}>
              <summary className="sp-zone-label" style={{ cursor: 'pointer' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {t('collaboration.studentZone.label')}
              </summary>

              <div className="review-inbox">
                <div className="review-inbox__head">
                  <span className="review-inbox__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                  </span>
                  <span className="review-inbox__title">{t('collaboration.reviewQueue.title')}</span>
                  {reviewQueue.length > 0 && (
                    <span className="review-inbox__count">{t('collaboration.groupCard.awaitingReview', { count: reviewQueue.length })}</span>
                  )}
                </div>
                <p className="review-inbox__sub">{t('collaboration.reviewQueue.subtitle')}</p>
                {reviewQueue.length === 0 ? (
                  <p className="sp-empty">{t('collaboration.reviewQueue.empty')}</p>
                ) : (
                  <ScreenplayList
                    screenplays={reviewQueue}
                    workspaceLabel={getWorkspaceLabel}
                    {...listProps}
                  />
                )}
              </div>

              <div className="student-work-card">
                <h4 className="student-work-card__title">{t('collaboration.allStudentWork.title')}</h4>
                <p className="student-work-card__sub">{t('collaboration.allStudentWork.subtitle')}</p>
                <div className="work-filter-chips" role="group" aria-label={t('collaboration.allStudentWork.filterLabel')}>
                  {studentFilterOrder.map(status => {
                    const count = studentStatusCounts[status] || 0;
                    if (status !== 'all' && count === 0) return null;
                    const label = status === 'all'
                      ? t('collaboration.allStudentWork.filterAll')
                      : t(`collaboration.reviewStatus.labels.${status}`);
                    return (
                      <button
                        key={status}
                        type="button"
                        className={`work-filter-chip${studentWorkFilter === status ? ' is-active' : ''}`}
                        aria-pressed={studentWorkFilter === status}
                        onClick={() => setStudentWorkFilter(status)}
                      >
                        {label} <span className="work-filter-chip__count">{count}</span>
                      </button>
                    );
                  })}
                </div>
                {filteredStudentWork.length === 0 ? (
                  <p className="sp-empty">{t('collaboration.allStudentWork.empty')}</p>
                ) : (
                  <ScreenplayList
                    screenplays={filteredStudentWork}
                    workspaceLabel={getWorkspaceLabel}
                    {...listProps}
                  />
                )}
              </div>
            </details>
          )}
          {supervisesAnyWorkspace && (
            <h3 className="sp-zone-label sp-zone-label--personal" style={{ order: 1 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {t('collaboration.personalZone.label')}
            </h3>
          )}
          <div className="screenplay-upload-card bg-white rounded-lg shadow-md p-6 mb-6" style={{ order: 1 }}>
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
                  background: 'var(--primary-600)',
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
                {t('fountain.startWriting')}
              </button>
            </div>
            <p className="form-help" style={{ marginTop: 10 }}>
              {t('collaboration.myScreenplays.groupHint')}
            </p>
          </div>
          <div className="screenplays-list bg-white rounded-lg shadow-md p-6" style={{ order: 1 }}>
            <section className="screenplay-section">
              <h3 style={{ margin: 0 }}>{t('collaboration.personalNoWorkspace')}</h3>
              {personalScreenplays.length === 0 ? (
                <div
                  className="screenplays-empty-state"
                  style={{
                    textAlign: 'center',
                    padding: '2.5rem 1.5rem',
                    color: '#475569'
                  }}
                >
                  <div style={{ marginBottom: 12, color: '#94a3b8' }} aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
                    </svg>
                  </div>
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
                  </div>
                </div>
              ) : (
                <ScreenplayList screenplays={personalScreenplays} {...listProps} />
              )}
            </section>
          </div>
        </div>
      </div>
    );
  };

  // Teacher-only: the private class organizer. One card per class, linking to
  // /collaboration/class/:classId. Students never get this tab.
  const handleSetClassColor = async (classId: string, color: string) => {
    try {
      await updateTeacherClass(classId, { color });
    } catch (err) {
      console.error('Failed to update class color', err);
      toast.error(t('collaboration.classes.colorError'));
    }
  };

  // Best-effort student set for a class CARD preview: union of the class's groups' members
  // (from the already-loaded workspaces) + uid-linked manual students, minus the teacher and
  // excluded uids. Groups the teacher isn't a member of aren't loaded here, so this can
  // under-count — the class page holds the authoritative roster.
  const getClassStudentIds = (teacherClass: TeacherClass): string[] => {
    const ids = new Set<string>();
    teacherClass.workspaceIds.forEach(workspaceId => {
      const ws = workspaces.find(w => w.id === workspaceId);
      if (ws) getWorkspaceMemberIds(ws).forEach(id => { if (id) ids.add(id); });
    });
    (teacherClass.manualStudents || []).forEach(student => { if (student.uid) ids.add(student.uid); });
    if (currentUser) ids.delete(currentUser.uid);
    (teacherClass.excludedUids || []).forEach(id => ids.delete(id));
    return Array.from(ids).filter(id => !memberProfilesById[id]?.disabled);
  };

  const renderClassesTab = () => (
    <div className="workspaces-tab">
      <div className="workspaces-header">
        <h2>{t('collaboration.classes.tabTitle')}</h2>
      </div>
      <p style={{ color: '#64748b', margin: '0 0 16px' }}>{t('collaboration.classes.tabSubtitle')}</p>
      <div style={{ display: 'flex', gap: 10, margin: '0 0 24px', maxWidth: 480 }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 1 }}
          value={newClassName}
          maxLength={120}
          placeholder={t('collaboration.classes.namePlaceholder')}
          onChange={e => setNewClassName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleCreateClass(); }}
        />
        <button
          type="button"
          className="btn-primary"
          disabled={creatingClass || !newClassName.trim()}
          onClick={handleCreateClass}
        >
          {creatingClass ? t('collaboration.classes.creating') : t('collaboration.classes.newClass')}
        </button>
      </div>
      {teacherClasses.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>{t('collaboration.classes.empty')}</p>
      ) : (
        <div className="workspaces-grid">
          {teacherClasses.map(teacherClass => {
            const doneCount = teacherClass.checklist.filter(item => item.done).length;
            const classColor = getClassColor(teacherClass);
            const studentIds = getClassStudentIds(teacherClass);
            return (
              <div
                key={teacherClass.id}
                className="workspace-card active"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/collaboration/class/${teacherClass.id}`)}
              >
                <div className="class-color-control" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    className="class-color-dot"
                    style={{ background: classColor }}
                    title={t('collaboration.classes.setColor')}
                    aria-label={t('collaboration.classes.setColor')}
                    aria-expanded={colorMenuClassId === teacherClass.id}
                    onClick={e => { e.stopPropagation(); setColorMenuClassId(prev => (prev === teacherClass.id ? null : teacherClass.id)); }}
                  />
                  {colorMenuClassId === teacherClass.id && (
                    <div className="class-color-menu" role="menu">
                      {CLASS_COLORS.map(swatch => (
                        <button
                          key={swatch}
                          type="button"
                          role="menuitemradio"
                          aria-checked={classColor === swatch}
                          className={`class-swatch${classColor === swatch ? ' is-selected' : ''}`}
                          style={{ background: swatch }}
                          aria-label={swatch}
                          onClick={e => { e.stopPropagation(); handleSetClassColor(teacherClass.id, swatch); setColorMenuClassId(null); }}
                        />
                      ))}
                      <label
                        className="class-swatch class-swatch--custom"
                        title={t('collaboration.classes.customColor')}
                        aria-label={t('collaboration.classes.customColor')}
                        onClick={e => e.stopPropagation()}
                      >
                        +
                        <input
                          type="color"
                          value={/^#[0-9a-fA-F]{6}$/.test(teacherClass.color || '') ? (teacherClass.color as string) : classColor}
                          onChange={e => handleSetClassColor(teacherClass.id, e.target.value)}
                          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="workspace-header">
                  <div className="workspace-title-section">
                    <div className="workspace-icon" aria-hidden="true" style={{ background: `${classColor}22`, color: classColor }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10 12 5 2 10l10 5 10-5Z"/>
                      <path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5"/>
                    </svg>
                  </div>
                    <div className="workspace-info">
                      <h3 className="workspace-title" style={{ color: '#1a1a1a', fontWeight: 600 }}>{teacherClass.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="workspace-stats">
                  <div className="stat">
                    <span className="stat-value">{studentIds.length}</span>
                    <span className="stat-label">{t('collaboration.classes.studentsLabel')}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{teacherClass.workspaceIds.length}</span>
                    <span className="stat-label">{t('collaboration.workspaces')}</span>
                  </div>
                  {teacherClass.checklist.length > 0 && (
                    <div className="stat">
                      <span className="stat-value">{doneCount}/{teacherClass.checklist.length}</span>
                      <span className="stat-label">{t('collaboration.classes.checklistTitle')}</span>
                    </div>
                  )}
                </div>
                {studentIds.length > 0 && (
                  <div className="member-avatars" style={{ marginTop: 10 }}>
                    {studentIds.slice(0, 6).map(id => {
                      const profile = memberProfilesById[id];
                      const display = profile?.name || id;
                      return profile?.avatar ? (
                        <span className="av av-img" key={id} title={display}>
                          <img src={profile.avatar} alt={display} loading="lazy" />
                        </span>
                      ) : (
                        <span className="av" key={id} style={{ background: avatarColor(id) }} title={display}>{nameInitials(display)}</span>
                      );
                    })}
                    {studentIds.length > 6 && <span className="av more">+{studentIds.length - 6}</span>}
                  </div>
                )}
                <div className="workspace-actions">
                  <button
                    className="btn-primary"
                    onClick={e => { e.stopPropagation(); navigate(`/collaboration/class/${teacherClass.id}`); }}
                  >
                    {t('collaboration.openGroup')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workspaces':
        return renderWorkspacesTab();
      case 'tasks':
        return renderTasksTab();
      case 'screenplays':
        return renderScreenplaysTab();
      case 'classes':
        // Non-teachers never see the tab button; a deep link falls back to groups.
        return isTeacher ? renderClassesTab() : renderWorkspacesTab();
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
        <div className="loading-spinner">{t('collaboration.loading')}</div>
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

              {isTeacher && (
                <button
                  className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('classes')}
                >
                  <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  <span className="nav-label">{t('collaboration.classes.tabTitle')}</span>
                </button>
              )}
            </nav>
          </div>

          <div className="collaboration-main">
            {renderTabContent()}
          </div>
        </div>

        {/* Full-Screen Screenplay Modal */}
        {showScreenplayModal && selectedScreenplayId && (() => {
          const selectedScreenplay = userScreenplays.find(s => s.id === selectedScreenplayId);
          if (!selectedScreenplay) return null;
          return (
            <ScreenplayViewerModal
              screenplay={selectedScreenplay}
              projectId={projectId || 'default-project'}
              onClose={() => {
                setShowScreenplayModal(false);
                setSelectedScreenplayId(null);
              }}
              onGenerateReport={handleGenerateReport}
            />
          );
        })()}

        {/* In-browser Fountain editor (B3) */}
        {editingFountain && (
          <FountainEditor
            screenplay={{
              id: editingFountain.id,
              name: editingFountain.name,
              fountainSource: editingFountain.fountainSource
            }}
            projectId={projectId || 'default-project'}
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
                <p className="form-help" style={{ margin: 0, color: '#64748b' }}>
                  {t('collaboration.myScreenplays.fountainPersonalHint')}
                </p>
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
