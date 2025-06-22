// Correct content for seed-departments.js

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- Configuration ---
initializeApp({
  credential: applicationDefault(),
  projectId: 'whosonsetdepez',
});

const db = getFirestore();

// --- Department Data (Pure JavaScript Array) ---
const departments = [
  { name: "Production", jobTitles: ["Executive Producer", "Producer", "Co-Producer", "Associate Producer", "Line Producer", "Production Manager", "Unit Production Manager (UPM)", "Production Coordinator", "Production Secretary", "Production Assistant (PA)"] },
  { name: "Locations", jobTitles: ["Location Manager", "Assistant Location Manager", "Location Scout"] },
  { name: "Direction & Writing", jobTitles: ["Director", "Assistant Director (AD) - 1st AD, 2nd AD, 2nd 2nd AD", "Script Supervisor (Continuity)", "Writer", "Screenwriter", "Story Editor"] },
  { name: "Camera", jobTitles: ["Director of Photography (DP) / Cinematographer", "Camera Operator", "1st Assistant Camera (1st AC) / Focus Puller", "2nd Assistant Camera (2nd AC) / Clapper Loader", "Camera Technician", "Steadicam Operator", "Drone Operator", "Still Photographer"] },
  { name: "Sound", jobTitles: ["Production Sound Mixer", "Boom Operator", "Sound Assistant", "Sound Designer (Post-Production)", "Foley Artist (Post-Production)", "Foley Mixer (Post-Production)"] },
  { name: "Grip & Electric", jobTitles: ["Gaffer (Chief Lighting Technician)", "Best Boy Electric (Assistant Chief Lighting Technician)", "Electrician", "Lighting Technician", "Key Grip", "Best Boy Grip (Assistant Key Grip)", "Grip", "Dolly Grip"] },
  { name: "Art Department & Set Decoration", jobTitles: ["Production Designer", "Art Director", "Set Decorator", "Set Dresser", "Prop Master", "Prop Builder", "Scenic Artist", "Construction Coordinator", "Construction Foreman"] },
  { name: "Costume & Wardrobe", jobTitles: ["Costume Designer", "Assistant Costume Designer", "Costume Supervisor", "Set Costumer", "Seamstress/Seamster"] },
  { name: "Hair & Makeup", jobTitles: ["Makeup Artist (Key)", "Hair Stylist (Key)", "Makeup Artist", "Hair Stylist", "Special Effects Makeup Artist"] },
  { name: "Post-Production", jobTitles: ["Editor", "Assistant Editor", "Colorist", "VFX Supervisor", "VFX Artist", "Compositor"] },
  { name: "Music", jobTitles: ["Composer", "Music Supervisor"] },
  { name: "Transportation", jobTitles: ["Transportation Coordinator", "Driver"] },
  { name: "Stunts & Effects", jobTitles: ["Stunt Coordinator", "Stunt Performer", "Animal Handler"] },
  { name: "Support & General Crew", jobTitles: ["Craft Service", "Catering", "Security Coordinator", "Security Guard", "Medic / On-Set Nurse", "Publicist", "Unit Publicist", "Interpreter", "COVID Compliance Officer"] },
  { name: "Casting", jobTitles: ["Casting Director", "Casting Assistant"] },
  { name: "Other (Please specify)", jobTitles: [] },
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

async function seed() {
  console.log("--- Starting database seed process ---");
  await deleteCollection("jobTitles").catch(() => {}); // Attempt to delete old collection
  const col = db.collection("departments");
  const batch = db.batch();
  departments.forEach((dept) => {
    const docRef = col.doc();
    batch.set(docRef, dept);
  });
  await batch.commit();
  console.log(`🌱 Seeded ${departments.length} departments.`);
  console.log("--- ✅ Seeding complete! ---");
}

seed().catch((err) => {
  console.error("--- ❌ Seeding failed ---");
  console.error(err);
});