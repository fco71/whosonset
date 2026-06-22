#!/usr/bin/env node
/**
 * ONE-TIME MIGRATION — move email/phone out of the world-readable crewProfiles docs
 * into the owner-only `crewProfiles/{uid}/private/contact` subdoc.
 *
 * Why: a published crewProfiles doc is readable by anyone, and Firestore has no
 * field-level read control, so contact PII must physically leave the public doc.
 * This relocates email/phone, strips the public copies, drops the dead
 * emailPrivate/phonePrivate flags, and sets showPublicContact=false (opt-in default).
 *
 * SAFETY:
 *   - DRY RUN by default — writes NOTHING, just prints what it would do.
 *   - Idempotent — re-running skips already-migrated docs.
 *   - Respects opt-ins — profiles with showPublicContact===true are left alone.
 *   - Back up crewProfiles first (gcloud firestore export) — already done.
 *
 * AUTH (uses Application Default Credentials — no service-account key needed):
 *   gcloud auth application-default login --project my-film-jobs
 *
 * RUN:
 *   cd functions && node migrate-contacts.cjs              # dry run (review this first)
 *   cd functions && node migrate-contacts.cjs --commit     # actually write
 */
const admin = require('firebase-admin');

const COMMIT = process.argv.includes('--commit');
const PROJECT = 'my-film-jobs';

admin.initializeApp({ projectId: PROJECT });
const db = admin.firestore();
const { FieldValue } = admin.firestore;

const str = (x) => (typeof x === 'string' ? x.trim() : '');

async function main() {
  console.log(`\n=== Contact privacy migration — ${COMMIT ? 'COMMIT (WILL WRITE)' : 'DRY RUN (no writes)'} ===`);
  console.log(`Project: ${PROJECT}\n`);

  const snap = await db.collection('crewProfiles').get();
  let total = 0, migrated = 0, optInKept = 0, alreadyClean = 0, withEmail = 0, withPhone = 0, errors = 0;

  for (const doc of snap.docs) {
    total++;
    const data = doc.data() || {};
    const ci = data.contactInfo || {};

    // Respect anyone who explicitly chose to show their contact publicly.
    if (data.showPublicContact === true) { optInKept++; continue; }

    const email = str(data.email) || str(ci.email);
    const phone = str(ci.phone);

    const hasPublicContact =
      data.email !== undefined ||
      ci.email !== undefined || ci.phone !== undefined ||
      ci.emailPrivate !== undefined || ci.phonePrivate !== undefined;
    const needsFlag = data.showPublicContact === undefined;

    if (!hasPublicContact && !needsFlag) { alreadyClean++; continue; }

    if (email) withEmail++;
    if (phone) withPhone++;
    const label = `${doc.id}  email:${email ? 'yes' : '—'}  phone:${phone ? 'yes' : '—'}`;

    if (!COMMIT) {
      console.log(`  would migrate   ${label}`);
      migrated++;
      continue;
    }

    try {
      // 1) Preserve contact privately. Only write non-empty values so a re-run
      //    can never blank an existing private record.
      const priv = {};
      if (email) priv.email = email;
      if (phone) priv.phone = phone;
      if (Object.keys(priv).length) {
        await db.doc(`crewProfiles/${doc.id}/private/contact`).set(priv, { merge: true });
      }

      // 2) Strip the public copies + drop dead flags + set the opt-in default.
      const updates = { showPublicContact: false };
      if (data.email !== undefined) updates.email = FieldValue.delete();
      if (ci.email !== undefined) updates['contactInfo.email'] = FieldValue.delete();
      if (ci.phone !== undefined) updates['contactInfo.phone'] = FieldValue.delete();
      if (ci.emailPrivate !== undefined) updates['contactInfo.emailPrivate'] = FieldValue.delete();
      if (ci.phonePrivate !== undefined) updates['contactInfo.phonePrivate'] = FieldValue.delete();
      await doc.ref.update(updates);

      migrated++;
      if (migrated % 25 === 0) console.log(`  ...migrated ${migrated}`);
    } catch (e) {
      errors++;
      console.error(`  ERROR ${doc.id}: ${e.message}`);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`  profiles scanned:            ${total}`);
  console.log(`  ${COMMIT ? 'migrated' : 'WOULD migrate'}:              ${migrated}`);
  console.log(`     with email to move:       ${withEmail}`);
  console.log(`     with phone to move:       ${withPhone}`);
  console.log(`  left public (opted in):      ${optInKept}`);
  console.log(`  already clean (skipped):     ${alreadyClean}`);
  if (COMMIT) console.log(`  errors:                      ${errors}`);
  else console.log(`\n  DRY RUN — nothing was written. Re-run with --commit to apply.`);
  console.log('');
}

main().then(() => process.exit(0)).catch((e) => {
  console.error('\nMigration failed:', e.message);
  console.error('If this is an auth error, run: gcloud auth application-default login --project my-film-jobs\n');
  process.exit(1);
});
