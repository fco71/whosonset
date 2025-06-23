// scripts/seedJobDepartments.ts
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const jobDepartments = [
  {
    name: 'Camera',
    titles: [
      'Director of Photography (DP)',
      'Camera Operator',
      '1st Assistant Camera',
      '2nd Assistant Camera',
      'Steadicam Operator',
      'Drone Operator',
    ],
  },
  {
    name: 'Production',
    titles: [
      'Executive Producer',
      'Producer',
      'Co-Producer',
      'Associate Producer',
      'Line Producer',
      'Production Manager',
    ],
  },
  {
    name: 'Art',
    titles: [
      'Production Designer',
      'Art Director',
      'Set Decorator',
      'Set Dresser',
      'Prop Master',
      'Scenic Artist',
    ],
  },
  {
    name: 'Sound',
    titles: [
      'Production Sound Mixer',
      'Boom Operator',
      'Sound Assistant',
      'Foley Artist',
    ],
  },
  {
    name: 'Makeup & Hair',
    titles: [
      'Makeup Artist',
      'Hair Stylist',
      'Special Effects Makeup Artist',
    ],
  },
  {
    name: 'Lighting',
    titles: [
      'Gaffer',
      'Best Boy Electric',
      'Electrician',
      'Lighting Technician',
    ],
  },
  {
    name: 'Grip',
    titles: [
      'Key Grip',
      'Best Boy Grip',
      'Dolly Grip',
    ],
  },
  {
    name: 'Other',
    titles: [],
  },
];

async function seed() {
  const batch = db.batch();
  const col = db.collection('jobDepartments');

  jobDepartments.forEach((dept) => {
    const docRef = col.doc(dept.name); // Department name as document ID
    batch.set(docRef, dept);
  });

  await batch.commit();
  console.log(`✅ Seeded ${jobDepartments.length} departments.`);
}

seed().catch((err) => {
  console.error('❌ Error seeding departments:', err);
});
