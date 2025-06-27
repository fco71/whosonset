import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

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

export const seedJobTitles = functions.https.onRequest(async (_req, res) => {
  try {
    const db = admin.firestore();
    const batch = db.batch();
    const col = db.collection("jobTitles");

    jobTitles.forEach((name) => {
      const docRef = col.doc();
      batch.set(docRef, {name});
    });

    await batch.commit();
    res.status(200).send(`✅ Seeded ${jobTitles.length} job titles.`);
  } catch (e) {
    if (e instanceof Error) {
      console.error("❌ Seeding failed:", e);
      res.status(500).send("❌ Seeding failed: " + e.message);
    } else {
      console.error("❌ Seeding failed:", e);
      res.status(500).send("❌ Seeding failed: Unknown error");
    }
  }
});
