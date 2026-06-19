import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { syncFountainScenes } from '../../services/sceneService';
import { shouldSnapshot, writeRevision, pruneRevisions } from '../../services/screenplayRevisions';
import FountainRevisionHistory from './FountainRevisionHistory';
import {
  ScreenplayElementType,
  applyElementType,
  computePageCount,
  computePageAtCaret,
  detectLineType,
  describeFountainScenes,
  nextElementType,
  prevElementType
} from '../../utilities/fountain';
import { exportElementToPdf } from '../../utilities/exportFountainPdf';
import FountainPages from './FountainPages';

interface FountainEditorProps {
  screenplay: { id: string; name: string; fountainSource?: string };
  projectId: string;
  onClose: () => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const SAVE_DEBOUNCE_MS = 2500;
// Scene reconciliation (reads all scene docs + writes changed ones) is the expensive part
// of a save, so throttle it well below the source-save cadence. The unmount flush always
// runs a final sync, so the latest scene state is never lost.
const SCENE_SYNC_MIN_INTERVAL_MS = 12000;

// Toolbar button order + the keyboard letter that triggers each (with Alt/Option).
const TOOLBAR: Array<{ type: ScreenplayElementType; labelKey: string; key: string }> = [
  { type: 'scene_heading', labelKey: 'fountain.elements.scene', key: 'S' },
  { type: 'action', labelKey: 'fountain.elements.action', key: 'A' },
  { type: 'character', labelKey: 'fountain.elements.character', key: 'C' },
  { type: 'parenthetical', labelKey: 'fountain.elements.parenthetical', key: 'P' },
  { type: 'dialogue', labelKey: 'fountain.elements.dialogue', key: 'D' },
  { type: 'transition', labelKey: 'fountain.elements.transition', key: 'T' }
];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const modLabel = isMac ? '⌥' : 'Alt+';

// Cap the typing column to a page-like character width (Courier is monospace, so `ch`
// ≈ one character). Keeps lines from running the full width of the pane — closer to a
// real screenplay page's text block than an infinite horizontal line.
const EDITOR_COLUMN_CH = 63;

const FountainEditor: React.FC<FountainEditorProps> = ({ screenplay, projectId, onClose }) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [source, setSource] = useState(screenplay.fountainSource || '');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [activeType, setActiveType] = useState<ScreenplayElementType>('action');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeSceneLine, setActiveSceneLine] = useState<number | null>(null);
  const [editorPanePct, setEditorPanePct] = useState(50); // width % of the editor pane when preview is shown
  const printRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);

  const saveTimer = useRef<number | null>(null);
  const pendingCaret = useRef<number | null>(null);
  const hasLocalEdit = useRef(false);
  const latestSource = useRef(source);
  latestSource.current = source;

  // Version-safety bookkeeping: the last successfully-saved source (the version a save
  // overwrites), when we last archived a revision, when scenes were last synced, and how
  // many revisions we've written this session (for periodic pruning).
  const lastSavedSource = useRef(screenplay.fountainSource || '');
  const lastSnapshotAt = useRef(0);
  const lastSceneSyncAt = useRef(0);
  const revisionCount = useRef(0);

  const pageCount = computePageCount(source);
  const sceneDescriptors = useMemo(() => describeFountainScenes(source), [source]);

  // Load the freshest source once on mount (the list-level copy may be stale).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'screenplays', screenplay.id));
        if (cancelled || !snap.exists()) return;
        const data = snap.data();
        if (typeof data.fountainSource === 'string' && !hasLocalEdit.current) {
          setSource(data.fountainSource);
          lastSavedSource.current = data.fountainSource;
          if (currentUser?.uid) {
            syncFountainScenes({
              screenplayId: screenplay.id,
              projectId,
              source: data.fountainSource,
              actor: {
                uid: currentUser.uid,
                displayName: currentUser.displayName
              }
            }).catch(err => console.error('Failed to backfill Fountain scenes:', err));
          }
        }
      } catch (err) {
        console.error('Failed to load fountain source:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenplay.id, projectId, currentUser?.uid, currentUser?.displayName]);

  // Persist (debounced). Last write wins — no merge, no version (per product decision).
  const scheduleSave = useCallback((value: string) => {
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }
    setSaveStatus('saving');
    saveTimer.current = window.setTimeout(async () => {
      try {
        const previous = lastSavedSource.current;
        await updateDoc(doc(db, 'screenplays', screenplay.id), {
          fountainSource: value,
          fountainUpdatedAt: serverTimestamp(),
          lastModified: serverTimestamp(),
          lastEditedBy: currentUser?.uid || null
        });
        lastSavedSource.current = value;
        setSaveStatus('saved');

        if (currentUser?.uid) {
          // Version safety: archive the just-overwritten source when warranted (a periodic
          // ~5-min checkpoint OR a suspicious large shrink), keeping a bounded ring so an
          // accidental delete-then-autosave is always recoverable. Best-effort.
          const now = Date.now();
          const decision = shouldSnapshot({
            previousSource: previous,
            newSource: value,
            lastSnapshotAt: lastSnapshotAt.current,
            now
          });
          if (decision.snapshot) {
            lastSnapshotAt.current = now;
            writeRevision({
              screenplayId: screenplay.id,
              source: previous,
              authorId: currentUser.uid,
              authorName: currentUser.displayName,
              reason: decision.reason
            }).then(() => {
              revisionCount.current += 1;
              if (revisionCount.current % 5 === 0) {
                return pruneRevisions(screenplay.id);
              }
              return undefined;
            }).catch(err => console.error('Failed to archive screenplay revision:', err));
          }

          // Scene reconciliation is throttled — it's the costly part of a save (reads all
          // scene docs + writes changed ones). The unmount flush runs a final sync.
          if (now - lastSceneSyncAt.current >= SCENE_SYNC_MIN_INTERVAL_MS) {
            lastSceneSyncAt.current = now;
            syncFountainScenes({
              screenplayId: screenplay.id,
              projectId,
              source: value,
              actor: {
                uid: currentUser.uid,
                displayName: currentUser.displayName
              }
            }).catch(err => console.error('Failed to synchronize Fountain scenes:', err));
          }
        }
      } catch (err) {
        console.error('Failed to save fountain source:', err);
        setSaveStatus('error');
        toast.error(t('fountain.saveError'));
      }
    }, SAVE_DEBOUNCE_MS);
  }, [screenplay.id, projectId, currentUser?.uid, currentUser?.displayName, t]);

  // Flush any pending save on unmount.
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
        // Best-effort final write so closing immediately after typing doesn't lose work.
        const finalSource = latestSource.current;
        updateDoc(doc(db, 'screenplays', screenplay.id), {
          fountainSource: latestSource.current,
          fountainUpdatedAt: serverTimestamp(),
          lastModified: serverTimestamp(),
          lastEditedBy: currentUser?.uid || null
        }).then(() => {
          if (!currentUser?.uid) return;
          return syncFountainScenes({
            screenplayId: screenplay.id,
            projectId,
            source: finalSource,
            actor: {
              uid: currentUser.uid,
              displayName: currentUser.displayName
            }
          });
        }).catch(err => console.error('Final fountain save failed:', err));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenplay.id, projectId, currentUser?.uid, currentUser?.displayName]);

  // Restore caret after a programmatic source change (toolbar / shortcut transforms).
  useEffect(() => {
    if (pendingCaret.current != null && textareaRef.current) {
      const pos = pendingCaret.current;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(pos, pos);
      pendingCaret.current = null;
    }
  }, [source]);

  const refreshActiveType = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    setActiveType(detectLineType(el.value, el.selectionStart));
    setCurrentPage(computePageAtCaret(el.value, el.selectionStart));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const caret = e.target.selectionStart;
    hasLocalEdit.current = true;
    setSource(value);
    scheduleSave(value);
    setActiveType(detectLineType(value, caret));
    setCurrentPage(computePageAtCaret(value, caret));
  };

  const applyType = useCallback((type: ScreenplayElementType) => {
    const el = textareaRef.current;
    if (!el) return;
    const caret = el.selectionStart;
    const result = applyElementType(el.value, caret, type);
    hasLocalEdit.current = true;
    pendingCaret.current = result.caret;
    setSource(result.source);
    scheduleSave(result.source);
    setActiveType(type);
    setCurrentPage(computePageAtCaret(result.source, result.caret));
  }, [scheduleSave]);

  // Draggable divider between the textarea and the preview. Updates the editor pane's
  // width % from the pointer position relative to the body container (clamped 20–80%).
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizingRef.current || !bodyRef.current) return;
      const rect = bodyRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setEditorPanePct(Math.max(20, Math.min(80, pct)));
    };
    const onUp = () => {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(printRef.current, screenplay.name);
    } catch (err) {
      console.error('PDF export failed:', err);
      toast.error(t('fountain.pdfError'));
    } finally {
      setExporting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;
    if (!el) return;

    // Tab / Shift+Tab cycle the current line's element type.
    if (e.key === 'Tab') {
      e.preventDefault();
      const current = detectLineType(el.value, el.selectionStart);
      applyType(e.shiftKey ? prevElementType(current) : nextElementType(current));
      return;
    }

    // Alt/Option + letter -> direct element type. NOTE: on macOS, Option+letter changes
    // e.key to a composed glyph (Option+S => "ß"), so we must match on e.code ("KeyS"),
    // which is layout/modifier independent. Alt+letter is free inside a focused textarea
    // once we preventDefault, so we "own" these while editing.
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      const match = TOOLBAR.find(item => `Key${item.key.toUpperCase()}` === e.code);
      if (match) {
        e.preventDefault();
        applyType(match.type);
        return;
      }
    }
  };

  const jumpToScene = (lineIndex: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const lines = source.split('\n');
    const start = lines.slice(0, lineIndex).reduce((offset, line) => offset + line.length + 1, 0);
    const end = start + (lines[lineIndex]?.length || 0);
    textarea.focus();
    textarea.setSelectionRange(start, end);
    // focus() + setSelectionRange alone often doesn't scroll the caret into view on the
    // first click (the "needs a double-click" bug). Scroll explicitly to the scene's line.
    requestAnimationFrame(() => {
      const frac = lines.length > 1 ? lineIndex / lines.length : 0;
      textarea.scrollTop = Math.max(0, frac * textarea.scrollHeight - textarea.clientHeight * 0.3);
    });
    setActiveType('scene_heading');
    setCurrentPage(computePageAtCaret(source, start));
  };

  // Restore a previous version. Backs up the CURRENT content first (so restoring a
  // less-advanced version is itself reversible), then writes the chosen source.
  const handleRestoreVersion = useCallback(async (restoredSource: string) => {
    if (!currentUser?.uid) return;
    setShowHistory(false);
    try {
      const current = latestSource.current;
      if (current && current !== restoredSource) {
        writeRevision({
          screenplayId: screenplay.id,
          source: current,
          authorId: currentUser.uid,
          authorName: currentUser.displayName,
          reason: 'pre_restore'
        }).catch(err => console.error('Failed to back up before restore:', err));
      }
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      setSaveStatus('saving');
      await updateDoc(doc(db, 'screenplays', screenplay.id), {
        fountainSource: restoredSource,
        fountainUpdatedAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        lastEditedBy: currentUser.uid
      });
      lastSavedSource.current = restoredSource;
      hasLocalEdit.current = true;
      setSource(restoredSource);
      setSaveStatus('saved');
      syncFountainScenes({
        screenplayId: screenplay.id,
        projectId,
        source: restoredSource,
        actor: { uid: currentUser.uid, displayName: currentUser.displayName }
      }).catch(err => console.error('Failed to sync scenes after restore:', err));
      toast.success(t('fountain.revisions.restored'));
    } catch (err) {
      console.error('Failed to restore revision:', err);
      setSaveStatus('error');
      toast.error(t('fountain.saveError'));
    }
  }, [screenplay.id, projectId, currentUser?.uid, currentUser?.displayName, t]);

  return (
    <div className="fountain-editor-overlay" style={overlayStyle}>
      <div className="fountain-editor" style={editorStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <strong style={{ fontSize: '1.05em', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {screenplay.name}
            </strong>
            <span style={saveBadgeStyle(saveStatus)}>
              {saveStatus === 'saving' && t('fountain.saving')}
              {saveStatus === 'saved' && t('fountain.saved')}
              {saveStatus === 'error' && t('fountain.saveErrorShort')}
              {saveStatus === 'idle' && ''}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={() => setShowPreview(p => !p)}
              style={ghostBtnStyle}
              title={t('fountain.togglePreview')}
            >
              {showPreview ? t('fountain.hidePreview') : t('fountain.showPreview')}
            </button>
            <button type="button" onClick={handleDownloadPdf} disabled={exporting} style={ghostBtnStyle}>
              {exporting ? t('fountain.pdfExporting') : `⬇ ${t('fountain.downloadPdf')}`}
            </button>
            <button type="button" onClick={() => setShowHistory(true)} style={ghostBtnStyle} title={t('fountain.revisions.title')}>
              🕘 {t('fountain.revisions.button')}
            </button>
            <span style={pageBadgeStyle} title={t('fountain.pageCountTooltip')}>
              {t('fountain.pageOf', { current: currentPage, total: pageCount })}
            </span>
            <button type="button" onClick={onClose} style={closeBtnStyle} aria-label={t('fountain.close')}>×</button>
          </div>
        </div>

        {showHistory && (
          <FountainRevisionHistory
            screenplayId={screenplay.id}
            onRestore={handleRestoreVersion}
            onClose={() => setShowHistory(false)}
          />
        )}

        {/* Format toolbar */}
        <div style={toolbarStyle}>
          {TOOLBAR.map(item => {
            const active = activeType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => applyType(item.type)}
                style={toolbarButtonStyle(active)}
                title={`${t(item.labelKey)} — ${item.type === 'scene_heading' ? '⇥ / ' : ''}${modLabel}${item.key}`}
              >
                <span style={{ fontWeight: 600 }}>{t(item.labelKey)}</span>
                <span style={{ fontSize: '0.7em', color: active ? 'rgba(255,255,255,0.85)' : '#94a3b8' }}>
                  {item.type === 'scene_heading' ? `⇥ ${modLabel}${item.key}` : `${modLabel}${item.key}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Editor body: textarea + (optional) live formatted preview, resizable divider */}
        <div style={bodyStyle} ref={bodyRef}>
          <nav style={sceneNavigatorStyle} aria-label={t('fountain.sceneNavigator')}>
            <div style={sceneNavigatorHeaderStyle}>
              {t('fountain.sceneNavigator')} ({sceneDescriptors.length})
            </div>
            <style>{`
              .mfj-scene-btn { background: transparent; transition: background 0.12s ease; }
              .mfj-scene-btn:hover { background: #eef2ff; }
              .mfj-scene-btn:active { background: #c7d2fe; }
              .mfj-scene-btn.is-active { background: #e0e7ff; box-shadow: inset 3px 0 0 #6366f1; }
            `}</style>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {sceneDescriptors.length === 0 ? (
                <div style={sceneNavigatorEmptyStyle}>{t('screenplay.scenes.fountainEmpty')}</div>
              ) : (
                sceneDescriptors.map(descriptor => (
                  <button
                    key={`${descriptor.lineIndex}-${descriptor.heading}`}
                    type="button"
                    className={`mfj-scene-btn${descriptor.lineIndex === activeSceneLine ? ' is-active' : ''}`}
                    onClick={() => { setActiveSceneLine(descriptor.lineIndex); jumpToScene(descriptor.lineIndex); }}
                    style={sceneNavigatorButtonStyle}
                    title={descriptor.heading}
                  >
                    <span style={sceneNavigatorNumberStyle}>{descriptor.ordinal + 1}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {descriptor.heading}
                    </span>
                    <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.82em' }}>
                      p.{descriptor.page}
                    </span>
                  </button>
                ))
              )}
            </div>
          </nav>
          <div
            style={{
              flex: '1 1 100%',
              minWidth: 0,
              // Window-switch: the editor stays mounted (keeps the textarea ref + cursor)
              // but hides while previewing — so the writing canvas is full-width when
              // writing and the preview is full-width when reviewing, never squeezed
              // side by side.
              display: showPreview ? 'none' : 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#ffffff',
              overflow: 'hidden'
            }}
          >
            <textarea
              ref={textareaRef}
              value={source}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onClick={refreshActiveType}
              onKeyUp={refreshActiveType}
              placeholder={t('fountain.placeholder')}
              spellCheck
              style={textareaStyle}
            />
          </div>
          {showPreview && (
            <div style={previewPaneStyle}>
              <FountainPages source={source} pageAccurate />
            </div>
          )}
        </div>

        {/* Offscreen print container targeted by html2pdf. */}
        <div style={offscreenStyle} aria-hidden="true">
          <FountainPages source={source} printMode innerRef={printRef} />
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.55)',
  zIndex: 2500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16
};

const editorStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 12,
  width: 'min(1200px, 100%)',
  height: 'min(92vh, 100%)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 24px 60px rgba(2, 6, 23, 0.45)'
};

const bodyStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  minHeight: 0
};

const sceneNavigatorStyle: React.CSSProperties = {
  flex: '0 0 210px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid #e2e8f0',
  background: '#f8fafc'
};

const sceneNavigatorHeaderStyle: React.CSSProperties = {
  padding: '9px 10px',
  borderBottom: '1px solid #e2e8f0',
  color: '#475569',
  fontSize: '0.75em',
  fontWeight: 700,
  textTransform: 'uppercase'
};

const sceneNavigatorEmptyStyle: React.CSSProperties = {
  padding: 10,
  color: '#94a3b8',
  fontSize: '0.76em',
  lineHeight: 1.4
};

const sceneNavigatorButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  width: '100%',
  border: 'none',
  borderBottom: '1px solid #eef2f7',
  padding: '7px 8px',
  color: '#334155',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
  fontSize: '0.72em'
};

const sceneNavigatorNumberStyle: React.CSSProperties = {
  flex: '0 0 auto',
  minWidth: 20,
  color: '#4338ca',
  fontWeight: 700
};

const previewPaneStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  overflow: 'auto', // scroll both axes: page-accurate sheets are a fixed width
  background: '#e5e7eb'
};

const dividerStyle: React.CSSProperties = {
  flex: '0 0 6px',
  cursor: 'col-resize',
  background: '#e2e8f0',
  borderLeft: '1px solid #cbd5e1',
  borderRight: '1px solid #cbd5e1'
};

const offscreenStyle: React.CSSProperties = {
  position: 'absolute',
  left: -10000,
  top: 0,
  width: 816,
  pointerEvents: 'none',
  opacity: 0
};

const ghostBtnStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  padding: '5px 10px',
  fontSize: '0.82em',
  fontWeight: 600,
  color: '#1e293b',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 18px',
  borderBottom: '1px solid #e2e8f0',
  gap: 12
};

const pageBadgeStyle: React.CSSProperties = {
  background: '#0f172a',
  color: '#fff',
  borderRadius: 999,
  padding: '3px 12px',
  fontSize: '0.85em',
  fontWeight: 700
};

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '1.8rem',
  lineHeight: 1,
  color: '#64748b',
  cursor: 'pointer'
};

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  padding: '10px 18px',
  borderBottom: '1px solid #eef2f7',
  flexWrap: 'wrap',
  background: '#f8fafc'
};

const toolbarButtonStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  minWidth: 78,
  padding: '6px 8px',
  borderRadius: 8,
  border: `1px solid ${active ? '#2563eb' : '#cbd5e1'}`,
  background: active ? '#2563eb' : '#ffffff',
  color: active ? '#ffffff' : '#1e293b',
  cursor: 'pointer',
  fontSize: '0.85em',
  transition: 'all 0.12s ease'
});

const saveBadgeStyle = (status: SaveStatus): React.CSSProperties => ({
  fontSize: '0.8em',
  color: status === 'error' ? '#b91c1c' : '#64748b',
  whiteSpace: 'nowrap'
});

const textareaStyle: React.CSSProperties = {
  flex: 1,
  width: '100%',
  // Page-like column width (≈ a screenplay text block) instead of full pane width.
  maxWidth: `${EDITOR_COLUMN_CH}ch`,
  border: 'none',
  outline: 'none',
  resize: 'none',
  padding: '24px 12px',
  fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
  fontSize: 15,
  lineHeight: 1.5,
  color: '#1e293b',
  background: '#ffffff'
};

export default FountainEditor;
