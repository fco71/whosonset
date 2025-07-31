import * as admin from 'firebase-admin';
import { EmailService } from './emailService';

export interface NotificationData {
  userId: string;
  type: string;
  message: string;
  relatedId?: string;
  applicationId?: string;
  applicantId?: string;
  senderId?: string;
  extra?: any;
  sendEmail?: boolean;
  emailData?: {
    to: string;
    template: any;
    data: any;
  };
}

export class NotificationService {
  private static getDb() {
    return admin.firestore();
  }

  static async createNotification(notificationData: NotificationData): Promise<string> {
    try {
      const notification = {
        type: notificationData.type,
        message: notificationData.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
        userId: notificationData.userId,
        relatedId: notificationData.relatedId,
        applicationId: notificationData.applicationId,
        applicantId: notificationData.applicantId,
        senderId: notificationData.senderId,
        extra: notificationData.extra
      };

      // Add to user's notifications
      const docRef = await this.getDb()
        .collection('users')
        .doc(notificationData.userId)
        .collection('notifications')
        .add(notification);

      // Send email notification if requested
      if (notificationData.sendEmail && notificationData.emailData) {
        try {
          await EmailService.sendEmail(notificationData.emailData);
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
          // Don't fail the notification creation if email fails
        }
      }

      console.log(`Notification created for user ${notificationData.userId}: ${notificationData.type}`);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Job Application Notifications
  static async notifyJobApplication(
    jobId: string,
    applicationId: string,
    applicantId: string,
    jobPosterId: string
  ): Promise<void> {
    try {
      // Get job and applicant details
      const [jobSnap, applicantSnap] = await Promise.all([
        this.getDb().collection('jobPostings').doc(jobId).get(),
        this.getDb().collection('users').doc(applicantId).get()
      ]);

      const jobData = jobSnap.data();
      const applicantData = applicantSnap.data();

      if (!jobData || !applicantData) {
        console.error('Job or applicant data not found');
        return;
      }

      // Get job poster's email preferences
      const jobPosterSnap = await this.getDb().collection('users').doc(jobPosterId).get();
      const jobPosterData = jobPosterSnap.data();
      const emailNotifications = jobPosterData?.emailNotifications ?? true;

      // Create in-app notification
      await this.createNotification({
        userId: jobPosterId,
        type: 'job_application',
        message: `New job application for "${jobData.title}" from ${applicantData.displayName || applicantData.email}`,
        relatedId: jobId,
        applicationId: applicationId,
        applicantId: applicantId,
        extra: {
          jobTitle: jobData.title,
          applicantName: applicantData.displayName || applicantData.email,
          companyName: jobData.companyName || 'Unknown Company'
        },
        sendEmail: emailNotifications,
        emailData: {
          to: jobPosterData?.email,
          template: EmailService.getJobApplicationTemplate(
            applicantData.displayName || applicantData.email,
            jobData.title,
            jobData.companyName || 'Unknown Company'
          ),
          data: {
            applicantName: applicantData.displayName || applicantData.email,
            jobTitle: jobData.title,
            companyName: jobData.companyName || 'Unknown Company',
            dashboardUrl: `${process.env.FRONTEND_URL || 'https://whosonset.com'}/jobs/${jobId}/applications`
          }
        }
      });
    } catch (error) {
      console.error('Error notifying job application:', error);
    }
  }

  // Project Invitation Notifications
  static async notifyProjectInvitation(
    projectId: string,
    inviterId: string,
    inviteeId: string,
    role: string
  ): Promise<void> {
    try {
      // Get project and user details
      const [projectSnap, inviterSnap, inviteeSnap] = await Promise.all([
        this.getDb().collection('Projects').doc(projectId).get(),
        this.getDb().collection('users').doc(inviterId).get(),
        this.getDb().collection('users').doc(inviteeId).get()
      ]);

      const projectData = projectSnap.data();
      const inviterData = inviterSnap.data();
      const inviteeData = inviteeSnap.data();

      if (!projectData || !inviterData || !inviteeData) {
        console.error('Project or user data not found');
        return;
      }

      // Get invitee's email preferences
      const emailNotifications = inviteeData?.emailNotifications ?? true;

      // Create in-app notification
      await this.createNotification({
        userId: inviteeId,
        type: 'project_invitation',
        message: `${inviterData.displayName || inviterData.email} invited you to join "${projectData.projectName}" as ${role}`,
        relatedId: projectId,
        senderId: inviterId,
        extra: {
          projectName: projectData.projectName,
          role: role,
          inviterName: inviterData.displayName || inviterData.email
        },
        sendEmail: emailNotifications,
        emailData: {
          to: inviteeData.email,
          template: EmailService.getProjectInvitationTemplate(
            projectData.projectName,
            inviterData.displayName || inviterData.email,
            role
          ),
          data: {
            projectName: projectData.projectName,
            inviterName: inviterData.displayName || inviterData.email,
            role: role,
            dashboardUrl: `${process.env.FRONTEND_URL || 'https://whosonset.com'}/projects/${projectId}`,
            acceptUrl: `${process.env.FRONTEND_URL || 'https://whosonset.com'}/projects/${projectId}/accept-invitation`,
            declineUrl: `${process.env.FRONTEND_URL || 'https://whosonset.com'}/projects/${projectId}/decline-invitation`
          }
        }
      });
    } catch (error) {
      console.error('Error notifying project invitation:', error);
    }
  }

  // Task Assignment Notifications
  static async notifyTaskAssignment(
    taskId: string,
    projectId: string,
    assignerId: string,
    assigneeId: string,
    taskTitle: string,
    dueDate?: string
  ): Promise<void> {
    try {
      // Get project and user details
      const [projectSnap, assignerSnap, assigneeSnap] = await Promise.all([
        this.getDb().collection('Projects').doc(projectId).get(),
        this.getDb().collection('users').doc(assignerId).get(),
        this.getDb().collection('users').doc(assigneeId).get()
      ]);

      const projectData = projectSnap.data();
      const assignerData = assignerSnap.data();
      const assigneeData = assigneeSnap.data();

      if (!projectData || !assignerData || !assigneeData) {
        console.error('Project or user data not found');
        return;
      }

      // Get assignee's email preferences
      const emailNotifications = assigneeData?.emailNotifications ?? true;

      // Create in-app notification
      await this.createNotification({
        userId: assigneeId,
        type: 'task_assignment',
        message: `${assignerData.displayName || assignerData.email} assigned you task "${taskTitle}" in "${projectData.projectName}"`,
        relatedId: taskId,
        senderId: assignerId,
        extra: {
          taskTitle: taskTitle,
          projectName: projectData.projectName,
          assignerName: assignerData.displayName || assignerData.email,
          dueDate: dueDate
        },
        sendEmail: emailNotifications,
        emailData: {
          to: assigneeData.email,
          template: EmailService.getTaskAssignmentTemplate(
            taskTitle,
            projectData.projectName,
            assignerData.displayName || assignerData.email,
            dueDate
          ),
          data: {
            taskTitle: taskTitle,
            projectName: projectData.projectName,
            assignerName: assignerData.displayName || assignerData.email,
            dueDate: dueDate,
            dashboardUrl: `${process.env.FRONTEND_URL || 'https://whosonset.com'}/tasks/${taskId}`
          }
        }
      });
    } catch (error) {
      console.error('Error notifying task assignment:', error);
    }
  }

  // Message Notifications
  static async notifyNewMessage(
    senderId: string,
    receiverId: string,
    messageContent: string,
    conversationId: string
  ): Promise<void> {
    try {
      // Get user details
      const [senderSnap, receiverSnap] = await Promise.all([
        this.getDb().collection('users').doc(senderId).get(),
        this.getDb().collection('users').doc(receiverId).get()
      ]);

      const senderData = senderSnap.data();
      const receiverData = receiverSnap.data();

      if (!senderData || !receiverData) {
        console.error('User data not found');
        return;
      }

      // Get receiver's email preferences
      const emailNotifications = receiverData?.emailNotifications ?? true;

      // Create message preview (truncate if too long)
      const messagePreview = messageContent.length > 100 
        ? messageContent.substring(0, 100) + '...' 
        : messageContent;

      // Create in-app notification
      await this.createNotification({
        userId: receiverId,
        type: 'message',
        message: `New message from ${senderData.displayName || senderData.email}`,
        senderId: senderId,
        extra: {
          content: messagePreview,
          conversationId: conversationId
        },
        sendEmail: emailNotifications,
        emailData: {
          to: receiverData.email,
          template: EmailService.getMessageNotificationTemplate(
            senderData.displayName || senderData.email,
            messagePreview
          ),
          data: {
            senderName: senderData.displayName || senderData.email,
            messagePreview: messagePreview,
            messageUrl: `${process.env.FRONTEND_URL || 'https://whosonset.com'}/chat?user=${senderId}`
          }
        }
      });
    } catch (error) {
      console.error('Error notifying new message:', error);
    }
  }

  // Project Update Notifications
  static async notifyProjectUpdate(
    projectId: string,
    updaterId: string,
    updateType: string,
    crewMemberIds: string[]
  ): Promise<void> {
    try {
      // Get project and updater details
      const [projectSnap, updaterSnap] = await Promise.all([
        this.getDb().collection('Projects').doc(projectId).get(),
        this.getDb().collection('users').doc(updaterId).get()
      ]);

      const projectData = projectSnap.data();
      const updaterData = updaterSnap.data();

      if (!projectData || !updaterData) {
        console.error('Project or user data not found');
        return;
      }

      // Notify all crew members except the updater
      const notifications = crewMemberIds
        .filter(memberId => memberId !== updaterId)
        .map(async (memberId) => {
          try {
            const memberSnap = await this.getDb().collection('users').doc(memberId).get();
            const memberData = memberSnap.data();

            if (!memberData) return;

            const emailNotifications = memberData?.emailNotifications ?? true;

            await this.createNotification({
              userId: memberId,
              type: 'project_update',
              message: `${updaterData.displayName || updaterData.email} updated "${projectData.projectName}"`,
              relatedId: projectId,
              senderId: updaterId,
              extra: {
                projectName: projectData.projectName,
                updateType: updateType,
                updaterName: updaterData.displayName || updaterData.email
              },
              sendEmail: emailNotifications,
              emailData: {
                to: memberData.email,
                template: EmailService.getProjectUpdateTemplate(
                  projectData.projectName,
                  updateType,
                  updaterData.displayName || updaterData.email
                ),
                data: {
                  projectName: projectData.projectName,
                  updateType: updateType,
                  updaterName: updaterData.displayName || updaterData.email,
                  updateDate: new Date().toLocaleDateString(),
                  projectUrl: `${process.env.FRONTEND_URL || 'https://whosonset.com'}/projects/${projectId}`
                }
              }
            });
          } catch (error) {
            console.error(`Error notifying crew member ${memberId}:`, error);
          }
        });

      await Promise.all(notifications);
    } catch (error) {
      console.error('Error notifying project update:', error);
    }
  }

  // Bulk notification for multiple users
  static async notifyMultipleUsers(
    userIds: string[],
    notificationData: Omit<NotificationData, 'userId'>
  ): Promise<void> {
    const notifications = userIds.map(userId => 
      this.createNotification({
        ...notificationData,
        userId
      })
    );

    await Promise.all(notifications);
  }
} 