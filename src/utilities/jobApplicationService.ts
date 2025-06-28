import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  writeBatch,
  getDoc,
  increment,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  JobApplication, 
  JobPosting, 
  JobSearchFilter, 
  JobApplicationDashboard,
  ApplicationActivity,
  JobRecommendation,
  JobSearchAnalytics,
  ApplicationMessage,
  ApplicationNotification
} from '../types/JobApplication';

export class JobApplicationService {
  // Job Search Operations
  static async searchJobs(filters: JobSearchFilter, page: number = 1, pageSize: number = 20): Promise<JobPosting[]> {
    try {
      console.log('[JobApplicationService] Searching jobs with filters:', filters);
      
      let jobsQuery = query(
        collection(db, 'jobPostings'),
        where('status', '==', 'active'),
        orderBy('postedAt', 'desc')
      );

      // Apply filters
      if (filters.department) {
        jobsQuery = query(jobsQuery, where('department', '==', filters.department));
      }

      if (filters.experienceLevel) {
        jobsQuery = query(jobsQuery, where('experienceLevel', '==', filters.experienceLevel));
      }

      if (filters.contractType) {
        jobsQuery = query(jobsQuery, where('contractType', '==', filters.contractType));
      }

      if (filters.isRemote !== undefined) {
        jobsQuery = query(jobsQuery, where('isRemote', '==', filters.isRemote));
      }

      if (filters.isUrgent !== undefined) {
        jobsQuery = query(jobsQuery, where('isUrgent', '==', filters.isUrgent));
      }

      // Apply pagination
      if (page > 1) {
        // For now, we'll load all and filter client-side
        // In production, you'd implement proper pagination with startAfter
      }

      const snapshot = await getDocs(jobsQuery);
      let jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobPosting[];

      // Apply client-side filters
      if (filters.keywords) {
        const keywords = filters.keywords.toLowerCase();
        jobs = jobs.filter(job =>
          job.title.toLowerCase().includes(keywords) ||
          job.description.toLowerCase().includes(keywords) ||
          job.department.toLowerCase().includes(keywords) ||
          job.jobTitle.toLowerCase().includes(keywords) ||
          job.location.toLowerCase().includes(keywords) ||
          job.tags.some(tag => tag.toLowerCase().includes(keywords))
        );
      }

      if (filters.location) {
        jobs = jobs.filter(job => 
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.salaryMin !== undefined) {
        jobs = jobs.filter(job => job.salary && job.salary.min >= filters.salaryMin!);
      }

      if (filters.salaryMax !== undefined) {
        jobs = jobs.filter(job => job.salary && job.salary.max <= filters.salaryMax!);
      }

      if (filters.datePosted && filters.datePosted !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (filters.datePosted) {
          case 'today':
            filterDate.setDate(now.getDate() - 1);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
        }

        jobs = jobs.filter(job => {
          const postedDate = job.postedAt?.toDate ? job.postedAt.toDate() : new Date(job.postedAt);
          return postedDate >= filterDate;
        });
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      jobs = jobs.slice(startIndex, endIndex);

      console.log('[JobApplicationService] Found', jobs.length, 'jobs');
      return jobs;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }

  // Job Application Operations
  static async submitApplication(application: Omit<JobApplication, 'id' | 'appliedAt' | 'lastUpdated'>): Promise<string> {
    try {
      console.log('[JobApplicationService] Submitting application for job:', application.jobId);
      
      const applicationData = {
        ...application,
        appliedAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        status: 'pending' as const
      };

      const docRef = await addDoc(collection(db, 'jobApplications'), applicationData);
      
      // Update job posting application count
      const jobRef = doc(db, 'jobPostings', application.jobId);
      await updateDoc(jobRef, {
        applicationsCount: increment(1)
      });

      // Create notification for the job poster
      await this.createApplicationNotification(application.jobId, docRef.id, application.applicantId);

      console.log('[JobApplicationService] Application submitted successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }

  static async updateApplicationStatus(applicationId: string, status: JobApplication['status'], notes?: string): Promise<void> {
    try {
      console.log('[JobApplicationService] Updating application status:', applicationId, 'to', status);
      
      const updateData: any = {
        status,
        lastUpdated: serverTimestamp()
      };

      if (status === 'reviewed') {
        updateData.reviewedAt = serverTimestamp();
      }

      if (notes) {
        updateData.notes = notes;
      }

      await updateDoc(doc(db, 'jobApplications', applicationId), updateData);

      // Create notification for the applicant
      const application = await this.getApplication(applicationId);
      if (application) {
        await this.createStatusUpdateNotification(applicationId, application.applicantId, status);
      }

      console.log('[JobApplicationService] Application status updated successfully');
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  static async getApplication(applicationId: string): Promise<JobApplication | null> {
    try {
      const docRef = await getDoc(doc(db, 'jobApplications', applicationId));
      if (docRef.exists()) {
        return {
          id: docRef.id,
          ...docRef.data()
        } as JobApplication;
      }
      return null;
    } catch (error) {
      console.error('Error getting application:', error);
      throw error;
    }
  }

  static async getUserApplications(userId: string): Promise<JobApplication[]> {
    try {
      const applicationsQuery = query(
        collection(db, 'jobApplications'),
        where('applicantId', '==', userId),
        orderBy('appliedAt', 'desc')
      );

      const snapshot = await getDocs(applicationsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobApplication[];
    } catch (error) {
      console.error('Error getting user applications:', error);
      throw error;
    }
  }

  static async getJobApplications(jobId: string): Promise<JobApplication[]> {
    try {
      const applicationsQuery = query(
        collection(db, 'jobApplications'),
        where('jobId', '==', jobId),
        orderBy('appliedAt', 'desc')
      );

      const snapshot = await getDocs(applicationsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobApplication[];
    } catch (error) {
      console.error('Error getting job applications:', error);
      throw error;
    }
  }

  // Dashboard Operations
  static async getUserDashboard(userId: string): Promise<JobApplicationDashboard> {
    try {
      const applications = await this.getUserApplications(userId);
      
      const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewed: applications.filter(app => app.status === 'reviewed').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        interviewed: applications.filter(app => app.status === 'interviewed').length,
        hired: applications.filter(app => app.status === 'hired').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
      };

      const recentActivity = applications.slice(0, 10).map(app => ({
        id: app.id,
        type: 'application_submitted' as const,
        jobId: app.jobId,
        jobTitle: 'Job Title', // You'd need to fetch this from the job posting
        timestamp: app.appliedAt,
        details: `Application submitted for ${app.jobId}`
      }));

      return {
        userId,
        applications,
        savedJobs: [], // TODO: Implement saved jobs
        recommendedJobs: [], // TODO: Implement recommendations
        applicationStats: stats,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting user dashboard:', error);
      throw error;
    }
  }

  // Messaging Operations
  static async sendApplicationMessage(applicationId: string, message: Omit<ApplicationMessage, 'id' | 'timestamp'>): Promise<void> {
    try {
      const messageData = {
        ...message,
        timestamp: serverTimestamp(),
        isRead: false
      };

      await addDoc(collection(db, 'applicationMessages'), {
        applicationId,
        ...messageData
      });

      // Create notification
      await this.createMessageNotification(applicationId, message.senderId, message.senderName);
    } catch (error) {
      console.error('Error sending application message:', error);
      throw error;
    }
  }

  // Notification Operations
  static async createApplicationNotification(jobId: string, applicationId: string, applicantId: string): Promise<void> {
    try {
      const notificationData = {
        userId: applicantId,
        type: 'application_submitted',
        title: 'Application Submitted',
        message: 'Your job application has been submitted successfully.',
        relatedJobId: jobId,
        relatedApplicationId: applicationId,
        isRead: false,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'applicationNotifications'), notificationData);
    } catch (error) {
      console.error('Error creating application notification:', error);
    }
  }

  static async createStatusUpdateNotification(applicationId: string, userId: string, status: string): Promise<void> {
    try {
      const notificationData = {
        userId,
        type: 'status_update',
        title: 'Application Status Updated',
        message: `Your application status has been updated to: ${status}`,
        relatedApplicationId: applicationId,
        isRead: false,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'applicationNotifications'), notificationData);
    } catch (error) {
      console.error('Error creating status update notification:', error);
    }
  }

  static async createMessageNotification(applicationId: string, userId: string, senderName: string): Promise<void> {
    try {
      const notificationData = {
        userId,
        type: 'message_received',
        title: 'New Message',
        message: `You received a message from ${senderName} regarding your application.`,
        relatedApplicationId: applicationId,
        isRead: false,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'applicationNotifications'), notificationData);
    } catch (error) {
      console.error('Error creating message notification:', error);
    }
  }

  // Analytics Operations
  static async trackJobView(jobId: string, userId?: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'jobPostings', jobId), {
        views: increment(1)
      });

      if (userId) {
        // Track user's job view history
        await addDoc(collection(db, 'jobViewHistory'), {
          userId,
          jobId,
          viewedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error tracking job view:', error);
    }
  }

  static async saveJobSearch(userId: string, name: string, filters: JobSearchFilter): Promise<void> {
    try {
      await addDoc(collection(db, 'savedSearches'), {
        userId,
        name,
        filters,
        createdAt: serverTimestamp(),
        lastUsed: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving job search:', error);
      throw error;
    }
  }

  // Real-time Listeners
  static subscribeToUserApplications(userId: string, callback: (applications: JobApplication[]) => void) {
    try {
      const applicationsQuery = query(
        collection(db, 'jobApplications'),
        where('applicantId', '==', userId),
        orderBy('appliedAt', 'desc')
      );

      return onSnapshot(applicationsQuery, (snapshot) => {
        const applications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JobApplication[];
        callback(applications);
      });
    } catch (error) {
      console.error('Error setting up applications listener:', error);
      return () => {};
    }
  }

  static subscribeToApplicationMessages(applicationId: string, callback: (messages: ApplicationMessage[]) => void) {
    try {
      const messagesQuery = query(
        collection(db, 'applicationMessages'),
        where('applicationId', '==', applicationId),
        orderBy('timestamp', 'asc')
      );

      return onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ApplicationMessage[];
        callback(messages);
      });
    } catch (error) {
      console.error('Error setting up messages listener:', error);
      return () => {};
    }
  }
} 