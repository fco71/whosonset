import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface EmailNotificationData {
  to: string;
  subject: string;
  message: string;
  senderName: string;
  template?: 'chat' | 'project' | 'job' | 'general';
}

class EmailNotificationService {
  private static readonly EMAIL_FUNCTION_URL = 'https://us-central1-my-film-jobs.cloudfunctions.net/emailSend';
  private static readonly WEEKLY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  // Check if user can receive email (weekly limit)
  private static async canSendEmail(userEmail: string, template: string): Promise<boolean> {
    try {
      const emailTrackingRef = doc(db, 'emailTracking', userEmail);
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
      return timeSinceLastEmail >= this.WEEKLY_LIMIT_MS;
    } catch (error) {
      console.error('Error checking email limit:', error);
      // If there's an error checking, allow the email to be sent
      return true;
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
      console.log('[EmailNotificationService] Sending notification:', data);

      // Check weekly limit
      const canSend = await this.canSendEmail(data.to, data.template || 'general');
      if (!canSend) {
        console.log(`[EmailNotificationService] Weekly limit reached for ${data.to} (${data.template})`);
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
      console.log('[EmailNotificationService] Response:', result);

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

  // Chat notification
  static async sendChatNotification(
    recipientEmail: string,
    senderName: string,
    messagePreview: string,
    conversationUrl?: string
  ): Promise<boolean> {
    const subject = `New message from ${senderName}`;
    const message = `
Hello,

You have received a new message from ${senderName}.

Message preview: "${messagePreview}"

${conversationUrl ? `Click here to view the conversation: ${conversationUrl}` : 'Log in to your My Film Jobs dashboard to view this message.'}

Best regards,
The My Film Jobs Team
    `;

    return this.sendNotification({
      to: recipientEmail,
      subject,
      message,
      senderName: 'My Film Jobs',
      template: 'chat'
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