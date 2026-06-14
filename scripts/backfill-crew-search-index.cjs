/**
 * Backfill server-owned prefix indexes for existing crew profiles.
 *
 * The shared index builder is compiled from functions/src before this script is
 * run by `npm run backfill:crew-search`.
 */

const admin = require('firebase-admin');
const {
  buildCrewProfileSearchIndex,
  crewProfileSearchIndexMatches
} = require('../functions/lib/crewProfileSearch.js');

const APPLY = process.argv.includes('--apply');
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.FIREBASE_PROJECT_ID ||
  'my-film-jobs';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: PROJECT_ID
});

const db = admin.firestore();

async function main() {
  const snapshot = await db.collection('crewProfiles').get();
  const pending = snapshot.docs.flatMap(profile => {
    const data = profile.data() || {};
    const index = buildCrewProfileSearchIndex(data);
    return crewProfileSearchIndexMatches(data, index)
      ? []
      : [{ ref: profile.ref, index }];
  });

  console.log(`Scanned ${snapshot.size} crew profile(s); ${pending.length} need indexing.`);
  if (!APPLY || pending.length === 0) {
    if (!APPLY && pending.length > 0) {
      console.log('Dry run only. Re-run with --apply to write indexes.');
    }
    return;
  }

  for (let offset = 0; offset < pending.length; offset += 400) {
    const chunk = pending.slice(offset, offset + 400);
    const batch = db.batch();
    chunk.forEach(({ ref, index }) => batch.set(ref, index, { merge: true }));
    await batch.commit();
    console.log(`Indexed ${Math.min(offset + chunk.length, pending.length)}/${pending.length}.`);
  }
}

main().catch(error => {
  console.error('Crew search backfill failed:', error);
  process.exitCode = 1;
});
