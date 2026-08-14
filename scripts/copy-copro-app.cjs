// Copies the pre-built Coproduction tool (static app) from public/copro into
// dist/copro so Firebase Hosting serves it at myfilmjobs.com/copro.
//
// The tool is a SEPARATE app (its own repo/build/Firebase project); only its
// built static output lives here. To update it: rebuild the tool with Vite
// base '/copro/', then copy its dist/ into public/copro/ and commit.
// See COPRODUCTION_TOOL_HANDOFF.md.
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'public', 'copro');
const destDir = path.join(rootDir, 'dist', 'copro');

if (!fs.existsSync(path.join(rootDir, 'dist'))) {
  console.error('[copy-copro-app] dist directory not found.');
  process.exit(1);
}

if (!fs.existsSync(sourceDir)) {
  console.warn('[copy-copro-app] public/copro not found — skipping (tool not built in yet).');
  process.exit(0);
}

fs.rmSync(destDir, { recursive: true, force: true });
fs.cpSync(sourceDir, destDir, { recursive: true });
console.log('[copy-copro-app] Copied public/copro -> dist/copro');
