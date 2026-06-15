/**
 * READ-ONLY: list every workspace (name, status, owner identity, member count,
 * created date) and optionally search screenplays/projects for a --find term.
 * No writes. Admin SDK via ADC.
 *
 *   node scripts/list-workspaces.cjs
 *   node scripts/list-workspaces.cjs --find "company move"
 */
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: process.env.GOOGLE_CLOUD_PROJECT || 'my-film-jobs' });
const db = admin.firestore();

const arg = f => { const i = process.argv.indexOf(f); return i >= 0 ? process.argv[i + 1] : null; };
const find = (arg('--find') || '').trim().toLowerCase();
const ts = v => (v && v.toDate ? v.toDate().toISOString().slice(0, 10) : (v ?? ''));

const idCache = new Map();
const who = async id => {
  if (!id) return '(none)';
  if (idCache.has(id)) return idCache.get(id);
  let l;
  try { const u = await admin.auth().getUser(id); l = `${u.email || '(no email)'}${u.displayName ? ' / ' + u.displayName : ''}`; }
  catch (e) { l = `${id} (no auth user)`; }
  idCache.set(id, l);
  return l;
};

(async () => {
  const all = await db.collection('workspaces').get();
  console.log(`\nAll ${all.size} workspaces (READ ONLY), oldest first:\n`);
  const rows = all.docs.slice().sort((a, b) => {
    const av = a.data().createdAt && a.data().createdAt.toMillis ? a.data().createdAt.toMillis() : 0;
    const bv = b.data().createdAt && b.data().createdAt.toMillis ? b.data().createdAt.toMillis() : 0;
    return av - bv;
  });
  for (const doc of rows) {
    const d = doc.data() || {};
    const ids = new Set([
      ...(d.ownerId ? [d.ownerId] : []),
      ...(Array.isArray(d.memberIds) ? d.memberIds : []),
      ...((Array.isArray(d.members) ? d.members : []).map(m => m && m.userId).filter(Boolean))
    ]);
    console.log(`  • "${d.name}"  [${d.status || 'active'}]  owner=${await who(d.ownerId)}  members=${ids.size}  created=${ts(d.createdAt)}  id=${doc.id}`);
  }

  if (find) {
    console.log(`\n=== Cross-collection search for "${find}" ===`);
    for (const col of ['screenplays', 'projects', 'Projects']) {
      let snap;
      try { snap = await db.collection(col).get(); }
      catch (e) { console.log(`  ${col}: (not readable: ${e.message})`); continue; }
      const hits = snap.docs.filter(doc => {
        const x = doc.data() || {};
        return [x.name, x.title, x.projectName].some(v => typeof v === 'string' && v.toLowerCase().includes(find));
      });
      console.log(`  ${col}: ${snap.size} docs, ${hits.length} name/title match`);
      for (const h of hits.slice(0, 12)) {
        const x = h.data();
        console.log(`     - "${x.name || x.title || x.projectName}"  id=${h.id}  workspaceId=${x.workspaceId || '(none)'}  by=${await who(x.uploadedBy || x.ownerId || x.createdBy)}`);
      }
    }
  }
})().catch(e => { console.error('FAILED:', e); process.exit(1); });
