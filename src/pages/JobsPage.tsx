import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getJobPostings, createJobPosting, JobPosting } from '../services/api/jobService';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

// Enhanced card component for job display with better field handling
const JobCard = ({ job }: { job: JobPosting }) => {
  // Format date to a readable format
  const formatDate = (date: Date | string) => {
    if (!date) return 'No date specified';
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if a field has a value
  const hasValue = (value: any) => {
    return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title || 'Untitled Position'}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {hasValue(job.department) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {job.department}
              </span>
            )}
            {hasValue(job.jobType) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {job.jobType.replace('_', ' ')}
              </span>
            )}
            {job.isRemote && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Remote
              </span>
            )}
          </div>
          {hasValue(job.location) && (
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {job.location}
            </div>
          )}
          {hasValue(job.description) && (
            <p className="mt-3 text-gray-600 line-clamp-2">
              {job.description}
            </p>
          )}
          {/* Requirements */}
          {hasValue(job.requirements) && (
            <div className="mt-2">
              <span className="block text-xs font-semibold text-gray-700">Requirements:</span>
              <span className="block text-gray-600 text-xs">
                {Array.isArray(job.requirements)
                  ? job.requirements.join(', ')
                  : job.requirements}
              </span>
            </div>
          )}
          {/* Responsibilities */}
          {hasValue(job.responsibilities) && (
            <div className="mt-2">
              <span className="block text-xs font-semibold text-gray-700">Responsibilities:</span>
              <span className="block text-gray-600 text-xs">
                {Array.isArray(job.responsibilities)
                  ? job.responsibilities.join(', ')
                  : job.responsibilities}
              </span>
            </div>
          )}
          {/* Benefits */}
          {hasValue(job.benefits) && (
            <div className="mt-2">
              <span className="block text-xs font-semibold text-gray-700">Benefits:</span>
              <span className="block text-gray-600 text-xs">
                {Array.isArray(job.benefits)
                  ? job.benefits.join(', ')
                  : job.benefits}
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <Link 
            to={`/jobs/${job.id}`} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center">
          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Posted {formatDate(job.createdAt)}</span>
        </div>
        {hasValue(job.salaryMin) && hasValue(job.salaryMax) && (
          <div className="text-sm font-medium text-gray-900">
            ${(job.salaryMin || 0).toLocaleString()} - ${(job.salaryMax || 0).toLocaleString()}
            <span className="text-gray-500 text-xs ml-1">/year</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  
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
  const checkFirestoreJobs = async () => {
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
              const data = doc.data();
              console.log(`Document ${doc.id}:`, data);
              
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
                status: data.status || 'published', // Default to published if not set
                postedById: data.postedById || '',
                createdBy: data.createdBy || data.postedById || '',
                applicationCount: data.applicationCount || 0,
                views: data.views || 0,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
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
  };

  // Fetch jobs with enhanced error handling and logging
  const fetchJobs = async () => {
    console.group('=== fetchJobs() ===');
    console.log('Starting job fetch...');
    setLoading(true);
    
    try {
      console.log('Current auth state:', { 
        isAuthenticated: !!auth.currentUser,
        userId: auth.currentUser?.uid 
      });
      console.log('Attempt 1: Fetching jobs with status: published');
      const jobList = await getJobPostings({ status: 'published' });
      console.log(`Found ${jobList.length} jobs via service`);
      
      if (jobList.length > 0) {
        console.log('Jobs found via service, updating state');
        setJobs(jobList);
        setError(null);
        return;
      }
      
      // If no jobs found with status=published, try without status filter
      console.log('No published jobs found. Trying without status filter...');
      const allJobs = await getJobPostings({ status: 'all' });
      console.log(`Found ${allJobs.length} total jobs (no status filter)`);
      
      if (allJobs.length > 0) {
        console.log('Jobs found without status filter, updating state');
        setJobs(allJobs);
        setError(null);
        return;
      }
      
      // If still no jobs, try direct Firestore query
      console.log('No jobs found via service, trying direct Firestore query...');
      const directJobs = await checkFirestoreJobs();
      console.log(`Found ${directJobs.length} jobs via direct Firestore query`);
      
      if (directJobs.length > 0) {
        console.log('Jobs found via direct query, updating state');
        setJobs(directJobs);
        setError(null);
        return;
      }
      
      // If we get here, no jobs were found
      console.log('No jobs found in any collection');
      setJobs([]);
      
    } catch (err) {
      console.error('Error in fetchJobs:', err);
      setError('Failed to load jobs. Please check the console for details.');
      
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
  };

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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
            <p className="mt-1 text-sm text-gray-600">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
            </p>
          </div>
          
          {auth.currentUser && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={createTestJob}
                className="w-full sm:w-auto"
              >
                Create Test Job
              </Button>
              <Link to="/post-job" className="w-full sm:w-auto">
                <Button className="w-full">
                  Post a Job
                </Button>
              </Link>
            </div>
          )}
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              There are currently no job postings. Check back later or post a new job.
            </p>
            <div className="mt-6">
              {auth.currentUser ? (
                <div className="space-x-3">
                  <Button onClick={createTestJob} variant="outline">
                    Create Test Job
                  </Button>
                  <Link to="/post-job">
                    <Button>Post a Job</Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link> to post a job
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Available Jobs
                </h2>
                <span className="text-sm text-gray-500">
                  Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
        
        {/* Debug panel - always visible for troubleshooting */}
        <div className="mt-12 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
          <h3 className="text-sm font-bold text-yellow-900 mb-3">Debug Information (Visible to All Users)</h3>
          <div className="text-xs font-mono bg-black text-green-400 p-3 rounded overflow-x-auto">
            <div className="mb-2">Jobs in state: <span className="text-white">{jobs.length}</span></div>
            <div className="mb-2">Error: <span className="text-red-400">{error ? error : 'None'}</span></div>
            <div className="mb-2">Raw jobs array:</div>
            <pre className="whitespace-pre-wrap text-xs text-green-200 bg-black p-2 rounded mt-2 max-h-96 overflow-y-auto">{JSON.stringify(jobs, null, 2)}</pre>
            <div className="mt-2 flex flex-wrap gap-2">
              <button 
                onClick={fetchJobs}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Refresh Jobs
              </button>
              <button 
                onClick={createTestJob}
                className="text-blue-400 hover:text-blue-300 underline ml-2"
              >
                Create Test Job
              </button>
            </div>
            <div className="mt-2 text-gray-500">
              This debug panel is always visible for troubleshooting. If you see jobs here but not in the main list, there may be a display or mapping issue.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
