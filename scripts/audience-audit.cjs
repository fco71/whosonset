#!/usr/bin/env node
/**
 * audience-audit.cjs
 * -----------------------------------------------------------------------------
 * Read-only audience diagnostic for My Film Jobs (whosonset).
 *
 * Answers three questions from data you already own (no GA4 needed):
 *   1. Signups over time  -> are you actually growing, or flat?
 *   2. Did the blog move the needle? (compares 90 days before vs after launch)
 *   3. Is your audience mostly students you onboarded? (email-domain clustering
 *      + same-day signup bursts + optional teacherClasses roster sizes)
 *   4. Do people come back? (re-auth gap: creationTime vs lastSignInTime)
 *
 * It ONLY reads Firebase Auth + a few Firestore collections, and writes two
 * local files (CSV + JSON) into ./audience-report/. It never writes to Firebase.
 *
 * -----------------------------------------------------------------------------
 * RUN IT (locally, where you deploy from):
 *
 *   1. Get a service-account key (one time):
 *        Firebase Console -> Project settings -> Service accounts
 *        -> "Generate new private key" -> save as serviceAccount.json (DO NOT COMMIT)
 *
 *   2. From the repo root:
 *        GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json \
 *        node scripts/audience-audit.cjs
 *
 *   Optional flags:
 *        --blog-launch=2026-02-09   (default; the date your blog went live)
 *        --window=90                (days each side of launch to compare)
 *        --project=my-film-jobs     (Firebase project id)
 *        --no-firestore             (Auth-only; skip class/membership enrichment)
 *        --self-test                (runs the math on synthetic data, no Firebase)
 *
 * Verify the logic with no credentials:  node scripts/audience-audit.cjs --self-test
 * -----------------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

// ----------------------------- arg parsing ----------------------------------
const argv = process.argv.slice(2);
const flag = (name, def) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
};
const has = (name) => argv.includes(`--${name}`);

const BLOG_LAUNCH = flag('blog-launch', process.env.BLOG_LAUNCH || '2026-02-09');
const WINDOW_DAYS = parseInt(flag('window', '90'), 10);
const PROJECT_ID = flag('project', process.env.FIREBASE_PROJECT_ID || 'my-film-jobs');
const OUT_DIR = flag('out', path.join(process.cwd(), 'audience-report'));
const SELF_TEST = has('self-test');
const NO_FIRESTORE = has('no-firestore');
const FROM_EXPORT = flag('from-export', '');

const DAY = 86400000;

// ----------------------------- pure helpers ---------------------------------
const monthKey = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
const dayKey = (d) => d.toISOString().slice(0, 10);
const pct = (n, total) => (total ? `${((100 * n) / total).toFixed(1)}%` : '0.0%');

function domainOf(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return '(none)';
  return email.split('@').pop().toLowerCase().trim();
}

// Accepts ISO strings (Admin SDK) OR epoch ms/seconds (firebase auth:export).
function toEpoch(v) {
  if (v == null || v === '') return NaN;
  if (typeof v === 'number') return v >= 1e12 ? v : v * 1000;
  const s = String(v).trim();
  if (/^\d+$/.test(s)) return s.length >= 13 ? Number(s) : Number(s) * 1000;
  return new Date(s).getTime();
}

// Maps a `firebase auth:export` JSON file into the shape analyze() expects.
function readExport(file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const arr = Array.isArray(raw) ? raw : raw.users || [];
  return arr.map((u) => ({
    uid: u.localId || u.uid || u.userId || '',
    email: u.email || '',
    creationTime: u.createdAt != null ? u.createdAt : u.creationTime,
    lastSignInTime:
      u.lastLoginAt != null
        ? u.lastLoginAt
        : u.lastRefreshAt != null
        ? u.lastRefreshAt
        : u.lastSignInTime != null
        ? u.lastSignInTime
        : u.createdAt,
  }));
}

// Horizontal bar for console tables.
function bar(n, max, width = 40) {
  if (max <= 0) return '';
  const len = Math.round((n / max) * width);
  return '█'.repeat(Math.max(0, len)) + '·'.repeat(Math.max(0, width - len));
}

function median(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Core analysis. `users` is an array of:
 *   { uid, email, creationTime (ISO|ms), lastSignInTime (ISO|ms) }
 */
