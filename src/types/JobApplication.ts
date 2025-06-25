export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  projectId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  appliedAt: any; // Firestore timestamp
  reviewedAt?: any;
  reviewedBy?: string;
  coverLetter?: string;
  resumeId: string;
  expectedSalary?: number;
  availabilityDate?: string;
  notes?: string;
  attachments?: JobApplicationAttachment[];
}

export interface JobApplicationAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
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
} 