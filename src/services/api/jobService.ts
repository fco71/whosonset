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
    console.log('Creating job posting with user ID:', userId);
    
    const jobPosting: Omit<FirestoreJobPosting, 'id'> = {
      ...jobData,
      status: 'published',
      postedById: userId, // Ensure this is set from the function parameter
      createdBy: userId,  // Also set createdBy for backward compatibility
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
    console.log('Updating job with ID:', jobId, 'in collection: jobs');
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
    console.log('Deleting job with ID:', jobId, 'from collection: jobs');
    const jobRef = doc(db, 'jobs', jobId);
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
    console.log('=== getJobPostings called ===');
    console.log('Filters:', JSON.stringify(filters, null, 2));
    
    const jobsRef = collection(db, 'jobs');
    console.log('Querying collection: jobs');
    
    let q = query(jobsRef);
    console.log('Base query created');
    
    // Apply status filter if provided and not 'all'
    if (filters.status && filters.status !== 'all') {
      console.log(`Filtering by status: ${filters.status}`);
      q = query(q, where('status', '==', filters.status));
    } else if (!filters.status) {
      // Default to published if no status is specified
      console.log('Using default status filter: published');
      q = query(q, where('status', '==', 'published'));
    } else {
      console.log('No status filter applied (showing all statuses)');
    }
    
    if (filters?.department) {
      console.log('Adding department filter:', filters.department);
      q = query(q, where('department', '==', filters.department));
    }
    
    if (filters?.jobType) {
      console.log('Adding jobType filter:', filters.jobType);
      q = query(q, where('jobType', '==', filters.jobType));
    }
    
    if (filters?.experienceLevel) {
      console.log('Adding experienceLevel filter:', filters.experienceLevel);
      q = query(q, where('experienceLevel', '==', filters.experienceLevel));
    }
    
    if (filters?.isRemote !== undefined) {
      console.log('Adding isRemote filter:', filters.isRemote);
      q = query(q, where('isRemote', '==', filters.isRemote));
    }
    
    if (filters?.postedBy) {
      console.log('Adding postedBy filter:', filters.postedBy);
      if (filters.postedBy) {
        q = query(q, where('postedById', '==', filters.postedBy));
      }
    }
    
    if (filters?.limit) {
      console.log('Adding limit:', filters.limit);
      q = query(q, limit(filters.limit));
    }
    
    // Order by creation date, newest first
    console.log('Adding order by createdAt desc');
    q = query(q, orderBy('createdAt', 'desc'));
    
    console.log('Executing query...');
    const querySnapshot = await getDocs(q);
    console.log(`Query returned ${querySnapshot.size} documents`);
    
    const jobs: JobPosting[] = [];
    
    querySnapshot.forEach((doc) => {
      try {
        const docData = doc.data();
        console.group(`Document ${doc.id}:`);
        console.log('Raw document data:', docData);
        
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
        
        console.log('Processed job data:', jobData);
        console.groupEnd();
        
        jobs.push(jobData);
      } catch (error) {
        console.error(`Error processing document ${doc.id}:`, error);
      }
    });
    
    console.log(`Returning ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('Error getting job postings:', error);
    throw new Error('Failed to get job postings');
  }
};

// Get a single job posting by ID
export const getJobPostingById = async (jobId: string): Promise<JobPosting | null> => {
  try {
    console.log('Fetching job with ID:', jobId, 'from collection: jobs');
    const docRef = doc(db, 'jobs', jobId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('Job not found in jobs collection, checking jobPostings as fallback...');
      // Fallback to check jobPostings collection for backward compatibility
      const legacyDocRef = doc(db, 'jobPostings', jobId);
      const legacyDocSnap = await getDoc(legacyDocRef);
      
      if (!legacyDocSnap.exists()) {
        console.log('Job not found in any collection');
        return null;
      }
      
      const docData = legacyDocSnap.data();
      console.log('Found job in legacy jobPostings collection:', docData);
      
      // Migrate the job to the new collection
      if (docData) {
        console.log('Migrating job to jobs collection...');
        const newJobRef = doc(db, 'jobs', jobId);
        await setDoc(newJobRef, {
          ...docData,
          updatedAt: serverTimestamp()
        });
        
        // Delete the old document
        await deleteDoc(legacyDocRef);
        console.log('Job migrated successfully');
      }
      
      // Return the job data with proper typing
      return {
        ...docData as JobPostingBase,
        id: jobId,
        createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : new Date(),
        updatedAt: new Date(),
        status: docData.status || 'published',
        postedById: docData.postedById || '',
        createdBy: docData.createdBy || docData.postedById || '',
        applicationCount: docData.applicationCount || 0,
        views: docData.views || 0,
        skills: Array.isArray(docData.skills) ? docData.skills : []
      };
    }
    
    const docData = docSnap.data();
    
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
