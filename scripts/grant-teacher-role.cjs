/**
 * Grant or revoke the admin-verified teacher role (teacherRoles/{uid}).
 *
 * WHY: teacherRoles/{uid} existence is the ONLY thing Firestore rules accept for
 * supervisor self-election (`isVerifiedTeacher`). Clients cannot write this
 * collection (`allow write: if false`) — grants happen only here, via Admin SDK.
 *
 * Run scripts/audit-teacher-flags.cjs first to see who claims teacher status.
 *
 * AUTH (pick one before running):
 *   - gcloud auth application-default login        (then this just works), or
 *   - export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *
 * USAGE:
 *   node scripts/grant-teacher-role.cjs <uid>                # DRY RUN — shows what would happen
 *   node scripts/grant-teacher-role.cjs <uid> --apply        # grants
 *   node scripts/grant-teacher-role.cjs <uid> --revoke --apply  # revokes (deletes the doc)
 *
 * Data-safety: dry run by default. --apply writes/deletes exactly one
 * teacherRoles/{uid} doc; it never touches crewProfiles, workspaces, or any other data.
 * Revoking does NOT remove existing selfElectedSupervisors entries — review those
 * via the audit script and remove manually if needed.
 */

const admin = require('firebase-admin');

const args = process.argv.slice(2);
const uid = args.find((a) => !a.startsWith('--'));
const apply = args.includes('--apply');
const revoke = args.includes('--revoke');

if (!uid) {
  console.error('Usage: node scripts/grant-teacher-role.cjs <uid> [--revoke] [--apply]');
  process.exit(1);
}

admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'my-film-jobs' });
const db = admin.firestore();

async function main() {
  // Context so you can confirm you have the right person before --apply.
  const [authUser, profile, existing] = await Promise.all([
    admin.auth().getUser(uid).catch(() => null),
    db.doc(`crewProfiles/${uid}`).get(),
    db.doc(`teacherRoles/${uid}`).get(),
  ]);

  console.log(`uid:            ${uid}`);
  console.log(`auth email:     ${authUser?.email || 'NOT FOUND IN AUTH — check the uid!'}`);
  console.log(`profile name:   ${profile.get('name') || profile.get('displayName') || '(no crewProfile)'}`);
  console.log(`claims teacher: ${profile.get('isTeacher') === true || profile.get('profileType') === 'teacher'}`);
  console.log(`current grant:  ${existing.exists ? 'GRANTED' : 'none'}`);

  if (!authUser) {
    console.error('\nRefusing to proceed: uid has no Firebase Auth user.');
    process.exit(1);
  }

  if (revoke) {
    if (!existing.exists) return console.log('\nNothing to revoke.');
    if (!apply) return console.log('\nDRY RUN: would DELETE teacherRoles doc (revoke). Re-run with --apply.');
    await db.doc(`teacherRoles/${uid}`).delete();
    console.log('\nRevoked. Reminder: check audit script for lingering selfElectedSupervisors entries.');
    return;
  }

  if (existing.exists) return console.log('\nAlready granted — nothing to do.');
  if (!apply) return console.log('\nDRY RUN: would CREATE teacherRoles doc (grant). Re-run with --apply.');

  await db.doc(`teacherRoles/${uid}`).set({
    email: authUser.email || null,
    grantedAt: admin.firestore.FieldValue.serverTimestamp(),
    grantedBy: 'grant-teacher-role.cjs',
  });
  console.log('\nGranted. The user can now self-elect as supervisor in workspaces they belong to.');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
