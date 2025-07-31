import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();

// Manual Job Application Notification Trigger
export const triggerJobApplicationNotification = onRequest(async (req, res) => {
  try {
    const { jobId, applicationId, applicantId, postedById } = req.body;
    
    if (!jobId || !applicationId || !applicantId || !postedById) {
      res.status(400).json({ 
        error: 'Missing required fields: jobId, applicationId, applicantId, postedById' 
      });
      return;
    }

    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: postedById,
      type: "job_application",
      message: `New application received for job posting`,
      relatedId: jobId,
      applicationId: applicationId,
      applicantId: applicantId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ 
      success: true, 
      message: 'Job application notification created successfully'
    });
  } catch (error) {
    console.error('Error creating job application notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual Message Notification Trigger
export const triggerMessageNotification = onRequest(async (req, res) => {
  try {
    const { receiverId, senderId, senderName, messageId } = req.body;
    
    if (!receiverId || !senderId || !messageId) {
      res.status(400).json({ 
        error: 'Missing required fields: receiverId, senderId, messageId' 
      });
      return;
    }

    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: receiverId,
      type: "message",
      message: `New message from ${senderName || 'User'}`,
      senderId: senderId,
      messageId: messageId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ 
      success: true, 
      message: 'Message notification created successfully'
    });
  } catch (error) {
    console.error('Error creating message notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual Project Invitation Notification Trigger
export const triggerProjectInvitationNotification = onRequest(async (req, res) => {
  try {
    const { invitedUserId, projectId, invitationId } = req.body;
    
    if (!invitedUserId || !projectId || !invitationId) {
      res.status(400).json({ 
        error: 'Missing required fields: invitedUserId, projectId, invitationId' 
      });
      return;
    }

    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: invitedUserId,
      type: "project_invitation",
      message: `You've been invited to join a project`,
      relatedId: projectId,
      invitationId: invitationId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ 
      success: true, 
      message: 'Project invitation notification created successfully'
    });
  } catch (error) {
    console.error('Error creating project invitation notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual Task Assignment Notification Trigger
export const triggerTaskAssignmentNotification = onRequest(async (req, res) => {
  try {
    const { assignedUserId, taskId, assignmentId } = req.body;
    
    if (!assignedUserId || !taskId || !assignmentId) {
      res.status(400).json({ 
        error: 'Missing required fields: assignedUserId, taskId, assignmentId' 
      });
      return;
    }

    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: assignedUserId,
      type: "task_assignment",
      message: `You've been assigned a new task`,
      relatedId: taskId,
      assignmentId: assignmentId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ 
      success: true, 
      message: 'Task assignment notification created successfully'
    });
  } catch (error) {
    console.error('Error creating task assignment notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual Project Update Notification Trigger
export const triggerProjectUpdateNotification = onRequest(async (req, res) => {
  try {
    const { projectId, userIds } = req.body;
    
    if (!projectId || !userIds || !Array.isArray(userIds)) {
      res.status(400).json({ 
        error: 'Missing required fields: projectId, userIds (array)' 
      });
      return;
    }

    // Create notifications for all project members
    const batch = admin.firestore().batch();
    userIds.forEach(userId => {
      const ref = admin.firestore().collection("notifications").doc();
      batch.set(ref, {
        userId: userId,
        type: "project_update",
        message: `Project has been updated`,
        relatedId: projectId,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    await batch.commit();

    res.json({ 
      success: true, 
      message: `Project update notifications created for ${userIds.length} users`
    });
  } catch (error) {
    console.error('Error creating project update notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual Application Status Update Notification Trigger
export const triggerApplicationStatusUpdateNotification = onRequest(async (req, res) => {
  try {
    const { applicantId, applicationId, jobId, status } = req.body;
    
    if (!applicantId || !applicationId || !jobId || !status) {
      res.status(400).json({ 
        error: 'Missing required fields: applicantId, applicationId, jobId, status' 
      });
      return;
    }

    // Create notification in Firestore
    await admin.firestore().collection("notifications").add({
      userId: applicantId,
      type: "application_status_update",
      message: `Your job application status has been updated to: ${status}`,
      applicationId: applicationId,
      jobId: jobId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ 
      success: true, 
      message: 'Application status update notification created successfully'
    });
  } catch (error) {
    console.error('Error creating application status update notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 