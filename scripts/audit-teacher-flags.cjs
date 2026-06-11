/**
 * Audit teacher-flag claims vs admin-granted teacher roles. READ-ONLY — never writes.
 *
 * WHY: supervisor self-election used to be gated on crewProfiles.isTeacher /
 * profileType == 'teacher', which are USER-WRITABLE fields — any student could set
 * them and grant themselves supervisor powers (grading CSV export, teacher-styled
 * notes). The gate now requires an Admin-SDK-written teacherRoles/{uid} doc.
 *
 * This script reports:
 *   1. crewProfiles claiming teacher (isTeacher == true or profileType == 'teacher')
 *   2. teacherRoles grants (the new privilege source of truth)
 *   3. Claimants WITHOUT a grant  -> real teachers needing scripts/grant-teacher-role.cjs,
 *                                    or students who self-escalated (investigate!)
 *   4. Grants without a claim     -> informational only
 *   5. Workspaces with selfElectedSupervisors entries whose uid has NO grant
 *                                  -> existing escalations to review/remove
 *
 * Uses the Admin SDK (bypasses security rules).
 *
 * AUTH (pick one before running):
 *   - gcloud auth application-default login        (then this just works), or
 *   - export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *
 * USAGE:
 *   node scripts/audit-teacher-flags.cjs
 */

const admin = require('firebase-admin');

admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'my-film-jobs' });
const db = admin.firestore();

const label = (d) =>
  `${d.id}  name="${d.get('name') || d.get('displayName') || '?'}"  email="${d.get('email') || '?'}"`;

async function main() {
  // 1. Profiles claiming teacher status (display fields, user-writable).
  const [byFlag, byType, grantsSnap] = await Promise.all([
    db.collection('crewProfiles').where('isTeacher', '==', true).get(),
    db.collection('crewProfiles').where('profileType', '==', 'teacher').get(),
    db.collection('teacherRoles').get(),
  ]);

  const claimants = new Map();
  byFlag.forEach((d) => claimants.set(d.id, d));
  byType.forEach((d) => claimants.set(d.id, d));
  const grantedIds = new Set(grantsSnap.docs.map((d) => d.id));

  console.log(`\n=== crewProfiles claiming teacher: ${claimants.size} ===`);
  claimants.forEach((d) => console.log(`  ${grantedIds.has(d.id) ? '[GRANTED]  ' : '[NO GRANT] '}${label(d)}`));

  console.log(`\n=== teacherRoles grants: ${grantedIds.size} ===`);
  grantsSnap.forEach((d) =>
    console.log(`  ${d.id}  grantedAt=${d.get('grantedAt')?.toDate?.()?.toISOString() || '?'}  email="${d.get('email') || '?'}"`)
  );

  const ungranted = [...claimants.values()].filter((d) => !grantedIds.has(d.id));
  console.log(`\n=== claimants WITHOUT grant: ${ungranted.length} ===`);
  console.log('  (verify each: real teacher -> grant-teacher-role.cjs; student -> self-escalation, investigate)');
  ungranted.forEach((d) => console.log(`  ${label(d)}`));

  // 5. Existing self-elected supervisors lacking a grant (escalations already in effect).
  const wsSnap = await db.collection('workspaces').get();
  let escalations = 0;
  console.log('\n=== selfElectedSupervisors entries without a teacherRoles grant ===');
  wsSnap.forEach((ws) => {
    const electees = ws.get('selfElectedSupervisors') || [];
    electees.forEach((uid) => {
      if (!grantedIds.has(uid)) {
        escalations += 1;
        console.log(`  workspace=${ws.id} "${ws.get('name') || '?'}"  uid=${uid}  (owner=${ws.get('ownerId')})`);
      }
    });
  });
  if (escalations === 0) console.log('  none — clean.');
  console.log(
    `\nDone. ${escalations} ungranted supervisor election(s). This script is read-only; nothing was changed.\n`
  );
}

main().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
