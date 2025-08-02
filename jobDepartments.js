// mi nota: this is a seed file.

// scripts/jobDepartments.js

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- Initialization (from your working script) ---
initializeApp({
    credential: applicationDefault(),
});
const db = getFirestore();


// --- Data (Your new, complete list but with "titles" instead of "jobTitles") ---
const jobDepartments = [
    { name: "Production", titles: ["Executive Producer", "Producer", "Co-Producer", "Associate Producer", "Line Producer", "Production Manager", "Unit Production Manager (UPM)", "Production Coordinator", "Production Secretary", "Production Assistant (PA)"] },
    { name: "Locations", titles: ["Location Manager", "Assistant Location Manager", "Location Scout"] },
    { name: "Directing", titles: ["Director", "Assistant Director (AD) - 1st AD, 2nd AD, 2nd 2nd AD", "Script Supervisor (Continuity)"] },
    { name: "Writing", titles: ["Writer", "Screenwriter", "Story Editor"] },
    { name: "Camera", titles: ["Director of Photography (DP) / Cinematographer", "Camera Operator", "1st Assistant Camera (1st AC) / Focus Puller", "2nd Assistant Camera (2nd AC) / Clapper Loader", "Camera Technician", "Steadicam Operator", "Drone Operator", "Still Photographer"] },
    { name: "Sound", titles: ["Production Sound Mixer", "Boom Operator", "Sound Assistant", "Sound Designer (Post-Production)", "Foley Artist (Post-Production)", "Foley Mixer (Post-Production)"] },
    { name: "Grip & Electric", titles: ["Gaffer (Chief Lighting Technician)", "Best Boy Electric (Assistant Chief Lighting Technician)", "Electrician", "Lighting Technician", "Key Grip", "Best Boy Grip (Assistant Key Grip)", "Grip", "Dolly Grip"] },
    { name: "Art Department & Set Decoration", titles: ["Production Designer", "Art Director", "Set Decorator", "Set Dresser", "Prop Master", "Prop Builder", "Scenic Artist", "Construction Coordinator", "Construction Foreman"] },
    { name: "Costume & Wardrobe", titles: ["Costume Designer", "Assistant Costume Designer", "Costume Supervisor", "Set Costumer", "Seamstress/Seamster"] },
    { name: "Hair & Makeup", titles: ["Makeup Artist (Key)", "Hair Stylist (Key)", "Makeup Artist", "Hair Stylist", "Special Effects Makeup Artist"] },
    { name: "Post-Production", titles: ["Editor", "Assistant Editor", "Colorist", "VFX Supervisor", "VFX Artist", "Compositor"] },
    { name: "Music", titles: ["Composer", "Music Supervisor"] },
    { name: "Transportation", titles: ["Transportation Coordinator", "Driver"] },
    { name: "Stunts & Effects", titles: ["Stunt Coordinator", "Stunt Performer", "Animal Handler"] },
    { name: "Support & General Crew", titles: ["Craft Service", "Catering", "Security Coordinator", "Security Guard", "Medic / On-Set Nurse", "Publicist", "Unit Publicist", "Interpreter", "COVID Compliance Officer"] },
    { name: "Casting", titles: ["Casting Director", "Casting Assistant"] },
];


// --- Seeding Logic (from your working script) ---
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


// --- Execution (from your working script) ---
seed().catch((err) => {
    console.error('❌ Error seeding departments:', err);
});