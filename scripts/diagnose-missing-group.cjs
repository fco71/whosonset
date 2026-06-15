/**
 * READ-ONLY diagnosis of a workspace/group that isn't showing up for a user.
 *
 * Makes NO writes of any kind — only .get() reads and an auth email lookup.
 * Uses the Admin SDK (bypasses security rules) via ADC, so it sees data the
 * client's rules would hide.
 *
 * AUTH: gcloud auth application-default login   (ADC), or GOOGLE_APPLICATION_CREDENTIALS.
 *
 * USAGE:
 *   node scripts/diagnose-missing-group.cjs --email you@example.com
 *   node scripts/diagnose-missing-group.cjs --email you@example.com --name "Exact Group Name"
 *
 * Without --name it lists every group the hub WOULD show you (the baseline).
 * With --name it locates the group and explains why it isn't in your list.
 */
const admin = require('firebase-admin');

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'my-film-jobs';
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: PROJECT_ID });
const db = admin.firestore();

const arg = flag => { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : null; };
const email = arg('--email');
const name = arg('--name');

const ts = v => (v && v.toDate ? v.toDate().toISOString() : (v ?? '(none)'));

(async () => {
  if (!email && !name) { console.error('Need --name "Group Name" and/or --email <address>'); process.exit(1); }
  console.log(`\n=== Missing-group diagnosis — project ${PROJECT_ID} (READ ONLY) ===\n`);

  // 1) Resolve the user (optional — only if --email is given and valid).
  let uid = null;
  if (email) {
    let user = null;
    try { user = await admin.auth().getUserByEmail(email); }
    catch (e) { console.log(`(No auth user for ${email}: ${e.message} — continuing with group lookup only.)\n`); }
    if (user) {
      uid = user.uid;
      console.log(`User: ${email}\n  uid:         ${uid}\n  displayName: ${user.displayName || '(none)'}\n`);
      const memSnap = await db.collection('workspaceMemberships').where('userId', '==', uid).get();
      console.log(`Groups the hub would list for this account (via workspaceMemberships): ${memSnap.size}`);
      for (const m of memSnap.docs) {
        const wid = m.data().workspaceId;
        const ws = await db.collection('workspaces').doc(wid).get();
        const d = ws.exists ? ws.data() : {};
        console.log(`  - ${ws.exists ? d.name : '(workspace doc MISSING)'}  [${ws.exists ? (d.status || 'active') : '—'}]  role=${m.data().role}  id=${wid}`);
      }
      console.log('');
    }
  }

  if (!name) {
    console.log('Re-run with --name "Exact Group Name" to diagnose a specific group.\n');
    return;
  }

  // 3) Locate the named workspace (exact first, then case-insensitive contains).
  console.log(`=== Searching for a group named "${name}" ===`);
  const matches = [];
  const exact = await db.collection('workspaces').where('name', '==', name).get();
  exact.forEach(doc => matches.push(doc));
  if (matches.length === 0) {
    const all = await db.collection('workspaces').get();
    const needle = name.trim().toLowerCase();
    all.forEach(doc => { if (((doc.data().name || '')).toLowerCase().includes(needle)) matches.push(doc); });
    console.log(`exact: 0 — fuzzy contains: ${matches.length} (scanned ${all.size} workspaces)`);
  } else {
    console.log(`exact match: ${matches.length}`);
  }
  if (matches.length === 0) {
    console.log('\n❌ No workspace found by that name. Either the name differs, or the doc was hard-deleted (check backups).\n');
    return;
  }

  // Resolve a uid -> "email / name" (cached, read-only auth lookup).
  const idCache = new Map();
  const who = async id => {
    if (!id) return '(none)';
    if (idCache.has(id)) return idCache.get(id);
    let label;
    try { const u = await admin.auth().getUser(id); label = `${u.email || '(no email)'}${u.displayName ? ' / ' + u.displayName : ''}`; }
    catch (e) { label = `${id} (no auth user)`; }
    idCache.set(id, label);
    return label;
  };

  for (const doc of matches) {
    const d = doc.data() || {};
    const wid = doc.id;
    const memberIds = Array.isArray(d.memberIds) ? d.memberIds : [];
    const members = Array.isArray(d.members) ? d.members : [];
    const roleByUid = new Map(members.filter(m => m && m.userId).map(m => [m.userId, m.role]));

    console.log(`\n--- "${d.name}"  (id=${wid}) ---`);
    console.log(`  status:    ${d.status || 'active'}`);
    console.log(`  projectId: ${d.projectId ?? 'null'}`);
    console.log(`  ownerId:   ${d.ownerId || '(none)'}  ->  ${await who(d.ownerId)}`);
    console.log(`  createdAt: ${ts(d.createdAt)}   deletedAt: ${ts(d.deletedAt)}`);

    const roster = Array.from(new Set([
      ...(d.ownerId ? [d.ownerId] : []),
      ...memberIds,
      ...members.map(m => m && m.userId).filter(Boolean)
    ]));
    console.log(`  roster (${roster.length}) — identity | role | membership doc (what the hub reads):`);
    for (const id of roster) {
      const md = await db.collection('workspaceMemberships').doc(`${wid}_${id}`).get();
      const tags = [];
      if (id === d.ownerId) tags.push('OWNER');
      if (uid && id === uid) tags.push('<-- YOU');
      console.log(`     • ${await who(id)} | role=${roleByUid.get(id) || (id === d.ownerId ? 'owner' : '?')} | membershipDoc=${md.exists ? 'yes' : 'MISSING'} ${tags.join(' ')}`);
    }

    const invSnap = await db.collection('workspaceInvitations').where('workspaceId', '==', wid).get();
    console.log(`  workspaceInvitations: ${invSnap.size} for this group`);
    for (const i of invSnap.docs) {
      const x = i.data();
      console.log(`     -> ${await who(x.inviteeId)} | status=${x.status} role=${x.role} invitedBy=${x.inviterName || x.inviterId} at ${ts(x.createdAt)}`);
    }
  }

  console.log('\nWhat the result means:');
  console.log('  • In members[]/memberIds but membership doc MISSING  -> migration gap; backfill-workspace-memberships.cjs --apply fixes it (creates the membership doc only).');
  console.log('  • A PENDING invitation + you not in members           -> you just need to Accept the invite in-app (Notifications).');
  console.log('  • status=deleted                                      -> soft-deleted; recoverable within the recovery window.');
  console.log('  • No workspace doc by that name at all                -> hard-deleted; restore from backup.\n');
})().catch(e => { console.error('FAILED:', e); process.exit(1); });
