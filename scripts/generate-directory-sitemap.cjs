// Generates public/sitemap-directory.xml from the directory taxonomy.
// Intentionally lists only the Spanish and English directory hubs.
//
// Category×region pages exist as routes and are reachable via internal links, but
// they self-noindex until they have enough real matching crew. A static build-time
// sitemap cannot know live crew counts, so submitting those URLs can create
// "Submitted URL marked 'noindex'" Search Console noise.
// Runs during `npm run build` (before copy-static-seo-assets copies public/ -> dist/).

const fs = require('fs');
const path = require('path');

const BASE = 'https://myfilmjobs.com';
const today = new Date().toISOString().slice(0, 10);

function urlEntry(loc, priority, changefreq) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

const urls = [
  urlEntry(`${BASE}/directorio`, '0.8', 'weekly'),
  urlEntry(`${BASE}/directory`, '0.8', 'weekly'),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls.join('\n'),
  '</urlset>',
  '',
].join('\n');

const out = path.join(__dirname, '..', 'public', 'sitemap-directory.xml');
fs.writeFileSync(out, xml, 'utf8');
console.log(`[generate-directory-sitemap] Wrote ${urls.length} URLs -> public/sitemap-directory.xml`);
