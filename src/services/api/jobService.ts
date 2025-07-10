import { 
  db, 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
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
  applicationCount: number;
  views: number;
}

// Extend the base interface for the app (with Date instead of Timestamp)
export interface JobPosting extends JobPostingBase {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'closed' | 'archived';
  postedById: string;
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
      status: 'draft',
      postedById: userId,
      applicationCount: 0,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'jobs'), jobPosting);
    return docRef.id;
  } catch (error) {
    console.error('Error creating job posting:', error);
    throw new Error('Failed to create job posting');
  }
};

// Update an existing job posting
export const updateJobPosting = async (jobId: string, jobData: Partial<JobPostingBase>): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
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
    const jobRef = doc(db, 'jobs', jobId);
    await deleteDoc(jobRef);
  } catch (error) {
    console.error('Error deleting job posting:', error);
    throw new Error('Failed to delete job posting');
  }
};

// Get job postings with filters
export const getJobPostings = async (filters: {
  status?: 'draft' | 'published' | 'closed' | 'archived';
  department?: string;
  jobType?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  postedBy?: string;
  limit?: number;
}) => {
  try {
    const jobsRef = collection(db, 'jobs');
    let q = query(jobsRef);
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.department) {
      q = query(q, where('department', '==', filters.department));
    }
    if (filters.jobType) {
      q = query(q, where('jobType', '==', filters.jobType));
    }
    if (filters.experienceLevel) {
      q = query(q, where('experienceLevel', '==', filters.experienceLevel));
    }
    if (filters.isRemote !== undefined) {
      q = query(q, where('isRemote', '==', filters.isRemote));
    }
    if (filters.postedBy) {
      q = query(q, where('postedById', '==', filters.postedBy));
    }
    
    // Default to published jobs if no status filter is provided
    if (!filters.status) {
      q = query(q, where('status', '==', 'published'));
    }
    
    // Apply ordering and limit
    q = query(q, orderBy('createdAt', 'desc'));
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    const jobs: JobPosting[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<FirestoreJobPosting, 'id'>;
      jobs.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
      });
    });
    return jobs;
  } catch (error) {
    console.error('Error fetching job postings:', error);
    throw new Error('Failed to fetch job postings');
  }
};

// Get a single job posting by ID
export const getJobPostingById = async (jobId: string): Promise<JobPosting | null> => {
  try {
    const docRef = doc(db, 'jobs', jobId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<FirestoreJobPosting, 'id'>;
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching job posting:', error);
    throw new Error('Failed to fetch job posting');
  }
};
