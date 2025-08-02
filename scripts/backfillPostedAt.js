import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

async function backfillPostedAt() {
  const jobsRef = db.collection('jobPostings');
  const snapshot = await jobsRef.get();
  let updated = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.postedAt) {
      const postedAt = data.createdAt || FieldValue.serverTimestamp();
      await doc.ref.update({ postedAt });
      updated++;
      console.log(`Updated job ${doc.id} with postedAt.`);
    }
  }
  console.log(`Backfill complete. Updated ${updated} jobs.`);
}

backfillPostedAt().catch(console.error); 