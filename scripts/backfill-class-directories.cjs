/**
 * Backfill the `classDirectory` collection for every existing teacher class.
 *
 * WHY: classDirectory docs are the server-maintained, student-readable view of a class's
 * groups (group name/owner/members + the union memberIds that gates reads). They power the
 * student "request to join another group in my class" flow. They are normally (re)built by
 * the onTeacherClassWritten / onWorkspaceWrittenSyncDirectories Cloud Function triggers —
 * but those only fire on FUTURE writes, so classes that already exist have no directory doc
 * until something changes. This script builds them once, immediately, so the feature works
 * for current classes the moment the client ships.
 *
 * Directory shape MUST match rebuildClassDirectory() in functions/src/workspaceJoinRequests.ts:
 *   id: classId
 *   { classId, className, groups[], groupWorkspaceIds[], memberIds[], updatedAt }
 * Only ACTIVE groups are included; member display names resolve crewProfiles → users.
 *
 * Uses the Admin SDK (bypasses security rules — required because classDirectory is
 * `allow write: if false` for clients).
 *
 * AUTH (pick one before running):
 *   - gcloud auth application-default login        (then this just works), or
 *   - export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *
 * USAGE:
 *   node scripts/backfill-class-directories.cjs            # DRY RUN — reports only
 *   node scripts/backfill-class-directories.cjs --apply    # (re)writes the directory docs
 *
 * Data-safety: dry run is read-only. --apply only writes the new `classDirectory`
 * collection; it never touches teacherClasses, workspaces, or any user data.
 */

const admin = require('firebase-admin');

const APPLY = process.argv.includes('--apply');
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'my-film-jobs';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: PROJECT_ID
});

const db = admin.firestore();

async function resolveName(uid, cache) {
  if (cache.has(uid)) return cache.get(uid);
  const [crewSnap, userSnap] = await Promise.all([
    db.collection('crewProfiles').doc(uid).get(),
    db.collection('users').doc(uid).get()
  ]);
  const crew = crewSnap.data() || {};
  const user = userSnap.data() || {};
  const candidates = [crew.name, crew.displayName, user.name, user.displayName];
  const resolved = candidates.find(v => typeof v === 'string' && v.trim());
  const name = resolved ? resolved.trim() : 'Crew member';
  cache.set(uid, name);
  return name;
}

async function buildDirectory(classDoc) {
  const classId = classDoc.id;
  const classData = classDoc.data() || {};
  const workspaceIds = Array.isArray(classData.workspaceIds)
    ? classData.workspaceIds.filter(id => typeof id === 'string')
    : [];

  const cache = new Map();
  const groups = [];
  const memberIdUnion = new Set();

  for (const wsId of workspaceIds) {
    const wsSnap = await db.collection('workspaces').doc(wsId).get();
    if (!wsSnap.exists) continue;
    const ws = wsSnap.data() || {};
    if (ws.status && ws.status !== 'active') continue; // hide archived/deleted groups

    const memberIds = Array.isArray(ws.memberIds) ? ws.memberIds.filter(id => typeof id === 'string') : [];
    memberIds.forEach(uid => memberIdUnion.add(uid));

    const memberNames = [];
    for (const uid of memberIds) memberNames.push(await resolveName(uid, cache));
    const ownerId = typeof ws.ownerId === 'string' ? ws.ownerId : '';
    const ownerName = ownerId ? await resolveName(ownerId, cache) : '';

    groups.push({
      workspaceId: wsId,
      name: typeof ws.name === 'string' ? ws.name : 'Group',
      ownerId,
      ownerName,
      memberCount: memberIds.length,
      memberNames,
      memberIds
    });
  }

  return {
    classId,
    className: typeof classData.name === 'string' ? classData.name : '',
    groups,
    groupWorkspaceIds: groups.map(g => g.workspaceId),
    memberIds: Array.from(memberIdUnion),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
}

async function main() {
  console.log(`\n=== classDirectory ${APPLY ? 'BACKFILL (--apply)' : 'DRY RUN'} — project ${PROJECT_ID} ===\n`);

  const classesSnap = await db.collection('teacherClasses').get();
  console.log(`Scanning ${classesSnap.size} class(es)...\n`);

  let written = 0;
  for (const classDoc of classesSnap.docs) {
    const directory = await buildDirectory(classDoc);
    console.log(
      `  - class ${classDoc.id} ("${directory.className}"): ` +
      `${directory.groups.length} active group(s), ${directory.memberIds.length} member(s)`
    );
    if (APPLY) {
      await db.collection('classDirectory').doc(classDoc.id).set(directory);
      written++;
    }
  }

  if (!APPLY) {
    console.log(`\nDRY RUN — no writes. Re-run with --apply to (re)build ${classesSnap.size} directory doc(s).\n`);
  } else {
    console.log(`\n✅ Wrote ${written} classDirectory doc(s).\n`);
  }
}

main().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
