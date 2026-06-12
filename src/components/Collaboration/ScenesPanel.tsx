import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { paginateElements } from '../../utilities/fountain';
import {
  deleteScene,
  parseSlugText,
  sceneForPosition,
  SceneIntExt,
  SceneMark,
  updateScene
} from '../../services/sceneService';

// Final-Draft-style scene navigator for ScreenplayViewer: a filterable table
// (Page | # | I/E | Location), and a detail pane for the selected scene with the
// full heading, synopsis/note, the notes inside the scene (tags keep their
// category color), and author editing. PDFs use user-marked scenes
// (screenplayScenes docs anchored like annotations); Fountain screenplays derive
// rows straight from the source's slug lines.

export interface SceneNoteItem {
  id: string;
  kind: 'annotation' | 'tag';
  label: string;
  userName: string;
  pageNumber: number;
  positionY: number;
  resolved?: boolean;
  color?: string;
}

interface SceneRow {
  key: string;
  page: number;
  number: string;
  intExt: string;
  location: string;
  timeOfDay: string;
  heading: string;
  scene?: SceneMark;      // PDF-marked scenes only
  lineIndex?: number;     // Fountain rows only
}

interface ScenesPanelProps {
  isFountain: boolean;
  fountainSource: string;
  scenes: SceneMark[];
  notes: SceneNoteItem[];
  currentUserUid?: string | null;
  /** Uploader may also delete scene marks (rules: moderation model). */
  screenplayUploadedBy?: string | null;
  onJumpToPage: (pageNumber: number) => void;
  onJumpToFountainLine: (lineIndex: number) => void;
  onOpenNote: (note: SceneNoteItem) => void;
}

const INT_EXT_OPTIONS: SceneIntExt[] = ['', 'INT', 'EXT', 'INT/EXT'];

