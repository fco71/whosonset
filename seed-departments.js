// CORRECTED SEED SCRIPT - 23 June 2025

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- Configuration ---
initializeApp({
  credential: applicationDefault(),
  projectId: 'whosonsetdepez',
});

const db = getFirestore();

// --- Department Data (This remains the same) ---
const departments = [
    { name: "Production", jobTitles: ["Executive Producer", "Producer", "Co-Producer", "Associate Producer", "Line Producer", "Production Manager", "Unit Production Manager (UPM)", "Production Coordinator", "Production Secretary", "Production Assistant (PA)"] },
    { name: "Locations", jobTitles: ["Location Manager", "Assistant Location Manager", "Location Scout"] },
    { name: "Direction", jobTitles: ["Director", "Assistant Director (AD) - 1st AD, 2nd AD, 2nd 2nd AD", "Script Supervisor (Continuity)"] },
    { name: "Writing", jobTitles: ["Writer", "Screenwriter", "Story Editor"] },
    // ... (rest of the department data is the same)
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
];

// --- NEW, SIMPLIFIED SEED FUNCTION ---
async function seed() {
  console.log("--- Starting database seed process ---");

  // Define the collection and the single document we will create/overwrite.
  const docRef = db.collection('jobDepartments').doc('all');

  // Transform the array of departments into a single map object.
  // This is likely the structure your website is expecting.
  const departmentsMap = {};
  departments.forEach(dept => {
    departmentsMap[dept.name] = dept.jobTitles;
  });

  // Set the data in our single document.
  // .set() will create the document if it doesn't exist or completely overwrite it if it does.
  await docRef.set(departmentsMap);

  console.log("🌱 Seeded all departments into a single document: 'jobDepartments/all'");
  console.log("--- ✅ Seeding complete! ---");
}

seed().catch((err) => {
  console.error("--- ❌ Seeding failed ---");
  console.error(err);
});