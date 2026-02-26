/**
 * fix-crew-photos.js
 *
 * Uses the Firebase CLI's stored OAuth credentials to talk to Firestore
 * via REST API — no service account key or gcloud re-auth needed.
 *
 * Step 1: Backs up the entire crewProfiles collection to a local JSON file.
 * Step 2: Finds José María Carbal's profileImageUrl.
 * Step 3: Lists all other profiles sharing that same URL.
 * Step 4: With --fix flag, clears profileImageUrl to "" for those profiles.
 *
 * Usage:
 *   node fix-crew-photos.js          # dry run: backup + show what would change
 *   node fix-crew-photos.js --fix    # backup + apply the fix
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_ID = 'my-film-jobs';
const FIX_MODE = process.argv.includes('--fix');

// ── Firebase CLI OAuth2 client credentials (public, from firebase-tools) ────
const FIREBASE_CLI_CLIENT_ID =
  '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const FIREBASE_CLI_CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

// ── Helpers ──────────────────────────────────────────────────────────────────

function httpsRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getAccessToken() {
  const configPath = path.join(
    os.homedir(),
    '.config/configstore/firebase-tools.json'
  );
  if (!fs.existsSync(configPath)) {
    throw new Error('Firebase CLI config not found. Run: firebase login');
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const refreshToken = config?.tokens?.refresh_token;
  if (!refreshToken) {
    throw new Error('No refresh token in Firebase CLI config. Run: firebase login');
  }

  const body = new URLSearchParams({
    client_id: FIREBASE_CLI_CLIENT_ID,
    client_secret: FIREBASE_CLI_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  }).toString();

  const result = await httpsRequest(
    {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
    body
  );

  if (result.status !== 200 || !result.body.access_token) {
    throw new Error(`Token refresh failed: ${JSON.stringify(result.body)}`);
  }
  return result.body.access_token;
}

// Firestore REST: list all documents in a collection (handles pagination)
async function listAllDocuments(token, collectionId) {
  const docs = [];
  let pageToken = null;

  do {
    const qs = pageToken ? `?pageToken=${pageToken}` : '';
    const result = await httpsRequest({
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionId}${qs}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (result.status !== 200) {
      throw new Error(`Firestore list failed (${result.status}): ${JSON.stringify(result.body)}`);
    }

    const documents = result.body.documents || [];
    docs.push(...documents);
    pageToken = result.body.nextPageToken || null;
  } while (pageToken);

  return docs;
}

// Convert Firestore REST document to plain JS object
function firestoreToPlain(firestoreDoc) {
  function convertValue(val) {
    if (val.stringValue !== undefined) return val.stringValue;
    if (val.integerValue !== undefined) return Number(val.integerValue);
    if (val.doubleValue !== undefined) return val.doubleValue;
    if (val.booleanValue !== undefined) return val.booleanValue;
    if (val.nullValue !== undefined) return null;
    if (val.timestampValue !== undefined) return val.timestampValue;
    if (val.arrayValue !== undefined)
      return (val.arrayValue.values || []).map(convertValue);
    if (val.mapValue !== undefined)
      return convertFields(val.mapValue.fields || {});
    return val;
  }
  function convertFields(fields) {
    const obj = {};
    for (const [k, v] of Object.entries(fields)) obj[k] = convertValue(v);
    return obj;
  }
  const docId = firestoreDoc.name.split('/').pop();
  return { _id: docId, ...convertFields(firestoreDoc.fields || {}) };
}

// Firestore REST: patch a single string field on a document
async function patchStringField(token, collectionId, docId, fieldName, value) {
  const body = JSON.stringify({
    fields: { [fieldName]: { stringValue: value } },
  });
  const result = await httpsRequest(
    {
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionId}/${docId}?updateMask.fieldPaths=${fieldName}`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
    body
  );
  if (result.status !== 200) {
    throw new Error(`Patch failed for ${docId} (${result.status}): ${JSON.stringify(result.body)}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔑  Refreshing credentials via Firebase CLI token...');
  const token = await getAccessToken();
  console.log('✅  Credentials OK.\n');

  console.log('🔍  Fetching all crewProfiles from Firestore...');
  const rawDocs = await listAllDocuments(token, 'crewProfiles');
  const profiles = rawDocs.map(firestoreToPlain);
  console.log(`    Found ${profiles.length} documents.\n`);

  // ── 1. BACKUP ──────────────────────────────────────────────────────────────
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(__dirname, `crewProfiles-backup-${timestamp}.json`);
  const backupObj = {};
  profiles.forEach(p => { backupObj[p._id] = p; });
  fs.writeFileSync(backupFile, JSON.stringify(backupObj, null, 2));
  console.log(`✅  Backup saved → ${backupFile}\n`);

  // ── 2. FIND ALL PROFILES WITH GOOGLE AUTHENTICATED PHOTO URLS ────────────
  // lh3.googleusercontent.com/a/ and /a-/ paths are "authenticated" profile
  // photo endpoints that serve the VIEWER's own Google photo instead of the
  // stored user's photo. They must be cleared so users upload their own photos.
  const affected = profiles.filter(p => {
    const url = p.profileImageUrl || '';
    return url.includes('lh3.googleusercontent.com/a');
  });

  console.log(`⚠️   Found ${affected.length} profile(s) with Google authenticated photo URLs`);
  console.log('    (these URLs show the viewer\'s own Google photo, not the profile owner\'s):\n');
  affected.forEach(p => console.log(`  • [${p._id}] ${p.name || '(no name)'}`));

  if (affected.length === 0) {
    console.log('✅  No profiles with problematic Google photo URLs. Nothing to fix.');
    process.exit(0);
  }

  // ── 3. APPLY FIX ──────────────────────────────────────────────────────────
  if (!FIX_MODE) {
    console.log('\n⚡  DRY RUN — no changes made.');
    console.log('    Run with --fix to clear all Google authenticated photo URLs.\n');
    process.exit(0);
  }

  console.log('\n🔧  Applying fix...');
  for (const p of affected) {
    await patchStringField(token, 'crewProfiles', p._id, 'profileImageUrl', '');
    console.log(`  ✔  Cleared profileImageUrl for "${p.name}" (${p._id})`);
  }

  console.log(`\n✅  Done. ${affected.length} profiles will now show the default avatar.`);
  console.log('    Users can upload their own photos via the profile editor.');
  console.log(`\n📦  Backup at: ${backupFile}`);
}

main().catch(err => {
  console.error('❌  Error:', err.message || err);
  process.exit(1);
});
