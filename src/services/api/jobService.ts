import { 
  db, 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  FieldValue
} from '../../firebase';

// Define base job posting interface for the app
export interface JobPostingBase {
  // Basic Info
  title: string;
  department: string;
  location: string;
  jobType: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'temporary' | 'internship' | 'volunteer';
  experienceLevel: 'intern' | 'entry' | 'associate' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
  isRemote: boolean;
  
  // Details
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  skills: string[];
  
  // Compensation
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod: 'year' | 'month' | 'week' | 'day' | 'hour';
  showSalary: boolean;
  
  // Project Info
  projectName?: string;
  projectLink?: string;
  projectType: 'feature' | 'short' | 'tv' | 'commercial' | 'music_video' | 'corporate' | 'documentary' | 'other';
  
  // Timeline
  startDate: string;
  endDate?: string;
  deadline?: string;
  
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  
  // Additional
  isPaid: boolean;
  isUnion: boolean;
  visaSponsorship: boolean;
  relocationAssistance: boolean;
}

// Extend the base interface for Firestore
export interface FirestoreJobPosting extends JobPostingBase {
  id?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  status: 'draft' | 'published' | 'closed' | 'archived';
  postedById: string;
  createdBy: string; // Added for tracking who created the job
  applicationCount: number;
  views: number;
  postedAt: Timestamp | FieldValue; // Added for querying posted jobs
}

// Extend the base interface for the app (with Date instead of Timestamp)
export interface JobPosting extends JobPostingBase {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'closed' | 'archived';
  postedById: string;
  createdBy: string; // Added for tracking who created the job
  applicationCount: number;
  views: number;
}



// Create a new job posting
export const createJobPosting = async (
  jobData: Omit<JobPostingBase, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'postedById' | 'applicationCount' | 'views'>,
  userId: string
): Promise<string> => {
  try {
  
    
    const jobPosting: Omit<FirestoreJobPosting, 'id'> = {
      ...jobData,
      status: 'published',
      postedById: userId, // Ensure this is set from the function parameter
      createdBy: userId,  // Also set createdBy for backward compatibility
      applicationCount: 0,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      postedAt: serverTimestamp(), // Add this field for proper querying
    };

    const docRef = await addDoc(collection(db, 'jobPostings'), jobPosting);
    return docRef.id;
  } catch (error) {
    console.error('Error creating job posting:', error);
    throw new Error('Failed to create job posting');
  }
};

// Update an existing job posting
export const updateJobPosting = async (jobId: string, jobData: Partial<JobPostingBase>): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobPostings', jobId);
    const updateData: Partial<FirestoreJobPosting> = {
      ...jobData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(jobRef, updateData);
  } catch (error) {
    console.error('Error updating job posting:', error);
    throw new Error('Failed to update job posting');
  }
};

// Delete a job posting
export const deleteJobPosting = async (jobId: string): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobPostings', jobId);
    await deleteDoc(jobRef);
  } catch (error) {
    console.error('Error deleting job posting:', error);
    throw new Error('Failed to delete job posting');
  }
};

// Status type that includes 'all' for unfiltered queries
type JobStatus = 'draft' | 'published' | 'closed' | 'archived' | 'all';

// Get job postings with filters
export const getJobPostings = async (filters: {
  status?: JobStatus;
  department?: string;
  jobType?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  postedBy?: string;
  limit?: number;
} = {}): Promise<JobPosting[]> => {
  try {

    
    const jobsRef = collection(db, 'jobPostings');

    
    let q = query(jobsRef);

    
    // Apply status filter if provided and not 'all'
    if (filters.status && filters.status !== 'all') {

      q = query(q, where('status', '==', filters.status));
    } else if (!filters.status) {
      // Default to published if no status is specified

      q = query(q, where('status', '==', 'published'));
    } else {

    }
    
    if (filters?.department) {

      q = query(q, where('department', '==', filters.department));
    }
    
    if (filters?.jobType) {

      q = query(q, where('jobType', '==', filters.jobType));
    }
    
    if (filters?.experienceLevel) {

      q = query(q, where('experienceLevel', '==', filters.experienceLevel));
    }
    
    if (filters?.isRemote !== undefined) {

      q = query(q, where('isRemote', '==', filters.isRemote));
    }
    
    if (filters?.postedBy) {

      if (filters.postedBy) {
        q = query(q, where('postedById', '==', filters.postedBy));
      }
    }
    
    if (filters?.limit) {

      q = query(q, limit(filters.limit));
    }
    
    // Order by creation date, newest first

    q = query(q, orderBy('createdAt', 'desc'));
    

    const querySnapshot = await getDocs(q);

    
    const jobs: JobPosting[] = [];
    
    querySnapshot.forEach((doc) => {
      try {
        const docData = doc.data();
        // Ensure required fields exist with defaults
        const jobData: JobPosting = {
          id: doc.id,
          title: docData.title || 'Untitled Position',
          department: docData.department || 'General',
          location: docData.location || 'Location not specified',
          jobType: docData.jobType || 'full_time',
          experienceLevel: docData.experienceLevel || 'mid',
          isRemote: docData.isRemote || false,
          description: docData.description || '',
          requirements: docData.requirements || '',
          responsibilities: docData.responsibilities || '',
          benefits: docData.benefits || '',
          skills: Array.isArray(docData.skills) ? docData.skills : [],
          salaryMin: docData.salaryMin,
          salaryMax: docData.salaryMax,
          salaryPeriod: docData.salaryPeriod || 'year',
          showSalary: docData.showSalary || false,
          projectName: docData.projectName || '',
          projectType: docData.projectType || 'other',
          startDate: docData.startDate || new Date().toISOString().split('T')[0],
          contactName: docData.contactName || '',
          contactEmail: docData.contactEmail || '',
          isPaid: docData.isPaid !== undefined ? docData.isPaid : true,
          isUnion: docData.isUnion || false,
          visaSponsorship: docData.visaSponsorship || false,
          relocationAssistance: docData.relocationAssistance || false,
          status: docData.status || 'draft',
          postedById: docData.postedById || '',
          createdBy: docData.createdBy || docData.postedById || '',
          applicationCount: docData.applicationCount || 0,
          views: docData.views || 0,
          // Handle Firestore timestamps
          createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : new Date(),
          updatedAt: docData.updatedAt?.toDate ? docData.updatedAt.toDate() : new Date()
        };

        
        jobs.push(jobData);
      } catch (error) {
        console.error(`Error processing document ${doc.id}:`, error);
      }
    });
    

    return jobs;
  } catch (error) {
    console.error('Error getting job postings:', error);
    throw new Error('Failed to get job postings');
  }
};

// Get a single job posting by ID
export const getJobPostingById = async (jobId: string): Promise<JobPosting | null> => {
  try {
    const docRef = doc(db, 'jobPostings', jobId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const docData = docSnap.data();
    
    // Return the job data with proper typing
    return {
      ...docData as JobPostingBase,
      id: jobId,
      createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : new Date(),
      updatedAt: docData.updatedAt?.toDate ? docData.updatedAt.toDate() : new Date(),
      status: docData.status || 'published',
      postedById: docData.postedById || '',
      createdBy: docData.createdBy || docData.postedById || '',
      applicationCount: docData.applicationCount || 0,
      views: docData.views || 0,
      skills: Array.isArray(docData.skills) ? docData.skills : []
    };
  } catch (error) {
    console.error('Error fetching job posting:', error);
    throw new Error('Failed to fetch job posting');
  }
};
