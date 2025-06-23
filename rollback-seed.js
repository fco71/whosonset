// rollback-seed.js
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: applicationDefault(),
  projectId: 'whosonsetdepez',
});

const db = getFirestore();

// The original flat list of job titles
const jobTitles = [
  "Executive Producer", "Producer", "Co-Producer", "Associate Producer", "Line Producer", "Production Manager", "Unit Production Manager (UPM)", "Production Coordinator", "Production Secretary", "Production Assistant (PA)", "Location Manager", "Assistant Location Manager", "Location Scout", "COVID Compliance Officer", "Director", "Assistant Director (AD) - 1st AD, 2nd AD, 2nd 2nd AD", "Script Supervisor (Continuity)", "Writer", "Screenwriter", "Story Editor", "Director of Photography (DP) / Cinematographer", "Camera Operator", "1st Assistant Camera (1st AC) / Focus Puller", "2nd Assistant Camera (2nd AC) / Clapper Loader", "Camera Technician", "Steadicam Operator", "Drone Operator", "Still Photographer", "Production Sound Mixer", "Boom Operator", "Sound Assistant", "Sound Designer (Post-Production)", "Foley Artist (Post-Production)", "Foley Mixer (Post-Production)", "Gaffer (Chief Lighting Technician)", "Best Boy Electric (Assistant Chief Lighting Technician)", "Electrician", "Lighting Technician", "Key Grip", "Best Boy Grip (Assistant Key Grip)", "Grip", "Dolly Grip", "Production Designer", "Art Director", "Set Decorator", "Set Dresser", "Prop Master", "Prop Builder", "Scenic Artist", "Construction Coordinator", "Construction Foreman", "Costume Designer", "Assistant Costume Designer", "Costume Supervisor", "Set Costumer", "Seamstress/Seamster", "Makeup Artist (Key)", "Hair Stylist (Key)", "Makeup Artist", "Hair Stylist", "Special Effects Makeup Artist", "Editor", "Assistant Editor", "Colorist", "VFX Supervisor", "VFX Artist", "Compositor", "Composer", "Music Supervisor", "Transportation Coordinator", "Driver", "Craft Service", "Catering", "Security Coordinator", "Security Guard", "Medic / On-Set Nurse", "Animal Handler", "Stunt Coordinator", "Stunt Performer", "Casting Director", "Casting Assistant", "Publicist", "Unit Publicist", "Interpreter", "Other",
];

async function deleteCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.limit(500).get();
  if (snapshot.size === 0) {
    console.log(`✅ Collection '${collectionPath}' is already empty or does not exist.`);
    return;
  }
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`🔥 Deleted ${snapshot.size} documents from '${collectionPath}'.`);
  if (snapshot.size > 0) {
    return deleteCollection(collectionPath);
  }
}

async function rollback() {
  console.log("--- Starting database rollback process ---");

  // 1. Delete the 'departments' collection
  await deleteCollection("departments");

  // 2. Re-seed the original 'jobTitles' collection
  const batch = db.batch();
  const col = db.collection("jobTitles");
  jobTitles.forEach((name) => {
    const docRef = col.doc(); // auto-ID
    batch.set(docRef, { name });
  });
  await batch.commit();
  console.log(`🌱 Seeded ${jobTitles.length} documents into 'jobTitles'.`);
  console.log("--- ✅ Rollback complete! ---");
}

rollback().catch(console.error);