import * as admin from "firebase-admin";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";

admin.initializeApp();

// Simplified Job Application Notification
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

  try {
    // Get job posting to find the poster
    const jobSnap = await admin.firestore().collection("jobPostings").doc(application.jobId).get();
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

    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: postedById,
      type: "job_application",
      message: `New application received for job posting`,
      relatedId: application.jobId,
      applicationId: event.params.applicationId,
      applicantId: application.applicantId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("Job application notification created for user:", postedById);
  } catch (error) {
    console.error("Error creating job application notification:", error);
  }
});

// Simplified Message Notification
export const notifyNewMessage = onDocumentCreated("messages/{messageId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    console.error("No snapshot data in event");
    return;
  }
  
  const message = snap.data();
  if (!message || !message.senderId || !message.receiverId) {
    console.error("Missing senderId or receiverId in message:", message);
    return;
  }

  try {
    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: message.receiverId,
      type: "message",
      message: `New message from ${message.senderName || 'User'}`,
      senderId: message.senderId,
      messageId: event.params.messageId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("Message notification created for user:", message.receiverId);
  } catch (error) {
    console.error("Error creating message notification:", error);
  }
});

// Simplified Project Invitation Notification
export const notifyProjectInvitation = onDocumentCreated("projectInvitations/{invitationId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    console.error("No snapshot data in event");
    return;
  }
  
  const invitation = snap.data();
  if (!invitation || !invitation.projectId || !invitation.invitedUserId) {
    console.error("Missing projectId or invitedUserId in invitation:", invitation);
    return;
  }

  try {
    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: invitation.invitedUserId,
      type: "project_invitation",
      message: `You've been invited to join a project`,
      relatedId: invitation.projectId,
      invitationId: event.params.invitationId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("Project invitation notification created for user:", invitation.invitedUserId);
  } catch (error) {
    console.error("Error creating project invitation notification:", error);
  }
});

// Simplified Task Assignment Notification
export const notifyTaskAssignment = onDocumentCreated("taskAssignments/{assignmentId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    console.error("No snapshot data in event");
    return;
  }
  
  const assignment = snap.data();
  if (!assignment || !assignment.taskId || !assignment.assignedUserId) {
    console.error("Missing taskId or assignedUserId in assignment:", assignment);
    return;
  }

  try {
    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: assignment.assignedUserId,
      type: "task_assignment",
      message: `You've been assigned a new task`,
      relatedId: assignment.taskId,
      assignmentId: event.params.assignmentId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("Task assignment notification created for user:", assignment.assignedUserId);
  } catch (error) {
    console.error("Error creating task assignment notification:", error);
  }
});

// Simplified Project Update Notification
export const notifyProjectUpdate = onDocumentUpdated("projects/{projectId}", async (event) => {
  const before = event.data?.before;
  const after = event.data?.after;
  
  if (!before || !after) {
    console.error("No before/after data in event");
    return;
  }
  
  const beforeData = before.data();
  const afterData = after.data();
  
  if (!beforeData || !afterData) {
    console.error("No data in before/after snapshots");
    return;
  }

  try {
    // Get project members
    const membersSnap = await admin.firestore()
      .collection("projectMembers")
      .where("projectId", "==", event.params.projectId)
      .get();

    const notifications = membersSnap.docs.map(doc => ({
      userId: doc.data().userId,
      type: "project_update",
      message: `Project has been updated`,
      relatedId: event.params.projectId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }));

    // Batch write notifications
    const batch = admin.firestore().batch();
    notifications.forEach(notification => {
      const ref = admin.firestore().collection("notifications").doc();
      batch.set(ref, notification);
    });
    await batch.commit();

    console.log("Project update notifications created for", notifications.length, "users");
  } catch (error) {
    console.error("Error creating project update notifications:", error);
  }
});

// Simplified Application Status Update Notification
export const notifyApplicationStatusUpdate = onDocumentUpdated("jobApplications/{applicationId}", async (event) => {
  const before = event.data?.before;
  const after = event.data?.after;
  
  if (!before || !after) {
    console.error("No before/after data in event");
    return;
  }
  
  const beforeData = before.data();
  const afterData = after.data();
  
  if (!beforeData || !afterData) {
    console.error("No data in before/after snapshots");
    return;
  }

  // Only notify if status changed
  if (beforeData.status === afterData.status) {
    return;
  }

  try {
    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: afterData.applicantId,
      type: "application_status_update",
      message: `Your job application status has been updated to: ${afterData.status}`,
      applicationId: event.params.applicationId,
      jobId: afterData.jobId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("Application status update notification created for user:", afterData.applicantId);
  } catch (error) {
    console.error("Error creating application status update notification:", error);
  }
}); 