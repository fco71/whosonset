import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SavedJobsService, SavedJob } from '../../utilities/savedJobsService';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobPosting } from '../../types/JobApplication';

const SavedJobsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = SavedJobsService.subscribeToSavedJobs(currentUser.uid, async (savedJobs) => {
      try {
        // Get full job data for each saved job
        const jobsWithData = await Promise.all(
          savedJobs.map(async (savedJob) => {
            try {
              const jobDoc = await getDocs(query(
                collection(db, 'jobPostings'),
                where('__name__', '==', savedJob.jobId)
              ));
              
              if (!jobDoc.empty) {
                const jobData = {
                  id: jobDoc.docs[0].id,
                  ...jobDoc.docs[0].data()
                } as JobPosting;
                
                return {
                  ...savedJob,
                  jobData
                };
              }
              
              return savedJob;
            } catch (error) {
              console.error('Error fetching job data for saved job:', error);
              return savedJob;
            }
          })
        );
        
        setSavedJobs(jobsWithData);
      } catch (error) {
        console.error('Error loading saved jobs:', error);
        toast.error('Failed to load saved jobs');
      } finally {
        setIsLoading(false);
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const handleRemove = async (savedJobId: string) => {
    try {
      await SavedJobsService.removeSavedJob(savedJobId);
      setSavedJobs(prev => prev.filter(job => job.id !== savedJobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error('Failed to remove saved job');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-light text-gray-900">Saved Jobs</h1>
          <Link to="/jobs" className="text-blue-600 hover:underline text-sm">← Back to Job Search</Link>
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg font-light text-gray-600">Loading saved jobs...</p>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">💾</div>
            <h3 className="text-xl font-light text-gray-900 mb-2">No saved jobs yet</h3>
            <p className="text-gray-600">Jobs you save will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map(({ id, jobData }) => (
              <div key={id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col justify-between">
                <div className="mb-2 flex items-center gap-2">
                  <Link to={jobData ? `/jobs/${jobData.id}` : '#'} className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors truncate" title={jobData?.title}>
                    {jobData?.title || 'Untitled Job'}
                  </Link>
                  {jobData?.status && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-2">{jobData.status}</span>
                  )}
                </div>
                <p className="text-gray-600 mb-1 truncate">{jobData ? (jobData.contactName || jobData.projectName || '') : ''} • {jobData?.department} • {jobData?.location}</p>
                <p className="text-xs text-gray-500 mb-2">Saved on {savedJobs.find(j => j.id === id)?.savedAt?.toDate ? savedJobs.find(j => j.id === id)?.savedAt.toDate().toLocaleDateString() : ''}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <Link to={jobData ? `/jobs/${jobData.id}` : '#'} className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors text-center">View Job</Link>
                  <Button onClick={() => handleRemove(id)} variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage; 