/**
 * scripts/publish-blog-posts.cjs
 *
 * One-off Firestore Admin script to inspect / publish specific blog posts
 * that Google Search Console flagged as "Excluded by 'noindex' tag".
 *
 * The prerender function (`functions/src/prerender.ts:436`) noindexes blog
 * posts unless `isPublic === true`. To make a flagged post indexable we set
 * `isPublic: true`.
 *
 * USAGE:
 *   Dry run (default — prints current state, changes nothing):
 *     node scripts/publish-blog-posts.cjs
 *
 *   Actually publish:
 *     node scripts/publish-blog-posts.cjs --apply
 *
 *   Custom post ids (comma-separated, no spaces):
 *     node scripts/publish-blog-posts.cjs --ids=2026-02-23-a79b3a881fb4,2026-07-20-0906874a0122 --apply
 *
 * AUTH:
 *   Uses Application Default Credentials, same pattern as backfill scripts.
 *   Local: `gcloud auth application-default login` (as iam@myfilmjobs.com).
 *   CI: already authenticated via workload identity in deploy workflow.
 */

const admin = require('firebase-admin');

const APPLY = process.argv.includes('--apply');
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.FIREBASE_PROJECT_ID ||
  'my-film-jobs';

// Default set: the two IDs Google Search Console flagged on 2026-07-21.
const DEFAULT_IDS = [
  '2026-02-23-a79b3a881fb4',
  '2026-07-20-0906874a0122',
];

const idsArg = process.argv.find(a => a.startsWith('--ids='));
const POST_IDS = idsArg
  ? idsArg.replace('--ids=', '').split(',').map(s => s.trim()).filter(Boolean)
  : DEFAULT_IDS;

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: PROJECT_ID,
});

const db = admin.firestore();

async function main() {
  console.log(`[publish-blog-posts] project=${PROJECT_ID} apply=${APPLY}`);
  console.log(`[publish-blog-posts] targets: ${POST_IDS.join(', ')}`);
  console.log('');

  let updated = 0;
  let alreadyPublic = 0;
  let missing = 0;

  for (const id of POST_IDS) {
    const ref = db.collection('blogPosts').doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      console.log(`✗ ${id}  MISSING (no doc at blogPosts/${id})`);
      missing++;
      continue;
    }

    const data = snap.data() || {};
    const current = data.isPublic === true;
    const title = (data.title || '(no title)').slice(0, 80);

    if (current) {
      console.log(`✓ ${id}  ALREADY isPublic:true — "${title}"`);
      alreadyPublic++;
      continue;
    }

    if (!APPLY) {
      console.log(`… ${id}  would set isPublic:true (currently ${JSON.stringify(data.isPublic)}) — "${title}"`);
      continue;
    }

    await ref.update({
      isPublic: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✓ ${id}  UPDATED isPublic:true — "${title}"`);
    updated++;
  }

  console.log('');
  console.log(`[publish-blog-posts] summary: updated=${updated} alreadyPublic=${alreadyPublic} missing=${missing}`);
  if (!APPLY) {
    console.log('[publish-blog-posts] DRY RUN — re-run with --apply to actually write.');
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('[publish-blog-posts] FAILED:', err);
    process.exit(1);
  });
