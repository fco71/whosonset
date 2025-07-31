import * as admin from "firebase-admin";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { NotificationService } from "./notificationService";
import { EmailService } from "./emailService";
import * as functions from 'firebase-functions';

admin.initializeApp();

// Email configuration test function
export const emailTest = onRequest(async (req, res) => {
  try {
    // Get Firebase Functions config
    const config = functions.config();
    
    res.json({ 
      message: "Email configuration test", 
      config: {
        smtp: {
          host: config.smtp?.host,
          port: config.smtp?.port,
          user: config.smtp?.user,
          // Don't include password for security
        },
        email: {
          from: config.email?.from
        }
      },
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Test email function (temporary for testing)
export const testEmail = onRequest(async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to || !subject || !message) {
      res.status(400).json({ 
        error: 'Missing required fields: to, subject, message' 
      });
      return;
    }

    const success = await EmailService.sendEmail({
      to,
      template: {
        subject: subject,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test Email</h2>
          <p>${message}</p>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>`,
        text: `Test Email\n\n${message}\n\nBest regards,\nThe My Film Jobs Team`
      },
      data: { message }
    });

    if (success) {
      res.json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test notification function
export const testNotification = onRequest(async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    
    if (!userId || !type || !message) {
      res.status(400).json({ 
        error: 'Missing required fields: userId, type, message' 
      });
      return;
    }

    // Create a test notification
    const notificationId = await NotificationService.createNotification({
      userId,
      type,
      message,
      sendEmail: true,
      emailData: {
        to: 'iam@myfilmjobs.com', // Test email
        template: EmailService.getMessageNotificationTemplate(
          'Test User',
          'This is a test notification message'
        ),
        data: {
          senderName: 'Test User',
          messagePreview: 'This is a test notification message',
          messageUrl: 'https://myfilmjobs.com/chat'
        }
      }
    });

    res.json({ 
      success: true, 
      message: 'Test notification created successfully',
      notificationId 
    });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Job Application Notification
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

    // Use the new notification service
    await NotificationService.notifyJobApplication(
      application.jobId,
      event.params.applicationId,
      application.applicantId,
      postedById
    );
  } catch (error) {
    console.error("Error in notifyJobPosterOnApplication:", error);
  }
});

// Project Invitation Notification
export const notifyProjectInvitation = onDocumentCreated("projectInvitations/{invitationId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    console.error("No snapshot data in event");
    return;
  }
  
  const invitation = snap.data();
  if (!invitation || !invitation.projectId || !invitation.inviterId || !invitation.inviteeId || !invitation.role) {
    console.error("Missing required fields in invitation:", invitation);
    return;
  }

  try {
    await NotificationService.notifyProjectInvitation(
      invitation.projectId,
      invitation.inviterId,
      invitation.inviteeId,
      invitation.role
    );
  } catch (error) {
    console.error("Error in notifyProjectInvitation:", error);
  }
});

// Task Assignment Notification
export const notifyTaskAssignment = onDocumentCreated("tasks/{taskId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    console.error("No snapshot data in event");
    return;
  }
  
  const task = snap.data();
  if (!task || !task.projectId || !task.assignerId || !task.assigneeId || !task.title) {
    console.error("Missing required fields in task:", task);
    return;
  }

  try {
    await NotificationService.notifyTaskAssignment(
      event.params.taskId,
      task.projectId,
      task.assignerId,
      task.assigneeId,
      task.title,
      task.dueDate
    );
  } catch (error) {
    console.error("Error in notifyTaskAssignment:", error);
  }
});

// Message Notification
export const notifyNewMessage = onDocumentCreated("conversations/{conversationId}/messages/{messageId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    console.error("No snapshot data in event");
    return;
  }
  
  const message = snap.data();
  if (!message || !message.senderId || !message.content) {
    console.error("Missing required fields in message:", message);
    return;
  }

  try {
    // Get conversation to find participants
    const conversationSnap = await admin.firestore().collection("conversations").doc(event.params.conversationId).get();
    if (!conversationSnap.exists) {
      console.error("Conversation not found:", event.params.conversationId);
      return;
    }
    
    const conversation = conversationSnap.data();
    const participants = conversation?.participants || [];
    
    // Find the receiver (not the sender)
    const receiverId = participants.find((id: string) => id !== message.senderId);
    if (!receiverId) {
      console.error("Receiver not found in conversation participants");
      return;
    }

    await NotificationService.notifyNewMessage(
      message.senderId,
      receiverId,
      message.content,
      event.params.conversationId
    );
  } catch (error) {
    console.error("Error in notifyNewMessage:", error);
  }
});

// Project Update Notification
export const notifyProjectUpdate = onDocumentUpdated("Projects/{projectId}", async (event) => {
  const beforeSnap = event.data?.before;
  const afterSnap = event.data?.after;
  
  if (!beforeSnap || !afterSnap) {
    console.error("Missing before or after snapshot");
    return;
  }
  
  const beforeData = beforeSnap.data();
  const afterData = afterSnap.data();
  
  if (!beforeData || !afterData) {
    console.error("Missing project data");
    return;
  }

  try {
    // Determine what changed
    const changes = [];
    if (beforeData.projectName !== afterData.projectName) changes.push('project name');
    if (beforeData.status !== afterData.status) changes.push('status');
    if (beforeData.synopsis !== afterData.synopsis) changes.push('synopsis');
    if (beforeData.startDate !== afterData.startDate) changes.push('start date');
    if (beforeData.endDate !== afterData.endDate) changes.push('end date');
    
    if (changes.length === 0) return; // No significant changes
    
    // Get crew members to notify
    const crewMembers = afterData.crewMembers || [];
    const updaterId = afterData.lastUpdatedBy || afterData.owner_uid;
    
    if (!updaterId || crewMembers.length === 0) return;
    
    await NotificationService.notifyProjectUpdate(
      event.params.projectId,
      updaterId,
      changes.join(', '),
      crewMembers
    );
  } catch (error) {
    console.error("Error in notifyProjectUpdate:", error);
  }
});

// Application Status Update Notification
export const notifyApplicationStatusUpdate = onDocumentUpdated("jobApplications/{applicationId}", async (event) => {
  const beforeSnap = event.data?.before;
  const afterSnap = event.data?.after;
  
  if (!beforeSnap || !afterSnap) {
    console.error("Missing before or after snapshot");
    return;
  }
  
  const beforeData = beforeSnap.data();
  const afterData = afterSnap.data();
  
  if (!beforeData || !afterData) {
    console.error("Missing application data");
    return;
  }

  // Only notify if status changed
  if (beforeData.status === afterData.status) return;

  try {
    const applicantId = afterData.applicantId;
    const jobId = afterData.jobId;
    
    if (!applicantId || !jobId) {
      console.error("Missing applicantId or jobId in application");
      return;
    }

    // Get job and applicant details
    const [jobSnap, applicantSnap] = await Promise.all([
      admin.firestore().collection('jobPostings').doc(jobId).get(),
      admin.firestore().collection('users').doc(applicantId).get()
    ]);

    const jobData = jobSnap.data();
    const applicantData = applicantSnap.data();

    if (!jobData || !applicantData) {
      console.error("Job or applicant data not found");
      return;
    }

    // Notify the applicant about status change
    await NotificationService.createNotification({
      userId: applicantId,
      type: 'application_status_update',
      message: `Your application for "${jobData.title}" status has been updated to "${afterData.status}"`,
      relatedId: jobId,
      applicationId: event.params.applicationId,
      extra: {
        jobTitle: jobData.title,
        companyName: jobData.companyName || 'Unknown Company',
        oldStatus: beforeData.status,
        newStatus: afterData.status
      },
      sendEmail: applicantData?.emailNotifications ?? true,
      emailData: {
        to: applicantData.email,
        template: {
          subject: 'Application Status Update - {{jobTitle}}',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Application Status Update</h2>
              <p>Hello {{applicantName}},</p>
              <p>Your application status for <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong> has been updated.</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Status Update:</h3>
                <p><strong>Previous Status:</strong> {{oldStatus}}</p>
                <p><strong>New Status:</strong> <span style="color: #059669; font-weight: bold;">{{newStatus}}</span></p>
              </div>
              <p>Please log in to your WhosOnSet dashboard to view the full details.</p>
              <a href="{{dashboardUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Application</a>
              <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                Best regards,<br>
                The WhosOnSet Team
              </p>
            </div>
          `,
          text: `
Application Status Update

Hello {{applicantName}},

Your application status for {{jobTitle}} at {{companyName}} has been updated.

Status Update:
- Previous Status: {{oldStatus}}
- New Status: {{newStatus}}

Please log in to your WhosOnSet dashboard to view the full details: {{dashboardUrl}}

Best regards,
The WhosOnSet Team
          `
        },
        data: {
          applicantName: applicantData.displayName || applicantData.email,
          jobTitle: jobData.title,
          companyName: jobData.companyName || 'Unknown Company',
          oldStatus: beforeData.status,
          newStatus: afterData.status,
          dashboardUrl: `${process.env.FRONTEND_URL || 'https://whosonset.com'}/applications/${event.params.applicationId}`
        }
      }
    });
  } catch (error) {
    console.error("Error in notifyApplicationStatusUpdate:", error);
  }
});
