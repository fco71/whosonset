/**
 * scripts/publish-original-post.cjs
 *
 * Publishes an ORIGINAL blog article (our own writing) from a Markdown file in
 * content/blog/ to Firestore `blogPosts/{slug}` with `postType: "original"`.
 *
 * Original posts are the only indexable blog posts: prerender.ts serves them
 * with full article text + BlogPosting JSON-LD, and blogSitemap lists only them.
 * Curated headlines (the daily RSS feed) are `noindex, follow`.
 *
 * USAGE:
 *   Dry run (default — validates, prints what would be written, changes nothing):
 *     node scripts/publish-original-post.cjs content/blog/my-post.md
 *
 *   Actually write:
 *     node scripts/publish-original-post.cjs content/blog/my-post.md --apply
 *
 * FILE FORMAT: see content/blog/_TEMPLATE.md. The doc id (and URL) is the
 * front-matter `slug`: https://myfilmjobs.com/blog/<slug>
 *
 * SAFETY:
 *   - Only ever writes the single doc `blogPosts/<slug>`.
 *   - Refuses to touch an existing doc that is not already an original post
 *     (never overwrites a curated headline or anything else).
 *   - Re-publishing an existing original keeps its createdAt and commentsCount.
 *   - Raw HTML and non-http(s) links in the Markdown are rejected.
 *
 * AUTH:
 *   Application Default Credentials, same as the other admin scripts.
 *   Local: `gcloud auth application-default login` (as iam@myfilmjobs.com).
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { marked } = require('marked');

const APPLY = process.argv.includes('--apply');
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.FIREBASE_PROJECT_ID ||
  'my-film-jobs';

const CATEGORIES = ['technology', 'business', 'industry', 'careers'];
const LANGS = ['es', 'en'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Curated doc ids look like 2026-10-22-05d711581ff7 — keep originals out of that shape.
const CURATED_ID_PATTERN = /^\d{4}-\d{2}-\d{2}-[0-9a-f]{12}$/;
const RESERVED_SLUGS = new Set(['page']);
const ALLOWED_LINK = /^(?:https?:\/\/|\/|#|mailto:)/i;
const MIN_WORDS_WARNING = 600;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

// Minimal front matter: `key: value` lines between `---` fences.
// `tags` is a comma-separated list. Values may be wrapped in quotes.
function parseFrontMatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) fail('Missing front matter (--- ... ---) at the top of the file.');

  const meta = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) fail(`Bad front matter line: "${line}"`);
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

function collectProblems(tokens, problems) {
  for (const token of tokens) {
    if (token.type === 'html') {
      problems.push(`raw HTML is not allowed: ${JSON.stringify(token.raw.trim().slice(0, 60))}`);
    }
    if ((token.type === 'link' || token.type === 'image') && !ALLOWED_LINK.test(token.href || '')) {
      problems.push(`link must be http(s), /path, #anchor or mailto: ${JSON.stringify(token.href)}`);
    }
    if (Array.isArray(token.tokens)) collectProblems(token.tokens, problems);
    if (Array.isArray(token.items)) collectProblems(token.items, problems);
    if (token.type === 'table') {
      for (const cell of token.header || []) collectProblems(cell.tokens || [], problems);
      for (const row of token.rows || []) {
        for (const cell of row) collectProblems(cell.tokens || [], problems);
      }
    }
  }
}

function buildPost(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const { meta, body } = parseFrontMatter(source);

  const slug = (meta.slug || '').trim();
  if (!SLUG_PATTERN.test(slug)) fail(`slug must be lowercase words joined by hyphens, got "${slug}"`);
  if (RESERVED_SLUGS.has(slug) || CURATED_ID_PATTERN.test(slug)) fail(`slug "${slug}" is reserved`);

  // Slug of the same article in the other language (es ↔ en). Drives the hreflang
  // links and the "Read in English / Leer en español" switch on the post page.
  const translationSlug = (meta.translation || '').trim();
  if (translationSlug && (!SLUG_PATTERN.test(translationSlug) || translationSlug === slug)) {
    fail(`translation must be the slug of the other-language version, got "${translationSlug}"`);
  }

  const title = (meta.title || '').trim();
  if (!title) fail('title is required');
  const summary = (meta.summary || '').trim();
  if (!summary) fail('summary is required (used as the search-result description)');
  if (summary.length > 160) console.warn(`! summary is ${summary.length} chars; Google shows ~155.`);

  const lang = (meta.lang || 'es').trim();
  if (!LANGS.includes(lang)) fail(`lang must be one of ${LANGS.join(', ')}`);
  const category = (meta.category || 'careers').trim();
  if (!CATEGORIES.includes(category)) fail(`category must be one of ${CATEGORIES.join(', ')}`);

  // A bare date (2026-10-23) would parse as UTC midnight — the previous day in the DR.
  // Pin it to noon Santo Domingo time so the shown date matches what was written.
  const rawDate = (meta.publishedAt || '').trim();
  const publishedAt = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
    ? new Date(`${rawDate}T12:00:00-04:00`)
    : new Date(rawDate || Date.now());
  if (Number.isNaN(publishedAt.getTime())) fail(`publishedAt is not a valid date: "${meta.publishedAt}"`);

  const imageUrl = (meta.image || '').trim();
  if (imageUrl && !/^https:\/\//.test(imageUrl)) fail('image must be an https:// URL');

  const tokens = marked.lexer(body);
  const problems = [];
  collectProblems(tokens, problems);
  if (problems.length) fail(`Markdown problems:\n  - ${problems.join('\n  - ')}`);

  // The page already renders the title as <h1>; keep the body from adding a second one.
  if (tokens.some((t) => t.type === 'heading' && t.depth === 1)) {
    fail('Use ## (h2) and below in the body; the title is already the page <h1>.');
  }

  const bodyHtml = marked.parser(tokens).trim();
  if (!bodyHtml) fail('body is empty');

  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    words,
    data: {
      title,
      summary,
      bodyHtml,
      postType: 'original',
      contentPolicy: 'original',
      lang,
      category,
      tags: (meta.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      authorName: (meta.author || '').trim(),
      translationSlug,
      imageUrl,
      isPublic: (meta.public || 'true').trim() !== 'false',
      publishedAt,
    },
  };
}

async function main() {
  const filePath = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (!filePath) fail('Usage: node scripts/publish-original-post.cjs content/blog/<file>.md [--apply]');
  if (!fs.existsSync(filePath)) fail(`File not found: ${filePath}`);

  const { slug, words, data } = buildPost(path.resolve(filePath));

  console.log(`[publish-original-post] project=${PROJECT_ID} apply=${APPLY}`);
  console.log(`  doc:        blogPosts/${slug}`);
  console.log(`  url:        https://myfilmjobs.com/blog/${slug}`);
  console.log(`  title:      ${data.title}`);
  console.log(`  lang:       ${data.lang}   category: ${data.category}   public: ${data.isPublic}`);
  console.log(`  published:  ${data.publishedAt.toISOString()}`);
  console.log(`  words:      ${words}`);
  if (data.translationSlug) console.log(`  translation: blogPosts/${data.translationSlug}`);
  if (words < MIN_WORDS_WARNING) {
    console.warn(`! Only ${words} words. Guides that rank usually run ${MIN_WORDS_WARNING}+ words.`);
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: PROJECT_ID,
  });
  const db = admin.firestore();
  const ref = db.collection('blogPosts').doc(slug);
  let snap;
  try {
    snap = await ref.get();
  } catch (error) {
    if (APPLY) throw error;
    console.log(`\nValidation passed. Could not read Firestore to check the slug (${error.message}).`);
    console.log('Dry run — nothing written.');
    return;
  }

  if (snap.exists && snap.data().postType !== 'original') {
    fail(`blogPosts/${slug} already exists and is not an original post. Pick another slug.`);
  }
  console.log(`  status:     ${snap.exists ? 'UPDATE existing original' : 'CREATE new'}`);

  const write = {
    ...data,
    publishedAt: admin.firestore.Timestamp.fromDate(data.publishedAt),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  if (!snap.exists) {
    write.createdAt = admin.firestore.FieldValue.serverTimestamp();
    write.commentsCount = 0;
  }

  if (!APPLY) {
    console.log('\nDry run — nothing written. Re-run with --apply to publish.');
    return;
  }

  await ref.set(write, { merge: true });
  console.log(`\n✓ Wrote blogPosts/${slug}`);
}

main().catch((error) => {
  console.error('[publish-original-post] failed:', error);
  process.exit(1);
});
