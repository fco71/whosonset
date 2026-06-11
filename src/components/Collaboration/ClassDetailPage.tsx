import React, { useEffect, useState } from 'react';
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
  ManualStudent,
  TeacherClass,
  deleteTeacherClass,
  newLocalId,
  normalizeTeacherClass,
  updateTeacherClass
} from '../../services/classService';
import { createAssignments } from '../../services/assignmentService';
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
  key: string;            // uid for derived students, manual id otherwise
  name: string;
  avatar?: string;
  groupNames: string[];   // empty for manual students
  manual: boolean;
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

  const [groupStats, setGroupStats] = useState<GroupStats[]>([]);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<CollaborationWorkspace[] | null>(null);
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

  // ---- Groups + roster (one-shot, with manual refresh) ----------------------

  const workspaceIdsKey = (teacherClass?.workspaceIds || []).slice().sort().join(',');
  const manualStudentsKey = (teacherClass?.manualStudents || []).map(s => `${s.id}:${s.name}`).join(',');

  useEffect(() => {
    if (!uid || !teacherClass) {
      setGroupStats([]);
      setRoster([]);
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
          .map(snap => access.normalizeWorkspace(snap.id, snap.data()!));

        // Screenplay rollups per group (chunked by Firestore `in` limit).
        const counts: Record<string, { total: number; submitted: number }> = {};
        const ids = workspaces.map(w => w.id);
        for (let i = 0; i < ids.length; i += 10) {
          const chunk = ids.slice(i, i + 10);
          const snap = await getDocs(query(collection(db, 'screenplays'), where('workspaceId', 'in', chunk)));
          snap.docs.forEach(d => {
            const data = access.normalizeScreenplay(d.id, d.data());
            if (!data.workspaceId) return;
            const entry = counts[data.workspaceId] || { total: 0, submitted: 0 };
            entry.total += 1;
            if (access.getReviewStatus(data) === 'submitted') entry.submitted += 1;
            counts[data.workspaceId] = entry;
          });
        }

        // Roster: union of group members (minus the teacher), resolved by
        // crewProfile DOCUMENT ID (doc id == uid; profiles may omit a uid field).
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
        const derived: RosterEntry[] = await Promise.all(
          Array.from(groupNamesByUid.entries()).map(async ([studentUid, groupNames]) => {
            let name = `Crew Member ${studentUid.slice(-4)}`;
            let avatar = '';
            try {
              const snap = await getDoc(doc(db, 'crewProfiles', studentUid));
              if (snap.exists()) {
                const data: any = snap.data();
                name = data.name || data.displayName || name;
                avatar = data.profileImageUrl || data.avatarUrl || '';
              }
            } catch {
              // Fallback name is fine.
            }
            return { key: studentUid, name, avatar, groupNames, manual: false };
          })
        );
        const manual: RosterEntry[] = (teacherClass.manualStudents || []).map(student => ({
          key: student.id,
          name: student.name,
          groupNames: [],
          manual: true
        }));
        const fullRoster = [...derived, ...manual].sort((a, b) => a.name.localeCompare(b.name));

        if (cancelled) return;
        setGroupStats(workspaces
          .map(workspace => ({
            workspace,
            screenplayCount: counts[workspace.id]?.total || 0,
            awaitingReview: counts[workspace.id]?.submitted || 0
          }))
          .sort((a, b) => a.workspace.name.localeCompare(b.workspace.name)));
        setRoster(fullRoster);
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
  }, [uid, workspaceIdsKey, manualStudentsKey, reloadNonce]);

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
    const next = Array.from(new Set([...(teacherClass.workspaceIds || []), ...toAdd]));
    await persist({ workspaceIds: next }, 'collaboration.classes.updateFailed');
    setPickedGroupIds({});
    setShowGroupPicker(false);
  };

  const handleRemoveGroup = async (workspaceId: string) => {
    if (!teacherClass) return;
    await persist(
      { workspaceIds: (teacherClass.workspaceIds || []).filter(id => id !== workspaceId) },
      'collaboration.classes.updateFailed'
    );
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
    const student: ManualStudent = { id: newLocalId('manual'), name };
    await persist(
      { manualStudents: [...(teacherClass.manualStudents || []), student] },
      'collaboration.classes.updateFailed'
    );
    setNewStudentName('');
  };

  const handleRemoveManualStudent = async (studentId: string) => {
    if (!teacherClass) return;
    const nextChecks = { ...(teacherClass.studentChecks || {}) };
    delete nextChecks[studentId];
    await persist({
      manualStudents: (teacherClass.manualStudents || []).filter(s => s.id !== studentId),
      studentChecks: nextChecks
    }, 'collaboration.classes.updateFailed');
  };

  const handleToggleStudent = async (key: string) => {
    if (!teacherClass) return;
    const next = { ...(teacherClass.studentChecks || {}) };
    next[key] = !next[key];
    await persist({ studentChecks: next }, 'collaboration.classes.updateFailed');
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
                      <label key={group.id} className="assignment-target-option">
                        <input
                          type="checkbox"
                          checked={Boolean(pickedGroupIds[group.id])}
                          onChange={e => setPickedGroupIds(prev => ({ ...prev, [group.id]: e.target.checked }))}
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
                  <li key={workspace.id} className="assignment-row">
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
                        onClick={() => handleRemoveGroup(workspace.id)}
                        title={t('collaboration.classes.removeFromClassHint')}
                      >
                        {t('collaboration.classes.removeFromClass')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

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
              roster.map(entry => (
                <div className="member-row" key={entry.key}>
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
                    {entry.groupNames.length > 0 ? (
                      entry.groupNames.map(name => (
                        <span key={name} className="member-role">{name}</span>
                      ))
                    ) : (
                      <span className="member-role" style={{ background: '#fef9c3', color: '#854d0e' }}>
                        {t('collaboration.classes.noGroup')}
                      </span>
                    )}
                    {entry.manual && (
                      <button
                        type="button"
                        className="btn-text-link"
                        onClick={() => handleRemoveManualStudent(entry.key)}
                      >
                        {t('collaboration.classes.removeStudent')}
                      </button>
                    )}
                  </span>
                </div>
              ))
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
    </div>
  );
};

export default ClassDetailPage;
