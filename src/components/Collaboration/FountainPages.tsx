import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { paginateElements, ScreenplayElementType } from '../../utilities/fountain';

interface FountainPagesProps {
  source: string;
  /** Forwarded so html2pdf can target the rendered pages for export. */
  innerRef?: React.Ref<HTMLDivElement>;
  /** Tighter margins / smaller gaps for the editor's side preview. */
  compact?: boolean;
  /**
   * Print layout for PDF export: white background, no grey gutter, one continuous flow
   * of elements (let html2pdf paginate physically), no on-screen page-number badges.
   */
  printMode?: boolean;
}

// Presentational, screenplay-formatted render of Fountain source. Groups elements into
// pages (per the line-count heuristic) and draws each as a white "sheet" with the page
// number in the top-right corner — the standard screenplay convention (page 1 unnumbered).
// Shared by FountainViewer (read), FountainEditor (live preview), and the PDF export.
const FountainPages: React.FC<FountainPagesProps> = ({ source, innerRef, compact, printMode }) => {
  const { t } = useTranslation();

  const elementsFlat = useMemo(() => paginateElements(source), [source]);

  const pages = useMemo(() => {
    const grouped = new Map<number, typeof elementsFlat>();
    elementsFlat.forEach(element => {
      const list = grouped.get(element.page) || [];
      list.push(element);
      grouped.set(element.page, list);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  }, [elementsFlat]);

  // Print/export layout: one continuous white sheet; html2pdf paginates physically.
  if (printMode) {
    return (
      <div ref={innerRef} style={printSheetStyle}>
        {elementsFlat.map((element, index) => (
          <div key={index} style={elementStyle(element.type)}>{element.text}</div>
        ))}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div ref={innerRef} style={stackStyle(compact)}>
        <div style={pageSheetStyle(compact)}>
          <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>{t('fountain.emptyDraft')}</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={innerRef} style={stackStyle(compact)}>
      {pages.map(([pageNumber, elements]) => (
        <div key={pageNumber} style={pageSheetStyle(compact)} data-page={pageNumber} className="fountain-page-sheet">
          {/* Screenplay page number: top-right, "N." — omitted on page 1 by convention. */}
          {pageNumber > 1 && <div style={pageNumberStyle}>{pageNumber}.</div>}
          {elements.map((element, index) => (
            <div key={index} style={elementStyle(element.type)}>{element.text}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

function stackStyle(compact?: boolean): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: compact ? 16 : 28,
    padding: compact ? 12 : 20,
    background: '#e5e7eb',
    minHeight: '100%'
  };
}

function pageSheetStyle(compact?: boolean): React.CSSProperties {
  return {
    position: 'relative',
    background: '#ffffff',
    width: '100%',
    maxWidth: 680,
    margin: '0 auto',
    boxShadow: '0 8px 22px rgba(15, 23, 42, 0.16)',
    padding: compact ? '48px 56px' : '64px clamp(48px, 9%, 96px)',
    fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
    fontSize: 15,
    lineHeight: 1.5,
    color: '#1e293b',
    boxSizing: 'border-box'
  };
}

const pageNumberStyle: React.CSSProperties = {
  position: 'absolute',
  top: 24,
  right: 32,
  fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
  fontSize: 14,
  color: '#1e293b'
};

// Continuous white sheet for PDF export. 1in margins at 96dpi ≈ 96px.
const printSheetStyle: React.CSSProperties = {
  background: '#ffffff',
  color: '#000000',
  padding: '96px',
  width: '816px', // US Letter width at 96dpi
  boxSizing: 'border-box',
  fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
  fontSize: 15,
  lineHeight: 1.5
};

// Approximate standard screenplay margins.
function elementStyle(type: ScreenplayElementType): React.CSSProperties {
  switch (type) {
    case 'scene_heading':
      return { fontWeight: 700, textTransform: 'uppercase', margin: '1.5em 0 0.5em' };
    case 'character':
      return { textTransform: 'uppercase', marginLeft: '38%', marginTop: '1em' };
    case 'parenthetical':
      return { marginLeft: '30%', fontStyle: 'italic', color: '#475569' };
    case 'dialogue':
      return { marginLeft: '20%', marginRight: '20%' };
    case 'transition':
      return { textTransform: 'uppercase', textAlign: 'right', margin: '1em 0' };
    case 'action':
    default:
      return { margin: '0.75em 0', whiteSpace: 'pre-wrap' };
  }
}

export default FountainPages;
