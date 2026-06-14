/**
 * One-time migration for the Projects.crewMemberIds query index.
 *
 * Production CI runs this after Google Cloud authentication and before Hosting
 * deployment. A migration marker makes subsequent deploys a single-document read.
 */

const admin = require('firebase-admin');

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.FIREBASE_PROJECT_ID ||
  'my-film-jobs';
const MIGRATION_ID = 'projectCrewMemberIdsV1';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: PROJECT_ID
});

const db = admin.firestore();
const markerRef = db.collection('systemMigrations').doc(MIGRATION_ID);

function activeCrewMemberIds(project) {
  const crewMembers = Array.isArray(project.crewMembers) ? project.crewMembers : [];
  return Array.from(new Set(
    crewMembers
      .filter(member => member && member.status === 'active' && typeof member.userId === 'string')
      .map(member => member.userId)
      .filter(Boolean)
  )).sort();
}

function stringArray(value) {
  return Array.isArray(value)
    ? Array.from(new Set(value.filter(item => typeof item === 'string' && item))).sort()
    : [];
}

async function main() {
  const marker = await markerRef.get();
  if (marker.exists && !FORCE) {
    console.log(`Project crew index migration already completed (${MIGRATION_ID}).`);
    return;
  }

  const snapshot = await db.collection('Projects').get();
  const pending = snapshot.docs.flatMap(project => {
    const expected = activeCrewMemberIds(project.data() || {});
    const current = stringArray(project.data()?.crewMemberIds);
    return JSON.stringify(expected) === JSON.stringify(current)
      ? []
      : [{ ref: project.ref, crewMemberIds: expected }];
  });

  console.log(`Scanned ${snapshot.size} project(s); ${pending.length} need crew index updates.`);
  if (!APPLY) {
    console.log('Dry run only. Re-run with --apply to write the migration.');
    return;
  }

  for (let offset = 0; offset < pending.length; offset += 400) {
    const chunk = pending.slice(offset, offset + 400);
    const batch = db.batch();
    chunk.forEach(({ ref, crewMemberIds }) => batch.update(ref, { crewMemberIds }));
    await batch.commit();
    console.log(`Updated ${Math.min(offset + chunk.length, pending.length)}/${pending.length}.`);
  }

  await markerRef.set({
    migrationId: MIGRATION_ID,
    projectCount: snapshot.size,
    updatedProjectCount: pending.length,
    completedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log(`Project crew index migration completed (${MIGRATION_ID}).`);
}

main().catch(error => {
  console.error('Project crew index migration failed:', error);
  process.exitCode = 1;
});
