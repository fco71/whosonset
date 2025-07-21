import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { JobApplication } from '../../types/JobApplication';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface JobPostingSummary {
  id: string;
  title: string;
  companyName?: string;
  department?: string;
  location?: string;
  status?: string;
  postedAt?: any;
}

const AppliedJobsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState<Array<{ application: JobApplication; job: JobPostingSummary | null }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        // Fetch job applications for current user
        const appsQuery = query(
          collection(db, 'jobApplications'),
          where('applicantId', '==', currentUser.uid)
        );
        const appsSnapshot = await getDocs(appsQuery);
        const applications: JobApplication[] = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));

        // Fetch job postings for each application
        const jobs = await Promise.all(applications.map(async (app) => {
          if (!app.jobId) return { application: app, job: null };
          const jobDoc = await getDoc(doc(db, 'jobPostings', app.jobId));
          if (!jobDoc.exists()) return { application: app, job: null };
          const jobData = jobDoc.data();
          return {
            application: app,
            job: {
              id: jobDoc.id,
              title: jobData.title || 'Untitled Job',
              companyName: jobData.companyName || jobData.company || '',
              department: jobData.department || '',
              location: jobData.location || '',
              status: jobData.status || '',
              postedAt: jobData.postedAt || null,
            } as JobPostingSummary
          };
        }));
        setAppliedJobs(jobs);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
        toast.error('Failed to load applied jobs');
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser) fetchAppliedJobs();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-light text-gray-900">Jobs You've Applied To</h1>
          <Link to="/jobs" className="text-blue-600 hover:underline text-sm">← Back to Job Search</Link>
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg font-light text-gray-600">Loading applied jobs...</p>
          </div>
        ) : appliedJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">📝</div>
            <h3 className="text-xl font-light text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">Jobs you apply to will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appliedJobs.map(({ application, job }) => (
              <div key={application.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col justify-between">
                <div className="mb-2 flex items-center gap-2">
                  <Link to={job ? `/jobs/${job.id}` : '#'} className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors truncate" title={job?.title}>
                    {job?.title || 'Untitled Job'}
                  </Link>
                  {job?.status && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-2">{job.status}</span>
                  )}
                </div>
                <p className="text-gray-600 mb-1 truncate">{job?.companyName} • {job?.department} • {job?.location}</p>
                <p className="text-xs text-gray-500 mb-2">Applied on {application.appliedAt?.toDate ? application.appliedAt.toDate().toLocaleDateString() : ''}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <Link to={job ? `/jobs/${job.id}` : '#'} className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors text-center">View Job</Link>
                  <Link to={`/applications/${application.id}`} className="flex-1 px-3 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors text-center">View Application</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobsPage; 