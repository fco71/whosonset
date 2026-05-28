import React, { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  ScreenplayElementType,
  applyElementType,
  computePageCount,
  detectLineType,
  nextElementType,
  prevElementType
} from '../../utilities/fountain';

interface FountainEditorProps {
  screenplay: { id: string; name: string; fountainSource?: string };
  onClose: () => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const SAVE_DEBOUNCE_MS = 1500;

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

const FountainEditor: React.FC<FountainEditorProps> = ({ screenplay, onClose }) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [source, setSource] = useState(screenplay.fountainSource || '');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [activeType, setActiveType] = useState<ScreenplayElementType>('action');

  const saveTimer = useRef<number | null>(null);
  const pendingCaret = useRef<number | null>(null);
  const latestSource = useRef(source);
  latestSource.current = source;

  const pageCount = computePageCount(source);

  // Load the freshest source once on mount (the list-level copy may be stale).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'screenplays', screenplay.id));
        if (cancelled || !snap.exists()) return;
        const data = snap.data();
        if (typeof data.fountainSource === 'string') {
          setSource(data.fountainSource);
        }
      } catch (err) {
        console.error('Failed to load fountain source:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenplay.id]);

  // Persist (debounced). Last write wins — no merge, no version (per product decision).
  const scheduleSave = useCallback((value: string) => {
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }
    setSaveStatus('saving');
    saveTimer.current = window.setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'screenplays', screenplay.id), {
          fountainSource: value,
          fountainUpdatedAt: serverTimestamp(),
          lastModified: serverTimestamp(),
          lastEditedBy: currentUser?.uid || null
        });
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to save fountain source:', err);
        setSaveStatus('error');
        toast.error(t('fountain.saveError'));
      }
    }, SAVE_DEBOUNCE_MS);
  }, [screenplay.id, currentUser?.uid, t]);

  // Flush any pending save on unmount.
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
        // Best-effort final write so closing immediately after typing doesn't lose work.
        updateDoc(doc(db, 'screenplays', screenplay.id), {
          fountainSource: latestSource.current,
          fountainUpdatedAt: serverTimestamp(),
          lastModified: serverTimestamp(),
          lastEditedBy: currentUser?.uid || null
        }).catch(err => console.error('Final fountain save failed:', err));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenplay.id]);

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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSource(value);
    scheduleSave(value);
    setActiveType(detectLineType(value, e.target.selectionStart));
  };

  const applyType = useCallback((type: ScreenplayElementType) => {
    const el = textareaRef.current;
    if (!el) return;
    const caret = el.selectionStart;
    const result = applyElementType(el.value, caret, type);
    pendingCaret.current = result.caret;
    setSource(result.source);
    scheduleSave(result.source);
    setActiveType(type);
  }, [scheduleSave]);

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

    // Alt/Option + letter -> direct element type. Alt+letter is free inside a focused
    // textarea once we preventDefault, so we "own" these while editing.
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      const match = TOOLBAR.find(item => item.key.toLowerCase() === e.key.toLowerCase());
      if (match) {
        e.preventDefault();
        applyType(match.type);
        return;
      }
    }
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={pageBadgeStyle} title={t('fountain.pageCountTooltip')}>
              {t('fountain.pageCount', { count: pageCount })}
            </span>
            <button type="button" onClick={onClose} style={closeBtnStyle} aria-label={t('fountain.close')}>×</button>
          </div>
        </div>

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

        {/* Editor body */}
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
  width: 'min(860px, 100%)',
  height: 'min(90vh, 100%)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 24px 60px rgba(2, 6, 23, 0.45)'
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
  border: 'none',
  outline: 'none',
  resize: 'none',
  padding: '24px clamp(24px, 8%, 96px)',
  fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
  fontSize: 15,
  lineHeight: 1.5,
  color: '#1e293b',
  background: '#ffffff'
};

export default FountainEditor;
