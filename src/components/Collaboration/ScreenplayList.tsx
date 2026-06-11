import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenplayReviewStatus } from '../../types/Collaboration';
import { getReviewStatus, Screenplay } from './workspaceAccess';

// Row list for screenplays, shared by the hub (personal + review queue) and the
// group page. Pure presentation: every capability decision and Firestore write is
// injected by the parent.

interface ScreenplayListProps {
  screenplays: Screenplay[];
  unresolvedCounts: Record<string, number>;
  unresolvedFromTeacherCounts: Record<string, number>;
  /** Renders a small label after the type (used when rows mix several groups). */
  workspaceLabel?: (workspaceId?: string | null) => string;
  canEdit: (screenplay: Screenplay) => boolean;
  canDelete: (screenplay: Screenplay) => boolean;
  canReview: (screenplay: Screenplay) => boolean;
  onView: (screenplay: Screenplay) => void;
  onEditFountain: (screenplay: Screenplay) => void;
  onDelete: (screenplay: Screenplay) => void;
  onReviewChange: (screenplay: Screenplay, status: ScreenplayReviewStatus) => void;
}

const ScreenplayList: React.FC<ScreenplayListProps> = ({
  screenplays,
  unresolvedCounts,
  unresolvedFromTeacherCounts,
  workspaceLabel,
  canEdit,
  canDelete,
  canReview,
  onView,
  onEditFountain,
  onDelete,
  onReviewChange
}) => {
  const { t } = useTranslation();

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {screenplays.map(screenplay => {
        const openCount = unresolvedCounts[screenplay.id] || 0;
        const teacherCount = unresolvedFromTeacherCounts[screenplay.id] || 0;
        const reviewStatus = getReviewStatus(screenplay);
        const editable = canEdit(screenplay);
        const canSubmitReview = editable && (reviewStatus === 'draft' || reviewStatus === 'changes_requested');
        const canReturnToDraft = editable && reviewStatus !== 'draft';
        const canTeacherReview = canReview(screenplay) && reviewStatus === 'submitted';
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
              {workspaceLabel && (
                <span style={{ color: '#666', fontSize: '0.85em' }}>{workspaceLabel(screenplay.workspaceId)}</span>
              )}
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
              {screenplay.format === 'fountain' && editable && (
                <button
                  className="btn-primary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.95em' }}
                  onClick={() => onEditFountain(screenplay)}
                >
                  ✍️ {t('fountain.write')}
                </button>
              )}
              <button
                className="btn-secondary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.95em' }}
                onClick={() => onView(screenplay)}
              >
                {t('collaboration.view')}
              </button>
              {canDelete(screenplay) && (
                <button
                  className="btn-danger"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.95em' }}
                  onClick={() => onDelete(screenplay)}
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
                    onClick={() => onReviewChange(screenplay, 'submitted')}
                  >
                    {t('collaboration.reviewStatus.actions.submit')}
                  </button>
                )}
                {canTeacherReview && (
                  <>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.85em' }}
                      onClick={() => onReviewChange(screenplay, 'changes_requested')}
                    >
                      {t('collaboration.reviewStatus.actions.requestChanges')}
                    </button>
                    <button
                      className="btn-primary"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.85em' }}
                      onClick={() => onReviewChange(screenplay, 'approved')}
                    >
                      {t('collaboration.reviewStatus.actions.approve')}
                    </button>
                  </>
                )}
                {canReturnToDraft && (
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.85em' }}
                    onClick={() => onReviewChange(screenplay, 'draft')}
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
};

export default ScreenplayList;
