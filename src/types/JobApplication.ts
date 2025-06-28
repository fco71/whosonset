export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  projectId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected' | 'withdrawn';
  appliedAt: any; // Firestore timestamp
  reviewedAt?: any;
  reviewedBy?: string;
  coverLetter?: string;
  resumeId: string;
  expectedSalary?: number;
  availabilityDate?: string;
  notes?: string;
  attachments?: JobApplicationAttachment[];
  // Enhanced tracking
  lastUpdated: any;
  applicationScore?: number;
  interviewScheduled?: any;
  interviewNotes?: string;
  rejectionReason?: string;
  followUpDate?: any;
  isUrgent?: boolean;
  tags?: string[];
  // Communication tracking
  messages?: ApplicationMessage[];
  notifications?: ApplicationNotification[];
}

export interface JobApplicationAttachment {
  id: string;
  name: string;
  url: string;
  type: 'resume' | 'portfolio' | 'cover_letter' | 'reference' | 'other';
  size: number;
  uploadedAt: any;
}

export interface ApplicationMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: any;
  isRead: boolean;
  messageType: 'application_update' | 'interview_invitation' | 'rejection' | 'offer' | 'general';
}

export interface ApplicationNotification {
  id: string;
  type: 'status_change' | 'interview_scheduled' | 'message_received' | 'deadline_reminder';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: any;
  actionUrl?: string;
}

export interface JobPosting {
  id: string;
  projectId: string;
  title: string;
  department: string;
  jobTitle: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  startDate: string;
  endDate?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  isRemote: boolean;
  isUrgent: boolean;
  postedBy: string;
  postedAt: any;
  deadline?: string;
  status: 'active' | 'closed' | 'draft';
  applicationsCount: number;
  tags: string[];
  // Enhanced job posting features
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  contractType: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  benefits?: string[];
  perks?: string[];
  applicationInstructions?: string;
  requiredDocuments?: string[];
  preferredSkills?: string[];
  teamSize?: number;
  projectDuration?: string;
  travelRequirements?: string;
  // Analytics
  views: number;
  saves: number;
  shares: number;
  // Application tracking
  applications?: JobApplication[];
  shortlistedCount: number;
  interviewedCount: number;
  hiredCount: number;
}

export interface JobSearchFilter {
  keywords?: string;
  department?: string;
  jobTitle?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  isUrgent?: boolean;
  datePosted?: 'today' | 'week' | 'month' | 'all';
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  contractType?: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  // Enhanced filters
  hasBenefits?: boolean;
  allowsRemote?: boolean;
  projectDuration?: 'short_term' | 'long_term' | 'ongoing';
  teamSize?: 'small' | 'medium' | 'large';
  travelRequired?: boolean;
  // Application status filter (for applicants)
  applicationStatus?: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
}

export interface JobApplicationDashboard {
  userId: string;
  applications: JobApplication[];
  savedJobs: string[];
  recommendedJobs: string[];
  applicationStats: {
    total: number;
    pending: number;
    reviewed: number;
    shortlisted: number;
    interviewed: number;
    hired: number;
    rejected: number;
  };
  recentActivity: ApplicationActivity[];
}

export interface ApplicationActivity {
  id: string;
  type: 'application_submitted' | 'status_updated' | 'interview_scheduled' | 'message_received';
  jobId: string;
  jobTitle: string;
  timestamp: any;
  details: string;
}

export interface JobRecommendation {
  jobId: string;
  score: number;
  reasons: string[];
  matchPercentage: number;
  skillsMatched: string[];
  skillsMissing: string[];
}

export interface JobSearchAnalytics {
  searchHistory: {
    query: string;
    timestamp: any;
    resultsCount: number;
    filters: JobSearchFilter;
  }[];
  savedSearches: {
    id: string;
    name: string;
    filters: JobSearchFilter;
    createdAt: any;
    lastUsed: any;
  }[];
  applicationTrends: {
    date: string;
    applicationsSubmitted: number;
    interviewsScheduled: number;
    offersReceived: number;
  }[];
} 