function analyze(users, opts) {
  const launch = new Date(opts.blogLaunch + 'T00:00:00Z').getTime();
  const win = opts.windowDays * DAY;

  const rows = users
    .map((u) => {
      const created = toEpoch(u.creationTime);
      const last = u.lastSignInTime ? toEpoch(u.lastSignInTime) : created;
      return {
        uid: u.uid,
        email: u.email || '',
        domain: domainOf(u.email),
        created,
        last,
        gapDays: Math.max(0, (last - created) / DAY),
      };
    })
    .filter((r) => Number.isFinite(r.created))
    .sort((a, b) => a.created - b.created);

  // ---- signups by month ----
  const byMonth = {};
  const byDay = {};
  for (const r of rows) {
    const d = new Date(r.created);
    byMonth[monthKey(d)] = (byMonth[monthKey(d)] || 0) + 1;
    byDay[dayKey(d)] = (byDay[dayKey(d)] || 0) + 1;
  }

  // ---- blog pre/post ----
  const preCount = rows.filter((r) => r.created >= launch - win && r.created < launch).length;
  const postCount = rows.filter((r) => r.created >= launch && r.created < launch + win).length;
  const weeks = opts.windowDays / 7;

  // ---- signup bursts (cohort-onboarding fingerprint) ----
  const dayCounts = Object.entries(byDay).map(([day, n]) => ({ day, n }));
  const med = median(dayCounts.filter((d) => d.n > 0).map((d) => d.n)) || 1;
  const burstThreshold = Math.max(5, Math.ceil(med * 3));
  const dominantDomainForDay = (day) => {
    const tally = {};
    for (const r of rows) {
      if (dayKey(new Date(r.created)) === day) tally[r.domain] = (tally[r.domain] || 0) + 1;
    }
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]})` : '';
  };
  const bursts = dayCounts
    .filter((d) => d.n >= burstThreshold)
    .sort((a, b) => b.n - a.n)
    .slice(0, 15)
    .map((d) => ({ ...d, dominant: dominantDomainForDay(d.day) }));

  // ---- email-domain clustering ----
  const domainTally = {};
  for (const r of rows) domainTally[r.domain] = (domainTally[r.domain] || 0) + 1;
  const domains = Object.entries(domainTally)
    .map(([domain, n]) => ({ domain, n, isEdu: /\.edu(\.|$)/.test(domain) || domain.endsWith('.ac.uk') }))
    .sort((a, b) => b.n - a.n);
  const eduCount = domains.filter((d) => d.isEdu).reduce((s, d) => s + d.n, 0);

  // ---- return behaviour (re-auth gap; LOWER bound on real engagement) ----
  const buckets = { neverReturned: 0, within7d: 0, within30d: 0, after30d: 0 };
  for (const r of rows) {
    if (r.gapDays < 1) buckets.neverReturned += 1;
    else if (r.gapDays < 7) buckets.within7d += 1;
    else if (r.gapDays < 30) buckets.within30d += 1;
    else buckets.after30d += 1;
  }

  return {
    total: rows.length,
    byMonth,
    blog: {
      launch: opts.blogLaunch,
      windowDays: opts.windowDays,
      preCount,
      postCount,
      prePerWeek: +(preCount / weeks).toFixed(2),
      postPerWeek: +(postCount / weeks).toFixed(2),
    },
    bursts,
    burstThreshold,
    medianDaily: med,
    domains,
    eduCount,
    buckets,
    rows,
  };
}

// ----------------------------- reporting ------------------------------------
function renderReport(s) {
  const line = (c = '─') => c.repeat(72);
  console.log('\n' + line('='));
  console.log(`  MY FILM JOBS — AUDIENCE AUDIT   (total accounts: ${s.total})`);
  console.log(line('='));

  // signups by month
  console.log('\n1) SIGNUPS BY MONTH (account creation)\n');
  const months = Object.keys(s.byMonth).sort();
  const maxM = Math.max(1, ...Object.values(s.byMonth));
  for (const m of months) {
    const n = s.byMonth[m];
    const mark = m === s.blog.launch.slice(0, 7) ? '  <- blog launched' : '';
    console.log(`  ${m}  ${String(n).padStart(4)}  ${bar(n, maxM, 36)}${mark}`);
  }

  // blog impact
  console.log('\n2) DID THE BLOG MOVE SIGNUPS?  (±' + s.blog.windowDays + ' days around ' + s.blog.launch + ')\n');
  console.log(`  Before:  ${s.blog.preCount} signups  (${s.blog.prePerWeek}/week)`);
  console.log(`  After:   ${s.blog.postCount} signups  (${s.blog.postPerWeek}/week)`);
  const delta = s.blog.postPerWeek - s.blog.prePerWeek;
  const dir = delta > 0 ? `+${delta.toFixed(2)}/week` : `${delta.toFixed(2)}/week`;
  console.log(`  Net:     ${dir}  ${Math.abs(delta) < 0.25 ? '(noise — your "maybe coincidence" hunch looks right)' : ''}`);

  // student / cohort fingerprint
  console.log('\n3) IS IT STUDENTS YOU ONBOARDED?\n');
  console.log(`  Top email domains:`);
  const maxD = Math.max(1, ...s.domains.slice(0, 12).map((d) => d.n));
  for (const d of s.domains.slice(0, 12)) {
    console.log(`    ${d.domain.padEnd(28)} ${String(d.n).padStart(4)}  ${bar(d.n, maxD, 24)}${d.isEdu ? '  [edu]' : ''}`);
  }
  console.log(`  Academic (.edu/.ac.uk) accounts: ${s.eduCount}  (${pct(s.eduCount, s.total)} of all signups)`);
  console.log(`\n  Same-day signup bursts (>= ${s.burstThreshold} in one day; median day = ${s.medianDaily}):`);
  if (!s.bursts.length) console.log('    none — signups arrive steadily, not in cohort batches.');
  for (const b of s.bursts) console.log(`    ${b.day}  ${String(b.n).padStart(3)} signups   dominant: ${b.dominant}`);
  console.log('    (A burst on one day from one domain = a class onboarded together, not organic reach.)');

  // returns
  console.log('\n4) DO THEY COME BACK?  (re-authentication gap — a LOWER bound)\n');
  const b = s.buckets;
  console.log(`  Never re-authed (<1d gap):  ${b.neverReturned}  (${pct(b.neverReturned, s.total)})`);
  console.log(`  Returned within 7d:         ${b.within7d}  (${pct(b.within7d, s.total)})`);
  console.log(`  Returned within 30d:        ${b.within30d}  (${pct(b.within30d, s.total)})`);
  console.log(`  Returned after 30d:         ${b.after30d}  (${pct(b.after30d, s.total)})`);
  console.log('  NOTE: persistent login sessions mean a daily user may rarely RE-auth,');
  console.log('  so this understates real return visits. For true active usage, wire GA4.');

  console.log('\n' + line('='));
  console.log('  READ IT LIKE THIS:');
  console.log('   • Flat months + a one-day .edu burst + high "never returned"  => captive');
  console.log('     student traffic, not casual discovery. Reach is your real gap.');
  console.log('   • Steady multi-domain signups + real returns => you have organic pull;');
  console.log('     focus on conversion, not discovery.');
  console.log(line('=') + '\n');
}

function writeArtifacts(s) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const csv = [
    'uid,email,domain,created_iso,last_signin_iso,gap_days,returned',
    ...s.rows.map((r) =>
      [
        r.uid,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        r.domain,
        new Date(r.created).toISOString(),
        new Date(r.last).toISOString(),
        r.gapDays.toFixed(2),
        r.gapDays >= 1 ? 'yes' : 'no',
      ].join(',')
    ),
  ].join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'accounts.csv'), csv);

  const summary = { ...s };
  delete summary.rows; // keep summary small
  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(`Wrote ${path.join(OUT_DIR, 'accounts.csv')}`);
  console.log(`Wrote ${path.join(OUT_DIR, 'summary.json')}\n`);
}

// ----------------------------- live data ------------------------------------
async function fetchAllAuthUsers(admin) {
  const out = [];
  let token;
  do {
    const page = await admin.auth().listUsers(1000, token);
    for (const u of page.users) {
      out.push({
        uid: u.uid,
        email: u.email || '',
        creationTime: u.metadata.creationTime,
        lastSignInTime: u.metadata.lastSignInTime,
      });
    }
    token = page.pageToken;
  } while (token);
  return out;
}

async function enrichFirestore(admin) {
  const db = admin.firestore();
  console.log('5) CLASS / MEMBERSHIP ENRICHMENT (Firestore)\n');
  // teacherClasses -> roster sizes
  try {
    const snap = await db.collection('teacherClasses').get();
    let rosterTotal = 0;
    const classes = [];
    snap.forEach((doc) => {
      const d = doc.data() || {};
      const manual = Array.isArray(d.manualStudents) ? d.manualStudents.length : 0;
      const groups = Array.isArray(d.workspaceIds) ? d.workspaceIds.length : 0;
      rosterTotal += manual;
      classes.push({ name: d.name || doc.id, manual, groups });
    });
    console.log(`  teacherClasses: ${snap.size} class(es), ~${rosterTotal} manual roster entries`);
    classes
      .sort((a, b) => b.manual - a.manual)
      .slice(0, 10)
      .forEach((c) => console.log(`    • ${String(c.name).slice(0, 40).padEnd(40)} students:${c.manual}  groups:${c.groups}`));
  } catch (e) {
    console.log(`  teacherClasses: skipped (${e.code || e.message})`);
  }
  // workspaceMemberships -> distinct members "inside a class/workspace"
  try {
    const snap = await db.collection('workspaceMemberships').get();
    const members = new Set();
    snap.forEach((doc) => {
      const d = doc.data() || {};
      const uid = d.uid || d.memberUid || d.userId;
      if (uid) members.add(uid);
    });
    console.log(`  workspaceMemberships: ${snap.size} membership docs, ${members.size} distinct member uids`);
    console.log('    (distinct members inside classes/workspaces — compare to total accounts above)');
  } catch (e) {
    console.log(`  workspaceMemberships: skipped (${e.code || e.message})`);
  }
  console.log('');
}

// ----------------------------- self test ------------------------------------
function selfTest() {
  // Synthetic: a steady trickle + one big .edu cohort burst on 2026-03-02,
  // most of whom never return. Confirms bursts/domain/return math.
  const users = [];
  const mk = (uid, email, created, last) => ({ uid, email, creationTime: created, lastSignInTime: last });
  // steady trickle Jan–Apr, mixed domains, half return
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  for (let i = 0; i < 40; i++) {
    const day = new Date(Date.UTC(2026, 0, 1 + i * 2)).toISOString();
    const last = i % 2 ? new Date(Date.UTC(2026, 2, 1 + i)).toISOString() : day; // half return
    users.push(mk(`t${i}`, `user${i}@${domains[i % 4]}`, day, last));
  }
  // cohort burst: 30 students, same day, same school, none return
  for (let i = 0; i < 30; i++) {
    const day = new Date(Date.UTC(2026, 2, 2, 14)).toISOString();
    users.push(mk(`s${i}`, `student${i}@filmschool.edu`, day, day));
  }
  const s = analyze(users, { blogLaunch: BLOG_LAUNCH, windowDays: WINDOW_DAYS });
  renderReport(s);
  console.log('SELF-TEST EXPECTATIONS:');
  console.log('  • a burst row on 2026-03-02 (~30) dominant filmschool.edu (30)');
  console.log('  • filmschool.edu ~30 in domain table, flagged [edu]');
  console.log('  • "never returned" elevated by the 30-student cohort');
  console.log(`  • computed total = ${s.total} (expected 70)\n`);
  if (s.total !== 70) {
    console.error('SELF-TEST FAILED: total mismatch');
    process.exit(1);
  }
  console.log('SELF-TEST OK ✅\n');
}

// ----------------------------- main -----------------------------------------
(async () => {
  if (SELF_TEST) return selfTest();

  // ---- No-key path: analyze a `firebase auth:export` JSON file ----
  if (FROM_EXPORT) {
    if (!fs.existsSync(FROM_EXPORT)) {
      console.error(`\n  Export file not found: ${FROM_EXPORT}`);
      console.error('  Create it with the Firebase CLI (uses your existing `firebase login`, no key needed):');
      console.error(`    firebase auth:export ${FROM_EXPORT} --project ${PROJECT_ID}\n`);
      process.exit(1);
    }
    const users = readExport(FROM_EXPORT);
    console.log(`Loaded ${users.length} accounts from ${FROM_EXPORT}`);
    const s = analyze(users, { blogLaunch: BLOG_LAUNCH, windowDays: WINDOW_DAYS });
    renderReport(s);
    writeArtifacts(s);
    console.log('(Class/membership enrichment needs Firestore — skipped in --from-export mode.)\n');
    process.exit(0);
  }

  let admin;
  try {
    admin = require('firebase-admin');
  } catch (e) {
    console.error('firebase-admin not found. Run from the repo root (npm i already includes it).');
    process.exit(1);
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath || !fs.existsSync(credPath)) {
    console.error('\n  No service-account key found at: ' + (credPath || '(unset)'));
    console.error('  ----------------------------------------------------------------');
    console.error('  EASIEST (no key — uses the firebase login you already have):');
    console.error(`    firebase auth:export auth-users.json --project ${PROJECT_ID}`);
    console.error('    node scripts/audience-audit.cjs --from-export=auth-users.json');
    console.error('  ----------------------------------------------------------------');
    console.error('  OR create a service-account key (only if org policy allows):');
    console.error(`   1. Open: https://console.firebase.google.com/project/${PROJECT_ID}/settings/serviceaccounts/adminsdk`);
    console.error('   2. Click "Generate new private key" -> Generate. A .json downloads.');
    console.error('   3. Move it into this folder as serviceAccount.json, e.g.:');
    console.error('        mv ~/Downloads/*firebase-adminsdk*.json ./serviceAccount.json');
    console.error('   4. Re-run (one line, no # comments):');
    console.error('        GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node scripts/audience-audit.cjs');
    console.error('  ----------------------------------------------------------------\n');
    process.exit(1);
  }

  admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: PROJECT_ID });

  console.log(`Fetching Firebase Auth users for project "${PROJECT_ID}" ...`);
  const users = await fetchAllAuthUsers(admin);
  console.log(`Fetched ${users.length} accounts.`);

  const s = analyze(users, { blogLaunch: BLOG_LAUNCH, windowDays: WINDOW_DAYS });
  renderReport(s);
  writeArtifacts(s);

  if (!NO_FIRESTORE) {
    try {
      await enrichFirestore(admin);
    } catch (e) {
      console.log(`Firestore enrichment skipped: ${e.message}`);
    }
  }

  process.exit(0);
})().catch((e) => {
  console.error('\nAudit failed:', e.message);
  if (/permission|PERMISSION|insufficient/i.test(e.message)) {
    console.error('The service account needs Firebase Auth + Firestore read access (the default Admin SDK key has both).');
  }
  process.exit(1);
});
