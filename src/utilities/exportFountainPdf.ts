import { jsPDF } from 'jspdf';
import { parseFountain, ParsedElement, ScreenplayElementType } from './fountain';

// Turn a screenplay name into a safe PDF filename slug.
export function screenplayPdfFilename(name: string): string {
  const slug = (name || 'screenplay')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'screenplay';
  return `${slug}.pdf`;
}

// US Letter @ 72pt/in. Standard screenplay geometry (12pt Courier, 6 lines/in).
const PAGE_BOTTOM = 720; // 11in - 1in bottom margin
const TOP = 72; // 1in top margin
const LINE = 12; // pt per single line of 12pt Courier
const CW = 7.2; // Courier 12pt character width (0.6em)

interface ElementLayout {
  x: number; // left margin (or right edge for right-aligned) in pt
  chars: number; // wrap width in characters
  upper?: boolean;
  align?: 'right';
}

// Margins per element type, in points (1in = 72pt).
const LAYOUT: Record<ScreenplayElementType, ElementLayout> = {
  scene_heading: { x: 108, chars: 60, upper: true }, // 1.5in left
  action: { x: 108, chars: 60 },
  character: { x: 266, chars: 38, upper: true }, // ~3.7in left
  parenthetical: { x: 223, chars: 25 }, // ~3.1in left
  dialogue: { x: 180, chars: 35 }, // 2.5in left
  transition: { x: 540, chars: 30, upper: true, align: 'right' },
};

// Blank lines that precede an element (standard screenplay spacing): a blank between
// blocks, a double space before scene headings, none inside a dialogue block.
function leadingBlanks(type: ScreenplayElementType, prev: ScreenplayElementType | null): number {
  if (prev === null) return 0;
  if (type === 'dialogue' || type === 'parenthetical') return 0;
  if (type === 'scene_heading') return 2;
  return 1;
}

/**
 * Render parsed screenplay elements into a text-based (vector) PDF. Page breaks fall
 * between lines (never mid-line); short blocks are kept whole by pushing them to the next
 * page when they don't fit. Page 1 is unnumbered; later pages get "N." top-right — the
 * screenplay convention. Text PDF ⇒ ~100s of KB, not the tens of MB an image export costs.
 */
function renderScreenplayPdf(elements: ParsedElement[]): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait' });
  doc.setFont('courier', 'normal');
  doc.setFontSize(12);

  let y = TOP;
  let prev: ScreenplayElementType | null = null;

  for (const el of elements) {
    const L = LAYOUT[el.type] || LAYOUT.action;
    const text = L.upper ? el.text.toUpperCase() : el.text;
    const wrapped: string[] = doc.splitTextToSize(text, L.chars * CW);

    if (y > TOP) y += leadingBlanks(el.type, prev) * LINE;

    // Keep an element together: if it fits on a page but not in the remaining space, break.
    const blockHeight = wrapped.length * LINE;
    if (y + blockHeight > PAGE_BOTTOM && blockHeight <= PAGE_BOTTOM - TOP) {
      doc.addPage();
      y = TOP;
    }

    for (const ln of wrapped) {
      if (y + LINE > PAGE_BOTTOM) {
        doc.addPage();
        y = TOP;
      }
      doc.text(ln, L.x, y, L.align ? { align: L.align } : undefined);
      y += LINE;
    }
    prev = el.type;
  }

  const total = doc.getNumberOfPages();
  for (let page = 2; page <= total; page++) {
    doc.setPage(page);
    doc.text(`${page}.`, 540, 50, { align: 'right' }); // ~1in from right, ~0.7in from top
  }
  return doc;
}

/** Build and download a screenplay PDF from raw Fountain source. */
export async function exportFountainSourceToPdf(source: string, name: string): Promise<void> {
  const elements = parseFountain(source);
  const doc = renderScreenplayPdf(elements);
  doc.save(screenplayPdfFilename(name));
}
