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
        message: `New application received for job posting`,
        relatedId: jobId,
        applicationId: applicationId,
        applicantId: applicantId,
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
        message: `New message from ${senderName || 'User'}`,
        senderId: senderId,
        messageId: messageId,
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
        message: `You've been invited to join a project`,
        relatedId: projectId,
        invitationId: invitationId,
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
        message: `You've been assigned a new task`,
        relatedId: taskId,
        assignmentId: assignmentId,
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
          message: `Project has been updated`,
          relatedId: projectId,
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
        message: `Your job application status has been updated to: ${status}`,
        applicationId: applicationId,
        jobId: jobId,
        read: false,
        createdAt: serverTimestamp()
      });
      console.log('Application status update notification created');
    } catch (error) {
      console.error('Error creating application status update notification:', error);
    }
  }
} 