const ScenesPanel: React.FC<ScenesPanelProps> = ({
  isFountain,
  fountainSource,
  scenes,
  notes,
  currentUserUid,
  screenplayUploadedBy,
  onJumpToPage,
  onJumpToFountainLine,
  onOpenNote
}) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    sceneNumber: '',
    intExt: '' as SceneIntExt,
    location: '',
    timeOfDay: '',
    synopsis: '',
    note: ''
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // One row shape for both formats (Fountain rows parse their slug text).
  const rows: SceneRow[] = useMemo(() => {
    if (isFountain) {
      if (!fountainSource) return [];
      return paginateElements(fountainSource)
        .filter(element => element.type === 'scene_heading')
        .map((element, index) => {
          const parsed = parseSlugText(element.text);
          return {
            key: `line-${element.lineIndex}`,
            page: element.page,
            number: String(index + 1),
            intExt: parsed.intExt,
            location: parsed.location || element.text,
            timeOfDay: parsed.timeOfDay,
            heading: element.text,
            lineIndex: element.lineIndex
          };
        });
    }
    return scenes.map(scene => ({
      key: scene.id,
      page: scene.pageNumber,
      number: scene.sceneNumber,
      intExt: scene.intExt,
      location: scene.location || scene.selection,
      timeOfDay: scene.timeOfDay,
      heading: [
        scene.intExt ? `${scene.intExt}.` : '',
        scene.location,
        scene.timeOfDay ? `- ${scene.timeOfDay}` : ''
      ].filter(Boolean).join(' ') || scene.selection,
      scene
    }));
  }, [isFountain, fountainSource, scenes]);

  const filteredRows = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(row =>
      row.location.toLowerCase().includes(needle) ||
      row.number.toLowerCase().includes(needle) ||
      row.intExt.toLowerCase().includes(needle) ||
      row.timeOfDay.toLowerCase().includes(needle) ||
      (row.scene?.synopsis || '').toLowerCase().includes(needle)
    );
  }, [rows, filter]);

  // PDF: each scene owns the notes from its anchor up to the next scene's anchor.
  const { notesByScene, frontMatterNotes } = useMemo(() => {
    const sortedNotes = [...notes].sort((a, b) =>
      (a.pageNumber * 10000 + a.positionY * 1000) - (b.pageNumber * 10000 + b.positionY * 1000)
    );
    const byScene = new Map<string, SceneNoteItem[]>();
    const front: SceneNoteItem[] = [];
    if (scenes.length === 0) return { notesByScene: byScene, frontMatterNotes: front };
    sortedNotes.forEach(note => {
      const owner = sceneForPosition(scenes, note.pageNumber, note.positionY);
      if (!owner) {
        front.push(note);
        return;
      }
      const list = byScene.get(owner.id) || [];
      list.push(note);
      byScene.set(owner.id, list);
    });
    return { notesByScene: byScene, frontMatterNotes: front };
  }, [scenes, notes]);

  const selectedRow = filteredRows.find(row => row.key === selectedKey)
    || rows.find(row => row.key === selectedKey)
    || null;
  const selectedScene = selectedRow?.scene || null;
  const selectedNotes = selectedScene ? (notesByScene.get(selectedScene.id) || []) : [];

  const canDeleteScene = (scene: SceneMark): boolean =>
    Boolean(currentUserUid && (scene.userId === currentUserUid || screenplayUploadedBy === currentUserUid));

  const handleRowClick = (row: SceneRow) => {
    setSelectedKey(row.key);
    setEditing(false);
    if (row.lineIndex !== undefined) onJumpToFountainLine(row.lineIndex);
    else onJumpToPage(row.page);
  };

  const handleStartEdit = () => {
    if (!selectedScene) return;
    setEditFields({
      sceneNumber: selectedScene.sceneNumber,
      intExt: selectedScene.intExt,
      location: selectedScene.location,
      timeOfDay: selectedScene.timeOfDay,
      synopsis: selectedScene.synopsis,
      note: selectedScene.note
    });
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedScene) return;
    setSavingEdit(true);
    try {
      await updateScene(selectedScene.id, {
        sceneNumber: editFields.sceneNumber.trim(),
        intExt: editFields.intExt,
        location: editFields.location.trim(),
        timeOfDay: editFields.timeOfDay.trim(),
        synopsis: editFields.synopsis.trim(),
        note: editFields.note.trim()
      });
      toast.success(t('screenplay.scenes.updated'));
      setEditing(false);
    } catch (err) {
      console.error('Failed to update scene:', err);
      toast.error(t('screenplay.scenes.updateFailed'));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedScene) return;
    if (!window.confirm(t('screenplay.scenes.deleteConfirm'))) return;
    try {
      await deleteScene(selectedScene.id);
      toast.success(t('screenplay.scenes.deleted'));
      setSelectedKey(null);
      setEditing(false);
    } catch (err) {
      console.error('Failed to delete scene:', err);
      toast.error(t('screenplay.scenes.deleteFailed'));
    }
  };

  const inputStyle: React.CSSProperties = { border: '1px solid #d1d5db', borderRadius: 6, padding: 6, fontSize: 12, width: '100%', boxSizing: 'border-box' };
  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '4px 6px', color: '#64748b', fontWeight: 600, fontSize: '0.72em', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, background: '#f8fafc' };
  const tdStyle: React.CSSProperties = { padding: '4px 6px', fontSize: '0.82em', color: '#1e293b', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' };

  const renderNoteRow = (note: SceneNoteItem) => (
    <button
      key={`${note.kind}-${note.id}`}
      type="button"
      onClick={() => onOpenNote(note)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        padding: '3px 0',
        cursor: 'pointer',
        color: note.resolved ? '#94a3b8' : (note.kind === 'tag' ? (note.color || '#b45309') : '#334155'),
        fontSize: '0.82em'
      }}
      title={t('screenplay.scenes.openNote', { user: note.userName })}
    >
      <span aria-hidden="true">{note.kind === 'annotation' ? '💬' : '🏷️'}</span>
      <span style={{
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textDecoration: note.resolved ? 'line-through' : 'none',
        fontWeight: note.kind === 'tag' ? 600 : 400
      }}>
        {note.label}
      </span>
      <span style={{ marginLeft: 'auto', color: '#94a3b8', whiteSpace: 'nowrap' }}>p.{note.pageNumber}</span>
    </button>
  );

  const sceneCount = rows.length;

  return (
    <div className="scenes-section" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h4 style={{ margin: 0 }}>🎬 {t('screenplay.scenes.title')} ({sceneCount})</h4>
        <button
          type="button"
          onClick={() => setCollapsed(prev => !prev)}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }}
        >
          {collapsed ? '▸' : '▾'}
        </button>
      </div>

      {!collapsed && (
        <>
          {sceneCount === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.85em', margin: '6px 0' }}>
              {isFountain ? t('screenplay.scenes.fountainEmpty') : t('screenplay.scenes.empty')}
            </p>
          ) : (
            <>
              <input
                type="search"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder={t('screenplay.scenes.filterPlaceholder')}
                style={{ ...inputStyle, margin: '6px 0' }}
              />
              <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>{t('screenplay.scenes.pageCol')}</th>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>{t('screenplay.scenes.introCol')}</th>
                      <th style={{ ...thStyle, width: '100%' }}>{t('screenplay.scenes.locationCol')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map(row => {
                      const selected = selectedKey === row.key;
                      return (
                        <tr
                          key={row.key}
                          onClick={() => handleRowClick(row)}
                          style={{ cursor: 'pointer', background: selected ? '#e0e7ff' : 'transparent' }}
                          title={t('screenplay.scenes.jumpTo')}
                        >
                          <td style={tdStyle}>{row.page}</td>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{row.number}</td>
                          <td style={tdStyle}>{row.intExt}</td>
                          <td style={{ ...tdStyle, whiteSpace: 'normal', fontWeight: 600 }}>
                            {row.location}
                            {row.timeOfDay && (
                              <span style={{ color: '#94a3b8', fontWeight: 400 }}> · {row.timeOfDay}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!isFountain && frontMatterNotes.length > 0 && (
            <div style={{ marginTop: 6 }}>
              <div style={{ color: '#94a3b8', fontSize: '0.78em', fontWeight: 600 }}>
                {t('screenplay.scenes.beforeFirst')}
              </div>
              {frontMatterNotes.map(renderNoteRow)}
            </div>
          )}

          {/* Detail pane for the selected scene (Final Draft's bottom panel). */}
          {selectedRow && (
            <div style={{ marginTop: 8, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ color: '#64748b', fontSize: '0.75em', fontWeight: 700, textTransform: 'uppercase' }}>
                  {t('screenplay.scenes.headingLabel')}
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.9em', color: '#0f172a' }}>
                  {selectedRow.number ? `#${selectedRow.number} · ` : ''}{selectedRow.heading}
                </span>
                <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.8em' }}>p.{selectedRow.page}</span>
              </div>

              {selectedScene && !editing && (
                <>
                  {selectedScene.synopsis && (
                    <p style={{ margin: '6px 0 0', color: '#334155', fontSize: '0.84em' }}>
                      <strong>{t('screenplay.scenes.synopsis')}:</strong> {selectedScene.synopsis}
                    </p>
                  )}
                  {selectedScene.note && (
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82em', fontStyle: 'italic' }}>
                      {selectedScene.note}
                    </p>
                  )}
                  <div style={{ marginTop: 6 }}>
                    <div style={{ color: '#64748b', fontSize: '0.75em', fontWeight: 700, textTransform: 'uppercase' }}>
                      {t('screenplay.scenes.notesInScene', { count: selectedNotes.length })}
                    </div>
                    {selectedNotes.length === 0 ? (
                      <div style={{ color: '#94a3b8', fontSize: '0.8em', padding: '2px 0' }}>
                        {t('screenplay.scenes.noNotes')}
                      </div>
                    ) : (
                      selectedNotes.map(renderNoteRow)
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                    {selectedScene.userId === currentUserUid && (
                      <button
                        type="button"
                        onClick={handleStartEdit}
                        style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', color: '#1e293b' }}
                      >
                        ✎ {t('screenplay.scenes.edit')}
                      </button>
                    )}
                    {canDeleteScene(selectedScene) && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', color: '#ef4444' }}
                      >
                        × {t('screenplay.scenes.delete')}
                      </button>
                    )}
                  </div>
                </>
              )}

              {selectedScene && editing && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      value={editFields.sceneNumber}
                      maxLength={10}
                      placeholder={t('screenplay.scenes.numberShort')}
                      onChange={e => setEditFields(prev => ({ ...prev, sceneNumber: e.target.value }))}
                      style={{ ...inputStyle, width: 56 }}
                    />
                    <select
                      value={editFields.intExt}
                      onChange={e => setEditFields(prev => ({ ...prev, intExt: e.target.value as SceneIntExt }))}
                      style={{ ...inputStyle, width: 'auto' }}
                    >
                      {INT_EXT_OPTIONS.map(option => (
                        <option key={option || 'none'} value={option}>
                          {option || t('screenplay.scenes.intExtNone')}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editFields.timeOfDay}
                      maxLength={40}
                      placeholder={t('screenplay.scenes.timeOfDay')}
                      onChange={e => setEditFields(prev => ({ ...prev, timeOfDay: e.target.value }))}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>
                  <input
                    type="text"
                    value={editFields.location}
                    maxLength={120}
                    placeholder={t('screenplay.scenes.location')}
                    onChange={e => setEditFields(prev => ({ ...prev, location: e.target.value }))}
                    style={inputStyle}
                  />
                  <textarea
                    value={editFields.synopsis}
                    maxLength={1000}
                    rows={2}
                    placeholder={t('screenplay.scenes.synopsis')}
                    onChange={e => setEditFields(prev => ({ ...prev, synopsis: e.target.value }))}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                  <input
                    type="text"
                    value={editFields.note}
                    maxLength={300}
                    placeholder={t('screenplay.scenes.noteOptional')}
                    onChange={e => setEditFields(prev => ({ ...prev, note: e.target.value }))}
                    style={inputStyle}
                  />
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}
                    >
                      {t('screenplay.popup.cancel')}
                    </button>
                    <button
                      type="button"
                      disabled={savingEdit}
                      onClick={handleSaveEdit}
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: savingEdit ? 'wait' : 'pointer' }}
                    >
                      {t('screenplay.popup.save')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScenesPanel;
