import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  describeFountainScenes,
  formatPageEighths
} from '../../utilities/fountain';
import {
  deleteScene,
  estimateScenePageEighths,
  parseSlugText,
  reconcileFountainScenes,
  sceneForPosition,
  sceneHeading,
  sceneOrderKey,
  INT_EXT_OPTIONS,
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
  category?: string;
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
  /** Mirrors the viewer's annotation/tag moderation gate (supervisor-aware). */
  canModerateScene: (scene: SceneMark) => boolean;
  onJumpToPage: (pageNumber: number) => void;
  onJumpToFountainLine: (lineIndex: number) => void;
  onOpenNote: (note: SceneNoteItem) => void;
  documentPageCount?: number | null;
  /** Fired after a successful delete so the viewer can log the activity. */
  onSceneDeleted?: () => void;
}

const ScenesPanel: React.FC<ScenesPanelProps> = ({
  isFountain,
  fountainSource,
  scenes,
  notes,
  currentUserUid,
  canModerateScene,
  onJumpToPage,
  onJumpToFountainLine,
  onOpenNote,
  documentPageCount,
  onSceneDeleted
}) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    sceneNumber: '',
    intExt: '' as SceneIntExt,
    location: '',
    timeOfDay: '',
    synopsis: '',
    note: '',
    scriptDay: '',
    unit: '',
    sequence: '',
    estimatedTime: ''
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // One row shape for both formats (Fountain rows parse their slug text).
  const rows: SceneRow[] = useMemo(() => {
    if (isFountain) {
      if (!fountainSource) return [];
      const descriptors = describeFountainScenes(fountainSource);
      const matches = reconcileFountainScenes(
        scenes.filter(scene => scene.sourceType === 'fountain'),
        descriptors
      );
      return matches.map(({ descriptor, scene }) => {
          const parsed = parseSlugText(descriptor.heading);
          return {
            key: scene?.id || `line-${descriptor.lineIndex}`,
            page: descriptor.page,
            number: scene?.sceneNumber || String(descriptor.ordinal + 1),
            intExt: parsed.intExt,
            location: parsed.location || descriptor.heading,
            timeOfDay: parsed.timeOfDay,
            heading: descriptor.heading,
            scene,
            lineIndex: descriptor.lineIndex
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
      heading: sceneHeading(scene),
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
      (row.scene?.synopsis || '').toLowerCase().includes(needle) ||
      (row.scene?.scriptDay || '').toLowerCase().includes(needle) ||
      (row.scene?.unit || '').toLowerCase().includes(needle) ||
      (row.scene?.sequence || '').toLowerCase().includes(needle) ||
      (row.scene?.estimatedTime || '').toLowerCase().includes(needle)
    );
  }, [rows, filter]);

  // PDF: each scene owns the notes from its anchor up to the next scene's anchor.
  const { notesByScene, frontMatterNotes } = useMemo(() => {
    const byScene = new Map<string, SceneNoteItem[]>();
    const front: SceneNoteItem[] = [];
    if (scenes.length === 0) return { notesByScene: byScene, frontMatterNotes: front };
    // Sorted so each bucket lists its notes in document order (same key as scenes).
    const sortedNotes = [...notes].sort((a, b) =>
      sceneOrderKey({ pageNumber: a.pageNumber, position: { y: a.positionY } as any })
      - sceneOrderKey({ pageNumber: b.pageNumber, position: { y: b.positionY } as any })
    );
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

  // filteredRows ⊆ rows, so one lookup over the full list suffices.
  const selectedRow = rows.find(row => row.key === selectedKey) || null;
  const selectedScene = selectedRow?.scene || null;
  const selectedNotes = selectedScene ? (notesByScene.get(selectedScene.id) || []) : [];
  const selectedAnnotations = useMemo(
    () => selectedNotes.filter(note => note.kind === 'annotation'),
    [selectedNotes]
  );
  const selectedTags = useMemo(
    () => selectedNotes.filter(note => note.kind === 'tag'),
    [selectedNotes]
  );
  const allTags = useMemo(
    () => notes.filter(note => note.kind === 'tag'),
    [notes]
  );

  const categoryRows = useMemo(() => {
    const counts = new Map<string, { scene: number; all: number }>();
    allTags.forEach(tag => {
      if (!tag.category) return;
      const count = counts.get(tag.category) || { scene: 0, all: 0 };
      count.all += 1;
      counts.set(tag.category, count);
    });
    selectedTags.forEach(tag => {
      if (!tag.category) return;
      const count = counts.get(tag.category) || { scene: 0, all: 0 };
      count.scene += 1;
      counts.set(tag.category, count);
    });
    return Array.from(counts.entries())
      .map(([category, count]) => ({ category, ...count }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [allTags, selectedTags]);

  const activeCategory = selectedCategory && categoryRows.some(row => row.category === selectedCategory)
    ? selectedCategory
    : null;
  const tagsInScene = activeCategory
    ? selectedTags.filter(tag => tag.category === activeCategory)
    : selectedTags;
  const tagsAcrossScreenplay = activeCategory
    ? allTags.filter(tag => tag.category === activeCategory)
    : allTags;

  // Same gate as annotation/tag delete buttons: author, or the viewer's
  // supervisor-aware moderation capability (rules enforce the same server-side).
  const canDeleteScene = (scene: SceneMark): boolean =>
    Boolean(currentUserUid && (scene.userId === currentUserUid || canModerateScene(scene)));

  const handleRowClick = (row: SceneRow) => {
    setSelectedKey(row.key);
    setSelectedCategory(null);
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
      note: selectedScene.note,
      scriptDay: selectedScene.scriptDay,
      unit: selectedScene.unit,
      sequence: selectedScene.sequence,
      estimatedTime: selectedScene.estimatedTime
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
        note: editFields.note.trim(),
        scriptDay: editFields.scriptDay.trim(),
        unit: editFields.unit.trim(),
        sequence: editFields.sequence.trim(),
        estimatedTime: editFields.estimatedTime.trim()
      }, selectedScene.sceneNumberAuto === true &&
        editFields.sceneNumber.trim() === selectedScene.sceneNumber);
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
      onSceneDeleted?.();
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

  const renderBreakdownTag = (note: SceneNoteItem, showCategory: boolean) => (
    <button
      key={`breakdown-${note.id}`}
      type="button"
      onClick={() => onOpenNote(note)}
      style={{
        display: 'grid',
        gridTemplateColumns: '8px minmax(0, 1fr)',
        columnGap: 6,
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        padding: '4px 2px',
        cursor: 'pointer',
        color: note.resolved ? '#94a3b8' : '#334155',
        fontSize: '0.76em'
      }}
      title={t('screenplay.scenes.openNote', { user: note.userName })}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          marginTop: 3,
          background: note.color || '#b45309'
        }}
      />
      <span style={{ minWidth: 0 }}>
        <span style={{
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textDecoration: note.resolved ? 'line-through' : 'none',
          fontWeight: 600
        }}>
          {note.label}
        </span>
        <span style={{ display: 'flex', gap: 4, color: '#94a3b8', fontSize: '0.9em' }}>
          {showCategory && note.category && (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {t(`screenplay.categories.${note.category}`, { defaultValue: note.category })}
            </span>
          )}
          <span style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>p.{note.pageNumber}</span>
        </span>
      </span>
    </button>
  );

  const sceneCount = rows.length;
  const selectedPageEighths = selectedScene
    ? estimateScenePageEighths(scenes, selectedScene, documentPageCount)
    : null;

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
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))',
                      gap: 5,
                      marginTop: 8
                    }}
                  >
                    {[
                      [t('screenplay.scenes.scriptDay'), selectedScene.scriptDay],
                      [t('screenplay.scenes.unit'), selectedScene.unit],
                      [t('screenplay.scenes.sequence'), selectedScene.sequence],
                      [t('screenplay.scenes.estimatedTime'), selectedScene.estimatedTime],
                      [t('screenplay.scenes.pageEighths'), selectedPageEighths ? formatPageEighths(selectedPageEighths) : '']
                    ].map(([label, value]) => (
                      <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 6px' }}>
                        <div style={{ color: '#64748b', fontSize: '0.66em', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
                        <div style={{ color: value ? '#1e293b' : '#94a3b8', fontSize: '0.8em', fontWeight: 600 }}>{value || '—'}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <div style={{ color: '#64748b', fontSize: '0.75em', fontWeight: 700, textTransform: 'uppercase' }}>
                      {t('screenplay.scenes.annotationsInScene', { count: selectedAnnotations.length })}
                    </div>
                    {selectedAnnotations.length === 0 ? (
                      <div style={{ color: '#94a3b8', fontSize: '0.8em', padding: '2px 0' }}>
                        {t('screenplay.scenes.noAnnotations')}
                      </div>
                    ) : (
                      selectedAnnotations.map(renderNoteRow)
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(92px, 0.8fr) repeat(2, minmax(0, 1.25fr))',
                      marginTop: 8,
                      border: '1px solid #e2e8f0',
                      borderRadius: 7,
                      overflow: 'hidden',
                      background: '#fff'
                    }}
                  >
                    <div style={{ minWidth: 0, borderRight: '1px solid #e2e8f0' }}>
                      <div style={{ padding: '5px 6px', background: '#f1f5f9', color: '#475569', fontSize: '0.68em', fontWeight: 700, textTransform: 'uppercase' }}>
                        {t('screenplay.scenes.categoriesPane')}
                      </div>
                      <div style={{ maxHeight: 170, overflowY: 'auto', padding: 3 }}>
                        <button
                          type="button"
                          aria-pressed={activeCategory === null}
                          onClick={() => setSelectedCategory(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            width: '100%',
                            border: 'none',
                            borderRadius: 4,
                            padding: '4px 5px',
                            background: activeCategory === null ? '#e0e7ff' : 'transparent',
                            color: activeCategory === null ? '#3730a3' : '#475569',
                            cursor: 'pointer',
                            fontSize: '0.72em',
                            textAlign: 'left'
                          }}
                        >
                          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {t('screenplay.scenes.allCategories')}
                          </span>
                          <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>{selectedTags.length}/{allTags.length}</span>
                        </button>
                        {categoryRows.map(row => (
                          <button
                            key={row.category}
                            type="button"
                            aria-pressed={activeCategory === row.category}
                            onClick={() => setSelectedCategory(row.category)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              width: '100%',
                              border: 'none',
                              borderRadius: 4,
                              padding: '4px 5px',
                              background: activeCategory === row.category ? '#e0e7ff' : 'transparent',
                              color: row.scene > 0 ? (activeCategory === row.category ? '#3730a3' : '#475569') : '#94a3b8',
                              cursor: 'pointer',
                              fontSize: '0.72em',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {t(`screenplay.categories.${row.category}`, { defaultValue: row.category })}
                            </span>
                            <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>{row.scene}/{row.all}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ minWidth: 0, borderRight: '1px solid #e2e8f0' }}>
                      <div style={{ padding: '5px 6px', background: '#f1f5f9', color: '#475569', fontSize: '0.68em', fontWeight: 700, textTransform: 'uppercase' }}>
                        {t('screenplay.scenes.tagsInScenePane', { count: tagsInScene.length })}
                      </div>
                      <div style={{ maxHeight: 170, overflowY: 'auto', padding: 3 }}>
                        {tagsInScene.length === 0 ? (
                          <div style={{ color: '#94a3b8', fontSize: '0.72em', padding: 5 }}>
                            {t('screenplay.scenes.noTagsInScene')}
                          </div>
                        ) : (
                          tagsInScene.map(tag => renderBreakdownTag(tag, activeCategory === null))
                        )}
                      </div>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ padding: '5px 6px', background: '#f1f5f9', color: '#475569', fontSize: '0.68em', fontWeight: 700, textTransform: 'uppercase' }}>
                        {t('screenplay.scenes.allTagsPane', { count: tagsAcrossScreenplay.length })}
                      </div>
                      <div style={{ maxHeight: 170, overflowY: 'auto', padding: 3 }}>
                        {tagsAcrossScreenplay.length === 0 ? (
                          <div style={{ color: '#94a3b8', fontSize: '0.72em', padding: 5 }}>
                            {t('screenplay.scenes.noTags')}
                          </div>
                        ) : (
                          tagsAcrossScreenplay.map(tag => renderBreakdownTag(tag, activeCategory === null))
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', color: '#1e293b' }}
                    >
                      ✎ {t('screenplay.scenes.edit')}
                    </button>
                    {!isFountain && canDeleteScene(selectedScene) && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', color: 'var(--error-500)' }}
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
                      disabled={isFountain}
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
                      disabled={isFountain}
                      maxLength={40}
                      placeholder={t('screenplay.scenes.timeOfDay')}
                      onChange={e => setEditFields(prev => ({ ...prev, timeOfDay: e.target.value }))}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>
                  <input
                    type="text"
                    value={editFields.location}
                    disabled={isFountain}
                    maxLength={120}
                    placeholder={t('screenplay.scenes.location')}
                    onChange={e => setEditFields(prev => ({ ...prev, location: e.target.value }))}
                    style={inputStyle}
                  />
                  {isFountain && (
                    <div style={{ color: '#64748b', fontSize: '0.74em' }}>
                      {t('screenplay.scenes.fountainHeadingHint')}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6 }}>
                    <input
                      type="text"
                      value={editFields.scriptDay}
                      maxLength={40}
                      placeholder={t('screenplay.scenes.scriptDay')}
                      onChange={e => setEditFields(prev => ({ ...prev, scriptDay: e.target.value }))}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      value={editFields.unit}
                      maxLength={40}
                      placeholder={t('screenplay.scenes.unit')}
                      onChange={e => setEditFields(prev => ({ ...prev, unit: e.target.value }))}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      value={editFields.sequence}
                      maxLength={80}
                      placeholder={t('screenplay.scenes.sequence')}
                      onChange={e => setEditFields(prev => ({ ...prev, sequence: e.target.value }))}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      value={editFields.estimatedTime}
                      maxLength={40}
                      placeholder={t('screenplay.scenes.estimatedTime')}
                      onChange={e => setEditFields(prev => ({ ...prev, estimatedTime: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
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
                      style={{ background: 'var(--primary-500)', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: savingEdit ? 'wait' : 'pointer' }}
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
