// Generates public/sitemap-directory.xml from the directory taxonomy.
// Intentionally lists only the hub + the national (República Dominicana) page per
// department — NOT the full department×city cartesian product. City pages exist as
// routes and are reachable via internal links, but they self-noindex until they have
// real crew, so we don't submit thin pages to Google (avoids doorway-page penalties).
// Runs during `npm run build` (before copy-static-seo-assets copies public/ -> dist/).

const fs = require('fs');
const path = require('path');
const taxonomy = require('../src/data/directoryTaxonomy.json');

const BASE = 'https://myfilmjobs.com';
const NATIONAL = 'republica-dominicana';
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

const NATIONAL_EN = 'dominican-republic';

const urls = [
  urlEntry(`${BASE}/directorio`, '0.8', 'weekly'),
  urlEntry(`${BASE}/directory`, '0.8', 'weekly'),
];
// Spanish national pages per department.
for (const c of taxonomy.categories) {
  urls.push(urlEntry(`${BASE}/directorio/${c.slug}/${NATIONAL}`, '0.6', 'weekly'));
}
// English national pages per department (mirror under /directory).
for (const c of taxonomy.categories) {
  urls.push(urlEntry(`${BASE}/directory/${c.enSlug}/${NATIONAL_EN}`, '0.6', 'weekly'));
}

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
