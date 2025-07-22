"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyJobPosterOnApplication = exports.seedJobTitles = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/v2/firestore");
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
exports.seedJobTitles = functions.https.onRequest(async (_req, res) => {
    try {
        const db = admin.firestore();
        const batch = db.batch();
        const col = db.collection("jobTitles");
        jobTitles.forEach((name) => {
            const docRef = col.doc();
            batch.set(docRef, { name });
        });
        await batch.commit();
        res.status(200).send(`✅ Seeded ${jobTitles.length} job titles.`);
    }
    catch (e) {
        if (e instanceof Error) {
            console.error("❌ Seeding failed:", e);
            res.status(500).send("❌ Seeding failed: " + e.message);
        }
        else {
            console.error("❌ Seeding failed:", e);
            res.status(500).send("❌ Seeding failed: Unknown error");
        }
    }
});
// Notification: On new job application, notify job poster (v2 API)
exports.notifyJobPosterOnApplication = (0, firestore_1.onDocumentCreated)("jobApplications/{applicationId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        console.error("No snapshot data in event");
        return;
    }
    const application = snap.data();
    if (!application || !application.jobId || !application.applicantId) {
        console.error("Missing jobId or applicantId in application:", application);
        return;
    }
    const db = admin.firestore();
    try {
        // Fetch the job posting to get the poster's userId
        const jobSnap = await db.collection("jobPostings").doc(application.jobId).get();
        if (!jobSnap.exists) {
            console.error("Job posting not found for jobId:", application.jobId);
            return;
        }
        const jobData = jobSnap.data();
        const postedById = jobData === null || jobData === void 0 ? void 0 : jobData.postedById;
        if (!postedById) {
            console.error("postedById missing in job posting:", jobData);
            return;
        }
        // Create notification in the job poster's notifications subcollection
        const notification = {
            type: "job_application",
            message: "You have a new job application for '" +
                (jobData.title || "your job") +
                "'",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            read: false,
            userId: postedById,
            relatedId: application.jobId,
            applicationId: event.params.applicationId,
            applicantId: application.applicantId,
            extra: {
                applicantId: application.applicantId,
                jobId: application.jobId,
            },
        };
        await db
            .collection("users")
            .doc(postedById)
            .collection("notifications")
            .add(notification);
        console.log("Notification created for job poster:", postedById);
    }
    catch (error) {
        console.error("Error creating notification for job poster:", error);
    }
});
//# sourceMappingURL=index.js.map