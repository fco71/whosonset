import * as admin from "firebase-admin";
import {onDocumentCreated} from "firebase-functions/v2/firestore";

admin.initializeApp();

// Temporarily disabled due to deployment issues
// export const seedJobTitles = onRequest(async (_req, res) => {
//   try {
//     const db = admin.firestore();
//     const batch = db.batch();
//     const col = db.collection("jobTitles");

//     jobTitles.forEach((name) => {
//       const docRef = col.doc();
//       batch.set(docRef, {name});
//     });

//     await batch.commit();
//     res.status(200).send(`✅ Seeded ${jobTitles.length} job titles.`);
//   } catch (e) {
//     if (e instanceof Error) {
//       console.error("❌ Seeding failed:", e);
//       res.status(500).send("❌ Seeding failed: " + e.message);
//     } else {
//       console.error("❌ Seeding failed:", e);
//       res.status(500).send("❌ Seeding failed: Unknown error");
//     }
//   }
// });

// Notification: On new job application, notify job poster (v2 API)
export const notifyJobPosterOnApplication = onDocumentCreated("jobApplications/{applicationId}", async (event) => {
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
    const postedById = jobData?.postedById;
    if (!postedById) {
      console.error("postedById missing in job posting:", jobData);
      return;
    }
    // Create notification in the job poster's notifications subcollection
    const notification = {
        type: "job_application",
        message:
            "You have a new job application for '" +
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
    console.log(
        "Notification created for job poster:",
        postedById
    );
  } catch (error) {
    console.error("Error creating notification for job poster:", error);
  }
});
