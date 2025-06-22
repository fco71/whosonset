import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
// Initialize Firebase Admin with the project-specific configuration
initializeApp({
    credential: applicationDefault(),
    projectId: 'whosonsetdepez', // Your project ID
});
// Get a reference to the Firestore database
const db = getFirestore();
// The complete list of job titles to be seeded
const jobTitles = [
    "Executive Producer",
    "Producer",
    "Co-Producer",
    "Associate Producer",
    "Line Producer",
    "Production Manager",
    "Unit Production Manager (UPM)",
    "Production Coordinator",
    "Production Secretary",
    "Production Assistant (PA)",
    "Location Manager",
    "Assistant Location Manager",
    "Location Scout",
    "COVID Compliance Officer",
    "Director",
    "Assistant Director (AD) - 1st AD, 2nd AD, 2nd 2nd AD",
    "Script Supervisor (Continuity)",
    "Writer",
    "Screenwriter",
    "Story Editor",
    "Director of Photography (DP) / Cinematographer",
    "Camera Operator",
    "1st Assistant Camera (1st AC) / Focus Puller",
    "2nd Assistant Camera (2nd AC) / Clapper Loader",
    "Camera Technician",
    "Steadicam Operator",
    "Drone Operator",
    "Still Photographer",
    "Production Sound Mixer",
    "Boom Operator",
    "Sound Assistant",
    "Sound Designer (Post-Production)",
    "Foley Artist (Post-Production)",
    "Foley Mixer (Post-Production)",
    "Gaffer (Chief Lighting Technician)",
    "Best Boy Electric (Assistant Chief Lighting Technician)",
    "Electrician",
    "Lighting Technician",
    "Key Grip",
    "Best Boy Grip (Assistant Key Grip)",
    "Grip",
    "Dolly Grip",
    "Production Designer",
    "Art Director",
    "Set Decorator",
    "Set Dresser",
    "Prop Master",
    "Prop Builder",
    "Scenic Artist",
    "Construction Coordinator",
    "Construction Foreman",
    "Costume Designer",
    "Assistant Costume Designer",
    "Costume Supervisor",
    "Set Costumer",
    "Seamstress/Seamster",
    "Makeup Artist (Key)",
    "Hair Stylist (Key)",
    "Makeup Artist",
    "Hair Stylist",
    "Special Effects Makeup Artist",
    "Editor",
    "Assistant Editor",
    "Colorist",
    "VFX Supervisor",
    "VFX Artist",
    "Compositor",
    "Composer",
    "Music Supervisor",
    "Transportation Coordinator",
    "Driver",
    "Craft Service",
    "Catering",
    "Security Coordinator",
    "Security Guard",
    "Medic / On-Set Nurse",
    "Animal Handler",
    "Stunt Coordinator",
    "Stunt Performer",
    "Casting Director",
    "Casting Assistant",
    "Publicist",
    "Unit Publicist",
    "Interpreter",
    "Other",
];
/**
 * Seeds the 'jobTitles' collection in Firestore with a predefined list.
 */
async function seed() {
    const batch = db.batch();
    const col = db.collection("jobTitles");
    jobTitles.forEach((name) => {
        const docRef = col.doc(); // Create a new document with an auto-generated ID
        batch.set(docRef, { name });
    });
    await batch.commit();
    console.log(`✅ Seeded ${jobTitles.length} job titles.`);
}
// Execute the seed function and catch any potential errors
seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
});
