import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getJobPostings, createJobPosting, JobPosting } from '../services/api/jobService';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';


import { useNavigate } from 'react-router-dom';
const hasValue = (value: any) => value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
const formatDate = (date: Date | string) => {
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
}

const JobCard: React.FC<JobCardProps> = ({ job, currentUserId, onEdit }) => {
  const navigate = useNavigate();
  return (
    <div
      className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 flex flex-col items-center p-5 relative cursor-pointer max-w-xs mx-auto"
      onClick={() => navigate(`/jobs/${job.id}`)}
      style={{ minHeight: 220 }}
    >
      {currentUserId && job.postedById === currentUserId && (
        <button
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-indigo-50 transition-all duration-200 z-10"
          title="Edit Job"
          onClick={e => { e.stopPropagation(); onEdit ? onEdit(job) : navigate(`/edit-job/${job.id}`); }}
        >
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" /></svg>
        </button>
      )}
      <div className="flex flex-col items-center gap-2 w-full">
        <h3 className="font-bold text-lg text-gray-900 text-center mb-1 truncate w-full">{job.title || 'Untitled Position'}</h3>
        <div className="flex flex-wrap gap-2 justify-center mb-1">
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
        {hasValue(job.location) && (
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            {job.location}
          </div>
        )}
        {/* Only show salary if showSalary is true and at least one value is present and > 0 */}
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
        {hasValue(job.description) && (
          <p className="text-xs text-gray-700 text-center line-clamp-2 mb-1">{job.description}</p>
        )}
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
      </div>
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
      const jobsRef = collection(db, 'jobPostings');
      const snapshot = await getDocs(jobsRef);

      if (!snapshot.empty) {
        const jobs = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        });

        return jobs;
      } else {
        return [];
      }
    } catch (error) {
      setError(`Failed to load jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const jobsData = await getJobPostings();

      if (jobsData && jobsData.length > 0) {
        setJobs(jobsData);
      } else {
        const firestoreJobs = await checkFirestoreJobs();

        if (firestoreJobs.length > 0) {
          setJobs(firestoreJobs as JobPosting[]);
        } else {
          setJobs([]);
        }
      }
    } catch (error) {
      setError(`Failed to load jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);

      try {
        const firestoreJobs = await checkFirestoreJobs();
        if (firestoreJobs.length > 0) {
          setJobs(firestoreJobs as JobPosting[]);
          setError(null); // Clear error if fallback works
        } else {
          setJobs([]);
        }
      } catch (fallbackError) {
        setJobs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTestJob = async () => {
    if (!auth.currentUser) {
      setError('Must be logged in to create a job');
      return;
    }

    try {
      const testJob = {
        title: 'Test Job - ' + new Date().toLocaleTimeString(),
        description: 'This is a test job posting created for debugging purposes.',
        department: 'Camera',
        jobType: 'full_time' as const,
        experienceLevel: 'mid' as const,
        location: 'Los Angeles, CA',
        isRemote: false,
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

      const jobId = await createJobPosting(testJob, auth.currentUser.uid);

      await fetchJobs();
    } catch (error) {
      setError(`Failed to create test job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

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
          {/* Only show Post a Job button if user is signed in */}
          {auth.currentUser ? (
            <Link to="/post-job" className="w-full sm:w-auto">
              <Button className="w-full">
                Post a Job
              </Button>
            </Link>
          ) : null}
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
                <Link to="/post-job">
                  <Button>Post a Job</Button>
                </Link>
              ) : null}
              {!auth.currentUser && (
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
                <JobCard key={job.id} job={job} currentUserId={auth.currentUser?.uid} />
              ))}
            </div>
          </div>
        )}
        
        {/* Debug panel removed for production */}
      </div>
    </div>
  );
}
