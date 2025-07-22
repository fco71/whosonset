import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobPosting, JobApplication } from '../../types/JobApplication';
import { JobApplicationService } from '../../utilities/jobApplicationService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const JobApplicationsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { currentUser } = useAuth();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'reviewed' | 'shortlisted' | 'hired' | 'rejected'>('all');

  useEffect(() => {
    if (jobId) {
      loadJobAndApplications();
    }
  }, [jobId]);

  const loadJobAndApplications = async () => {
    if (!jobId) return;
    
    setIsLoading(true);
    try {
      // Load job details
      const jobDoc = await getDoc(doc(db, 'jobPostings', jobId));
      if (jobDoc.exists()) {
        const jobData = {
          id: jobDoc.id,
          ...jobDoc.data()
        } as JobPosting;
        setJob(jobData);
        
        // Check if current user is the job poster
        if (jobData.postedById !== currentUser?.uid) {
          toast.error('You can only view applications for jobs you posted');
          return;
        }
      } else {
        toast.error('Job not found');
        return;
      }
      
      // Load applications
      const jobApplications = await JobApplicationService.getJobApplications(jobId);
      setApplications(jobApplications);
      
    } catch (error) {
      console.error('Error loading job and applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'reviewed': return '👁️';
      case 'shortlisted': return '⭐';
      case 'interviewed': return '📅';
      case 'hired': return '✅';
      case 'rejected': return '❌';
      case 'withdrawn': return '↩️';
      default: return '📋';
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    interviewed: applications.filter(app => app.status === 'interviewed').length,
    hired: applications.filter(app => app.status === 'hired').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg font-light text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center py-12">
            <h3 className="text-xl font-light text-gray-900 mb-2">Job not found</h3>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700">
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
                Applications for {job.title}
              </h1>
              <p className="text-xl font-light text-gray-600">
                {job.department} • {job.location} • {applications.length} applications
              </p>
            </div>
            <Link
              to={`/jobs/${job.id}`}
              className="px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Job
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-light text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-light text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-light text-blue-600">{stats.reviewed}</p>
            <p className="text-sm text-gray-600">Reviewed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-light text-green-600">{stats.shortlisted}</p>
            <p className="text-sm text-gray-600">Shortlisted</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-light text-purple-600">{stats.interviewed}</p>
            <p className="text-sm text-gray-600">Interviewed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-light text-green-600">{stats.hired}</p>
            <p className="text-sm text-gray-600">Hired</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-light text-red-600">{stats.rejected}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All', count: stats.total },
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'reviewed', label: 'Reviewed', count: stats.reviewed },
              { id: 'shortlisted', label: 'Shortlisted', count: stats.shortlisted },
              { id: 'hired', label: 'Hired', count: stats.hired },
              { id: 'rejected', label: 'Rejected', count: stats.rejected }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 rounded-lg font-light transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">📝</div>
              <h3 className="text-xl font-light text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {activeTab === 'all' 
                  ? 'No applications have been submitted for this job yet.'
                  : `No ${activeTab} applications found.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-medium text-gray-900">
                          Applicant #{application.applicantId.slice(0, 8)}...
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)} {application.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">
                        Applied on {formatDate(application.appliedAt)}
                      </p>
                      {application.expectedSalary && (
                        <p className="text-sm text-gray-500">
                          Expected salary: ${application.expectedSalary.toLocaleString()}
                        </p>
                      )}
                      {application.availabilityDate && (
                        <p className="text-sm text-gray-500">
                          Available from: {application.availabilityDate}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {application.reviewedAt && (
                        <p className="text-sm text-gray-500 mb-2">
                          Reviewed {formatDate(application.reviewedAt)}
                        </p>
                      )}
                      {application.interviewScheduled && (
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          Interview: {formatDate(application.interviewScheduled)}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Link
                          to={`/applications/${application.id}`}
                          className="px-4 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          View Application
                        </Link>
                        <Link
                          to={`/applications/${application.id}/edit`}
                          className="px-4 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Update Status
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsPage; 