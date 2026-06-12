import React, { useEffect, useMemo, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { computePageCount } from '../../utilities/fountain';
import { exportElementToPdf } from '../../utilities/exportFountainPdf';
import FountainPages from './FountainPages';

interface FountainViewerProps {
  screenplayId: string;
  screenplayName?: string;
  initialSource?: string;
  onSourceChange?: (source: string) => void;
}

// Read-only formatted render of a Fountain screenplay, shown inside ScreenplayViewer for
// format === 'fountain' docs. Subscribes so a reader sees the author's latest saved text
// live (last-write-wins; no multi-cursor). Includes a "Download PDF" action.
const FountainViewer: React.FC<FountainViewerProps> = ({
  screenplayId,
  screenplayName,
  initialSource,
  onSourceChange
}) => {
  const { t } = useTranslation();
  const [source, setSource] = useState(initialSource || '');
  const [exporting, setExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startingSource = initialSource || '';
    setSource(startingSource);
    onSourceChange?.(startingSource);

    const unsubscribe = onSnapshot(
      doc(db, 'screenplays', screenplayId),
      snap => {
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.fountainSource === 'string') {
            setSource(data.fountainSource);
            onSourceChange?.(data.fountainSource);
          }
        }
      },
      err => console.error('FountainViewer subscription error:', err)
    );
    return () => unsubscribe();
  }, [screenplayId, initialSource, onSourceChange]);

  const pageCount = useMemo(() => computePageCount(source), [source]);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(printRef.current, screenplayName || 'screenplay');
    } catch (err) {
      console.error('PDF export failed:', err);
      toast.error(t('fountain.pdfError'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={topBarStyle}>
        <button type="button" onClick={handleDownloadPdf} disabled={exporting} style={downloadBtnStyle}>
          {exporting ? t('fountain.pdfExporting') : `⬇ ${t('fountain.downloadPdf')}`}
        </button>
        <span style={pageBadgeStyle} title={t('fountain.pageCountTooltip')}>
          {t('fountain.pageCount', { count: pageCount })}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <FountainPages source={source} />
      </div>

      {/* Offscreen print container targeted by html2pdf. */}
      <div style={offscreenStyle} aria-hidden="true">
        <FountainPages source={source} printMode innerRef={printRef} />
      </div>
    </div>
  );
};

const wrapStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: '#e5e7eb'
};

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 16px',
  gap: 12,
  borderBottom: '1px solid #cbd5e1',
  background: '#f1f5f9'
};

const pageBadgeStyle: React.CSSProperties = {
  background: '#0f172a',
  color: '#fff',
  borderRadius: 999,
  padding: '3px 12px',
  fontSize: '0.85em',
  fontWeight: 700
};

const downloadBtnStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  padding: '5px 12px',
  fontSize: '0.85em',
  fontWeight: 600,
  color: '#1e293b',
  cursor: 'pointer'
};

const offscreenStyle: React.CSSProperties = {
  position: 'absolute',
  left: -10000,
  top: 0,
  width: 816,
  pointerEvents: 'none',
  opacity: 0
};

export default FountainViewer;
