#!/usr/bin/env node
/*
 * Negative security test: a self-labeled "teacher" student must NOT be able to
 * self-elect as workspace supervisor.
 *
 * WHY THIS SCRIPT EXISTS
 *   The 2026-06-11 teacher-privilege hardening fixed (a) firestore.rules and
 *   (b) the client UI gate, but the client self-elects through the
 *   setWorkspaceSupervisorMode CALLABLE, which runs with the Admin SDK and
 *   BYPASSES rules. Until the callable also checks teacherRoles/{uid}
 *   (fixed in functions/src/workspaceSupervisors.ts on 2026-06-11, DEPLOY
 *   REQUIRED), a student can self-promote. This script proves both vectors.
 *
 * PRECONDITION
 *   Deploy the functions fix FIRST, or test PATH 2 will report the vuln is OPEN:
 *     firebase deploy --only functions:setWorkspaceSupervisorMode --project my-film-jobs
 *
 * USAGE (run locally, where Firebase APIs are reachable — NOT from the agent
 * sandbox, which has no network route to *.googleapis.com):
 *   1) Ensure .env has the REACT_APP_FIREBASE_* web config (already present).
 *   2) node scripts/negative-test-teacher-escalation.cjs
 *
 * WHAT IT DOES (all on a disposable account it creates and deletes):
 *   - Creates codex.sec.test.<ts>@example.com / random password.
 *   - Writes crewProfiles/{uid} with profileType:'teacher' + isTeacher:true
 *     (allowed — these are cosmetic, user-writable fields).
 *   - Creates a SECOND disposable account that owns a workspace and adds the
 *     attacker as a plain member (the callable requires membership + ownerId!=uid).
 *   - PATH 1 (rules): attacker attempts a DIRECT updateDoc adding self to
 *     selfElectedSupervisors -> expect PERMISSION_DENIED.
 *   - PATH 2 (callable): attacker calls setWorkspaceSupervisorMode({enabled:true})
 *     -> expect functions/permission-denied. If it SUCCEEDS, the vuln is OPEN.
 *   - Cleans up: deletes the workspace, both crewProfiles, both Auth accounts.
 *     Deleting the Auth accounts also exercises the onAuthUserDeleted trigger;
 *     check Cloud Functions logs for the cleanup summary line afterward.
 *
 * EXIT CODE: 0 = both vectors correctly denied; 1 = a vector was allowed (vuln).
 */

const fs = require('fs');
const path = require('path');

// Minimal .env loader (avoid adding a dependency).
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const { initializeApp } = require('firebase/app');
const {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, deleteUser,
} = require('firebase/auth');
const {
  getFirestore, doc, setDoc, updateDoc, deleteDoc, arrayUnion,
} = require('firebase/firestore');
const { getFunctions, httpsCallable } = require('firebase/functions');

const cfg = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!cfg.apiKey || !cfg.projectId) {
  console.error('Missing REACT_APP_FIREBASE_* config in .env');
  process.exit(2);
}

const ts = Date.now();
const ATT_EMAIL = `codex.sec.test.attacker.${ts}@example.com`;
const OWN_EMAIL = `codex.sec.test.owner.${ts}@example.com`;
const PW = `Sec!${ts}aZ`;
const WS_ID = `codex_sec_ws_${ts}`;

const isDenied = (e) =>
  e && (e.code === 'permission-denied' ||
        e.code === 'functions/permission-denied' ||
        /permission-denied/i.test(String(e.message || '')));

(async () => {
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const dbc = getFirestore(app);
  const fns = getFunctions(app, 'us-central1');

  let attackerUid = null;
  let ownerUid = null;
  let path1Denied = false;
  let path2Denied = false;

  try {
    // --- Owner account creates a workspace, adds attacker as a plain member ---
    const owner = await createUserWithEmailAndPassword(auth, OWN_EMAIL, PW);
    ownerUid = owner.user.uid;
    // Create attacker first so we know its uid for the member array.
    await signOut(auth);
    const attacker = await createUserWithEmailAndPassword(auth, ATT_EMAIL, PW);
    attackerUid = attacker.user.uid;
    // Attacker self-labels as teacher (cosmetic, user-writable).
    await setDoc(doc(dbc, 'crewProfiles', attackerUid), {
      uid: attackerUid, name: 'Sec Test Attacker',
      profileType: 'teacher', isTeacher: true, email: ATT_EMAIL,
    });

    // Owner creates the workspace with attacker as member (ownerId != attacker).
    await signOut(auth);
    await signInWithEmailAndPassword(auth, OWN_EMAIL, PW);
    await setDoc(doc(dbc, 'workspaces', WS_ID), {
      name: 'Sec Test WS', ownerId: ownerUid,
      memberIds: [ownerUid, attackerUid],
      members: [
        { userId: ownerUid, role: 'owner' },
        { userId: attackerUid, role: 'member' },
      ],
      selfElectedSupervisors: [], status: 'active',
    });

    // --- Switch to attacker ---
    await signOut(auth);
    await signInWithEmailAndPassword(auth, ATT_EMAIL, PW);

    // PATH 1: direct Firestore write (governed by firestore.rules).
    try {
      await updateDoc(doc(dbc, 'workspaces', WS_ID), {
        selfElectedSupervisors: arrayUnion(attackerUid),
        updatedAt: new Date(),
      });
      console.error('PATH 1 (rules): ALLOWED — VULNERABLE. Direct write succeeded.');
    } catch (e) {
      path1Denied = isDenied(e);
      console.log(`PATH 1 (rules): ${path1Denied ? 'DENIED (correct)' : 'ERROR ' + e.code}`);
    }

    // PATH 2: the setWorkspaceSupervisorMode callable (Admin SDK, bypasses rules).
    try {
      const call = httpsCallable(fns, 'setWorkspaceSupervisorMode');
      await call({ workspaceId: WS_ID, enabled: true });
      console.error('PATH 2 (callable): ALLOWED — VULNERABLE. Self-election succeeded.');
    } catch (e) {
      path2Denied = isDenied(e);
      console.log(`PATH 2 (callable): ${path2Denied ? 'DENIED (correct)' : 'ERROR ' + e.code}`);
    }
  } catch (e) {
    console.error('Test setup error:', e.code || e.message);
  } finally {
    // --- Cleanup (best-effort) ---
    try {
      await signOut(auth);
      await signInWithEmailAndPassword(auth, OWN_EMAIL, PW);
      // Rules only allow deleting a workspace once it is soft-deleted
      // (status == 'deleted'); hard-deleting an active doc is denied and would
      // orphan it. Soft-delete first, then hard-delete.
      await updateDoc(doc(dbc, 'workspaces', WS_ID), { status: 'deleted' }).catch(() => {});
      await deleteDoc(doc(dbc, 'workspaces', WS_ID)).catch(() => {});
      await deleteUser(auth.currentUser).catch(() => {});
    } catch (_) {}
    try {
      await signOut(auth);
      await signInWithEmailAndPassword(auth, ATT_EMAIL, PW);
      await deleteDoc(doc(dbc, 'crewProfiles', attackerUid)).catch(() => {});
      await deleteUser(auth.currentUser).catch(() => {});
    } catch (_) {}
    console.log('Cleanup done. Verify onAuthUserDeleted in Cloud Functions logs.');
  }

  const ok = path1Denied && path2Denied;
  console.log(ok
    ? '\nRESULT: PASS — both self-election vectors denied.'
    : '\nRESULT: FAIL — a vector was allowed (see above). Deploy the callable fix.');
  process.exit(ok ? 0 : 1);
})();
