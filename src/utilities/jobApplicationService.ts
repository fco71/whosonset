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
  increment as firestoreIncrement,
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
        applicationsCount: firestoreIncrement(1)
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
        views: firestoreIncrement(1)
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

  // AI-powered job matching algorithm
  static async getJobRecommendations(userId: string, userProfile: any): Promise<JobRecommendation[]> {
    try {
      // Get all active job postings
      const jobsQuery = query(
        collection(db, 'jobPostings'),
        where('status', '==', 'active'),
        orderBy('postedAt', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(jobsQuery);
      const jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as JobPosting));

      // Calculate match scores for each job
      const recommendations = jobs.map(job => {
        const score = this.calculateJobMatchScore(job, userProfile);
        return {
          jobId: job.id,
          score,
          reasons: this.getMatchReasons(job, userProfile),
          matchPercentage: Math.round(score * 100),
          skillsMatched: this.getMatchedSkills(job, userProfile),
          skillsMissing: this.getMissingSkills(job, userProfile)
        } as JobRecommendation;
      });

      // Sort by score and return top recommendations
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      return [];
    }
  }

  // Calculate job match score (0-1)
  private static calculateJobMatchScore(job: JobPosting, userProfile: any): number {
    let score = 0;
    let totalWeight = 0;

    // Experience level match (30% weight)
    const experienceWeight = 0.3;
    const experienceScore = this.calculateExperienceMatch(job.experienceLevel, userProfile.experienceLevel);
    score += experienceScore * experienceWeight;
    totalWeight += experienceWeight;

    // Skills match (25% weight)
    const skillsWeight = 0.25;
    const skillsScore = this.calculateSkillsMatch(job.requirements, userProfile.skills || []);
    score += skillsScore * skillsWeight;
    totalWeight += skillsWeight;

    // Location match (20% weight)
    const locationWeight = 0.2;
    const locationScore = this.calculateLocationMatch(job.location, userProfile.location, job.isRemote);
    score += locationScore * locationWeight;
    totalWeight += locationWeight;

    // Salary expectations (15% weight)
    const salaryWeight = 0.15;
    const salaryScore = this.calculateSalaryMatch(job.salary, userProfile.expectedSalary);
    score += salaryScore * salaryWeight;
    totalWeight += salaryWeight;

    // Contract type preference (10% weight)
    const contractWeight = 0.1;
    const contractScore = this.calculateContractMatch(job.contractType, userProfile.preferredContractType);
    score += contractScore * contractWeight;
    totalWeight += contractWeight;

    return score / totalWeight;
  }

  private static calculateExperienceMatch(jobLevel: string, userLevel: string): number {
    const levels = ['entry', 'mid', 'senior', 'executive'];
    const jobIndex = levels.indexOf(jobLevel);
    const userIndex = levels.indexOf(userLevel);

    if (jobIndex === -1 || userIndex === -1) return 0.5;

    // Perfect match
    if (jobIndex === userIndex) return 1.0;
    
    // User is slightly overqualified (still good match)
    if (userIndex === jobIndex + 1) return 0.8;
    
    // User is underqualified
    if (userIndex < jobIndex) return 0.3;
    
    // User is overqualified
    return 0.6;
  }

  private static calculateSkillsMatch(requiredSkills: string[], userSkills: string[]): number {
    if (!requiredSkills || requiredSkills.length === 0) return 1.0;
    if (!userSkills || userSkills.length === 0) return 0.0;

    const matchedSkills = requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    return matchedSkills.length / requiredSkills.length;
  }

  private static calculateLocationMatch(jobLocation: string, userLocation: string, isRemote: boolean): number {
    if (isRemote) return 1.0;
    if (!userLocation) return 0.5;

    const jobLoc = jobLocation.toLowerCase();
    const userLoc = userLocation.toLowerCase();

    // Exact match
    if (jobLoc === userLoc) return 1.0;
    
    // Same city/region
    if (jobLoc.includes(userLoc) || userLoc.includes(jobLoc)) return 0.8;
    
    // Same country
    const jobCountry = jobLoc.split(',').pop()?.trim();
    const userCountry = userLoc.split(',').pop()?.trim();
    if (jobCountry === userCountry) return 0.6;

    return 0.2;
  }

  private static calculateSalaryMatch(jobSalary: any, userExpectedSalary: number): number {
    if (!jobSalary || !userExpectedSalary) return 0.5;

    const jobMin = jobSalary.min;
    const jobMax = jobSalary.max;
    const jobAvg = (jobMin + jobMax) / 2;

    // Perfect match if user's expectation is within the range
    if (userExpectedSalary >= jobMin && userExpectedSalary <= jobMax) return 1.0;
    
    // Close match (within 20%)
    const tolerance = jobAvg * 0.2;
    if (Math.abs(userExpectedSalary - jobAvg) <= tolerance) return 0.8;
    
    // User expects more (might still be interested)
    if (userExpectedSalary > jobMax) return 0.4;
    
    // User expects less (good for employer)
    return 0.9;
  }

  private static calculateContractMatch(jobContract: string, userPreferred: string): number {
    if (!userPreferred) return 0.5;
    return jobContract === userPreferred ? 1.0 : 0.3;
  }

  private static getMatchReasons(job: JobPosting, userProfile: any): string[] {
    const reasons = [];

    // Experience level
    if (job.experienceLevel === userProfile.experienceLevel) {
      reasons.push('Perfect experience level match');
    }

    // Skills
    const skillsMatch = this.calculateSkillsMatch(job.requirements, userProfile.skills || []);
    if (skillsMatch > 0.8) {
      reasons.push('Strong skills alignment');
    } else if (skillsMatch > 0.5) {
      reasons.push('Good skills overlap');
    }

    // Location
    if (job.isRemote) {
      reasons.push('Remote work available');
    } else if (job.location === userProfile.location) {
      reasons.push('Local opportunity');
    }

    // Salary
    if (job.salary && userProfile.expectedSalary) {
      const jobAvg = (job.salary.min + job.salary.max) / 2;
      if (userProfile.expectedSalary >= job.salary.min && userProfile.expectedSalary <= job.salary.max) {
        reasons.push('Salary expectations aligned');
      }
    }

    return reasons;
  }

  private static getMatchedSkills(job: JobPosting, userSkills: string[]): string[] {
    if (!job.requirements || !userSkills) return [];
    
    return job.requirements.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
  }

  private static getMissingSkills(job: JobPosting, userSkills: string[]): string[] {
    if (!job.requirements || !userSkills) return job.requirements || [];
    
    return job.requirements.filter(skill => 
      !userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
  }
} 