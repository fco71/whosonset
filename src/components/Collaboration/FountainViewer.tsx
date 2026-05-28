import React, { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import {
  paginateElements,
  computePageCount,
  ScreenplayElementType
} from '../../utilities/fountain';

interface FountainViewerProps {
  screenplayId: string;
  initialSource?: string;
}

// Read-only formatted render of a Fountain screenplay. Subscribes to the doc so a reader
// sees the author's latest saved text live (last-write-wins; no multi-cursor). Used inside
// ScreenplayViewer for format === 'fountain' docs so supervisors/peers read + comment.
const FountainViewer: React.FC<FountainViewerProps> = ({ screenplayId, initialSource }) => {
  const { t } = useTranslation();
  const [source, setSource] = useState(initialSource || '');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'screenplays', screenplayId),
      snap => {
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.fountainSource === 'string') {
            setSource(data.fountainSource);
          }
        }
      },
      err => console.error('FountainViewer subscription error:', err)
    );
    return () => unsubscribe();
  }, [screenplayId]);

  const elements = useMemo(() => paginateElements(source), [source]);
  const pageCount = useMemo(() => computePageCount(source), [source]);

  return (
    <div style={pageWrapStyle}>
      <div style={topBarStyle}>
        <span style={pageBadgeStyle} title={t('fountain.pageCountTooltip')}>
          {t('fountain.pageCount', { count: pageCount })}
        </span>
      </div>
      <div style={pageStyle}>
        {elements.length === 0 ? (
          <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>{t('fountain.emptyDraft')}</div>
        ) : (
          elements.map((element, index) => {
            const prevPage = index > 0 ? elements[index - 1].page : 1;
            const showDivider = index > 0 && element.page > prevPage;
            return (
              <React.Fragment key={index}>
                {showDivider && (
                  <div style={pageDividerStyle} aria-label={t('fountain.pageDivider', { page: element.page })}>
                    <span style={pageDividerLabelStyle}>{t('fountain.pageDivider', { page: element.page })}</span>
                  </div>
                )}
                <div style={elementStyle(element.type)}>{element.text}</div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};

const pageWrapStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  background: '#e5e7eb',
  padding: 20,
  position: 'relative'
};

const topBarStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: 12,
  zIndex: 1
};

const pageBadgeStyle: React.CSSProperties = {
  background: '#0f172a',
  color: '#fff',
  borderRadius: 999,
  padding: '3px 12px',
  fontSize: '0.85em',
  fontWeight: 700
};

const pageStyle: React.CSSProperties = {
  maxWidth: 680,
  margin: '0 auto',
  background: '#ffffff',
  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.18)',
  padding: '64px clamp(32px, 9%, 96px)',
  fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
  fontSize: 15,
  lineHeight: 1.5,
  color: '#1e293b',
  minHeight: '60vh'
};

const pageDividerStyle: React.CSSProperties = {
  position: 'relative',
  textAlign: 'right',
  borderTop: '1px dashed #cbd5e1',
  margin: '2.5em -2% 1.5em',
  paddingTop: 4
};

const pageDividerLabelStyle: React.CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: '0.7em',
  color: '#94a3b8',
  background: '#ffffff',
  padding: '0 6px',
  position: 'relative',
  top: -12
};

// Standard-ish screenplay layout. Approximate margins, not exact industry spec.
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
      return { margin: '0.75em 0' };
  }
}

export default FountainViewer;
