import html2pdf from 'html2pdf.js';

// Turn a screenplay name into a safe PDF filename slug.
export function screenplayPdfFilename(name: string): string {
  const slug = (name || 'screenplay')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'screenplay';
  return `${slug}.pdf`;
}

// Render a DOM element (a FountainPages printMode container) to a downloaded PDF.
// html2pdf paginates physically against US Letter; the element must be attached to the
// document (even offscreen) so html2canvas can measure it.
export async function exportElementToPdf(element: HTMLElement, name: string): Promise<void> {
  // The runtime accepts more options (html2canvas useCORS/backgroundColor, pagebreak) than
  // the bundled .d.ts models, so the options blob is cast to satisfy the type checker.
  const options = {
    margin: 0,
    filename: screenplayPdfFilename(name),
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  } as Parameters<ReturnType<typeof html2pdf>['set']>[0];

  await html2pdf().set(options).from(element).save();
}
