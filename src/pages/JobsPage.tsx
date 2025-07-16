import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getJobPostings, createJobPosting, JobPosting } from '../services/api/jobService';
import { getFirestore, collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

// Type guard to check if value is defined and not empty
const hasValue = (value: any): boolean => 
  value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);

// Format date for display
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'No date specified';
  const d = new Date(date);
  return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};


interface JobCardProps {
  job: JobPosting;
  currentUserId?: string;
  onEdit?: (job: JobPosting) => void;
  error?: string | null;
  showIndexError?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, currentUserId, onEdit, error, showIndexError }) => {
  const navigate = useNavigate();
  return (
    <div
      className="group card-base card-hover animate-entrance flex flex-col items-center relative cursor-pointer max-w-xs mx-auto bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 p-4"
      style={{ minHeight: 220, padding: 24, alignItems: 'center' }}
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      {/* Edit button for job owner */}
      {currentUserId && job.postedById === currentUserId && (
        <button
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-indigo-50 transition-all duration-200 z-10"
          title="Edit Job"
          onClick={e => { e.stopPropagation(); onEdit ? onEdit(job) : navigate(`/edit-job/${job.id}`); }}
        >
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" /></svg>
        </button>
      )}
      {/* Avatar/Icon */}
      <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-3 border-2 border-gray-200 overflow-hidden">
        <img
          src={'/movie-production-avatar.svg'}
          alt={job.title || 'Job'}
          className="object-cover w-full h-full"
          onError={e => { (e.target as HTMLImageElement).src = '/movie-production-avatar.svg'; }}
        />
      </div>
      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-900 text-center mb-1 truncate w-full">{job.title || 'Untitled Position'}</h3>
      {/* Department, Job Type, Remote badges */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {hasValue(job.department) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            {job.department}
          </span>
        )}
        {hasValue(job.jobType) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            {job.jobType.replace('_', ' ')}
          </span>
        )}
        {job.isRemote && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            Remote
          </span>
        )}
      </div>
      {/* Location */}
      {hasValue(job.location) && (
        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1 justify-center">
          <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
          {job.location}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              {showIndexError && (
                <div className="mt-2">
                  <p className="text-xs text-red-600">
                    If you're the site administrator, please create the required Firestore index by following this link:
                  </p>
                  <a 
                    href="https://console.firebase.google.com/v1/r/project/whosonsetdepez/firestore/indexes?create_composite=Cktwcm9qZWN0cy93aG9zb25zZXRkZXBlei9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvam9icy9pbmRleGVzL18QARoKCgZzdGF0dXMQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Create Firestore Index
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Salary */}
      {job.showSalary && ((job.salaryMin && job.salaryMin > 0) || (job.salaryMax && job.salaryMax > 0)) && (
        <div className="text-xs font-semibold text-gray-900 mb-1">
          {job.salaryMin && job.salaryMax && job.salaryMin > 0 && job.salaryMax > 0
            ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
            : job.salaryMin && job.salaryMin > 0
              ? `$${job.salaryMin.toLocaleString()}`
              : job.salaryMax && job.salaryMax > 0
                ? `$${job.salaryMax.toLocaleString()}`
                : ''}
          <span className="text-gray-500 text-xs ml-1">/{job.salaryPeriod || 'year'}</span>
        </div>
      )}
      {/* Short Description */}
      {hasValue(job.description) && (
        <p className="text-xs text-gray-700 text-center line-clamp-2 mb-1">{job.description}</p>
      )}
      {/* Requirements, Responsibilities, Benefits (compact) */}
      <div className="flex flex-wrap gap-2 justify-center mt-1">
        {hasValue(job.requirements) && (
          <span className="inline-block bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-[11px]">Req: {Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements}</span>
        )}
        {hasValue(job.responsibilities) && (
          <span className="inline-block bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-[11px]">Resp: {Array.isArray(job.responsibilities) ? job.responsibilities.join(', ') : job.responsibilities}</span>
        )}
        {hasValue(job.benefits) && (
          <span className="inline-block bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-[11px]">Benefits: {Array.isArray(job.benefits) ? job.benefits.join(', ') : job.benefits}</span>
        )}
      </div>
      {/* Footer: Posted date and Details link */}
      <div className="flex justify-between items-center w-full mt-3 text-xs text-gray-400">
        <span>Posted {formatDate(job.createdAt)}</span>
        <Link
          to={`/jobs/${job.id}`}
          className="text-indigo-600 hover:underline font-medium"
          onClick={e => e.stopPropagation()}
        >
          Details
        </Link>
      </div>
    </div>
  );
};

const JobsPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIndexError, setShowIndexError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Extract unique departments and locations for filters
  const departments = React.useMemo(() => {
    const depts = new Set<string>();
    jobs.forEach(job => {
      if (job.department) depts.add(job.department);
    });
    return ['all', ...Array.from(depts).sort()];
  }, [jobs]);

  const locations = React.useMemo(() => {
    const locs = new Set<string>();
    jobs.forEach(job => {
      if (job.location) locs.add(job.location);
    });
    return ['all', ...Array.from(locs).sort()];
  }, [jobs]);

  // Filter jobs based on search and filters
  const filteredJobs = React.useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !searchQuery || 
        (job.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.postedById?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
      const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
      
      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [jobs, searchQuery, selectedDepartment, selectedLocation]);

  // Debug: Log component mount and initial state
  useEffect(() => {
    console.log('JobsPage mounted');
    console.log('Initial auth state:', { 
      isAuthenticated: !!auth.currentUser,
      userId: auth.currentUser?.uid 
    });
    
    return () => {
      console.log('JobsPage unmounting');
    };
  }, [auth.currentUser]);

  // Check Firestore for jobs directly with enhanced logging
  const checkFirestoreJobs = useCallback(async (): Promise<JobPosting[]> => {
    console.group('=== checkFirestoreJobs() ===');
    console.log('Starting direct Firestore check...');
    
    try {
      console.log('Initializing Firestore...');
      const db = getFirestore();
      
      // Try both collections
      const collectionsToCheck = ['jobPostings', 'jobs'];
      
      for (const collectionName of collectionsToCheck) {
        try {
          console.log(`Checking collection: ${collectionName}`);
          const jobsRef = collection(db, collectionName);
          const q = query(jobsRef);
          
          console.log('Executing query...');
          const querySnapshot = await getDocs(q);
          console.log(`Found ${querySnapshot.size} documents in ${collectionName}`);
          
          if (querySnapshot.size > 0) {
            const jobsData = querySnapshot.docs.map(doc => {
              const data = doc.data() as Partial<JobPosting> & { 
                createdAt?: Timestamp | Date; 
                updatedAt?: Timestamp | Date;
              };
              console.log(`Document ${doc.id}:`, data);
              
              // Handle Timestamp or Date conversion with proper type checking
              const getDateFromFirestore = (dateValue: Timestamp | Date | string | undefined): Date => {
                if (!dateValue) return new Date();
                if (dateValue instanceof Date) return dateValue;
                if (typeof dateValue === 'string') return new Date(dateValue);
                if (typeof dateValue === 'object' && 'toDate' in dateValue) {
                  return (dateValue as Timestamp).toDate();
                }
                return new Date();
              };
              
              const createdAt = getDateFromFirestore(data.createdAt);
              const updatedAt = getDateFromFirestore(data.updatedAt);
              
              // Create a properly typed job object with defaults
              const job: JobPosting = {
                id: doc.id,
                title: data.title || 'Untitled Position',
                department: data.department || 'General',
                location: data.location || 'Location not specified',
                jobType: data.jobType || 'full_time',
                experienceLevel: data.experienceLevel || 'mid',
                isRemote: data.isRemote || false,
                description: data.description || '',
                requirements: data.requirements || '',
                responsibilities: data.responsibilities || '',
                benefits: data.benefits || '',
                skills: Array.isArray(data.skills) ? data.skills : [],
                salaryMin: data.salaryMin,
                salaryMax: data.salaryMax,
                salaryPeriod: data.salaryPeriod || 'year',
                showSalary: data.showSalary || false,
                projectName: data.projectName || '',
                projectType: data.projectType || 'other',
                startDate: data.startDate || new Date().toISOString().split('T')[0],
                contactName: data.contactName || '',
                contactEmail: data.contactEmail || '',
                isPaid: data.isPaid !== undefined ? data.isPaid : true,
                isUnion: data.isUnion || false,
                visaSponsorship: data.visaSponsorship || false,
                relocationAssistance: data.relocationAssistance || false,
                status: data.status || 'published',
                postedById: data.postedById || '',
                createdBy: data.createdBy || data.postedById || '',
                applicationCount: data.applicationCount || 0,
                views: data.views || 0,
                createdAt,
                updatedAt
              };
              
              console.log(`Processed job ${doc.id}:`, job);
              return job;
            });
            
            console.log(`Found ${jobsData.length} valid jobs in ${collectionName}`);
            console.groupEnd();
            return jobsData;
          }
        } catch (collectionError) {
          console.error(`Error querying collection ${collectionName}:`, collectionError);
          // Continue to next collection
        }
      }
      
      console.log('No jobs found in any collection');
      return [];
      
    } catch (error) {
      console.error('Error in checkFirestoreJobs:', error);
      console.groupEnd();
      return [];
    }
  }, []);

  // Fetch jobs with enhanced error handling and logging
  const fetchJobs = useCallback(async () => {
    console.group('=== fetchJobs() ===');
    console.log('Starting job fetch...');
    setLoading(true);
    setError(null);
    setShowIndexError(false);
    
    try {
      console.log('Current auth state:', { 
        isAuthenticated: !!auth.currentUser,
        userId: auth.currentUser?.uid 
      });
      
      console.log('Fetching jobs...');
      const jobList = await getJobPostings();
      console.log(`Found ${jobList.length} jobs`);
      
      if (jobList.length > 0) {
        console.log('Jobs found, updating state');
        setJobs(jobList);
        setError(null);
        return;
      }
      
      console.log('No jobs found, checking Firestore directly...');
      const directJobs = await checkFirestoreJobs();
      console.log(`Found ${directJobs.length} jobs via direct query`);
      
      if (directJobs.length > 0) {
        console.log('Jobs found via direct query, updating state');
        setJobs(directJobs);
        setError(null);
        return;
      }
      
      // If we get here, no jobs were found
      console.log('No jobs found');
      setJobs([]);
      
    } catch (err: any) {
      console.error('Error in fetchJobs:', err);
      
      // Check if this is a Firestore index error
      if (err.code === 'failed-precondition' && err.message.includes('index')) {
        console.log('Firestore index error detected');
        setShowIndexError(true);
        setError('Database index is being created. Please wait a few minutes and refresh the page.');
      } else {
        setError('Failed to load jobs. Please try again later.');
      }
      
      // Try direct Firestore as last resort
      try {
        console.log('Attempting fallback to direct Firestore query...');
        const directJobs = await checkFirestoreJobs();
        if (directJobs.length > 0) {
          console.log('Fallback query successful, updating state');
          setJobs(directJobs);
          setError(null);
        }
      } catch (firestoreErr) {
        console.error('Fallback Firestore query failed:', firestoreErr);
        setError('Failed to load jobs. Please check your connection and try again.');
      }
    } finally {
      console.log('Fetch jobs completed');
      console.groupEnd();
      setLoading(false);
    }
  }, [auth.currentUser, checkFirestoreJobs]);

  // Create a test job with proper typing
  const createTestJob = async () => {
    console.log('Attempting to create test job...');
    
    if (!auth.currentUser) {
      const errorMsg = 'Cannot create test job: No user logged in';
      console.error(errorMsg);
      setError(errorMsg);
      return;
    }
    
    console.log('Current user:', {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email
    });
    
    try {
      console.log('Creating test job...');
      
      const testJob = {
        title: `Test Job ${new Date().toLocaleString()}`,
        department: 'Camera',
        location: 'New York, NY',
        jobType: 'full_time' as const,
        experienceLevel: 'mid' as const,
        isRemote: false,
        description: 'This is a test job posting',
        requirements: 'Test requirements',
        responsibilities: 'Test responsibilities',
        benefits: 'Test benefits',
        skills: ['test', 'debugging'],
        salaryMin: 50000,
        salaryMax: 70000,
        salaryPeriod: 'year' as const,
        showSalary: true,
        projectName: 'Test Project',
        projectType: 'feature' as const,
        startDate: new Date().toISOString().split('T')[0],
        contactName: 'Test User',
        contactEmail: 'test@example.com',
        isPaid: true,
        isUnion: false,
        visaSponsorship: false,
        relocationAssistance: false,
      };
      
      console.log('Creating job with data:', testJob);
      
      const jobId = await createJobPosting(testJob, auth.currentUser.uid);
      console.log('Test job created with ID:', jobId);
      
      // Refresh the jobs list
      await fetchJobs();
      
    } catch (error) {
      console.error('Error creating test job:', error);
      setError(`Failed to create test job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Board</h1>
          <p className="text-lg text-gray-600">Find your next opportunity in the film industry</p>
        </div>
        
        {/* Main Content */}
        <div className="space-y-8">
          {/* Jobs List */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}</span>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading jobs...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      currentUserId={auth.currentUser?.uid}
                      onEdit={undefined}
                      error={error}
                      showIndexError={showIndexError}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Debug Panel */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
            <h3 className="text-sm font-bold text-yellow-900 mb-3">Debug Information (Visible to All Users)</h3>
            <div className="text-xs font-mono bg-black text-green-400 p-3 rounded overflow-x-auto">
              <div className="mb-2">Jobs in state: <span className="text-white">{jobs.length}</span></div>
              <div className="mb-2">Error: <span className="text-red-400">{error ? error : 'None'}</span></div>
              <div className="mb-2">Raw jobs array:</div>
              <pre className="whitespace-pre-wrap text-xs text-green-200 bg-black p-2 rounded mt-2 max-h-96 overflow-y-auto">
                {JSON.stringify(jobs, null, 2)}
              </pre>
              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  onClick={fetchJobs}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh Jobs
                </button>
                <button 
                  onClick={createTestJob}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Create Test Job
                </button>
              </div>
              <div className="mt-3 text-gray-500 text-xs">
                This debug panel is always visible for troubleshooting. If you see jobs here but not in the main list, there may be a display or mapping issue.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
