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
