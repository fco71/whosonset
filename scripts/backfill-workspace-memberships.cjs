/**
 * Audit + backfill `workspaceMemberships` docs.
 *
 * WHY: workspace discovery moved from a `where('memberIds','array-contains',uid)` query
 * (now blocked by `allow list: if false`) to a dedicated `workspaceMemberships` collection
 * the client lists by userId. Any workspace created BEFORE that migration has `memberIds`
 * but no membership docs, so its members silently lost it from their list. This script
 * finds those gaps and (with --apply) writes the missing membership docs.
 *
 * Membership doc shape MUST match the client writer (CollaborationHub.writeWorkspaceMemberships):
 *   id: `${workspaceId}_${userId}`
 *   { workspaceId, userId, role, ownerId, projectId, status, updatedAt }
 *
 * Uses the Admin SDK (bypasses security rules — required because workspaces are list:false).
 *
 * AUTH (pick one before running):
 *   - gcloud auth application-default login        (then this just works), or
 *   - export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *
 * USAGE:
 *   node scripts/backfill-workspace-memberships.cjs            # DRY RUN — reports gaps only
 *   node scripts/backfill-workspace-memberships.cjs --apply    # writes the missing docs
 *
 * Data-safety: dry run is read-only. --apply only CREATES missing membership docs
 * (merge:true); it never deletes or overwrites existing data, and never touches the
 * workspace docs themselves.
 */

const admin = require('firebase-admin');

const APPLY = process.argv.includes('--apply');
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'my-film-jobs';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: PROJECT_ID
});

const db = admin.firestore();

const membershipId = (workspaceId, userId) => `${workspaceId}_${userId}`;

async function main() {
  console.log(`\n=== workspaceMemberships ${APPLY ? 'BACKFILL (--apply)' : 'AUDIT (dry run)'} — project ${PROJECT_ID} ===\n`);

  const workspacesSnap = await db.collection('workspaces').get();
  console.log(`Scanning ${workspacesSnap.size} workspace(s)...\n`);

  const missing = [];

  for (const wsDoc of workspacesSnap.docs) {
    const ws = wsDoc.data() || {};
    const workspaceId = wsDoc.id;
    const memberIds = Array.isArray(ws.memberIds) ? ws.memberIds : [];
    const members = Array.isArray(ws.members) ? ws.members : [];

    // Union of memberIds + members[].userId, deduped.
    const uids = Array.from(new Set([
      ...memberIds,
      ...members.map(m => m && m.userId).filter(Boolean)
    ].filter(Boolean)));

    for (const uid of uids) {
      const id = membershipId(workspaceId, uid);
      const existing = await db.collection('workspaceMemberships').doc(id).get();
      if (!existing.exists) {
        const memberEntry = members.find(m => m && m.userId === uid);
        missing.push({
          id,
          workspaceId,
          userId: uid,
          role: (memberEntry && memberEntry.role) || (ws.ownerId === uid ? 'owner' : 'member'),
          ownerId: ws.ownerId || '',
          projectId: ws.projectId || null,
          status: ws.status || 'active'
        });
      }
    }
  }

  if (missing.length === 0) {
    console.log('✅ No missing membership docs. Nothing to backfill.\n');
    return;
  }

  console.log(`Found ${missing.length} missing membership doc(s):`);
  missing.forEach(m => console.log(`  - ${m.id}  (role=${m.role}, owner=${m.ownerId === m.userId})`));

  if (!APPLY) {
    console.log(`\nDRY RUN — no writes. Re-run with --apply to create these ${missing.length} doc(s).\n`);
    return;
  }

  console.log(`\nWriting ${missing.length} membership doc(s)...`);
  // Firestore batches cap at 500 ops.
  for (let i = 0; i < missing.length; i += 450) {
    const chunk = missing.slice(i, i + 450);
    const batch = db.batch();
    chunk.forEach(m => {
      batch.set(db.collection('workspaceMemberships').doc(m.id), {
        workspaceId: m.workspaceId,
        userId: m.userId,
        role: m.role,
        ownerId: m.ownerId,
        projectId: m.projectId,
        status: m.status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });
    await batch.commit();
    console.log(`  committed ${Math.min(i + 450, missing.length)}/${missing.length}`);
  }
  console.log('✅ Backfill complete.\n');
}

main().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
