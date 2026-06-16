import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { CollaborationWorkspace } from '../../types/Collaboration';
import * as access from './workspaceAccess';
import {
  ClassChecklistItem,
  TeacherClass,
  addManualStudentToClass,
  addWorkspacesToClass,
  deleteTeacherClass,
  newLocalId,
  normalizeTeacherClass,
  removeStudentFromRoster,
  restoreStudentToClass,
  setStudentTick,
  setWorkspaceInClass,
  updateTeacherClass
} from '../../services/classService';
import { createAssignments } from '../../services/assignmentService';
import {
  addStudentToWorkspace,
  respondToJoinRequest,
  subscribeToJoinRequestsForClass,
  WorkspaceJoinRequest
} from '../../services/joinRequestService';
import { Screenplay, WorkspaceAssignment } from './workspaceAccess';
import ScreenplayViewerModal from './ScreenplayViewerModal';
import ScreenplayList from './ScreenplayList';
import { fetchCrewProfilesByIds, searchCrewProfiles } from './crewSearch';
import UserAutocomplete, { UserAutocompleteOption } from './UserAutocomplete';
import './CollaborationHub.scss';
import './WorkspaceDetailPage.scss';

// A teacher's PRIVATE class page (/collaboration/class/:classId): the class's groups
// with review stats, a student roster (derived from group members + manual entries)
// with per-student ticks, a to-do checklist, and class-wide assignment posting.
// Students never see this; firestore.rules restricts teacherClasses to the owner.

interface GroupStats {
  workspace: CollaborationWorkspace;
  screenplayCount: number;
  awaitingReview: number;
}

interface RosterEntry {
  key: string;            // uid when known (derived or linked), manual id otherwise
  name: string;
  avatar?: string;
  groupNames: string[];   // empty for manual students
  manual: boolean;
  manualId?: string;      // set for manual entries; needed to remove them
}

const ClassDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  const [teacherClass, setTeacherClass] = useState<TeacherClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [classWorkspaces, setClassWorkspaces] = useState<CollaborationWorkspace[]>([]);
  // Derived (from group members) and manual roster halves load independently:
  // manual edits must not re-fetch every workspace/screenplay in the class.
  const [derivedRoster, setDerivedRoster] = useState<RosterEntry[]>([]);
  const [manualRoster, setManualRoster] = useState<RosterEntry[]>([]);
  // All screenplays + assignments across the class's groups, for the per-student
  // work view and assignment chips.
  const [classScreenplays, setClassScreenplays] = useState<Screenplay[]>([]);
  const [classAssignments, setClassAssignments] = useState<WorkspaceAssignment[]>([]);
  const [expandedStudentKey, setExpandedStudentKey] = useState<string | null>(null);
  const [viewingScreenplay, setViewingScreenplay] = useState<Screenplay | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [classJoinRequests, setClassJoinRequests] = useState<WorkspaceJoinRequest[]>([]);
  const [joinRequestPendingId, setJoinRequestPendingId] = useState<string | null>(null);
  // Teacher "add student to a group" picker — which group's picker is open + its search state.
  const [addingToGroupId, setAddingToGroupId] = useState<string | null>(null);
  const [addSearchResults, setAddSearchResults] = useState<UserAutocompleteOption[]>([]);
  const [addSearchLoading, setAddSearchLoading] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<CollaborationWorkspace[] | null>(null);
  // Short member-name preview per pickable group, so choosing doesn't require recall.
  const [availableGroupMembers, setAvailableGroupMembers] = useState<Record<string, string>>({});
  const [pickedGroupIds, setPickedGroupIds] = useState<Record<string, boolean>>({});
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [postingAssignment, setPostingAssignment] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  // ---- Class doc subscription ----------------------------------------------

  useEffect(() => {
    if (!classId || !uid) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    const unsubscribe = onSnapshot(
      doc(db, 'teacherClasses', classId),
      snapshot => {
        if (!snapshot.exists()) {
          setTeacherClass(null);
          setNotFound(true);
          setLoading(false);
          return;
        }
        const normalized = normalizeTeacherClass(snapshot.id, snapshot.data());
        if (normalized.ownerId !== uid) {
          setTeacherClass(null);
          setNotFound(true);
        } else {
          setTeacherClass(normalized);
          setNotFound(false);
        }
        setLoading(false);
      },
      err => {
        console.error('Error subscribing to class:', err);
        setTeacherClass(null);
        setNotFound(true);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [classId, uid]);

  // ---- Pending join requests across this class -----------------------------
  // The teacher can approve/deny here even for groups they don't personally sit in. Status
  // is filtered in the service; read access comes from the isClassTeacherForRequest rule
  // (teacher owns the class the request is stamped with).
  useEffect(() => {
    if (!classId || notFound) {
      setClassJoinRequests([]);
      return;
    }
    const unsubscribe = subscribeToJoinRequestsForClass(classId, setClassJoinRequests);
    return () => unsubscribe();
  }, [classId, notFound]);

  // ---- Groups + roster (one-shot, with manual refresh) ----------------------

  const workspaceIdsKey = (teacherClass?.workspaceIds || []).slice().sort().join(',');
  const manualStudentsKey = (teacherClass?.manualStudents || []).map(s => `${s.id}:${s.uid || ''}:${s.name}`).join(',');

  useEffect(() => {
    if (!uid || !teacherClass) {
      setClassWorkspaces([]);
      setDerivedRoster([]);
      setClassScreenplays([]);
      setClassAssignments([]);
      return;
    }
    const workspaceIds = workspaceIdsKey ? workspaceIdsKey.split(',') : [];
    let cancelled = false;
    (async () => {
      setLoadingGroups(true);
      try {
        // Workspaces (drop ids whose docs are gone or unreadable).
        const snapshots = await Promise.all(workspaceIds.map(async id => {
          try {
            return await getDoc(doc(db, 'workspaces', id));
          } catch {
            return null;
          }
        }));
        const workspaces = snapshots
          .filter((snap): snap is NonNullable<typeof snap> => Boolean(snap && snap.exists()))
          .map(snap => access.normalizeWorkspace(snap.id, snap.data()!))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Screenplays + assignments across the class (chunked by Firestore `in`
        // limit). The full screenplay list feeds the per-student work view and
        // the per-group rollups (derived at render).
        const allScreenplays: Screenplay[] = [];
        const allAssignments: WorkspaceAssignment[] = [];
        const ids = workspaces.map(w => w.id);
        for (let i = 0; i < ids.length; i += 10) {
          const chunk = ids.slice(i, i + 10);
          const [screenplaySnap, assignmentSnap] = await Promise.all([
            getDocs(query(collection(db, 'screenplays'), where('workspaceId', 'in', chunk))),
            getDocs(query(collection(db, 'workspaceAssignments'), where('workspaceId', 'in', chunk)))
          ]);
          screenplaySnap.docs.forEach(d => {
            const data = access.normalizeScreenplay(d.id, d.data());
            if (data.workspaceId) allScreenplays.push(data);
          });
          assignmentSnap.docs.forEach(d => {
            allAssignments.push(access.normalizeAssignment(d.id, d.data()));
          });
        }

        // Derived roster: union of group members (minus the teacher). Resolve only
        // those known member ids through the bounded callable lookup.
        const groupNamesByUid = new Map<string, string[]>();
        workspaces.forEach(workspace => {
          access.getWorkspaceMemberIds(workspace)
            .filter(memberUid => memberUid !== uid)
            .forEach(memberUid => {
              const list = groupNamesByUid.get(memberUid) || [];
              list.push(workspace.name);
              groupNamesByUid.set(memberUid, list);
            });
        });
        const profiles = await fetchCrewProfilesByIds(Array.from(groupNamesByUid.keys()));
        const profileByUid = new Map(profiles.map(profile => [profile.id, profile]));
        const derived: RosterEntry[] = Array.from(groupNamesByUid.entries()).map(([studentUid, groupNames]) => {
          const profile = profileByUid.get(studentUid);
          return {
            key: studentUid,
            name: profile?.name || `Crew Member ${studentUid.slice(-4)}`,
            avatar: profile?.avatar || '',
            groupNames,
            manual: false
          };
        });

        if (cancelled) return;
        setClassWorkspaces(workspaces);
        setDerivedRoster(derived);
        // Most recently touched first, so the work view leads with fresh hand-ins.
        allScreenplays.sort((a, b) =>
          (access.toDate(b.lastModified)?.getTime() || 0) - (access.toDate(a.lastModified)?.getTime() || 0)
        );
        setClassScreenplays(allScreenplays);
        setClassAssignments(allAssignments);
      } catch (err) {
        console.error('Failed to load class groups:', err);
      } finally {
        if (!cancelled) setLoadingGroups(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, workspaceIdsKey, reloadNonce]);

  // Manual roster entries resolve separately — adding/removing one student must
  // not re-fetch the whole class. uid-linked entries get live profile data.
  useEffect(() => {
    if (!uid || !teacherClass) {
      setManualRoster([]);
      return;
    }
    const manualStudents = teacherClass.manualStudents || [];
    if (manualStudents.length === 0) {
      setManualRoster([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const profiles = await fetchCrewProfilesByIds(
          manualStudents.flatMap(student => student.uid ? [student.uid] : [])
        );
        const profileByUid = new Map(profiles.map(profile => [profile.id, profile]));
        if (cancelled) return;
        setManualRoster(manualStudents.map(student => {
          const profile = student.uid ? profileByUid.get(student.uid) : undefined;
          return {
            key: student.uid || student.id,
            name: profile?.name || student.name,
            avatar: profile?.avatar || '',
            groupNames: [],
            manual: true,
            manualId: student.id
          };
        }));
      } catch (err) {
        console.error('Failed to resolve manual roster entries:', err);
        if (!cancelled) {
          setManualRoster(manualStudents.map(student => ({
            key: student.uid || student.id,
            name: student.name,
            groupNames: [],
            manual: true,
            manualId: student.id
          })));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, manualStudentsKey]);

  // Merge the two roster halves: a uid-linked manual entry whose student already
  // arrives via a group MERGES into the derived row (keeping its manualId so the
  // link stays removable) instead of being hidden or duplicated. Excluded uids are
  // split out into a restorable list — that's how a group-derived student behaves
  // like a removable individual.
  const excludedUids = useMemo(
    () => new Set(teacherClass?.excludedUids || []),
    [teacherClass?.excludedUids]
  );
  const { roster, excludedRoster } = useMemo(() => {
    const byKey = new Map(derivedRoster.map(entry => [entry.key, { ...entry }]));
    const standalone: RosterEntry[] = [];
    manualRoster.forEach(entry => {
      const existing = byKey.get(entry.key);
      if (existing) {
        existing.manualId = entry.manualId;
      } else {
        standalone.push(entry);
      }
    });
    const all = [...byKey.values(), ...standalone].sort((a, b) => a.name.localeCompare(b.name));
    return {
      roster: all.filter(entry => !excludedUids.has(entry.key)),
      excludedRoster: all.filter(entry => excludedUids.has(entry.key))
    };
  }, [derivedRoster, manualRoster, excludedUids]);

  const workspaceNameById = useMemo(
    () => new Map(classWorkspaces.map(workspace => [workspace.id, workspace.name])),
    [classWorkspaces]
  );
  const assignmentTitleById = useMemo(
    () => new Map(classAssignments.map(assignment => [assignment.id, assignment.title])),
    [classAssignments]
  );
  const worksByStudent = useMemo(() => {
    const map = new Map<string, Screenplay[]>();
    classScreenplays.forEach(screenplay => {
      if (!screenplay.uploadedBy) return;
      const list = map.get(screenplay.uploadedBy) || [];
      list.push(screenplay);
      map.set(screenplay.uploadedBy, list);
    });
    return map;
  }, [classScreenplays]);

  // Per-group rollups, derived from the one screenplay list (no second copy to drift).
  const groupStats: GroupStats[] = useMemo(() => {
    const counts = new Map<string, { total: number; submitted: number }>();
    classScreenplays.forEach(screenplay => {
      if (!screenplay.workspaceId) return;
      const entry = counts.get(screenplay.workspaceId) || { total: 0, submitted: 0 };
      entry.total += 1;
      if (access.getReviewStatus(screenplay) === 'submitted') entry.submitted += 1;
      counts.set(screenplay.workspaceId, entry);
    });
    return classWorkspaces.map(workspace => ({
      workspace,
      screenplayCount: counts.get(workspace.id)?.total || 0,
      awaitingReview: counts.get(workspace.id)?.submitted || 0
    }));
  }, [classWorkspaces, classScreenplays]);

  // ---- Actions --------------------------------------------------------------

  const persist = async (updates: Parameters<typeof updateTeacherClass>[1], errorKey: string) => {
    if (!teacherClass) return;
    try {
      await updateTeacherClass(teacherClass.id, updates);
    } catch (err) {
      console.error('Class update failed:', err);
      toast.error(t(errorKey));
    }
  };

  const handleRename = async () => {
    const name = nameDraft.trim();
    if (!name || !teacherClass) return;
    await persist({ name }, 'collaboration.classes.updateFailed');
    setEditingName(false);
  };

  const handleDeleteClass = async () => {
    if (!teacherClass) return;
    if (!window.confirm(t('collaboration.classes.deleteConfirm'))) return;
    try {
      await deleteTeacherClass(teacherClass.id);
      toast.success(t('collaboration.classes.deleted'));
      navigate('/collaboration?tab=classes');
    } catch (err) {
      console.error('Failed to delete class:', err);
      toast.error(t('collaboration.classes.deleteFailed'));
    }
  };

  // The add-groups picker offers every ACTIVE group the teacher belongs to that
  // isn't already in the class. Organizing is broader than posting rights.
  const loadAvailableGroups = async () => {
    if (!uid || availableGroups !== null) return;
    try {
      const memberships = await getDocs(query(
        collection(db, 'workspaceMemberships'),
        where('userId', '==', uid)
      ));
      const ids = Array.from(new Set(
        memberships.docs
          .map(d => d.data().workspaceId)
          .filter((id): id is string => typeof id === 'string' && id.length > 0)
      ));
      const snapshots = await Promise.all(ids.map(id => getDoc(doc(db, 'workspaces', id))));
      const groups = snapshots
        .filter(snap => snap.exists())
        .map(snap => access.normalizeWorkspace(snap.id, snap.data()))
        .filter(group => (group.status || 'active') === 'active')
        .sort((a, b) => a.name.localeCompare(b.name));
      // Resolve only the member ids needed for these group previews.
      try {
        const memberIds = Array.from(new Set(groups.flatMap(group =>
          access.getWorkspaceMemberIds(group).filter(memberUid => memberUid !== uid)
        )));
        const profiles = await fetchCrewProfilesByIds(memberIds);
        const nameByUid = new Map(profiles.map(profile => [profile.id, profile.name]));
        const preview: Record<string, string> = {};
        groups.forEach(group => {
          const names = access.getWorkspaceMemberIds(group)
            .filter(memberUid => memberUid !== uid)
            .map(memberUid => nameByUid.get(memberUid) || `Crew Member ${memberUid.slice(-4)}`);
          preview[group.id] = names.slice(0, 4).join(', ') + (names.length > 4 ? ` +${names.length - 4}` : '');
        });
        setAvailableGroupMembers(preview);
      } catch {
        // Previews are a convenience; the picker still works without them.
      }
      setAvailableGroups(groups);
    } catch (err) {
      console.error('Failed to load groups for picker:', err);
      setAvailableGroups([]);
    }
  };

  const handleAddGroups = async () => {
    if (!teacherClass) return;
    const toAdd = Object.keys(pickedGroupIds).filter(id => pickedGroupIds[id]);
    if (toAdd.length === 0) return;
    try {
      await addWorkspacesToClass(teacherClass.id, toAdd);
    } catch (err) {
      console.error('Class update failed:', err);
      toast.error(t('collaboration.classes.updateFailed'));
    }
    setPickedGroupIds({});
    setShowGroupPicker(false);
  };

  const handleRemoveGroup = async (workspaceId: string) => {
    if (!teacherClass) return;
    try {
      await setWorkspaceInClass(teacherClass.id, workspaceId, false);
    } catch (err) {
      console.error('Class update failed:', err);
      toast.error(t('collaboration.classes.updateFailed'));
    }
  };

  const handlePostAssignment = async () => {
    if (!currentUser || !teacherClass) return;
    const title = assignmentTitle.trim();
    if (!title) {
      toast.error(t('collaboration.assignments.titleRequired'));
      return;
    }
    // Only groups where the teacher may post (owner or effective supervisor);
    // the batch is atomic, so one denied group would sink all of them.
    const targets = groupStats
      .map(stats => stats.workspace)
      .filter(workspace => access.canCreateAssignment(workspace, uid));
    const skipped = groupStats.length - targets.length;
    if (targets.length === 0) {
      toast.error(t('collaboration.classes.noPostableGroups'));
      return;
    }
    setPostingAssignment(true);
    try {
      await createAssignments({
        title,
        description: assignmentDescription.trim(),
        workspaces: targets,
        actor: { uid: currentUser.uid, displayName: currentUser.displayName }
      });
      toast.success(t('collaboration.assignments.created', { count: targets.length }));
      if (skipped > 0) {
        toast(t('collaboration.classes.skippedGroups', { count: skipped }));
      }
      setShowAssignmentForm(false);
      setAssignmentTitle('');
      setAssignmentDescription('');
      setReloadNonce(n => n + 1);
    } catch (err) {
      console.error('Failed to post class assignment:', err);
      toast.error(t('collaboration.assignments.createFailed'));
    } finally {
      setPostingAssignment(false);
    }
  };

  const handleAddManualStudent = async () => {
    if (!teacherClass) return;
    const name = newStudentName.trim();
    if (!name) return;
    try {
      await addManualStudentToClass(teacherClass.id, { id: newLocalId('manual'), name });
    } catch (err) {
      console.error('Class update failed:', err);
      toast.error(t('collaboration.classes.updateFailed'));
    }
    setNewStudentName('');
  };

  // Remove ANY roster row: a manual entry is dropped, a group-derived student is
  // excluded (their group stays), a merged row gets both — one atomic write.
  const handleRemoveStudent = async (entry: RosterEntry) => {
    if (!teacherClass) return;
    const manualStudent = entry.manualId
      ? (teacherClass.manualStudents || []).find(s => s.id === entry.manualId)
      : undefined;
    const excludeUid = entry.groupNames.length > 0 ? entry.key : undefined;
    if (!manualStudent && !excludeUid) return;
    try {
      await removeStudentFromRoster(teacherClass.id, { manualStudent, excludeUid, tickKey: entry.key });
      if (excludeUid) {
        toast.success(t('collaboration.classes.studentExcluded', { name: entry.name }));
      }
    } catch (err) {
      console.error('Class update failed:', err);
      toast.error(t('collaboration.classes.updateFailed'));
    }
  };

  const handleRestoreStudent = async (studentUid: string) => {
    if (!teacherClass) return;
    try {
      await restoreStudentToClass(teacherClass.id, studentUid);
    } catch (err) {
      console.error('Class update failed:', err);
      toast.error(t('collaboration.classes.updateFailed'));
    }
  };

  const handleToggleStudent = async (key: string) => {
    if (!teacherClass) return;
    try {
      await setStudentTick(teacherClass.id, key, !(teacherClass.studentChecks || {})[key]);
    } catch (err) {
      console.error('Class update failed:', err);
      toast.error(t('collaboration.classes.updateFailed'));
    }
  };

  const handleClearTicks = async () => {
    if (!teacherClass) return;
    await persist({ studentChecks: {} }, 'collaboration.classes.updateFailed');
  };

  const handleAddChecklistItem = async () => {
    if (!teacherClass) return;
    const text = newChecklistText.trim();
    if (!text) return;
    const item: ClassChecklistItem = { id: newLocalId('todo'), text, done: false };
    await persist(
      { checklist: [...(teacherClass.checklist || []), item] },
      'collaboration.classes.updateFailed'
    );
    setNewChecklistText('');
  };

  const handleToggleChecklistItem = async (itemId: string) => {
    if (!teacherClass) return;
    await persist({
      checklist: (teacherClass.checklist || []).map(item =>
        item.id === itemId ? { ...item, done: !item.done } : item)
    }, 'collaboration.classes.updateFailed');
  };

  const handleRemoveChecklistItem = async (itemId: string) => {
    if (!teacherClass) return;
    await persist({
      checklist: (teacherClass.checklist || []).filter(item => item.id !== itemId)
    }, 'collaboration.classes.updateFailed');
  };

  // ---- Render ---------------------------------------------------------------

  if (loading) {
    return (
      <div className="workspace-detail-page">
        <div className="group-section" style={{ textAlign: 'center', color: '#94a3b8' }}>
          {t('collaboration.classes.loading')}
        </div>
      </div>
    );
  }

  if (notFound || !teacherClass) {
    return (
      <div className="workspace-detail-page">
        <button type="button" className="group-back-link" onClick={() => navigate('/collaboration?tab=classes')}>
          ← {t('collaboration.classes.back')}
        </button>
        <div className="group-section" style={{ textAlign: 'center' }}>
          <h2>{t('collaboration.classes.notFoundTitle')}</h2>
          <p className="group-empty">{t('collaboration.classes.notFoundBody')}</p>
        </div>
      </div>
    );
  }

  const ticks = teacherClass.studentChecks || {};
  const tickedCount = roster.filter(entry => ticks[entry.key]).length;
  const checklist = teacherClass.checklist || [];
  const doneCount = checklist.filter(item => item.done).length;
  const unassignedGroups = (availableGroups || []).filter(
    group => !(teacherClass.workspaceIds || []).includes(group.id)
  );

  // Approve/deny a student's request to join a group in this class. Membership is granted
  // server-side by approveJoinRequest; the subscription drops the row when status changes.
  const handleRespondToJoinRequest = async (request: WorkspaceJoinRequest, response: 'approve' | 'deny') => {
    setJoinRequestPendingId(request.id);
    try {
      await respondToJoinRequest(request.id, response);
      const groupName = workspaceNameById.get(request.workspaceId) || request.workspaceName || '';
      if (response === 'approve') {
        toast.success(t('collaboration.joinRequests.approved', {
          name: request.requesterName || request.requesterEmail || 'Student',
          group: groupName
        }));
      } else {
        toast.success(t('collaboration.joinRequests.denied'));
      }
    } catch (err) {
      console.error('Error responding to join request:', err);
      toast.error(t('collaboration.joinRequests.actionFailed'));
    } finally {
      setJoinRequestPendingId(null);
    }
  };

  const handleAddStudentSearch = async (queryStr: string) => {
    setAddSearchLoading(true);
    try {
      setAddSearchResults(await searchCrewProfiles(queryStr));
    } catch (err) {
      console.error('Student search failed:', err);
      setAddSearchResults([]);
    } finally {
      setAddSearchLoading(false);
    }
  };

  // Add the picked user to the group via the callable, then refresh the class's group
  // rollups so the new member shows up. The picker stays open for adding more.
  const handleAddStudent = async (workspaceId: string, user: UserAutocompleteOption) => {
    try {
      const result = await addStudentToWorkspace(workspaceId, user.id);
      const groupName = workspaceNameById.get(workspaceId) || '';
      if (result === 'already_member') {
        toast(t('collaboration.addStudent.alreadyMember', { name: user.name }));
      } else {
        toast.success(t('collaboration.addStudent.added', { name: user.name, group: groupName }));
        setReloadNonce(n => n + 1);
      }
      setAddSearchResults([]);
    } catch (err) {
      console.error('Add student failed:', err);
      toast.error(t('collaboration.addStudent.failed'));
    }
  };

  return (
    <div className="workspace-detail-page">
      <button type="button" className="group-back-link" onClick={() => navigate('/collaboration?tab=classes')}>
        ← {t('collaboration.classes.back')}
      </button>

      <header className="group-header">
        <div className="group-title-row">
          {editingName ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, minWidth: 240 }}>
              <input
                type="text"
                className="form-input"
                value={nameDraft}
                autoFocus
                maxLength={120}
                onChange={e => setNameDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleRename(); }}
              />
              <button type="button" className="btn-primary" disabled={!nameDraft.trim()} onClick={handleRename}>
                {t('collaboration.classes.save')}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setEditingName(false)}>
                {t('collaboration.createWorkspaceModal.cancel')}
              </button>
            </div>
          ) : (
            <h1>
              🏫 {teacherClass.name}
              <button
                type="button"
                className="btn-text-link"
                style={{ marginLeft: 10, fontSize: '0.5em', verticalAlign: 'middle' }}
                onClick={() => { setNameDraft(teacherClass.name); setEditingName(true); }}
              >
                {t('collaboration.classes.rename')}
              </button>
            </h1>
          )}
          <div className="group-header-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowAssignmentForm(prev => !prev)}
              disabled={groupStats.length === 0}
              title={groupStats.length === 0 ? t('collaboration.classes.noPostableGroups') : undefined}
            >
              📋 {t('collaboration.classes.postAssignment')}
            </button>
            <button type="button" className="btn-danger" onClick={handleDeleteClass}>
              {t('collaboration.classes.deleteClass')}
            </button>
          </div>
        </div>
        <p className="group-description">{t('collaboration.classes.privateHint')}</p>
      </header>

      {showAssignmentForm && (
        <section className="group-section">
          <h2>📋 {t('collaboration.classes.postAssignmentTitle', { name: teacherClass.name })}</h2>
          <div className="assignment-form" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <div className="form-group">
              <label>{t('collaboration.assignments.titleLabel')}</label>
              <input
                type="text"
                className="form-input"
                value={assignmentTitle}
                autoFocus
                maxLength={200}
                placeholder={t('collaboration.assignments.titlePlaceholder')}
                onChange={e => setAssignmentTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('collaboration.assignments.descriptionLabel')}</label>
              <textarea
                className="form-input"
                rows={2}
                maxLength={2000}
                value={assignmentDescription}
                onChange={e => setAssignmentDescription(e.target.value)}
              />
            </div>
            <p className="group-empty" style={{ margin: '0 0 10px' }}>
              {t('collaboration.classes.postAssignmentHint', { count: groupStats.length })}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setShowAssignmentForm(false); setAssignmentTitle(''); setAssignmentDescription(''); }}
              >
                {t('collaboration.createWorkspaceModal.cancel')}
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={postingAssignment || !assignmentTitle.trim()}
                onClick={handlePostAssignment}
              >
                {postingAssignment ? t('collaboration.assignments.creating') : t('collaboration.assignments.create')}
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="group-grid">
        <div>
          <section className="group-section">
            <div className="section-header">
              <h2>{t('collaboration.classes.groupsTitle', { count: groupStats.length })}</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setReloadNonce(n => n + 1)}
                  disabled={loadingGroups}
                >
                  {loadingGroups ? t('collaboration.classes.refreshing') : t('collaboration.classes.refresh')}
                </button>
                {!showGroupPicker && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => { setShowGroupPicker(true); loadAvailableGroups(); }}
                  >
                    {t('collaboration.classes.addGroups')}
                  </button>
                )}
              </div>
            </div>

            {showGroupPicker && (
              <div className="assignment-form">
                {availableGroups === null ? (
                  <p className="group-empty">{t('collaboration.classes.loading')}</p>
                ) : unassignedGroups.length === 0 ? (
                  <p className="group-empty">{t('collaboration.classes.noGroupsToAdd')}</p>
                ) : (
                  <div className="assignment-targets">
                    <div className="assignment-targets-head">
                      <span>{t('collaboration.classes.pickGroups')}</span>
                    </div>
                    {unassignedGroups.map(group => (
                      <label key={group.id} className="assignment-target-option" style={{ alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          style={{ marginTop: 4 }}
                          checked={Boolean(pickedGroupIds[group.id])}
                          onChange={e => setPickedGroupIds(prev => ({ ...prev, [group.id]: e.target.checked }))}
                        />
                        <span style={{ minWidth: 0 }}>
                          {group.name}
                          {availableGroupMembers[group.id] && (
                            <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.82em' }}>
                              {availableGroupMembers[group.id]}
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => { setShowGroupPicker(false); setPickedGroupIds({}); }}
                  >
                    {t('collaboration.createWorkspaceModal.cancel')}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={!Object.values(pickedGroupIds).some(Boolean)}
                    onClick={handleAddGroups}
                  >
                    {t('collaboration.classes.addSelected')}
                  </button>
                </div>
              </div>
            )}

            {groupStats.length === 0 ? (
              <p className="group-empty">{t('collaboration.classes.noGroups')}</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {groupStats.map(({ workspace, screenplayCount, awaitingReview }) => (
                  <li key={workspace.id} className="assignment-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="assignment-title">{workspace.name}</div>
                        <div className="assignment-meta">
                          <span className="assignment-chip">
                            {t('collaboration.classes.membersCount', { count: access.getWorkspaceMemberIds(workspace).filter(id => id !== uid).length })}
                          </span>
                          <span className="assignment-chip">
                            {t('collaboration.classes.screenplaysCount', { count: screenplayCount })}
                          </span>
                          {awaitingReview > 0 && (
                            <span className="assignment-chip turned-in">
                              📥 {t('collaboration.groupCard.awaitingReview', { count: awaitingReview })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '0.3rem 0.9rem', fontSize: '0.85em' }}
                          onClick={() => navigate(`/collaboration/${workspace.id}`)}
                        >
                          {t('collaboration.openGroup')}
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '0.3rem 0.9rem', fontSize: '0.85em' }}
                          onClick={() => {
                            setAddingToGroupId(prev => (prev === workspace.id ? null : workspace.id));
                            setAddSearchResults([]);
                          }}
                          aria-expanded={addingToGroupId === workspace.id}
                        >
                          {t('collaboration.addStudent.button')}
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '0.3rem 0.9rem', fontSize: '0.85em' }}
                          onClick={() => handleRemoveGroup(workspace.id)}
                          title={t('collaboration.classes.removeFromClassHint')}
                        >
                          {t('collaboration.classes.removeFromClass')}
                        </button>
                      </div>
                    </div>
                    {addingToGroupId === workspace.id && (
                      <div className="assignment-form" style={{ marginTop: 0 }}>
                        <p className="group-empty" style={{ margin: '0 0 8px' }}>
                          {t('collaboration.addStudent.hint', { group: workspace.name })}
                        </p>
                        <UserAutocomplete
                          value={[]}
                          onChange={(users: UserAutocompleteOption[]) => {
                            const picked = users[users.length - 1];
                            if (picked) handleAddStudent(workspace.id, picked);
                          }}
                          onSearch={handleAddStudentSearch}
                          options={addSearchResults}
                          loading={addSearchLoading}
                          placeholder={t('collaboration.addStudent.placeholder')}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.3rem 0.9rem', fontSize: '0.85em' }}
                            onClick={() => { setAddingToGroupId(null); setAddSearchResults([]); }}
                          >
                            {t('collaboration.addStudent.done')}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {classJoinRequests.length > 0 && (
            <section className="group-section">
              <h2>{t('collaboration.joinRequests.classTitle', { count: classJoinRequests.length })}</h2>
              <p className="group-empty" style={{ margin: '0 0 10px' }}>{t('collaboration.joinRequests.classHint')}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {classJoinRequests.map(request => {
                  const groupName = workspaceNameById.get(request.workspaceId) || request.workspaceName || '';
                  return (
                    <li key={request.id} className="assignment-row">
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="assignment-title">{request.requesterName || request.requesterEmail || 'Student'}</div>
                        <div className="assignment-meta">
                          <span className="assignment-chip">{t('collaboration.joinRequests.wantsToJoin', { group: groupName })}</span>
                        </div>
                        {request.message && (
                          <div style={{ color: '#94a3b8', fontSize: '0.82em', marginTop: 4 }}>“{request.message}”</div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '0.3rem 0.9rem', fontSize: '0.85em' }}
                          disabled={joinRequestPendingId === request.id}
                          onClick={() => handleRespondToJoinRequest(request, 'approve')}
                        >
                          {t('collaboration.joinRequests.approve')}
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '0.3rem 0.9rem', fontSize: '0.85em' }}
                          disabled={joinRequestPendingId === request.id}
                          onClick={() => handleRespondToJoinRequest(request, 'deny')}
                        >
                          {t('collaboration.joinRequests.deny')}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section className="group-section">
            <div className="section-header">
              <h2>{t('collaboration.classes.rosterTitle', { count: roster.length })}</h2>
              {roster.length > 0 && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9em' }}>
                    {t('collaboration.classes.tickedCount', { done: tickedCount, total: roster.length })}
                  </span>
                  {tickedCount > 0 && (
                    <button type="button" className="btn-secondary" style={{ padding: '0.25rem 0.7rem', fontSize: '0.82em' }} onClick={handleClearTicks}>
                      {t('collaboration.classes.clearTicks')}
                    </button>
                  )}
                </div>
              )}
            </div>
            {roster.length === 0 ? (
              <p className="group-empty">{t('collaboration.classes.rosterEmpty')}</p>
            ) : (
              roster.map(entry => {
                const works = worksByStudent.get(entry.key) || [];
                const turnedIn = works.filter(access.isTurnedIn).length;
                const expanded = expandedStudentKey === entry.key;
                return (
                  <React.Fragment key={entry.key}>
                    <div className="member-row">
                      <input
                        type="checkbox"
                        checked={Boolean(ticks[entry.key])}
                        onChange={() => handleToggleStudent(entry.key)}
                        aria-label={t('collaboration.classes.tickStudent', { name: entry.name })}
                      />
                      <span className="member-avatar">
                        {entry.avatar ? <img src={entry.avatar} alt="" /> : (entry.name || '?').charAt(0).toUpperCase()}
                      </span>
                      <span className="member-name">{entry.name}</span>
                      <span style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {works.length > 0 && (
                          <>
                            <span className="assignment-chip">{t('collaboration.assignments.works', { count: works.length })}</span>
                            {turnedIn > 0 && (
                              <span className="assignment-chip turned-in">{t('collaboration.assignments.turnedIn', { count: turnedIn })}</span>
                            )}
                          </>
                        )}
                        {entry.groupNames.length > 0 ? (
                          entry.groupNames.map(name => (
                            <span key={name} className="member-role">{name}</span>
                          ))
                        ) : (
                          <span className="member-role" style={{ background: '#fef9c3', color: '#854d0e' }}>
                            {t('collaboration.classes.noGroup')}
                          </span>
                        )}
                        {works.length > 0 && (
                          <button
                            type="button"
                            className="btn-text-link"
                            onClick={() => setExpandedStudentKey(expanded ? null : entry.key)}
                          >
                            {expanded ? t('collaboration.classes.hideWork') : t('collaboration.classes.showWork')}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-text-link"
                          title={entry.groupNames.length > 0
                            ? t('collaboration.classes.excludeStudentHint')
                            : t('collaboration.classes.removeStudentHint')}
                          onClick={() => handleRemoveStudent(entry)}
                        >
                          {t('collaboration.classes.removeStudent')}
                        </button>
                      </span>
                    </div>
                    {expanded && (
                      <div className="student-work-panel">
                        <ScreenplayList
                          screenplays={works}
                          unresolvedCounts={{}}
                          unresolvedFromTeacherCounts={{}}
                          workspaceLabel={workspaceId => workspaceNameById.get(workspaceId || '') || ''}
                          assignmentLabel={s => s.assignmentId
                            ? assignmentTitleById.get(s.assignmentId) || null
                            : null}
                          canEdit={() => false}
                          canDelete={() => false}
                          canReview={() => false}
                          onView={setViewingScreenplay}
                          onEditFountain={() => undefined}
                          onDelete={() => undefined}
                          onReviewChange={() => undefined}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                value={newStudentName}
                maxLength={80}
                placeholder={t('collaboration.classes.addStudentPlaceholder')}
                onChange={e => setNewStudentName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddManualStudent(); }}
              />
              <button
                type="button"
                className="btn-secondary"
                disabled={!newStudentName.trim()}
                onClick={handleAddManualStudent}
              >
                {t('collaboration.classes.addStudent')}
              </button>
            </div>
            {excludedRoster.length > 0 && (
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ color: '#64748b', fontWeight: 500, marginBottom: 4 }}>
                  {t('collaboration.classes.excludedTitle', { count: excludedRoster.length })}
                </div>
                {excludedRoster.map(entry => (
                  <div className="member-row" key={`excluded-${entry.key}`} style={{ opacity: 0.7 }}>
                    <span className="member-avatar">
                      {entry.avatar ? <img src={entry.avatar} alt="" /> : (entry.name || '?').charAt(0).toUpperCase()}
                    </span>
                    <span className="member-name" style={{ textDecoration: 'line-through' }}>{entry.name}</span>
                    <button
                      type="button"
                      className="btn-text-link"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => handleRestoreStudent(entry.key)}
                    >
                      {t('collaboration.classes.restoreStudent')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside>
          <section className="group-section">
            <div className="section-header">
              <h2>✅ {t('collaboration.classes.checklistTitle')}</h2>
              {checklist.length > 0 && (
                <span style={{ color: '#64748b', fontSize: '0.9em' }}>
                  {t('collaboration.classes.checklistProgress', { done: doneCount, total: checklist.length })}
                </span>
              )}
            </div>
            {checklist.length === 0 ? (
              <p className="group-empty">{t('collaboration.classes.checklistEmpty')}</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {checklist.map(item => (
                  <li key={item.id} className="checklist-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleChecklistItem(item.id)}
                      />
                      <span className={item.done ? 'done' : ''}>{item.text}</span>
                    </label>
                    <button
                      type="button"
                      className="btn-text-link"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      aria-label={t('collaboration.delete')}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                value={newChecklistText}
                maxLength={200}
                placeholder={t('collaboration.classes.checklistPlaceholder')}
                onChange={e => setNewChecklistText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddChecklistItem(); }}
              />
              <button
                type="button"
                className="btn-secondary"
                disabled={!newChecklistText.trim()}
                onClick={handleAddChecklistItem}
              >
                {t('collaboration.classes.addItem')}
              </button>
            </div>
          </section>
        </aside>
      </div>

      {/* Screenplay viewer (teacher reading a student's work from the roster) */}
      {viewingScreenplay && (
        <ScreenplayViewerModal
          screenplay={viewingScreenplay}
          projectId={
            classWorkspaces.find(workspace => workspace.id === viewingScreenplay.workspaceId)?.projectId
            || 'default-project'
          }
          onClose={() => setViewingScreenplay(null)}
        />
      )}
    </div>
  );
};

export default ClassDetailPage;
