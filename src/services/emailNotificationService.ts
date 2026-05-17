import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

interface EmailNotificationData {
  to: string;
  subject: string;
  message: string;
  senderName: string;
  template?: 'chat' | 'project' | 'job' | 'general' | 'follow_request' | 'message' | 'application_message' | 'collaboration_request' | 'collaborator_added' | 'application_status_update' | 'interview_scheduled' | 'task_assignment';
  userId?: string; // Add userId for preference checking
}

class EmailNotificationService {
  private static readonly EMAIL_FUNCTION_URL = 'https://us-central1-my-film-jobs.cloudfunctions.net/emailSend';
  private static readonly WEEKLY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  // Get user email by user ID
  private static async getUserEmail(userId: string): Promise<string | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.email || null;
      }
      return null;
    } catch (error) {
      console.error('[EmailNotificationService] Error getting user email:', error);
      return null;
    }
  }

  // Check if user can receive email based on preferences and frequency
  private static async canSendEmail(userIdentifier: string, template: string): Promise<boolean> {
    try {
      // First check if user has email notifications enabled
      // Try to get user by ID first, then by email
      let userDoc = await getDoc(doc(db, 'users', userIdentifier));
      
      if (!userDoc.exists()) {
        // Try to find user by email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', userIdentifier));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          userDoc = querySnapshot.docs[0];
        }
      }

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const notificationPreferences = userData.notificationPreferences;
        
        if (notificationPreferences) {
          // Check if email notifications are enabled for this template
          const emailEnabled = notificationPreferences.emailNotifications?.[template];
          if (!emailEnabled) {
            debugLog(`[EmailNotificationService] Email notifications disabled for ${userIdentifier} (${template})`);
            return false;
          }

          // Check frequency settings
          const frequency = notificationPreferences.emailFrequency?.[template] || 'weekly';
          const timeLimit = this.getTimeLimitForFrequency(frequency);
          
          if (timeLimit === 0) {
            // Immediate - always send
            return true;
          }

          // Check last sent time
          const emailTrackingRef = doc(db, 'emailTracking', userIdentifier);
          const emailTrackingDoc = await getDoc(emailTrackingRef);
          
          if (!emailTrackingDoc.exists()) {
            // First time sending email to this user
            return true;
          }

          const data = emailTrackingDoc.data();
          const lastSent = data[template]?.lastSent;
          
          if (!lastSent) {
            // First time sending this template to this user
            return true;
          }

          const timeSinceLastEmail = Date.now() - lastSent.toMillis();
          return timeSinceLastEmail >= timeLimit;
        }
      }

      // Fallback to weekly limit if no preferences found
      const emailTrackingRef = doc(db, 'emailTracking', userIdentifier);
      const emailTrackingDoc = await getDoc(emailTrackingRef);
      
      if (!emailTrackingDoc.exists()) {
        return true;
      }

      const data = emailTrackingDoc.data();
      const lastSent = data[template]?.lastSent;
      
      if (!lastSent) {
        return true;
      }

      const timeSinceLastEmail = Date.now() - lastSent.toMillis();
      return timeSinceLastEmail >= this.WEEKLY_LIMIT_MS;
    } catch (error) {
      console.error('Error checking email limit:', error);
      // If there's an error checking, allow the email to be sent
      return true;
    }
  }

  // Get time limit in milliseconds for each frequency
  private static getTimeLimitForFrequency(frequency: string): number {
    switch (frequency) {
      case 'immediate':
        return 0; // No limit
      case 'daily':
        return 24 * 60 * 60 * 1000; // 24 hours
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000; // 7 days
      case 'monthly':
        return 30 * 24 * 60 * 60 * 1000; // 30 days
      default:
        return this.WEEKLY_LIMIT_MS; // Default to weekly
    }
  }

  // Update email tracking after sending
  private static async updateEmailTracking(userEmail: string, template: string): Promise<void> {
    try {
      const emailTrackingRef = doc(db, 'emailTracking', userEmail);
      await updateDoc(emailTrackingRef, {
        [template]: {
          lastSent: new Date(),
          count: (await getDoc(emailTrackingRef)).data()?.[template]?.count || 0 + 1
        }
      });
    } catch (error) {
      console.error('Error updating email tracking:', error);
    }
  }

  static async sendNotification(data: EmailNotificationData): Promise<boolean> {
    try {
      debugLog('[EmailNotificationService] Sending notification:', data);

      // Check frequency limit using userId if available, otherwise use email
      const userIdentifier = data.userId || data.to;
      const canSend = await this.canSendEmail(userIdentifier, data.template || 'general');
      if (!canSend) {
        debugLog(`[EmailNotificationService] Frequency limit reached for ${data.to} (${data.template})`);
        return false;
      }

      const response = await fetch(this.EMAIL_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.to,
          subject: data.subject,
          message: data.message,
          senderName: data.senderName,
        }),
      });

      const result = await response.json();
      debugLog('[EmailNotificationService] Response:', result);

      if (result.success) {
        // Update tracking after successful send
        await this.updateEmailTracking(data.to, data.template || 'general');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  // Task assignment notification
  static async sendTaskAssignmentEmail(
    recipientUserId: string,
    taskId: string
  ): Promise<boolean> {
    try {
      // Get recipient's email
      const recipientEmail = await this.getUserEmail(recipientUserId);
      if (!recipientEmail) {
        debugLog('[EmailNotificationService] No email found for user:', recipientUserId);
        return false;
      }

      const subject = `New Task Assignment`;
      const message = `
Hello,

You have been assigned a new task on My Film Jobs.

Log in to your My Film Jobs dashboard to view and work on this task.

Best regards,
The My Film Jobs Team
      `;

      return this.sendNotification({
        to: recipientEmail,
        subject,
        message,
        senderName: 'My Film Jobs',
        template: 'task_assignment',
        userId: recipientUserId
      });
    } catch (error) {
      console.error('[EmailNotificationService] Error sending task assignment email:', error);
      return false;
    }
  }

  // Interview scheduled notification
  static async sendInterviewScheduledEmail(
    recipientUserId: string,
    jobTitle: string,
    interviewDate: string,
    interviewTime: string
  ): Promise<boolean> {
    try {
      // Get recipient's email
      const recipientEmail = await this.getUserEmail(recipientUserId);
      if (!recipientEmail) {
        debugLog('[EmailNotificationService] No email found for user:', recipientUserId);
        return false;
      }

      const subject = `Interview Scheduled: ${jobTitle}`;
      const message = `
Hello,

Your interview for ${jobTitle} has been scheduled for ${interviewDate} at ${interviewTime}.

Please log in to your My Film Jobs dashboard to view the interview details and prepare accordingly.

Best regards,
The My Film Jobs Team
      `;

      return this.sendNotification({
        to: recipientEmail,
        subject,
        message,
        senderName: 'My Film Jobs',
        template: 'interview_scheduled',
        userId: recipientUserId
      });
    } catch (error) {
      console.error('[EmailNotificationService] Error sending interview scheduled email:', error);
      return false;
    }
  }

  // Application status update notification
  static async sendApplicationStatusUpdateEmail(
    recipientUserId: string,
    newStatus: string,
    applicationId: string
  ): Promise<boolean> {
    try {
      // Get recipient's email
      const recipientEmail = await this.getUserEmail(recipientUserId);
      if (!recipientEmail) {
        debugLog('[EmailNotificationService] No email found for user:', recipientUserId);
        return false;
      }

      const statusDisplay = newStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const subject = `Application Status Update: ${statusDisplay}`;
      const message = `
Hello,

Your job application status has been updated to: ${statusDisplay}

Log in to your My Film Jobs dashboard to view the details of this application.

Best regards,
The My Film Jobs Team
      `;

      return this.sendNotification({
        to: recipientEmail,
        subject,
        message,
        senderName: 'My Film Jobs',
        template: 'application_status_update',
        userId: recipientUserId
      });
    } catch (error) {
      console.error('[EmailNotificationService] Error sending application status update email:', error);
      return false;
    }
  }

  // Collaborator added notification
  static async sendCollaboratorAddedEmail(
    recipientUserId: string,
    screenplayName: string,
    addedBy: string
  ): Promise<boolean> {
    try {
      // Get recipient's email
      const recipientEmail = await this.getUserEmail(recipientUserId);
      if (!recipientEmail) {
        debugLog('[EmailNotificationService] No email found for user:', recipientUserId);
        return false;
      }

      const subject = `You've been added as a collaborator`;
      const message = `
Hello,

${addedBy} has added you as a collaborator to the screenplay "${screenplayName}" on My Film Jobs.

Log in to your My Film Jobs dashboard to access and collaborate on this screenplay.

Best regards,
The My Film Jobs Team
      `;

      return this.sendNotification({
        to: recipientEmail,
        subject,
        message,
        senderName: 'My Film Jobs',
        template: 'collaborator_added',
        userId: recipientUserId
      });
    } catch (error) {
      console.error('[EmailNotificationService] Error sending collaborator added email:', error);
      return false;
    }
  }

  // Collaboration request notification
  static async sendCollaborationRequestEmail(
    recipientUserId: string,
    inviterName: string,
    screenplayName: string,
    screenplayId: string
  ): Promise<boolean> {
    try {
      // Get recipient's email
      const recipientEmail = await this.getUserEmail(recipientUserId);
      if (!recipientEmail) {
        debugLog('[EmailNotificationService] No email found for user:', recipientUserId);
        return false;
      }

      const subject = `Collaboration Request: ${screenplayName}`;
      const message = `
Hello,

${inviterName} has invited you to collaborate on the screenplay "${screenplayName}" on My Film Jobs.

Log in to your My Film Jobs dashboard to accept or decline this collaboration request.

Best regards,
The My Film Jobs Team
      `;

      return this.sendNotification({
        to: recipientEmail,
        subject,
        message,
        senderName: 'My Film Jobs',
        template: 'collaboration_request',
        userId: recipientUserId
      });
    } catch (error) {
      console.error('[EmailNotificationService] Error sending collaboration request email:', error);
      return false;
    }
  }

  // Application message notification
  static async sendApplicationMessageEmail(
    recipientUserId: string,
    senderName: string,
    applicationId: string
  ): Promise<boolean> {
    try {
      // Get recipient's email
      const recipientEmail = await this.getUserEmail(recipientUserId);
      if (!recipientEmail) {
        debugLog('[EmailNotificationService] No email found for user:', recipientUserId);
        return false;
      }

      const subject = `New message about your job application`;
      const message = `
Hello,

You have received a new message from ${senderName} regarding your job application on My Film Jobs.

Log in to your My Film Jobs dashboard to view and respond to this message.

Best regards,
The My Film Jobs Team
      `;

      return this.sendNotification({
        to: recipientEmail,
        subject,
        message,
        senderName: 'My Film Jobs',
        template: 'application_message',
        userId: recipientUserId
      });
    } catch (error) {
      console.error('[EmailNotificationService] Error sending application message email:', error);
      return false;
    }
  }

  // Message notification
  static async sendMessageNotificationEmail(
    recipientUserId: string,
    senderName: string,
    messagePreview: string
  ): Promise<boolean> {
    try {
      // Get recipient's email
      const recipientEmail = await this.getUserEmail(recipientUserId);
      if (!recipientEmail) {
        debugLog('[EmailNotificationService] No email found for user:', recipientUserId);
        return false;
      }

      const subject = `New message from ${senderName}`;
      const message = `
Hello,

You have received a new message from ${senderName} on My Film Jobs.

Message Preview:
"${messagePreview}"

Log in to your My Film Jobs dashboard to view and respond to this message.

Best regards,
The My Film Jobs Team
      `;

      return this.sendNotification({
        to: recipientEmail,
        subject,
        message,
        senderName: 'My Film Jobs',
        template: 'message',
        userId: recipientUserId
      });
    } catch (error) {
      console.error('[EmailNotificationService] Error sending message notification email:', error);
      return false;
    }
  }

  // Follow request notification
  static async sendFollowRequestEmail(
    recipientUserId: string,
    requesterName: string
  ): Promise<boolean> {
    try {
      // Get recipient's email
      const recipientEmail = await this.getUserEmail(recipientUserId);
      if (!recipientEmail) {
        debugLog('[EmailNotificationService] No email found for user:', recipientUserId);
        return false;
      }

      const subject = `New follow request from ${requesterName}`;
      const message = `
Hello,

${requesterName} has sent you a follow request on My Film Jobs.

Log in to your My Film Jobs dashboard to accept or decline this request.

Best regards,
The My Film Jobs Team
      `;

      return this.sendNotification({
        to: recipientEmail,
        subject,
        message,
        senderName: 'My Film Jobs',
        template: 'follow_request',
        userId: recipientUserId
      });
    } catch (error) {
      console.error('[EmailNotificationService] Error sending follow request email:', error);
      return false;
    }
  }

  // Chat notification
  static async sendChatNotification(
    recipientEmail: string,
    senderName: string,
    messagePreview: string,
    conversationUrl?: string,
    userId?: string
  ): Promise<boolean> {
    const subject = `New message from ${senderName}`;
    // Just send the message preview - the Firebase function will handle the email template
    const message = messagePreview;

    return this.sendNotification({
      to: recipientEmail,
      subject,
      message,
      senderName: senderName,
      template: 'chat',
      userId: userId
    });
  }

  // Project update notification
  static async sendProjectUpdateNotification(
    recipientEmail: string,
    projectName: string,
    updateType: 'created' | 'updated' | 'assigned' | 'completed',
    projectUrl?: string
  ): Promise<boolean> {
    const actionText = {
      created: 'has been created',
      updated: 'has been updated',
      assigned: 'has been assigned to you',
      completed: 'has been completed'
    }[updateType];

    const subject = `Project Update: ${projectName}`;
    const message = `
Hello,

The project "${projectName}" ${actionText}.

${projectUrl ? `Click here to view the project: ${projectUrl}` : 'Log in to your My Film Jobs dashboard to view this project.'}

Best regards,
The My Film Jobs Team
    `;

    return this.sendNotification({
      to: recipientEmail,
      subject,
      message,
      senderName: 'My Film Jobs',
      template: 'project'
    });
  }

  // Job application notification
  static async sendJobApplicationNotification(
    recipientEmail: string,
    jobTitle: string,
    applicantName: string,
    applicationUrl?: string
  ): Promise<boolean> {
    const subject = `New job application for ${jobTitle}`;
    const message = `
Hello,

You have received a new job application for "${jobTitle}" from ${applicantName}.

${applicationUrl ? `Click here to view the application: ${applicationUrl}` : 'Log in to your My Film Jobs dashboard to review this application.'}

Best regards,
The My Film Jobs Team
    `;

    return this.sendNotification({
      to: recipientEmail,
      subject,
      message,
      senderName: 'My Film Jobs',
      template: 'job'
    });
  }

  // General notification
  static async sendGeneralNotification(
    recipientEmail: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    return this.sendNotification({
      to: recipientEmail,
      subject,
      message,
      senderName: 'My Film Jobs',
      template: 'general'
    });
  }
}

export default EmailNotificationService;
