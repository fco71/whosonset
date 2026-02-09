const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');
const filesToCopy = [
  'robots.txt',
  'sitemap.xml',
  'sitemap-static.xml',
  'ads.txt',
  'my-icon.png',
  'bust-avatar.svg',
  'default-avatar.svg',
  'movie-production-avatar.svg',
  'firebase-error-suppressor.js',
  '404.html',
];

if (!fs.existsSync(distDir)) {
  console.error('[copy-static-seo-assets] dist directory not found.');
  process.exit(1);
}

for (const fileName of filesToCopy) {
  const sourcePath = path.join(publicDir, fileName);
  const destinationPath = path.join(distDir, fileName);

  if (!fs.existsSync(sourcePath)) {
    console.warn(`[copy-static-seo-assets] Skipping missing file: ${fileName}`);
    continue;
  }

  fs.copyFileSync(sourcePath, destinationPath);
  console.log(`[copy-static-seo-assets] Copied ${fileName}`);
}
