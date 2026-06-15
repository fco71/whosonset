import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { listRevisions, ScreenplayRevision } from '../../services/screenplayRevisions';

interface FountainRevisionHistoryProps {
  screenplayId: string;
  // Called with the chosen version's source. The editor is responsible for snapshotting
  // the current (pre-restore) state first so the restore is itself reversible.
  onRestore: (source: string) => void;
  onClose: () => void;
}

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  const v = value as { toDate?: () => Date; seconds?: number };
  if (typeof v.toDate === 'function') return v.toDate();
  if (typeof v.seconds === 'number') return new Date(v.seconds * 1000);
  return null;
};

/**
 * Version History panel for a Fountain screenplay. Lists the archived revisions (from the
 * screenplayRevisions ring), lets the user PREVIEW a version's content, and restore it.
 * The restore is gated behind an explicit confirm and the editor backs up the current
 * content first — so restoring a less-advanced version can itself be undone.
 */
const FountainRevisionHistory: React.FC<FountainRevisionHistoryProps> = ({ screenplayId, onRestore, onClose }) => {
  const { t } = useTranslation();
  const [revisions, setRevisions] = useState<ScreenplayRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const revs = await listRevisions(screenplayId);
        if (cancelled) return;
        setRevisions(revs);
        setSelectedId(revs[0]?.id ?? null);
      } catch (err) {
        console.error('Failed to load screenplay revisions:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [screenplayId]);

  const selected = revisions.find(r => r.id === selectedId) || null;

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
  };
  const modal: React.CSSProperties = {
    background: '#fff', color: '#111', borderRadius: 10, width: 'min(900px, 96vw)',
    maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden'
  };

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-label={t('fountain.revisions.title')}>
      <div style={modal}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>{t('fountain.revisions.title')}</h3>
          <button onClick={onClose} aria-label={t('common.close')} style={{ border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {loading ? (
          <p style={{ padding: 24, textAlign: 'center', color: '#666' }}>{t('fountain.revisions.loading')}</p>
        ) : revisions.length === 0 ? (
          <p style={{ padding: 24, textAlign: 'center', color: '#666' }}>{t('fountain.revisions.empty')}</p>
        ) : (
          <div style={{ display: 'flex', minHeight: 0, flex: 1 }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 8, width: 260, borderRight: '1px solid #eee', overflowY: 'auto' }}>
              {revisions.map(rev => {
                const d = toDate(rev.createdAt);
                const isShrink = rev.reason === 'shrink_guard';
                return (
                  <li key={rev.id} style={{ marginBottom: 4 }}>
                    <button
                      onClick={() => { setSelectedId(rev.id); setConfirming(false); }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                        border: '1px solid ' + (rev.id === selectedId ? '#2563eb' : 'transparent'),
                        background: rev.id === selectedId ? '#eff6ff' : 'transparent'
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{d ? d.toLocaleString() : '—'}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {t('fountain.revisions.pages', { count: rev.pageCount })}
                        {rev.authorName ? ` · ${rev.authorName}` : ''}
                      </div>
                      {isShrink && (
                        <div style={{ fontSize: 11, color: 'var(--warning-700)', marginTop: 2 }}>⚠ {t('fountain.revisions.reasonShrink')}</div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <pre style={{ flex: 1, margin: 0, padding: 16, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'Courier, monospace', fontSize: 13, background: '#fafafa' }}>
                {selected?.source || ''}
              </pre>
              <div style={{ padding: 14, borderTop: '1px solid #eee' }}>
                {confirming ? (
                  <div>
                    <p style={{ margin: '0 0 10px', color: 'var(--warning-700)', fontSize: 13 }}>{t('fountain.revisions.confirmRestore')}</p>
                    <button
                      onClick={() => selected && onRestore(selected.source)}
                      style={{ background: 'var(--primary-600)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', marginRight: 8 }}
                    >
                      {t('fountain.revisions.confirmYes')}
                    </button>
                    <button onClick={() => setConfirming(false)} style={{ border: '1px solid #ccc', background: '#fff', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>
                      {t('common.cancel')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(true)}
                    disabled={!selected}
                    style={{ background: 'var(--primary-600)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
                  >
                    {t('fountain.revisions.restore')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FountainRevisionHistory;
