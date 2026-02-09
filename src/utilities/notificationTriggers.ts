import { getAuth } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  writeBatch, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase';
import EmailNotificationService from './emailNotificationService';

// Initialize Firebase with error handling
let auth: any;

try {
  auth = getAuth();
} catch (error) {
  console.error('Error initializing Firebase in notificationTriggers:', error);
  // Provide fallback objects
  auth = null;
}

export class NotificationTriggers {
  
  // Trigger job application notification
  static async triggerJobApplicationNotification(
    jobId: string, 
    applicationId: string, 
    applicantId: string, 
    postedById: string
  ) {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return;
      }
      
      await addDoc(collection(db, 'notifications'), {
        userId: postedById,
        type: "job_application",
        title: 'New Job Application',
        body: 'New application received for your job posting.',
        message: `New application received for your job posting.`,
        link: `/jobs/${encodeURIComponent(jobId)}/applications`,
        relatedId: jobId,
        applicationId: applicationId,
        applicantId: applicantId,
        isRead: false,
        read: false,
        createdAt: serverTimestamp()
      });
      console.log('Job application notification created');
    } catch (error) {
      console.error('Error creating job application notification:', error);
    }
  }

  // Trigger message notification
  static async triggerMessageNotification(
    receiverId: string, 
    senderId: string, 
    senderName: string, 
    messageId: string
  ) {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return;
      }
      
      await addDoc(collection(db, 'notifications'), {
        userId: receiverId,
        type: "message",
        title: 'New Message',
        body: `New message from ${senderName || 'User'}`,
        message: `New message from ${senderName || 'User'}`,
        link: senderId ? `/chat?user=${encodeURIComponent(senderId)}` : '/chat',
        senderId: senderId,
        messageId: messageId,
        isRead: false,
        read: false,
        createdAt: serverTimestamp()
      });
      console.log('Message notification created');
    } catch (error) {
      console.error('Error creating message notification:', error);
    }
  }

  // Trigger project invitation notification
  static async triggerProjectInvitationNotification(
    invitedUserId: string, 
    projectId: string, 
    invitationId: string
  ) {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return;
      }
      
      await addDoc(collection(db, 'notifications'), {
        userId: invitedUserId,
        type: "project_invitation",
        title: 'Project Invitation',
        body: `You've been invited to join a project`,
        message: `You've been invited to join a project`,
        link: `/projects/${encodeURIComponent(projectId)}`,
        relatedId: projectId,
        invitationId: invitationId,
        isRead: false,
        read: false,
        createdAt: serverTimestamp()
      });
      console.log('Project invitation notification created');
    } catch (error) {
      console.error('Error creating project invitation notification:', error);
    }
  }

  // Trigger task assignment notification
  static async triggerTaskAssignmentNotification(
    assignedUserId: string, 
    taskId: string, 
    assignmentId: string
  ) {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return;
      }
      
      await addDoc(collection(db, 'notifications'), {
        userId: assignedUserId,
        type: "task_assignment",
        title: 'Task Assignment',
        body: `You've been assigned a new task`,
        message: `You've been assigned a new task`,
        link: `/projects/${encodeURIComponent(taskId)}/tasks`,
        relatedId: taskId,
        assignmentId: assignmentId,
        isRead: false,
        read: false,
        createdAt: serverTimestamp()
      });

      // Send email notification
      await EmailNotificationService.sendTaskAssignmentEmail(assignedUserId, taskId);
      
      console.log('Task assignment notification created');
    } catch (error) {
      console.error('Error creating task assignment notification:', error);
    }
  }

  // Trigger project update notification
  static async triggerProjectUpdateNotification(
    projectId: string, 
    userIds: string[]
  ) {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return;
      }
      
      const batch = writeBatch(db);
      userIds.forEach(userId => {
        const ref = doc(collection(db, 'notifications'));
        batch.set(ref, {
          userId: userId,
          type: "project_update",
          title: 'Project Update',
          body: `Project has been updated`,
          message: `Project has been updated`,
          link: `/projects/${encodeURIComponent(projectId)}`,
          relatedId: projectId,
          isRead: false,
          read: false,
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();
      console.log(`Project update notifications created for ${userIds.length} users`);
    } catch (error) {
      console.error('Error creating project update notifications:', error);
    }
  }

  // Trigger application status update notification
  static async triggerApplicationStatusUpdateNotification(
    applicantId: string, 
    applicationId: string, 
    jobId: string, 
    status: string
  ) {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return;
      }
      
      await addDoc(collection(db, 'notifications'), {
        userId: applicantId,
        type: "application_status_update",
        title: 'Application Status Updated',
        body: `Your job application status has been updated to: ${status}`,
        message: `Your job application status has been updated to: ${status}`,
        link: `/applications/${encodeURIComponent(applicationId)}`,
        applicationId: applicationId,
        jobId: jobId,
        isRead: false,
        read: false,
        createdAt: serverTimestamp()
      });
      console.log('Application status update notification created');
    } catch (error) {
      console.error('Error creating application status update notification:', error);
    }
  }
} 
