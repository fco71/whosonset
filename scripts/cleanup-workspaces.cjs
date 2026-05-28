/**
 * List / delete collaboration workspaces (maintenance + test-data cleanup).
 *
 * Uses the Admin SDK (bypasses security rules). Deleting a workspace also cascades its
 * workspaceMemberships and workspaceActivity docs. Screenplays are left in place by
 * default (they have their own teamMembers access); pass --with-screenplays to also delete
 * screenplays whose workspaceId matches (and their annotations + tags).
 *
 * AUTH (pick one before running):
 *   - gcloud auth application-default login        (then this just works), or
 *   - export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *
 * USAGE:
 *   node scripts/cleanup-workspaces.cjs                          # LIST every workspace (id, name, owner, status)
 *   node scripts/cleanup-workspaces.cjs --owner <uid>           # LIST workspaces owned by <uid>
 *   node scripts/cleanup-workspaces.cjs --ids a,b,c             # DRY RUN — what deleting a,b,c would remove
 *   node scripts/cleanup-workspaces.cjs --ids a,b,c --apply     # delete workspaces a,b,c (+ cascade)
 *   node scripts/cleanup-workspaces.cjs --owner <uid> --apply   # delete ALL workspaces owned by <uid>
 *   add --with-screenplays to also delete matching screenplays + their annotations/tags
 *
 * Data-safety: listing + dry run are read-only. --apply deletes; always run the dry run
 * first and eyeball the list. There is no undo.
 */

const admin = require('firebase-admin');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const WITH_SCREENPLAYS = args.includes('--with-screenplays');
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const ownerFilter = getArg('--owner');
const idsArg = getArg('--ids');
const targetIds = idsArg ? idsArg.split(',').map(s => s.trim()).filter(Boolean) : [];
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'my-film-jobs';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: PROJECT_ID
});
const db = admin.firestore();

const COMMIT_CHUNK = 450;
async function deleteRefs(refs) {
  let deleted = 0;
  for (let i = 0; i < refs.length; i += COMMIT_CHUNK) {
    const batch = db.batch();
    refs.slice(i, i + COMMIT_CHUNK).forEach(ref => batch.delete(ref));
    await batch.commit();
    deleted += Math.min(COMMIT_CHUNK, refs.length - i);
  }
  return deleted;
}

async function refsWhere(collectionName, field, value) {
  const snap = await db.collection(collectionName).where(field, '==', value).get();
  return snap.docs.map(d => d.ref);
}

async function main() {
  console.log(`\n=== cleanup-workspaces — project ${PROJECT_ID} ===\n`);

  const allSnap = await db.collection('workspaces').get();
  let workspaces = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (ownerFilter) workspaces = workspaces.filter(w => w.ownerId === ownerFilter);

  // LIST mode (no --ids and not --owner+apply): just print the inventory.
  if (targetIds.length === 0 && !(ownerFilter && APPLY)) {
    console.log(`${workspaces.length} workspace(s)${ownerFilter ? ` owned by ${ownerFilter}` : ''}:\n`);
    workspaces.forEach(w => {
      console.log(`  ${w.id}  "${w.name || '(untitled)'}"  owner=${w.ownerId || '?'}  status=${w.status || 'active'}  members=${(w.memberIds || []).length}`);
    });
    console.log('\nTo delete: --ids <id,id> [--apply]   or   --owner <uid> --apply\n');
    return;
  }

  // Resolve the set of workspaces to delete.
  const toDelete = targetIds.length > 0
    ? workspaces.filter(w => targetIds.includes(w.id))
    : workspaces; // --owner + --apply => all of that owner's

  if (toDelete.length === 0) {
    console.log('No matching workspaces to delete.\n');
    return;
  }

  console.log(`${APPLY ? 'DELETING' : 'DRY RUN — would delete'} ${toDelete.length} workspace(s):`);
  toDelete.forEach(w => console.log(`  - ${w.id}  "${w.name || '(untitled)'}"  (status=${w.status || 'active'})`));

  if (!APPLY) {
    console.log('\nDRY RUN — no writes. Re-run with --apply to delete.\n');
    return;
  }

  for (const w of toDelete) {
    const refs = [];
    refs.push(...await refsWhere('workspaceMemberships', 'workspaceId', w.id));
    refs.push(...await refsWhere('workspaceActivity', 'workspaceId', w.id));

    if (WITH_SCREENPLAYS) {
      const screenplaySnap = await db.collection('screenplays').where('workspaceId', '==', w.id).get();
      for (const sp of screenplaySnap.docs) {
        refs.push(...await refsWhere('screenplayAnnotations', 'screenplayId', sp.id));
        refs.push(...await refsWhere('screenplayTags', 'screenplayId', sp.id));
        refs.push(sp.ref);
      }
    }

    const cascadeDeleted = await deleteRefs(refs);
    await db.collection('workspaces').doc(w.id).delete();
    console.log(`  - ${w.id} deleted (+${cascadeDeleted} related docs)`);
  }
  console.log('\n✅ Cleanup complete.\n');
}

main().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
