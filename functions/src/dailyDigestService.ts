import * as admin from 'firebase-admin';
import { EmailService } from './emailService';
import { UserPreferencesService } from '../../src/utilities/userPreferencesService';

export interface DigestNotification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  relatedId?: string;
  senderId?: string;
}

export interface DailyDigest {
  userId: string;
  notifications: DigestNotification[];
  summary: {
    totalNotifications: number;
    messageCount: number;
    jobApplicationCount: number;
    projectInvitationCount: number;
    taskAssignmentCount: number;
    otherCount: number;
  };
}

export class DailyDigestService {
  private static getDb() {
    return admin.firestore();
  }

  /**
   * Collect all unread notifications for a user and group them for daily digest
   */
  static async collectDailyDigest(userId: string): Promise<DailyDigest | null> {
    try {
      const db = this.getDb();
      
      // Get user preferences
      const userPreferences = await UserPreferencesService.getUserPreferences(userId);
      if (!userPreferences?.dailyDigestEnabled) {
        return null;
      }

      // Get all unread notifications from the last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const notificationsRef = db.collection('notifications');
      const query = notificationsRef
        .where('userId', '==', userId)
        .where('read', '==', false)
        .where('createdAt', '>=', yesterday)
        .orderBy('createdAt', 'desc');

      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return null;
      }

      const notifications: DigestNotification[] = [];
      let messageCount = 0;
      let jobApplicationCount = 0;
      let projectInvitationCount = 0;
      let taskAssignmentCount = 0;
      let otherCount = 0;

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const notification: DigestNotification = {
          id: doc.id,
          type: data.type,
          message: data.message,
          timestamp: data.createdAt?.toDate() || new Date(),
          relatedId: data.relatedId,
          senderId: data.senderId
        };

        notifications.push(notification);

        // Count by type
        switch (data.type) {
          case 'message':
            messageCount++;
            break;
          case 'job_application':
            jobApplicationCount++;
            break;
          case 'project_invitation':
            projectInvitationCount++;
            break;
          case 'task_assignment':
            taskAssignmentCount++;
            break;
          default:
            otherCount++;
            break;
        }
      });

      return {
        userId,
        notifications,
        summary: {
          totalNotifications: notifications.length,
          messageCount,
          jobApplicationCount,
          projectInvitationCount,
          taskAssignmentCount,
          otherCount
        }
      };
    } catch (error) {
      console.error('Error collecting daily digest:', error);
      return null;
    }
  }

  /**
   * Send daily digest email to user
   */
  static async sendDailyDigest(userId: string): Promise<boolean> {
    try {
      const digest = await this.collectDailyDigest(userId);
      if (!digest || digest.notifications.length === 0) {
        return true; // No notifications to send
      }

      // Get user profile for email
      const userDoc = await this.getDb().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        console.error('User not found for daily digest:', userId);
        return false;
      }

      const userData = userDoc.data();
      const userEmail = userData?.email;
      const userName = userData?.displayName || userData?.name || 'User';

      if (!userEmail) {
        console.error('User email not found for daily digest:', userId);
        return false;
      }

      // Create digest email template
      const template = this.createDigestEmailTemplate(digest, userName);
      
      // Send email
      const success = await EmailService.sendEmail({
        to: userEmail,
        template,
        data: {
          userName,
          digest
        }
      });

      if (success) {
        // Mark notifications as read (optional - you might want to keep them unread)
        // await this.markDigestNotificationsAsRead(digest.notifications.map(n => n.id));
        console.log(`Daily digest sent to ${userEmail} with ${digest.notifications.length} notifications`);
      }

      return success;
    } catch (error) {
      console.error('Error sending daily digest:', error);
      return false;
    }
  }

  /**
   * Create email template for daily digest
   */
  private static createDigestEmailTemplate(digest: DailyDigest, userName: string) {
    const { summary, notifications } = digest;
    
    // Group notifications by type
    const messageNotifications = notifications.filter(n => n.type === 'message');
    const jobNotifications = notifications.filter(n => n.type === 'job_application');
    const projectNotifications = notifications.filter(n => n.type === 'project_invitation');
    const taskNotifications = notifications.filter(n => n.type === 'task_assignment');
    const otherNotifications = notifications.filter(n => !['message', 'job_application', 'project_invitation', 'task_assignment'].includes(n.type));

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    };

    const createNotificationList = (notifications: DigestNotification[], title: string) => {
      if (notifications.length === 0) return '';
      
      return `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #2563eb; margin-bottom: 10px;">${title}</h3>
          ${notifications.map(notification => `
            <div style="padding: 10px; background: #f8fafc; border-left: 3px solid #2563eb; margin-bottom: 8px;">
              <p style="margin: 0 0 5px 0; font-weight: 500;">${notification.message}</p>
              <small style="color: #6b7280;">${formatTime(notification.timestamp)}</small>
            </div>
          `).join('')}
        </div>
      `;
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">My Film Jobs - Daily Digest</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your daily activity summary</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${userName},</h2>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">Summary</h3>
            <p style="margin: 0; color: #6b7280;">
              You have <strong>${summary.totalNotifications}</strong> new notifications today:
            </p>
            <ul style="margin: 10px 0 0 0; color: #6b7280;">
              ${summary.messageCount > 0 ? `<li>${summary.messageCount} new message${summary.messageCount > 1 ? 's' : ''}</li>` : ''}
              ${summary.jobApplicationCount > 0 ? `<li>${summary.jobApplicationCount} job application${summary.jobApplicationCount > 1 ? 's' : ''}</li>` : ''}
              ${summary.projectInvitationCount > 0 ? `<li>${summary.projectInvitationCount} project invitation${summary.projectInvitationCount > 1 ? 's' : ''}</li>` : ''}
              ${summary.taskAssignmentCount > 0 ? `<li>${summary.taskAssignmentCount} task assignment${summary.taskAssignmentCount > 1 ? 's' : ''}</li>` : ''}
              ${summary.otherCount > 0 ? `<li>${summary.otherCount} other notification${summary.otherCount > 1 ? 's' : ''}</li>` : ''}
            </ul>
          </div>

          ${createNotificationList(messageNotifications, 'New Messages')}
          ${createNotificationList(jobNotifications, 'Job Applications')}
          ${createNotificationList(projectNotifications, 'Project Invitations')}
          ${createNotificationList(taskNotifications, 'Task Assignments')}
          ${createNotificationList(otherNotifications, 'Other Notifications')}

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <a href="https://myfilmjobs.com" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View All Notifications
            </a>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 14px; color: #6b7280;">
            <p style="margin: 0;">
              You're receiving this digest because you have daily digest notifications enabled. 
              <a href="https://myfilmjobs.com/settings/notifications" style="color: #2563eb;">Manage your notification preferences</a>
            </p>
          </div>
        </div>
      </div>
    `;

    const text = `
My Film Jobs - Daily Digest

Hello ${userName},

You have ${summary.totalNotifications} new notifications today:
${summary.messageCount > 0 ? `- ${summary.messageCount} new message${summary.messageCount > 1 ? 's' : ''}` : ''}
${summary.jobApplicationCount > 0 ? `- ${summary.jobApplicationCount} job application${summary.jobApplicationCount > 1 ? 's' : ''}` : ''}
${summary.projectInvitationCount > 0 ? `- ${summary.projectInvitationCount} project invitation${summary.projectInvitationCount > 1 ? 's' : ''}` : ''}
${summary.taskAssignmentCount > 0 ? `- ${summary.taskAssignmentCount} task assignment${summary.taskAssignmentCount > 1 ? 's' : ''}` : ''}
${summary.otherCount > 0 ? `- ${summary.otherCount} other notification${summary.otherCount > 1 ? 's' : ''}` : ''}

${notifications.map(notification => `• ${notification.message} (${formatTime(notification.timestamp)})`).join('\n')}

View all notifications: https://myfilmjobs.com

Manage notification preferences: https://myfilmjobs.com/settings/notifications

Best regards,
The My Film Jobs Team
    `;

    return {
      subject: `My Film Jobs - Daily Digest (${summary.totalNotifications} notifications)`,
      html,
      text
    };
  }

  /**
   * Mark digest notifications as read (optional)
   */
  private static async markDigestNotificationsAsRead(notificationIds: string[]): Promise<void> {
    try {
      const db = this.getDb();
      const batch = db.batch();
      
      notificationIds.forEach(id => {
        const ref = db.collection('notifications').doc(id);
        batch.update(ref, { read: true, readAt: admin.firestore.FieldValue.serverTimestamp() });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking digest notifications as read:', error);
    }
  }

  /**
   * Schedule daily digest for all users (to be called by a scheduled function)
   */
  static async sendDailyDigestToAllUsers(): Promise<void> {
    try {
      const db = this.getDb();
      const usersSnapshot = await db.collection('users').get();
      
      const promises = usersSnapshot.docs.map(doc => 
        this.sendDailyDigest(doc.id).catch(error => {
          console.error(`Error sending daily digest to user ${doc.id}:`, error);
          return false;
        })
      );
      
      await Promise.all(promises);
      console.log(`Daily digest sent to ${usersSnapshot.docs.length} users`);
    } catch (error) {
      console.error('Error sending daily digest to all users:', error);
    }
  }
} 