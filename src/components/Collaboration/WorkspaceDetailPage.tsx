import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
  query,
  QuerySnapshot,
  Unsubscribe,
  where
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { CollaborationWorkspace, ScreenplayReviewStatus, WorkspaceRole } from '../../types/Collaboration';
import { logWorkspaceActivity } from '../../services/workspaceActivityService';
import {
  createFountainScreenplay,
  createWorkspaceInvitations,
  resendWorkspaceInvitation,
  cancelWorkspaceInvitation,
  deleteScreenplayDoc,
  exportWorkspaceGradingCsv,
  isAcceptedScreenplayFile,
  setScreenplayReviewStatus,
  uploadScreenplayFile
} from '../../services/screenplayService';
import { createAssignments, deleteAssignment, updateAssignment } from '../../services/assignmentService';
import {
  addManualStudentToClass,
  newLocalId,
  normalizeTeacherClass,
  restoreStudentToClass,
  setWorkspaceInClass,
  TeacherClass
} from '../../services/classService';
import * as access from './workspaceAccess';
import { Screenplay, MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from './workspaceAccess';
import ScreenplayList from './ScreenplayList';
import ScreenplayViewerModal from './ScreenplayViewerModal';
import FountainEditor from './FountainEditor';
import UserAutocomplete, { UserAutocompleteOption } from './UserAutocomplete';
import { searchCrewProfiles } from './crewSearch';
import './CollaborationHub.scss';
import './WorkspaceDetailPage.scss';

// A single group's home page (/collaboration/:workspaceId): the group's screenplays,
// members, and activity in one place. The hub (/collaboration) lists the groups and
// links here. Personal (no-group) screenplays stay on the hub.

const INVITABLE_WORKSPACE_ROLES: Array<Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>> =
  ['member', 'supervisor', 'viewer'];

interface MemberProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: WorkspaceRole;
}

interface ActivityEvent {
  id: string;
  actorName?: string;
  verb: string;
  targetName?: string | null;
  detail?: string | null;
  createdAt?: any;
}

const ACTIVITY_PAGE_SIZE = 25;

const WorkspaceDetailPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [workspace, setWorkspace] = useState<CollaborationWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  // The teacher's classes, for "send this group / this student into a class"
  // controls right where the membership is visible (instead of recalling names
  // back on the class page). Empty for students.
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([]);
  const [classTogglePending, setClassTogglePending] = useState<Set<string>>(() => new Set());
  const [addingMemberToClass, setAddingMemberToClass] = useState<{ uid: string; name: string } | null>(null);
  const [targetClassId, setTargetClassId] = useState('');
  const [screenplays, setScreenplays] = useState<Screenplay[]>([]);
  const [memberProfiles, setMemberProfiles] = useState<MemberProfile[]>([]);
  const [unresolvedCounts, setUnresolvedCounts] = useState<Record<string, number>>({});
  const [unresolvedFromTeacherCounts, setUnresolvedFromTeacherCounts] = useState<Record<string, number>>({});
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [activityLimit, setActivityLimit] = useState(ACTIVITY_PAGE_SIZE);
  const [activityHasMore, setActivityHasMore] = useState(false);

  const [assignments, setAssignments] = useState<access.WorkspaceAssignment[]>([]);
  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDescription, setNewAssignmentDescription] = useState('');
  // Per-group opt-in for cross-posting. The teacher runs several classes at once
  // (and old ones accumulate), so "post to all my groups" is never right — they
  // pick exactly which other groups receive the assignment. Keyed by group id.
  const [extraTargetIds, setExtraTargetIds] = useState<Record<string, boolean>>({});
  // Lazily loaded list of OTHER active groups where the user may post assignments
  // (feeds the cross-post picker). null = not fetched yet.
  const [otherSupervisedGroups, setOtherSupervisedGroups] = useState<CollaborationWorkspace[] | null>(null);
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  // Inline edit of one assignment's text (creator-only; rules enforce too).
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [editAssignmentTitle, setEditAssignmentTitle] = useState('');
  const [editAssignmentDescription, setEditAssignmentDescription] = useState('');
  const [savingAssignmentEdit, setSavingAssignmentEdit] = useState(false);
  // ''= no assignment; applies to the next upload / start-writing action.
  const [uploadAssignmentId, setUploadAssignmentId] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [viewingScreenplay, setViewingScreenplay] = useState<Screenplay | null>(null);
  const [editingFountain, setEditingFountain] = useState<Screenplay | null>(null);
  const [showStartWritingModal, setShowStartWritingModal] = useState(false);
  const [newFountainTitle, setNewFountainTitle] = useState('');
  const [creatingFountain, setCreatingFountain] = useState(false);
  const [exportingGrading, setExportingGrading] = useState(false);
  const [toggleSupervisorPending, setToggleSupervisorPending] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [pendingInvitees, setPendingInvitees] = useState<UserAutocompleteOption[]>([]);
  const [inviteRole, setInviteRole] = useState<Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>>('member');
  const [inviteSearchResults, setInviteSearchResults] = useState<UserAutocompleteOption[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<Array<{ id: string; inviteeName: string; inviteeEmail: string; role: WorkspaceRole }>>([]);
  const [invitePendingId, setInvitePendingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uid = currentUser?.uid;

  // ---- Subscriptions -------------------------------------------------------

  // The workspace doc itself. Members may `get` it (firestore.rules); anyone else
  // hits permission-denied, which we surface as "not found or no access".
  useEffect(() => {
    if (!workspaceId || !uid) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    const unsubscribe = onSnapshot(
      doc(db, 'workspaces', workspaceId),
      snapshot => {
        if (!snapshot.exists()) {
          setWorkspace(null);
          setNotFound(true);
          setLoading(false);
          return;
        }
        setWorkspace(access.normalizeWorkspace(snapshot.id, snapshot.data()));
        setNotFound(false);
        setLoading(false);
      },
      err => {
        console.error('Error subscribing to workspace:', err);
        setWorkspace(null);
        setNotFound(true);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [workspaceId, uid]);

  // Privilege source of truth: admin-granted teacherRoles/{uid} doc.
  // crewProfiles.isTeacher / profileType are user-writable display fields and
  // must NOT gate teacher actions (students could set them on themselves).
  useEffect(() => {
    if (!uid) {
      setIsTeacher(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'teacherRoles', uid));
        if (cancelled) return;
        setIsTeacher(snap.exists());
      } catch (err) {
        console.error('Failed to load teacher flag:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  // The teacher's classes (owner-scoped; students simply get an empty list and
  // never see the class controls).
  useEffect(() => {
    if (!uid || !isTeacher) {
      setTeacherClasses([]);
      return;
    }
    const unsubscribe = onSnapshot(
      query(collection(db, 'teacherClasses'), where('ownerId', '==', uid)),
      snapshot => {
        const items = snapshot.docs.map(d => normalizeTeacherClass(d.id, d.data()));
        items.sort((a, b) => a.name.localeCompare(b.name));
        setTeacherClasses(items);
      },
      err => console.error('Error subscribing to classes:', err)
    );
    return () => unsubscribe();
  }, [uid, isTeacher]);

  // This group's screenplays.
  useEffect(() => {
    if (!workspaceId || !uid || notFound) {
      setScreenplays([]);
      return;
    }
    const unsubscribe = onSnapshot(
      query(collection(db, 'screenplays'), where('workspaceId', '==', workspaceId)),
      (snapshot: QuerySnapshot) => {
        const items = snapshot.docs.map(d => access.normalizeScreenplay(d.id, d.data()));
        // Most recently touched first.
        items.sort((a, b) =>
          (access.toDate(b.lastModified)?.getTime() || 0) - (access.toDate(a.lastModified)?.getTime() || 0)
        );
        setScreenplays(items);
      },
      err => console.error('Error subscribing to group screenplays:', err)
    );
    return () => unsubscribe();
  }, [workspaceId, uid, notFound]);

  // This group's assignments (sorted newest-first client-side — small lists, no
  // composite index needed).
  useEffect(() => {
    if (!workspaceId || !uid || notFound) {
      setAssignments([]);
      return;
    }
    const unsubscribe = onSnapshot(
      query(collection(db, 'workspaceAssignments'), where('workspaceId', '==', workspaceId)),
      snapshot => {
        const items = snapshot.docs.map(d => access.normalizeAssignment(d.id, d.data()));
        items.sort((a, b) =>
          (access.toDate(b.createdAt)?.getTime() || 0) - (access.toDate(a.createdAt)?.getTime() || 0)
        );
        setAssignments(items);
        // Drop a stale upload-target selection if its assignment was deleted.
        setUploadAssignmentId(prev => (prev && !items.some(item => item.id === prev) ? '' : prev));
      },
      err => console.error('Error subscribing to group assignments:', err)
    );
    return () => unsubscribe();
  }, [workspaceId, uid, notFound]);

  // Pending (not-yet-accepted) invitations for this workspace, owner-only — drives the
  // "Pending invitations" panel with resend/cancel. Queried by workspaceId alone (then
  // filtered to pending client-side) to avoid needing a composite index.
  useEffect(() => {
    const canManageNow = workspace ? access.canManageWorkspace(workspace, uid) : false;
    if (!workspaceId || !canManageNow || notFound) {
      setPendingInvites([]);
      return;
    }
    const unsubscribe = onSnapshot(
      query(collection(db, 'workspaceInvitations'), where('workspaceId', '==', workspaceId)),
      snapshot => {
        const items = snapshot.docs
          .map(d => ({ id: d.id, data: d.data() as any }))
          .filter(x => (x.data.status || 'pending') === 'pending')
          .map(x => ({
            id: x.id,
            inviteeName: x.data.inviteeName || x.data.inviteeEmail || 'Collaborator',
            inviteeEmail: x.data.inviteeEmail || '',
            role: (x.data.role || 'member') as WorkspaceRole
          }));
        setPendingInvites(items);
      },
      err => console.error('Error subscribing to pending invitations:', err)
    );
    return () => unsubscribe();
  }, [workspaceId, workspace, uid, notFound]);

  // Unresolved annotation/tag counts per screenplay (chunked by Firestore `in` limit).
  const screenplayIdsKey = useMemo(() => screenplays.map(s => s.id).sort().join(','), [screenplays]);
  useEffect(() => {
    if (!uid || screenplayIdsKey === '') {
      setUnresolvedCounts({});
      setUnresolvedFromTeacherCounts({});
      return;
    }
    const screenplayIds = screenplayIdsKey.split(',');
    const annotationsRef = collection(db, 'screenplayAnnotations');
    const tagsRef = collection(db, 'screenplayTags');
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
      setUnresolvedCounts(open);
      setUnresolvedFromTeacherCounts(fromTeacher);
    };

    const unsubs: Unsubscribe[] = [];
    for (let i = 0; i < screenplayIds.length; i += 10) {
      const chunk = screenplayIds.slice(i, i + 10);
      const annKey = `ann-${i}`;
      const tagKey = `tag-${i}`;
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
  }, [uid, screenplayIdsKey]);

  // Member profiles, resolved by crewProfile DOCUMENT ID (doc id == uid) — profiles
  // created at signup omit the `uid` field, so doc-id gets are the robust lookup.
  const memberIdsKey = workspace ? access.getWorkspaceMemberIds(workspace).sort().join(',') : '';
  useEffect(() => {
    if (!workspace || memberIdsKey === '') {
      setMemberProfiles([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const roleByUid = new Map<string, WorkspaceRole>(
          (workspace.members || []).map(member => [member.userId, member.role])
        );
        const profiles = await Promise.all(memberIdsKey.split(',').map(async memberUid => {
          const snap = await getDoc(doc(db, 'crewProfiles', memberUid));
          const data: any = snap.exists() ? snap.data() : {};
          return {
            id: memberUid,
            name: data.name || data.displayName || `Crew Member ${memberUid.slice(-4)}`,
            email: data.email || '',
            avatar: data.profileImageUrl || data.avatarUrl || '',
            role: roleByUid.get(memberUid) || 'member'
          } as MemberProfile;
        }));
        if (cancelled) return;
        const roleOrder: Record<string, number> = { owner: 0, admin: 1, supervisor: 2, member: 3, viewer: 4 };
        profiles.sort((a, b) => (roleOrder[a.role] ?? 5) - (roleOrder[b.role] ?? 5) || a.name.localeCompare(b.name));
        setMemberProfiles(profiles);
      } catch (err) {
        console.error('Error loading member profiles:', err);
        if (!cancelled) setMemberProfiles([]);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberIdsKey]);

  // Live "Recent activity" feed, paginated in 25-event chunks via "Load more".
  useEffect(() => {
    if (!uid || !workspaceId || notFound) {
      setActivityEvents([]);
      setActivityHasMore(false);
      return;
    }
    // Fetch one beyond the displayed window so we know whether there's a next page.
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
  }, [uid, workspaceId, notFound, activityLimit]);

  // ---- Capabilities --------------------------------------------------------

  const getWorkspaceLookup = (id: string) => (workspace && workspace.id === id ? workspace : null);
  const canEditContent = workspace ? access.canEditWorkspaceContent(workspace, uid) : false;
  const canManage = workspace ? access.canManageWorkspace(workspace, uid) : false;
  const effectiveRole = workspace ? access.getEffectiveRole(workspace, uid) : null;
  const selfElected = workspace ? access.isSelfElectedSupervisor(workspace, uid) : false;
  const showSupervisorToggle = workspace ? access.canToggleSupervisor(workspace, uid, isTeacher) : false;
  const canExportGrading = workspace ? access.canExportGradingReport(workspace, uid) : false;
  const canPostAssignment = workspace ? access.canCreateAssignment(workspace, uid) : false;
  const status = workspace?.status || 'active';

  // Drafts the current user could still share for feedback. Being a workspace member
  // already gives supervisors access, but a work only lands in their review inbox once
  // it's explicitly shared — students forget this per-screenplay step, so surface a
  // count. Same predicate as ScreenplayList's prominent "Share for feedback" button, so
  // this number always matches the number of those buttons below.
  const unsharedForFeedbackCount = screenplays.filter(screenplay => {
    if (!access.canEditScreenplay(screenplay, uid, getWorkspaceLookup)) return false;
    const reviewStatus = access.getReviewStatus(screenplay);
    return reviewStatus === 'draft' || reviewStatus === 'changes_requested';
  }).length;

  // ---- Actions -------------------------------------------------------------

  const handleUploadFiles = async (rawFiles: FileList | File[]) => {
    if (!currentUser || !workspace) return;
    if (!canEditContent) {
      toast.error(t('collaboration.groupPage.readOnlyUpload'));
      return;
    }
    const files = Array.from(rawFiles);
    if (files.length === 0) return;

    const validFiles = files.filter(isAcceptedScreenplayFile);
    const rejectedCount = files.length - validFiles.length;
    if (rejectedCount > 0) {
      toast(t('collaboration.groupPage.filesIgnored', { count: rejectedCount }));
    }
    const sizedFiles = validFiles.filter(file => {
      if (file.size > MAX_UPLOAD_BYTES) {
        toast.error(t('collaboration.screenplaysTab.fileTooLarge', { name: file.name, max: MAX_UPLOAD_MB }));
        return false;
      }
      return true;
    });
    if (sizedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: sizedFiles.length });
    let successCount = 0;
    let failureCount = 0;
    for (let i = 0; i < sizedFiles.length; i++) {
      setUploadProgress({ current: i + 1, total: sizedFiles.length });
      try {
        await uploadScreenplayFile({
          file: sizedFiles[i],
          actor: { uid: currentUser.uid, displayName: currentUser.displayName },
          workspace,
          projectId: workspace.projectId,
          assignmentId: uploadAssignmentId || null
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to upload ${sizedFiles[i].name}:`, err);
        failureCount++;
      }
    }
    setUploading(false);
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

  const handleCreateFountain = async () => {
    if (!currentUser || !workspace) return;
    const title = newFountainTitle.trim();
    if (!title) {
      toast.error(t('fountain.titleRequired'));
      return;
    }
    if (!canEditContent) {
      toast.error(t('collaboration.groupPage.readOnlyUpload'));
      return;
    }
    setCreatingFountain(true);
    try {
      const created = await createFountainScreenplay({
        title,
        actor: { uid: currentUser.uid, displayName: currentUser.displayName },
        workspace,
        projectId: workspace.projectId,
        assignmentId: uploadAssignmentId || null
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

  const handleDeleteScreenplay = async (screenplay: Screenplay) => {
    if (!currentUser) return;
    if (!access.canDeleteScreenplay(screenplay, uid, getWorkspaceLookup)) {
      toast.error(t('collaboration.screenplaysTab.deleteNotAllowed'));
      return;
    }
    if (!window.confirm(t('collaboration.screenplaysTab.deleteConfirm'))) return;
    try {
      await deleteScreenplayDoc(screenplay, { uid: currentUser.uid, displayName: currentUser.displayName });
      toast.success(t('collaboration.screenplaysTab.deleteSuccess'));
    } catch (err) {
      console.error('Error deleting screenplay:', err);
      toast.error(t('collaboration.screenplaysTab.deleteFailed'));
    }
  };

  const handleReviewStatusChange = async (screenplay: Screenplay, nextStatus: ScreenplayReviewStatus) => {
    if (!currentUser) return;
    const currentStatus = access.getReviewStatus(screenplay);
    if (currentStatus === nextStatus) return;

    const creatorAllowed = access.canEditScreenplay(screenplay, uid, getWorkspaceLookup) &&
      (nextStatus === 'draft' || nextStatus === 'submitted');
    const reviewerAllowed = access.canReviewScreenplay(screenplay, uid, getWorkspaceLookup) &&
      (nextStatus === 'changes_requested' || nextStatus === 'approved');
    if (!creatorAllowed && !reviewerAllowed) {
      toast.error(t('collaboration.groupPage.reviewNotAllowed'));
      return;
    }
    try {
      await setScreenplayReviewStatus(screenplay, nextStatus, {
        uid: currentUser.uid,
        displayName: currentUser.displayName
      });
      toast.success(t(`collaboration.reviewStatus.toasts.${nextStatus}`));
    } catch (err) {
      console.error('Error updating review status:', err);
      toast.error(t('collaboration.reviewStatus.toasts.failed'));
    }
  };

  // The "post to all my groups" option needs the user's other postable groups; fetched
  // once on demand (when the form opens), not subscribed — the list only feeds the checkbox.
  const loadOtherSupervisedGroups = async () => {
    if (!uid || otherSupervisedGroups !== null) return;
    try {
      const memberships = await getDocs(query(
        collection(db, 'workspaceMemberships'),
        where('userId', '==', uid)
      ));
      const ids = Array.from(new Set(
        memberships.docs
          .map(d => d.data().workspaceId)
          .filter((id): id is string => typeof id === 'string' && id.length > 0 && id !== workspaceId)
      ));
      const snapshots = await Promise.all(ids.map(id => getDoc(doc(db, 'workspaces', id))));
      const groups = snapshots
        .filter(snap => snap.exists())
        .map(snap => access.normalizeWorkspace(snap.id, snap.data()))
        .filter(group => (group.status || 'active') === 'active')
        .filter(group => access.canCreateAssignment(group, uid))
        .sort((a, b) => a.name.localeCompare(b.name));
      setOtherSupervisedGroups(groups);
    } catch (err) {
      console.error('Failed to load other supervised groups:', err);
      setOtherSupervisedGroups([]);
    }
  };

  const handleCreateAssignment = async () => {
    if (!currentUser || !workspace || !canPostAssignment) return;
    const title = newAssignmentTitle.trim();
    if (!title) {
      toast.error(t('collaboration.assignments.titleRequired'));
      return;
    }
    const targets = [
      workspace,
      ...(otherSupervisedGroups || []).filter(group => extraTargetIds[group.id])
    ];
    setCreatingAssignment(true);
    try {
      await createAssignments({
        title,
        description: newAssignmentDescription.trim(),
        workspaces: targets,
        actor: { uid: currentUser.uid, displayName: currentUser.displayName }
      });
      toast.success(t('collaboration.assignments.created', { count: targets.length }));
      setShowNewAssignmentForm(false);
      setNewAssignmentTitle('');
      setNewAssignmentDescription('');
      setExtraTargetIds({});
    } catch (err) {
      console.error('Failed to create assignment:', err);
      toast.error(t('collaboration.assignments.createFailed'));
    } finally {
      setCreatingAssignment(false);
    }
  };

  const handleSaveAssignmentEdit = async () => {
    if (!editingAssignmentId) return;
    const title = editAssignmentTitle.trim();
    if (!title) {
      toast.error(t('collaboration.assignments.titleRequired'));
      return;
    }
    setSavingAssignmentEdit(true);
    try {
      await updateAssignment(editingAssignmentId, {
        title,
        description: editAssignmentDescription.trim()
      });
      toast.success(t('collaboration.assignments.updated'));
      setEditingAssignmentId(null);
    } catch (err) {
      console.error('Failed to update assignment:', err);
      toast.error(t('collaboration.assignments.updateFailed'));
    } finally {
      setSavingAssignmentEdit(false);
    }
  };

  const handleDeleteAssignment = async (assignment: access.WorkspaceAssignment) => {
    if (!currentUser || !access.canDeleteAssignment(assignment, workspace, uid)) return;
    if (!window.confirm(t('collaboration.assignments.deleteConfirm'))) return;
    try {
      await deleteAssignment(assignment, { uid: currentUser.uid, displayName: currentUser.displayName });
      toast.success(t('collaboration.assignments.deleted'));
    } catch (err) {
      console.error('Failed to delete assignment:', err);
      toast.error(t('collaboration.assignments.deleteFailed'));
    }
  };

  // Toggle THIS group's membership in one of the teacher's classes, from the
  // group page where the members are visible. Atomic arrayUnion/arrayRemove —
  // the class page may be open in another tab. Guard per class, so a pending
  // write on class A doesn't silently swallow a click on class B.
  const handleToggleGroupInClass = async (teacherClass: TeacherClass) => {
    if (!workspace || classTogglePending.has(teacherClass.id)) return;
    const isInClass = teacherClass.workspaceIds.includes(workspace.id);
    setClassTogglePending(current => new Set(current).add(teacherClass.id));
    try {
      await setWorkspaceInClass(teacherClass.id, workspace.id, !isInClass);
      toast.success(isInClass
        ? t('collaboration.groupPage.removedFromClass', { class: teacherClass.name })
        : t('collaboration.groupPage.addedToClass', { class: teacherClass.name }));
    } catch (err) {
      console.error('Failed to toggle class membership:', err);
      toast.error(t('collaboration.classes.updateFailed'));
    } finally {
      setClassTogglePending(current => {
        const next = new Set(current);
        next.delete(teacherClass.id);
        return next;
      });
    }
  };

  // Add one member to a class roster as a uid-linked entry. If the class already
  // contains this group, the student is on the roster automatically — say so
  // instead of duplicating.
  const handleAddMemberToClass = async () => {
    if (!addingMemberToClass || !targetClassId) return;
    const teacherClass = teacherClasses.find(item => item.id === targetClassId);
    if (!teacherClass) return;
    try {
      // A previously removed ("excluded") student gets restored rather than duplicated.
      const wasExcluded = (teacherClass.excludedUids || []).includes(addingMemberToClass.uid);
      if (wasExcluded) {
        await restoreStudentToClass(teacherClass.id, addingMemberToClass.uid);
      }
      if (workspace && teacherClass.workspaceIds.includes(workspace.id)) {
        toast(wasExcluded
          ? t('collaboration.groupPage.memberRestoredToClass', { name: addingMemberToClass.name, class: teacherClass.name })
          : t('collaboration.groupPage.alreadyViaGroup', { class: teacherClass.name }));
        setAddingMemberToClass(null);
        return;
      }
      if ((teacherClass.manualStudents || []).some(student => student.uid === addingMemberToClass.uid)) {
        toast(wasExcluded
          ? t('collaboration.groupPage.memberRestoredToClass', { name: addingMemberToClass.name, class: teacherClass.name })
          : t('collaboration.groupPage.alreadyOnRoster', { class: teacherClass.name }));
        setAddingMemberToClass(null);
        return;
      }
      await addManualStudentToClass(teacherClass.id, {
        id: newLocalId('manual'),
        name: addingMemberToClass.name,
        uid: addingMemberToClass.uid
      });
      toast.success(t('collaboration.groupPage.memberAddedToClass', {
        name: addingMemberToClass.name,
        class: teacherClass.name
      }));
      setAddingMemberToClass(null);
    } catch (err) {
      console.error('Failed to add member to class:', err);
      toast.error(t('collaboration.classes.updateFailed'));
    }
  };

  const handleExportGrading = async () => {
    if (!workspace || !canExportGrading) return;
    if (screenplays.length === 0) {
      toast(t('collaboration.gradingReport.empty'));
      return;
    }
    setExportingGrading(true);
    try {
      await exportWorkspaceGradingCsv({ workspace, screenplays, t });
      toast.success(t('collaboration.gradingReport.success'));
    } catch (err) {
      console.error('Grading report export failed:', err);
      toast.error(t('collaboration.gradingReport.failed'));
    } finally {
      setExportingGrading(false);
    }
  };

  const handleToggleSupervisor = async () => {
    if (!currentUser || !workspace || toggleSupervisorPending) return;
    const enabling = !selfElected;
    setToggleSupervisorPending(true);
    try {
      const functions = getFunctions(app, 'us-central1');
      const setSupervisorMode = httpsCallable(functions, 'setWorkspaceSupervisorMode');
      await setSupervisorMode({ workspaceId: workspace.id, enabled: enabling });
      // The doc subscription refreshes selfElectedSupervisors on its own.
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

  const handleInviteSearch = async (queryStr: string) => {
    if (!queryStr.trim()) {
      setInviteSearchResults([]);
      return;
    }
    setIsSearchingUsers(true);
    try {
      // crewSearch caches the profile fetch, so per-keystroke calls are cheap.
      const results = await searchCrewProfiles(queryStr, { excludeUid: uid });
      setInviteSearchResults(results);
    } catch (err) {
      console.error('Error searching users:', err);
      setInviteSearchResults([]);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  const handleSendInvites = async () => {
    if (!currentUser || !workspace || pendingInvitees.length === 0) return;
    if (!canManage) {
      toast.error(t('collaboration.onlyCreatorCanInvite'));
      return;
    }
    setIsSendingInvites(true);
    try {
      const invitedCount = await createWorkspaceInvitations({
        workspace,
        users: pendingInvitees,
        getRole: () => inviteRole,
        actor: { uid: currentUser.uid, displayName: currentUser.displayName },
        t
      });
      if (invitedCount === 0) {
        toast.error(t('collaboration.groupPage.alreadyInvited'));
        return;
      }
      const invitedNames = pendingInvitees.map(user => user.name || user.email || 'a collaborator').join(', ');
      logWorkspaceActivity({
        workspaceId: workspace.id,
        actorUid: currentUser.uid,
        actorName: currentUser.displayName,
        verb: 'member_added',
        detail: invitedNames
      });
      setShowInviteModal(false);
      setPendingInvitees([]);
      setInviteRole('member');
      setInviteSearchResults([]);
      toast.success(t('collaboration.groupPage.invitationsSent', { count: invitedCount, workspace: workspace.name }));
    } catch (err) {
      console.error('Error inviting users to workspace:', err);
      toast.error(t('collaboration.groupPage.invitationsFailed'));
    } finally {
      setIsSendingInvites(false);
    }
  };

  const handleResendInvite = async (invitationId: string) => {
    if (!currentUser) return;
    setInvitePendingId(invitationId);
    try {
      await resendWorkspaceInvitation(invitationId, { uid: currentUser.uid, displayName: currentUser.displayName });
      toast.success(t('collaboration.groupPage.inviteResent'));
    } catch (err) {
      console.error('Error resending invitation:', err);
      toast.error(t('collaboration.groupPage.resendFailed'));
    } finally {
      setInvitePendingId(null);
    }
  };

  const handleCancelInvite = async (invitationId: string) => {
    setInvitePendingId(invitationId);
    try {
      await cancelWorkspaceInvitation(invitationId);
      toast.success(t('collaboration.groupPage.inviteCancelled'));
    } catch (err) {
      console.error('Error cancelling invitation:', err);
      toast.error(t('collaboration.groupPage.cancelFailed'));
    } finally {
      setInvitePendingId(null);
    }
  };

  // ---- Render --------------------------------------------------------------

  if (loading) {
    return (
      <div className="workspace-detail-page">
        <div className="group-section" style={{ textAlign: 'center', color: '#94a3b8' }}>
          {t('collaboration.groupPage.loading')}
        </div>
      </div>
    );
  }

  if (notFound || !workspace) {
    return (
      <div className="workspace-detail-page">
        <button type="button" className="group-back-link" onClick={() => navigate('/collaboration')}>
          ← {t('collaboration.groupPage.back')}
        </button>
        <div className="group-section" style={{ textAlign: 'center' }}>
          <h2>{t('collaboration.groupPage.notFoundTitle')}</h2>
          <p className="group-empty">{t('collaboration.groupPage.notFoundBody')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-detail-page">
      <button type="button" className="group-back-link" onClick={() => navigate('/collaboration')}>
        ← {t('collaboration.groupPage.back')}
      </button>

      <header className="group-header">
        <div className="group-title-row">
          <h1>{workspace.name}</h1>
          <div className="group-header-actions">
            {canManage && status === 'active' && (
              <button type="button" className="btn-secondary" onClick={() => setShowInviteModal(true)}>
                {t('collaboration.groupPage.inviteMembers')}
              </button>
            )}
            {canExportGrading && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleExportGrading}
                disabled={exportingGrading}
                title={t('collaboration.gradingReport.tooltip')}
              >
                {exportingGrading ? `⏳ ${t('collaboration.gradingReport.generating')}` : `📊 ${t('collaboration.gradingReport.button')}`}
              </button>
            )}
            {showSupervisorToggle && (
              <button
                type="button"
                className="btn-secondary"
                disabled={toggleSupervisorPending}
                onClick={handleToggleSupervisor}
              >
                {selfElected ? t('collaboration.supervisor.stepDown') : t('collaboration.supervisor.actAs')}
              </button>
            )}
          </div>
        </div>
        <div className="group-meta">
          <span className="group-type-chip">{t(`collaboration.workspaceTypes.${workspace.type}`, { defaultValue: workspace.type })}</span>
          {effectiveRole && (
            <span
              className={`role-chip ${selfElected ? 'self-elected' : ''}`}
              title={selfElected ? t('collaboration.supervisor.tooltipSelf') : t('collaboration.supervisor.tooltipRole')}
            >
              {t('collaboration.supervisor.yourRole', { role: t(`collaboration.roles.${effectiveRole}`) })}
              {selfElected ? ` ${t('collaboration.supervisor.selfTag')}` : ''}
            </span>
          )}
        </div>
        {workspace.description && <p className="group-description">{workspace.description}</p>}
      </header>

      {status === 'archived' && (
        <div className="group-status-banner archived">{t('collaboration.groupPage.archivedNotice')}</div>
      )}
      {status === 'deleted' && (
        <div className="group-status-banner deleted">{t('collaboration.groupPage.deletedNotice')}</div>
      )}

      <div className="group-grid">
        <div>
          {/* Assignments are an optional overlay on the verbal workflow: groups with
              none show nothing to students; only posters see the empty section. */}
          {(assignments.length > 0 || canPostAssignment) && (
          <section className="group-section">
            <div className="section-header">
              <h2>📋 {t('collaboration.assignments.title')}</h2>
              {canPostAssignment && status === 'active' && !showNewAssignmentForm && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setShowNewAssignmentForm(true); loadOtherSupervisedGroups(); }}
                >
                  {t('collaboration.assignments.new')}
                </button>
              )}
            </div>
            {showNewAssignmentForm && (
              <div className="assignment-form">
                <div className="form-group">
                  <label>{t('collaboration.assignments.titleLabel')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAssignmentTitle}
                    autoFocus
                    maxLength={200}
                    placeholder={t('collaboration.assignments.titlePlaceholder')}
                    onChange={e => setNewAssignmentTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>{t('collaboration.assignments.descriptionLabel')}</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    maxLength={2000}
                    value={newAssignmentDescription}
                    onChange={e => setNewAssignmentDescription(e.target.value)}
                  />
                </div>
                {(otherSupervisedGroups?.length || 0) > 0 && (
                  <div className="assignment-targets">
                    <div className="assignment-targets-head">
                      <span>{t('collaboration.assignments.alsoPostTo')}</span>
                      <button
                        type="button"
                        className="btn-text-link"
                        onClick={() => {
                          const groups = otherSupervisedGroups || [];
                          const allChecked = groups.every(group => extraTargetIds[group.id]);
                          setExtraTargetIds(allChecked
                            ? {}
                            : Object.fromEntries(groups.map(group => [group.id, true])));
                        }}
                      >
                        {(otherSupervisedGroups || []).every(group => extraTargetIds[group.id])
                          ? t('collaboration.assignments.selectNone')
                          : t('collaboration.assignments.selectAll')}
                      </button>
                    </div>
                    {(otherSupervisedGroups || []).map(group => (
                      <label key={group.id} className="assignment-target-option">
                        <input
                          type="checkbox"
                          checked={Boolean(extraTargetIds[group.id])}
                          onChange={e => setExtraTargetIds(prev => ({ ...prev, [group.id]: e.target.checked }))}
                        />
                        {group.name}
                      </label>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowNewAssignmentForm(false);
                      setNewAssignmentTitle('');
                      setNewAssignmentDescription('');
                      setExtraTargetIds({});
                    }}
                  >
                    {t('collaboration.createWorkspaceModal.cancel')}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={creatingAssignment || !newAssignmentTitle.trim()}
                    onClick={handleCreateAssignment}
                  >
                    {creatingAssignment ? t('collaboration.assignments.creating') : t('collaboration.assignments.create')}
                  </button>
                </div>
              </div>
            )}
            {assignments.length === 0 ? (
              <p className="group-empty">{t('collaboration.assignments.empty')}</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {assignments.map(assignment => {
                  const tagged = screenplays.filter(s => s.assignmentId === assignment.id);
                  const turnedIn = tagged.filter(access.isTurnedIn).length;
                  if (editingAssignmentId === assignment.id) {
                    return (
                      <li key={assignment.id} className="assignment-row">
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="form-group" style={{ marginBottom: 8 }}>
                            <input
                              type="text"
                              className="form-input"
                              value={editAssignmentTitle}
                              autoFocus
                              maxLength={200}
                              onChange={e => setEditAssignmentTitle(e.target.value)}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 8 }}>
                            <textarea
                              className="form-input"
                              rows={2}
                              maxLength={2000}
                              placeholder={t('collaboration.assignments.descriptionLabel')}
                              value={editAssignmentDescription}
                              onChange={e => setEditAssignmentDescription(e.target.value)}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                            <button
                              type="button"
                              className="btn-secondary"
                              style={{ padding: '0.3rem 0.8rem', fontSize: '0.85em' }}
                              onClick={() => setEditingAssignmentId(null)}
                            >
                              {t('collaboration.createWorkspaceModal.cancel')}
                            </button>
                            <button
                              type="button"
                              className="btn-primary"
                              style={{ padding: '0.3rem 0.8rem', fontSize: '0.85em' }}
                              disabled={savingAssignmentEdit || !editAssignmentTitle.trim()}
                              onClick={handleSaveAssignmentEdit}
                            >
                              {savingAssignmentEdit ? t('collaboration.assignments.saving') : t('collaboration.classes.save')}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li key={assignment.id} className="assignment-row">
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="assignment-title">{assignment.title}</div>
                        {assignment.description && (
                          <p className="assignment-desc">{assignment.description}</p>
                        )}
                        <div className="assignment-meta">
                          <span className="assignment-chip">
                            {t('collaboration.assignments.works', { count: tagged.length })}
                          </span>
                          <span className={`assignment-chip ${turnedIn > 0 ? 'turned-in' : ''}`}>
                            {t('collaboration.assignments.turnedIn', { count: turnedIn })}
                          </span>
                          {assignment.createdByName && (
                            <span style={{ color: '#94a3b8', fontSize: '0.82em' }}>
                              {t('collaboration.assignments.postedBy', { name: assignment.createdByName })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        {assignment.createdBy === uid && (
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.3rem 0.8rem', fontSize: '0.85em' }}
                            onClick={() => {
                              setEditingAssignmentId(assignment.id);
                              setEditAssignmentTitle(assignment.title);
                              setEditAssignmentDescription(assignment.description);
                            }}
                          >
                            {t('collaboration.assignments.edit')}
                          </button>
                        )}
                        {access.canDeleteAssignment(assignment, workspace, uid) && (
                          <button
                            type="button"
                            className="btn-danger"
                            style={{ padding: '0.3rem 0.8rem', fontSize: '0.85em' }}
                            onClick={() => handleDeleteAssignment(assignment)}
                          >
                            {t('collaboration.delete')}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
          )}

          <section className="group-section">
            <div className="section-header">
              <h2>{t('collaboration.groupPage.screenplaysTitle')}</h2>
              {canEditContent && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  {assignments.length > 0 && (
                    <select
                      className="form-input"
                      style={{ maxWidth: 240 }}
                      value={uploadAssignmentId}
                      onChange={e => setUploadAssignmentId(e.target.value)}
                      aria-label={t('collaboration.assignments.forAssignment')}
                      title={t('collaboration.assignments.forAssignment')}
                    >
                      <option value="">{t('collaboration.assignments.noneOption')}</option>
                      {assignments.map(assignment => (
                        <option key={assignment.id} value={assignment.id}>📋 {assignment.title}</option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading
                      ? (uploadProgress
                        ? t('collaboration.uploadProgress', { current: uploadProgress.current, total: uploadProgress.total })
                        : t('collaboration.screenplaysTab.uploading'))
                      : t('collaboration.screenplaysTab.uploadScreenplay')}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => { setNewFountainTitle(''); setShowStartWritingModal(true); }}
                  >
                    ✍️ {t('fountain.startWriting')}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: 'none' }}
                    disabled={uploading}
                    onChange={async event => {
                      const files = event.target.files;
                      if (files && files.length > 0) {
                        await handleUploadFiles(files);
                      }
                      event.target.value = '';
                    }}
                  />
                </div>
              )}
            </div>
            {unsharedForFeedbackCount > 0 && (
              <div className="share-feedback-nudge" role="status">
                <span className="nudge-icon" aria-hidden="true">📤</span>
                <div className="nudge-text">
                  <strong>{t('collaboration.groupPage.notSharedNudge', { count: unsharedForFeedbackCount })}</strong>
                  <p className="nudge-hint">{t('collaboration.groupPage.notSharedNudgeHint')}</p>
                </div>
              </div>
            )}
            {screenplays.length === 0 ? (
              <p className="group-empty">{t('collaboration.groupPage.noScreenplays')}</p>
            ) : (
              <ScreenplayList
                screenplays={screenplays}
                unresolvedCounts={unresolvedCounts}
                unresolvedFromTeacherCounts={unresolvedFromTeacherCounts}
                assignmentLabel={s => s.assignmentId
                  ? assignments.find(a => a.id === s.assignmentId)?.title || null
                  : null}
                canEdit={s => access.canEditScreenplay(s, uid, getWorkspaceLookup)}
                canDelete={s => access.canDeleteScreenplay(s, uid, getWorkspaceLookup)}
                canReview={s => access.canReviewScreenplay(s, uid, getWorkspaceLookup)}
                onView={setViewingScreenplay}
                onEditFountain={setEditingFountain}
                onDelete={handleDeleteScreenplay}
                onReviewChange={handleReviewStatusChange}
              />
            )}
          </section>

          <section className="group-section">
            <h2>{t('collaboration.activity.title')}</h2>
            {activityEvents.length === 0 ? (
              <p className="group-empty">{t('collaboration.activity.empty')}</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {activityEvents.map(ev => {
                  const when = access.toDate(ev.createdAt);
                  return (
                    <li key={ev.id} className="activity-row">
                      <span className="activity-text">
                        <strong>{ev.actorName || t('collaboration.activity.someone')}</strong>{' '}
                        {t(`collaboration.activity.verbs.${ev.verb}`, {
                          target: ev.targetName || t('collaboration.activity.aScreenplay'),
                          detail: ev.detail || ''
                        })}
                      </span>
                      <span className="activity-when">{when ? access.formatTimeAgo(when) : ''}</span>
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
          </section>
        </div>

        <aside>
          {isTeacher && teacherClasses.length > 0 && (
            <section className="group-section">
              <h2>🏫 {t('collaboration.groupPage.yourClasses')}</h2>
              <p className="group-empty" style={{ marginTop: 0 }}>
                {t('collaboration.groupPage.yourClassesHint')}
              </p>
              {teacherClasses.map(teacherClass => {
                const inClass = workspace ? teacherClass.workspaceIds.includes(workspace.id) : false;
                const pending = classTogglePending.has(teacherClass.id);
                return (
                  <div key={teacherClass.id} className="class-toggle-row">
                    <span className="class-toggle-name" title={teacherClass.name}>{teacherClass.name}</span>
                    <button
                      type="button"
                      className={`class-toggle-btn ${inClass ? 'in-class' : ''}`}
                      disabled={pending}
                      title={inClass
                        ? t('collaboration.groupPage.removeFromClassBtnHint')
                        : t('collaboration.groupPage.addToClassBtnHint')}
                      onClick={() => handleToggleGroupInClass(teacherClass)}
                    >
                      {pending ? '…' : inClass
                        ? `✓ ${t('collaboration.groupPage.inClass')}`
                        : `+ ${t('collaboration.groupPage.addToClassBtn')}`}
                    </button>
                  </div>
                );
              })}
            </section>
          )}
          <section className="group-section">
            <h2>{t('collaboration.groupPage.membersTitle', { count: memberProfiles.length })}</h2>
            {memberProfiles.length === 0 ? (
              <p className="group-empty">{t('collaboration.groupPage.noMembers')}</p>
            ) : (
              memberProfiles.map(member => (
                <div className="member-row" key={member.id}>
                  <span className="member-avatar">
                    {member.avatar
                      ? <img src={member.avatar} alt="" />
                      : (member.name || '?').charAt(0).toUpperCase()}
                  </span>
                  <span className="member-name" title={member.email || member.name}>{member.name}</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className={`member-role ${member.role}`} style={{ marginLeft: 0 }}>
                      {t(`collaboration.roles.${member.role}`, { defaultValue: member.role })}
                    </span>
                    {isTeacher && teacherClasses.length > 0 && member.id !== uid && (
                      <button
                        type="button"
                        className="btn-text-link"
                        title={t('collaboration.groupPage.addMemberToClassTitle')}
                        onClick={() => {
                          setTargetClassId(teacherClasses[0]?.id || '');
                          setAddingMemberToClass({ uid: member.id, name: member.name });
                        }}
                      >
                        + {t('collaboration.classes.tabTitle')}
                      </button>
                    )}
                  </span>
                </div>
              ))
            )}
          </section>
          {canManage && pendingInvites.length > 0 && (
            <section className="group-section">
              <h2>{t('collaboration.groupPage.pendingInvitesTitle', { count: pendingInvites.length })}</h2>
              <p style={{ color: '#64748b', fontSize: '0.85em', margin: '0 0 10px' }}>{t('collaboration.groupPage.pendingInvitesHint')}</p>
              {pendingInvites.map(invite => (
                <div className="member-row" key={invite.id}>
                  <span className="member-avatar" aria-hidden="true">{(invite.inviteeName || '?').charAt(0).toUpperCase()}</span>
                  <span className="member-name" title={invite.inviteeEmail || invite.inviteeName}>{invite.inviteeName}</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`member-role ${invite.role}`} style={{ marginLeft: 0 }}>
                      {t(`collaboration.roles.${invite.role}`, { defaultValue: invite.role })}
                    </span>
                    <button type="button" className="btn-text-link" disabled={invitePendingId === invite.id} onClick={() => handleResendInvite(invite.id)}>
                      {t('collaboration.groupPage.resend')}
                    </button>
                    <button type="button" className="btn-text-link" disabled={invitePendingId === invite.id} onClick={() => handleCancelInvite(invite.id)}>
                      {t('collaboration.groupPage.cancelInvite')}
                    </button>
                  </span>
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>

      {/* Screenplay viewer */}
      {viewingScreenplay && (
        <ScreenplayViewerModal
          screenplay={viewingScreenplay}
          projectId={workspace.projectId || 'default-project'}
          onClose={() => setViewingScreenplay(null)}
        />
      )}

      {/* In-browser Fountain editor */}
      {editingFountain && (
        <FountainEditor
          screenplay={{
            id: editingFountain.id,
            name: editingFountain.name,
            fountainSource: editingFountain.fountainSource
          }}
          projectId={workspace.projectId || 'default-project'}
          onClose={() => setEditingFountain(null)}
        />
      )}

      {/* Start Writing modal */}
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
                  onKeyDown={e => { if (e.key === 'Enter') handleCreateFountain(); }}
                />
              </div>
              <p className="group-empty" style={{ margin: 0 }}>
                {t('collaboration.groupPage.fountainScopeHint', { workspace: workspace.name })}
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => { setShowStartWritingModal(false); setNewFountainTitle(''); }}
              >
                {t('fountain.cancel')}
              </button>
              <button
                className="btn-primary"
                disabled={creatingFountain || !newFountainTitle.trim()}
                onClick={handleCreateFountain}
              >
                {creatingFountain ? t('fountain.creating') : t('fountain.create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite members modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{t('collaboration.groupPage.inviteModalTitle', { workspace: workspace.name })}</h3>
              <button
                className="close-btn"
                aria-label={t('fountain.close')}
                onClick={() => {
                  setShowInviteModal(false);
                  setPendingInvitees([]);
                  setInviteRole('member');
                  setInviteSearchResults([]);
                }}
              >×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{t('collaboration.createWorkspaceModal.searchUsers')}</label>
                <UserAutocomplete
                  value={pendingInvitees}
                  onChange={(users: UserAutocompleteOption[]) => {
                    const existingIds = new Set(access.getWorkspaceMemberIds(workspace));
                    setPendingInvitees(users.filter(user => !existingIds.has(user.id)));
                  }}
                  onSearch={handleInviteSearch}
                  options={inviteSearchResults}
                  loading={isSearchingUsers}
                  placeholder={t('collaboration.createWorkspaceModal.searchPlaceholder')}
                />
                {isSearchingUsers && <div className="searching-indicator">{t('collaboration.groupPage.searching')}</div>}
              </div>
              <div className="form-group">
                <label>{t('collaboration.groupPage.inviteRoleLabel')}</label>
                <select
                  className="form-input"
                  value={inviteRole}
                  onChange={event => setInviteRole(event.target.value as Extract<WorkspaceRole, 'member' | 'supervisor' | 'viewer'>)}
                >
                  {INVITABLE_WORKSPACE_ROLES.map(role => (
                    <option key={role} value={role}>
                      {t(`collaboration.roles.${role}`)} — {t(`collaboration.roles.${role}Desc`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowInviteModal(false);
                  setPendingInvitees([]);
                  setInviteRole('member');
                }}
              >
                {t('collaboration.createWorkspaceModal.cancel')}
              </button>
              <button
                className="btn-primary"
                disabled={isSendingInvites || pendingInvitees.length === 0}
                onClick={handleSendInvites}
              >
                {isSendingInvites ? t('collaboration.groupPage.sending') : t('collaboration.groupPage.sendInvitations')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add a member to a class roster (teacher-only) */}
      {addingMemberToClass && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{t('collaboration.groupPage.addMemberToClassTitle2', { name: addingMemberToClass.name })}</h3>
              <button
                className="close-btn"
                aria-label={t('fountain.close')}
                onClick={() => setAddingMemberToClass(null)}
              >×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{t('collaboration.groupPage.classSelectLabel')}</label>
                <select
                  className="form-input"
                  value={targetClassId}
                  onChange={e => setTargetClassId(e.target.value)}
                >
                  {teacherClasses.map(teacherClass => (
                    <option key={teacherClass.id} value={teacherClass.id}>{teacherClass.name}</option>
                  ))}
                </select>
              </div>
              <p className="group-empty" style={{ margin: 0 }}>
                {t('collaboration.groupPage.addMemberToClassHint')}
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setAddingMemberToClass(null)}>
                {t('collaboration.createWorkspaceModal.cancel')}
              </button>
              <button
                className="btn-primary"
                disabled={!targetClassId}
                onClick={handleAddMemberToClass}
              >
                {t('collaboration.classes.addStudent')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDetailPage;
