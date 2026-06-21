// Copies the freshly built dist/index.html into the functions package so the
// `prerender` Cloud Function can read it from disk (no runtime network fetch).
// Runs at the end of `npm run build` / `build:prod`, so the bundled template always
// matches the web build being deployed. See functions/src/prerender.ts.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'dist', 'index.html');
const dest = path.join(root, 'functions', 'prerender-template.html');

if (!fs.existsSync(src)) {
  console.error('[copy-template-to-functions] dist/index.html not found — build the web app first.');
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('[copy-template-to-functions] Copied dist/index.html -> functions/prerender-template.html');

// Also ship the directory taxonomy (single source of truth in src/data) into the function so
// the prerender's buildDirectory() can resolve category/region slugs + labels server-side.
// Read at runtime via fs (see functions/src/prerender.ts loadTaxonomy()).
const taxSrc = path.join(root, 'src', 'data', 'directoryTaxonomy.json');
const taxDest = path.join(root, 'functions', 'directoryTaxonomy.json');
if (fs.existsSync(taxSrc)) {
  fs.copyFileSync(taxSrc, taxDest);
  console.log('[copy-template-to-functions] Copied src/data/directoryTaxonomy.json -> functions/directoryTaxonomy.json');
} else {
  console.warn('[copy-template-to-functions] directoryTaxonomy.json not found — directory prerender will be skipped.');
}
