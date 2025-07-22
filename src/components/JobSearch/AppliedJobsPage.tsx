import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { JobApplication } from '../../types/JobApplication';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { JobApplicationService } from '../../utilities/jobApplicationService';
import ApplicationStatusBadge, { ApplicationStatus } from './ApplicationStatusBadge';
import Card, { CardHeader, CardBody, CardFooter, CardTitle, CardDescription } from '../ui/Card';

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
    if (!currentUser) return;
    
    setIsLoading(true);
    
    // Subscribe to real-time updates for user applications
    const unsubscribe = JobApplicationService.subscribeToUserApplications(currentUser.uid, async (applications) => {
      try {
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
    });
    
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-light text-gray-900">Jobs You've Applied To</h1>
          <div className="flex items-center gap-4">
            <Link to="/applications/dashboard" className="text-blue-600 hover:underline text-sm">
              View Dashboard
            </Link>
            <Link to="/jobs" className="text-blue-600 hover:underline text-sm">← Back to Job Search</Link>
          </div>
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
            {appliedJobs.map(({ application, job }) => {
              // Create enhanced status object
              const enhancedStatus: ApplicationStatus = {
                status: application.status || 'pending',
                lastUpdated: application.lastUpdated?.toDate(),
                timeline: {
                  applied: application.appliedAt?.toDate() || new Date(),
                  reviewed: application.reviewedAt?.toDate(),
                  shortlisted: application.reviewedAt?.toDate(), // Use reviewedAt for shortlisted
                  interviewed: application.interviewScheduled?.toDate(),
                  decision: application.lastUpdated?.toDate(),
                },
                notes: application.notes,
                nextStep: application.interviewNotes
              };

              return (
                <Card key={application.id} variant="elevated" hoverable className="flex flex-col">
                  <CardBody className="p-6 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <CardTitle className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors truncate">
                          <Link to={job ? `/jobs/${job.id}` : '#'} title={job?.title}>
                            {job?.title || 'Untitled Job'}
                          </Link>
                        </CardTitle>
                      </div>
                      
                      <CardDescription className="text-gray-600 mb-3">
                        {job?.companyName} • {job?.department} • {job?.location}
                      </CardDescription>

                      {/* Enhanced Status Tracking */}
                      <ApplicationStatusBadge 
                        status={enhancedStatus} 
                        showProgress={true}
                        className="mb-4"
                      />
                    </div>

                    <CardFooter className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <Link 
                        to={job ? `/jobs/${job.id}` : '#'} 
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        View Job
                      </Link>
                      <Link 
                        to={`/applications/${application.id}`} 
                        className="flex-1 px-3 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors text-center"
                      >
                        View Application
                      </Link>
                    </CardFooter>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobsPage; 