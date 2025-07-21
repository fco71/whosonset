"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[93],{

/***/ 6093:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ JobApplicationService)
/* harmony export */ });
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9487);


class JobApplicationService {
    // Job Search Operations
    static async searchJobs(filters, page = 1, pageSize = 20) {
        try {
            console.log('[JobApplicationService] Searching jobs with filters:', filters);
            let jobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobPostings'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('status', '==', 'active'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('postedAt', 'desc'));
            // Apply filters
            if (filters.department) {
                jobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(jobsQuery, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('department', '==', filters.department));
            }
            if (filters.experienceLevel) {
                jobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(jobsQuery, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('experienceLevel', '==', filters.experienceLevel));
            }
            if (filters.contractType) {
                jobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(jobsQuery, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('contractType', '==', filters.contractType));
            }
            if (filters.isRemote !== undefined) {
                jobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(jobsQuery, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('isRemote', '==', filters.isRemote));
            }
            if (filters.isUrgent !== undefined) {
                jobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(jobsQuery, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('isUrgent', '==', filters.isUrgent));
            }
            // Apply pagination
            if (page > 1) {
                // For now, we'll load all and filter client-side
                // In production, you'd implement proper pagination with startAfter
            }
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(jobsQuery);
            let jobs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Apply client-side filters
            if (filters.keywords) {
                const keywords = filters.keywords.toLowerCase();
                jobs = jobs.filter(job => job.title.toLowerCase().includes(keywords) ||
                    job.description.toLowerCase().includes(keywords) ||
                    job.department.toLowerCase().includes(keywords) ||
                    job.jobTitle.toLowerCase().includes(keywords) ||
                    job.location.toLowerCase().includes(keywords) ||
                    job.tags.some(tag => tag.toLowerCase().includes(keywords)));
            }
            if (filters.location) {
                jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
            }
            if (filters.salaryMin !== undefined) {
                jobs = jobs.filter(job => job.salary && job.salary.min >= filters.salaryMin);
            }
            if (filters.salaryMax !== undefined) {
                jobs = jobs.filter(job => job.salary && job.salary.max <= filters.salaryMax);
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
        }
        catch (error) {
            console.error('Error searching jobs:', error);
            throw error;
        }
    }
    // Job Application Operations
    static async submitApplication(application) {
        try {
            console.log('[JobApplicationService] Submitting application for job:', application.jobId);
            console.log('[JobApplicationService] Application data:', application);
            // Simple connection check - just try the operation directly
            // Firebase will handle connection issues automatically
            // Filter out undefined values to prevent Firestore errors
            const cleanApplication = Object.fromEntries(Object.entries(application).filter(([_, value]) => value !== undefined));
            console.log('[JobApplicationService] Cleaned application data:', cleanApplication);
            const applicationData = {
                ...cleanApplication,
                appliedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)(),
                lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)(),
                status: 'pending'
            };
            const docRef = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobApplications'), applicationData);
            // Update job posting application count (optional - don't fail if user can't update)
            try {
                const jobRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobPostings', application.jobId);
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)(jobRef, {
                    applicationsCount: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .increment */ .GV)(1)
                });
            }
            catch (updateError) {
                console.log('[JobApplicationService] Could not update job application count (this is expected for non-owners):', updateError);
                // Don't throw error - application was still created successfully
            }
            // Create notification for the job poster (optional)
            try {
                await this.createApplicationNotification(application.jobId, docRef.id, application.applicantId);
            }
            catch (notificationError) {
                console.log('[JobApplicationService] Could not create notification (this is expected):', notificationError);
                // Don't throw error - application was still created successfully
            }
            console.log('[JobApplicationService] Application submitted successfully:', docRef.id);
            return docRef.id;
        }
        catch (error) {
            console.error('Error submitting application:', error);
            throw error;
        }
    }
    static async updateApplicationStatus(applicationId, status, notes) {
        try {
            console.log('[JobApplicationService] Updating application status:', applicationId, 'to', status);
            const updateData = {
                status,
                lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
            };
            if (status === 'reviewed') {
                updateData.reviewedAt = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)();
            }
            if (notes) {
                updateData.notes = notes;
            }
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobApplications', applicationId), updateData);
            // Create notification for the applicant
            const application = await this.getApplication(applicationId);
            if (application) {
                await this.createStatusUpdateNotification(applicationId, application.applicantId, status);
            }
            console.log('[JobApplicationService] Application status updated successfully');
        }
        catch (error) {
            console.error('Error updating application status:', error);
            throw error;
        }
    }
    // User can edit their own application
    static async updateApplication(applicationId, updates) {
        try {
            console.log('[JobApplicationService] Updating application:', applicationId);
            const updateData = {
                ...updates,
                lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
            };
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobApplications', applicationId), updateData);
            console.log('[JobApplicationService] Application updated successfully');
        }
        catch (error) {
            console.error('Error updating application:', error);
            throw error;
        }
    }
    // User can delete/withdraw their own application
    static async deleteApplication(applicationId) {
        try {
            console.log('[JobApplicationService] Deleting application:', applicationId);
            // Get the application to update job posting count
            const application = await this.getApplication(applicationId);
            // Delete the application
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .deleteDoc */ .kd)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobApplications', applicationId));
            // Update job posting application count if possible
            if (application) {
                try {
                    const jobRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobPostings', application.jobId);
                    await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)(jobRef, {
                        applicationsCount: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .increment */ .GV)(-1)
                    });
                }
                catch (updateError) {
                    console.log('[JobApplicationService] Could not update job application count:', updateError);
                    // Don't throw error - application was still deleted successfully
                }
            }
            console.log('[JobApplicationService] Application deleted successfully');
        }
        catch (error) {
            console.error('Error deleting application:', error);
            throw error;
        }
    }
    static async getApplication(applicationId) {
        try {
            const docRef = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobApplications', applicationId));
            if (docRef.exists()) {
                return {
                    id: docRef.id,
                    ...docRef.data()
                };
            }
            return null;
        }
        catch (error) {
            console.error('Error getting application:', error);
            throw error;
        }
    }
    static async getUserApplications(userId) {
        try {
            const applicationsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobApplications'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('applicantId', '==', userId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('appliedAt', 'desc'));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(applicationsQuery);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }
        catch (error) {
            console.error('Error getting user applications:', error);
            throw error;
        }
    }
    static async getJobApplications(jobId) {
        try {
            const applicationsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobApplications'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('jobId', '==', jobId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('appliedAt', 'desc'));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(applicationsQuery);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }
        catch (error) {
            console.error('Error getting job applications:', error);
            throw error;
        }
    }
    // Dashboard Operations
    static async getUserDashboard(userId) {
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
                type: 'application_submitted',
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
        }
        catch (error) {
            console.error('Error getting user dashboard:', error);
            throw error;
        }
    }
    // Messaging Operations
    static async sendApplicationMessage(applicationId, message) {
        try {
            const messageData = {
                ...message,
                timestamp: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)(),
                isRead: false
            };
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'applicationMessages'), {
                applicationId,
                ...messageData
            });
            // Create notification
            await this.createMessageNotification(applicationId, message.senderId, message.senderName);
        }
        catch (error) {
            console.error('Error sending application message:', error);
            throw error;
        }
    }
    // Notification Operations
    static async createApplicationNotification(jobId, applicationId, applicantId) {
        try {
            const notificationData = {
                userId: applicantId,
                type: 'application_submitted',
                title: 'Application Submitted',
                message: 'Your job application has been submitted successfully.',
                relatedJobId: jobId,
                relatedApplicationId: applicationId,
                isRead: false,
                createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
            };
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'applicationNotifications'), notificationData);
            console.log('Application notification created successfully');
        }
        catch (error) {
            console.error('Error creating application notification:', error);
            // Only log if it's not a permission error
            if (error.code !== 'permission-denied') {
                console.log('Notification creation failed:', error.code);
            }
            // Don't throw the error - notification creation is not critical
        }
    }
    static async createStatusUpdateNotification(applicationId, userId, status) {
        try {
            const notificationData = {
                userId,
                type: 'status_update',
                title: 'Application Status Updated',
                message: `Your application status has been updated to: ${status}`,
                relatedApplicationId: applicationId,
                isRead: false,
                createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
            };
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'applicationNotifications'), notificationData);
        }
        catch (error) {
            console.error('Error creating status update notification:', error);
        }
    }
    static async createMessageNotification(applicationId, userId, senderName) {
        try {
            const notificationData = {
                userId,
                type: 'message_received',
                title: 'New Message',
                message: `You received a message from ${senderName} regarding your application.`,
                relatedApplicationId: applicationId,
                isRead: false,
                createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
            };
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'applicationNotifications'), notificationData);
        }
        catch (error) {
            console.error('Error creating message notification:', error);
        }
    }
    // Analytics Operations
    static async trackJobView(jobId, userId) {
        try {
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobPostings', jobId), {
                views: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .increment */ .GV)(1)
            });
            if (userId) {
                // Track user's job view history
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobViewHistory'), {
                    userId,
                    jobId,
                    viewedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
                });
            }
        }
        catch (error) {
            console.error('Error tracking job view:', error);
        }
    }
    static async saveJobSearch(userId, name, filters) {
        try {
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'savedSearches'), {
                userId,
                name,
                filters,
                createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)(),
                lastUsed: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
            });
        }
        catch (error) {
            console.error('Error saving job search:', error);
            throw error;
        }
    }
    // Real-time Listeners
    static subscribeToUserApplications(userId, callback) {
        try {
            const applicationsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobApplications'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('applicantId', '==', userId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('appliedAt', 'desc'));
            return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(applicationsQuery, (snapshot) => {
                const applications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(applications);
            });
        }
        catch (error) {
            console.error('Error setting up applications listener:', error);
            return () => { };
        }
    }
    static subscribeToApplicationMessages(applicationId, callback) {
        try {
            const messagesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'applicationMessages'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('applicationId', '==', applicationId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('timestamp', 'asc'));
            return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(messagesQuery, (snapshot) => {
                const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(messages);
            });
        }
        catch (error) {
            console.error('Error setting up messages listener:', error);
            return () => { };
        }
    }
    // AI-powered job matching algorithm
    static async getJobRecommendations(userId, userProfile) {
        try {
            // Get all active job postings
            const jobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobPostings'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('status', '==', 'active'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('postedAt', 'desc'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .limit */ .AB)(100));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(jobsQuery);
            const jobs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
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
                };
            });
            // Sort by score and return top recommendations
            return recommendations
                .sort((a, b) => b.score - a.score)
                .slice(0, 20);
        }
        catch (error) {
            console.error('Error getting job recommendations:', error);
            return [];
        }
    }
    // Calculate job match score (0-1)
    static calculateJobMatchScore(job, userProfile) {
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
    static calculateExperienceMatch(jobLevel, userLevel) {
        const levels = ['entry', 'mid', 'senior', 'executive'];
        const jobIndex = levels.indexOf(jobLevel);
        const userIndex = levels.indexOf(userLevel);
        if (jobIndex === -1 || userIndex === -1)
            return 0.5;
        // Perfect match
        if (jobIndex === userIndex)
            return 1.0;
        // User is slightly overqualified (still good match)
        if (userIndex === jobIndex + 1)
            return 0.8;
        // User is underqualified
        if (userIndex < jobIndex)
            return 0.3;
        // User is overqualified
        return 0.6;
    }
    static calculateSkillsMatch(requiredSkills, userSkills) {
        if (!requiredSkills || requiredSkills.length === 0)
            return 1.0;
        if (!userSkills || userSkills.length === 0)
            return 0.0;
        const matchedSkills = requiredSkills.filter(skill => userSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())));
        return matchedSkills.length / requiredSkills.length;
    }
    static calculateLocationMatch(jobLocation, userLocation, isRemote) {
        if (isRemote)
            return 1.0;
        if (!userLocation)
            return 0.5;
        const jobLoc = jobLocation.toLowerCase();
        const userLoc = userLocation.toLowerCase();
        // Exact match
        if (jobLoc === userLoc)
            return 1.0;
        // Same city/region
        if (jobLoc.includes(userLoc) || userLoc.includes(jobLoc))
            return 0.8;
        // Same country
        const jobCountry = jobLoc.split(',').pop()?.trim();
        const userCountry = userLoc.split(',').pop()?.trim();
        if (jobCountry === userCountry)
            return 0.6;
        return 0.2;
    }
    static calculateSalaryMatch(jobSalary, userExpectedSalary) {
        if (!jobSalary || !userExpectedSalary)
            return 0.5;
        const jobMin = jobSalary.min;
        const jobMax = jobSalary.max;
        const jobAvg = (jobMin + jobMax) / 2;
        // Perfect match if user's expectation is within the range
        if (userExpectedSalary >= jobMin && userExpectedSalary <= jobMax)
            return 1.0;
        // Close match (within 20%)
        const tolerance = jobAvg * 0.2;
        if (Math.abs(userExpectedSalary - jobAvg) <= tolerance)
            return 0.8;
        // User expects more (might still be interested)
        if (userExpectedSalary > jobMax)
            return 0.4;
        // User expects less (good for employer)
        return 0.9;
    }
    static calculateContractMatch(jobContract, userPreferred) {
        if (!userPreferred)
            return 0.5;
        return jobContract === userPreferred ? 1.0 : 0.3;
    }
    static getMatchReasons(job, userProfile) {
        const reasons = [];
        // Experience level
        if (job.experienceLevel === userProfile.experienceLevel) {
            reasons.push('Perfect experience level match');
        }
        // Skills
        const skillsMatch = this.calculateSkillsMatch(job.requirements, userProfile.skills || []);
        if (skillsMatch > 0.8) {
            reasons.push('Strong skills alignment');
        }
        else if (skillsMatch > 0.5) {
            reasons.push('Good skills overlap');
        }
        // Location
        if (job.isRemote) {
            reasons.push('Remote work available');
        }
        else if (job.location === userProfile.location) {
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
    static getMatchedSkills(job, userSkills) {
        if (!job.requirements || !userSkills)
            return [];
        return job.requirements.filter(skill => userSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())));
    }
    static getMissingSkills(job, userSkills) {
        if (!job.requirements || !userSkills)
            return job.requirements || [];
        return job.requirements.filter(skill => !userSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())));
    }
    // Connection health check - simplified
    static async checkConnectionHealth() {
        try {
            console.log('[JobApplicationService] Checking Firestore connection health...');
            // Simple test query
            const testQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobPostings'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .limit */ .AB)(1));
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(testQuery);
            console.log('[JobApplicationService] Connection health check passed');
            return true;
        }
        catch (error) {
            console.error('[JobApplicationService] Connection health check failed:', error);
            return false;
        }
    }
}


/***/ })

}]);
//# sourceMappingURL=93.chunk.js.map