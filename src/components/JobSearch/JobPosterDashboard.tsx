import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobPosting, JobApplication } from '../../types/JobApplication';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { JobApplicationService } from '../../utilities/jobApplicationService';
import { useAuth } from '../../contexts/AuthContext';

interface JobPosterStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  avgApplicationsPerJob: number;
  totalViews: number;
}

interface JobWithApplications extends JobPosting {
  applications: JobApplication[];
  applicantCount: number;
}

const JobPosterDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [postedJobs, setPostedJobs] = useState<JobWithApplications[]>([]);
  const [stats, setStats] = useState<JobPosterStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    avgApplicationsPerJob: 0,
    totalViews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'analytics'>('overview');

  useEffect(() => {
    if (currentUser) {
      loadPostedJobs();
    }
  }, [currentUser]);

  useEffect(() => {
    calculateStats();
  }, [postedJobs]);

  const loadPostedJobs = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // Get jobs posted by current user
      const jobsQuery = query(
        collection(db, 'jobPostings'),
        where('postedBy', '==', currentUser.uid),
        orderBy('postedAt', 'desc')
      );
      
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsData: JobWithApplications[] = [];
      
      // For each job, get the applications
      for (const jobDoc of jobsSnapshot.docs) {
        const jobData = {
          id: jobDoc.id,
          ...jobDoc.data()
        } as JobPosting;
        
        // Get applications for this job
        const applications = await JobApplicationService.getJobApplications(jobDoc.id);
        
        jobsData.push({
          ...jobData,
          applications,
          applicantCount: applications.length
        });
      }
      
      setPostedJobs(jobsData);
      console.log('Loaded posted jobs:', jobsData.length);
    } catch (error) {
      console.error('Error loading posted jobs:', error);
      toast.error('Failed to load posted jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const totalJobs = postedJobs.length;
    const activeJobs = postedJobs.filter(job => job.status === 'active' || job.status === 'published').length;
    const totalApplications = postedJobs.reduce((sum, job) => sum + job.applicantCount, 0);
    const pendingApplications = postedJobs.reduce((sum, job) => 
      sum + job.applications.filter(app => app.status === 'pending').length, 0
    );
    const avgApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;
    const totalViews = postedJobs.reduce((sum, job) => sum + (job.views || 0), 0);

    setStats({
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      avgApplicationsPerJob,
      totalViews
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'published': return '✅';
      case 'draft': return '📝';
      case 'closed': return '🔒';
      default: return '📋';
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Total Jobs Posted</p>
            <p className="text-3xl font-light text-gray-900">{stats.totalJobs}</p>
          </div>
          <div className="text-3xl opacity-20">💼</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Active Jobs</p>
            <p className="text-3xl font-light text-gray-900">{stats.activeJobs}</p>
          </div>
          <div className="text-3xl opacity-20">📊</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Total Applications</p>
            <p className="text-3xl font-light text-gray-900">{stats.totalApplications}</p>
          </div>
          <div className="text-3xl opacity-20">📝</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Pending Applications</p>
            <p className="text-3xl font-light text-gray-900">{stats.pendingApplications}</p>
          </div>
          <div className="text-3xl opacity-20">⏳</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Avg Applications/Job</p>
            <p className="text-3xl font-light text-gray-900">{stats.avgApplicationsPerJob.toFixed(1)}</p>
          </div>
          <div className="text-3xl opacity-20">📈</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Total Views</p>
            <p className="text-3xl font-light text-gray-900">{stats.totalViews}</p>
          </div>
          <div className="text-3xl opacity-20">👁️</div>
        </div>
      </div>
    </div>
  );

  const renderPostedJobs = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-light text-gray-900">Your Posted Jobs</h3>
        <Link
          to="/jobs/post"
          className="px-4 py-2 bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors"
        >
          Post New Job
        </Link>
      </div>
      
      {postedJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">💼</div>
          <h3 className="text-xl font-light text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-600 mb-4">Start posting jobs to see them here and track applications.</p>
          <Link
            to="/jobs/post"
            className="px-6 py-3 bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {postedJobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link 
                      to={`/jobs/${job.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)} {job.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">{job.department} • {job.location}</p>
                  <p className="text-sm text-gray-500">Posted on {formatDate(job.postedAt)}</p>
                </div>
                
                <div className="text-right">
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">Applications</p>
                    <p className="text-2xl font-light text-gray-900">{job.applicantCount}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="text-lg font-light text-gray-900">{job.views || 0}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-4 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Job
                    </Link>
                    {job.applicantCount > 0 && (
                      <Link
                        to={`/jobs/${job.id}/applications`}
                        className="px-4 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Applications ({job.applicantCount})
                      </Link>
                    )}
                    <Link
                      to={`/jobs/${job.id}/edit`}
                      className="px-4 py-2 text-sm bg-green-600 text-white font-light rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderApplications = () => {
    // Get all applications from all jobs
    const allApplications = postedJobs.flatMap(job => 
      job.applications.map(app => ({ ...app, jobTitle: job.title, jobId: job.id }))
    );

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-light text-gray-900">All Applications</h3>
        </div>
        
        {allApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">📝</div>
            <h3 className="text-xl font-light text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">Applications from your job postings will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {allApplications.slice(0, 20).map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        to={`/applications/${application.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {application.jobTitle}
                      </Link>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)} {application.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">Applicant: {application.applicantId.slice(0, 8)}...</p>
                    <p className="text-sm text-gray-500">Applied on {formatDate(application.appliedAt)}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex gap-2">
                      <Link
                        to={`/applications/${application.id}`}
                        className="px-4 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        View Application
                      </Link>
                      <Link
                        to={`/jobs/${application.jobId}`}
                        className="px-4 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-light text-gray-900 mb-6">Job Performance</h3>
        <div className="space-y-4">
          {postedJobs.slice(0, 5).map((job) => (
            <div key={job.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                <p className="text-xs text-gray-500">{job.department}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{job.applicantCount} apps</p>
                <p className="text-xs text-gray-500">{job.views || 0} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-light text-gray-900 mb-6">Application Status</h3>
        <div className="space-y-4">
          {postedJobs.map((job) => {
            const pending = job.applications.filter(app => app.status === 'pending').length;
            const reviewed = job.applications.filter(app => app.status === 'reviewed').length;
            const shortlisted = job.applications.filter(app => app.status === 'shortlisted').length;
            const hired = job.applications.filter(app => app.status === 'hired').length;
            
            return (
              <div key={job.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <p className="text-sm font-medium text-gray-900 mb-2">{job.title}</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-yellow-600">⏳ {pending} pending</span>
                  <span className="text-blue-600">👁️ {reviewed} reviewed</span>
                  <span className="text-green-600">⭐ {shortlisted} shortlisted</span>
                  <span className="text-purple-600">✅ {hired} hired</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Job Poster Dashboard
          </h1>
          <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage your job postings, track applications, and analyze performance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'jobs', label: 'Posted Jobs', icon: '💼' },
              { id: 'applications', label: 'Applications', icon: '📝' },
              { id: 'analytics', label: 'Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-lg font-light transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg font-light text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'jobs' && renderPostedJobs()}
            {activeTab === 'applications' && renderApplications()}
            {activeTab === 'analytics' && renderAnalytics()}
          </>
        )}
      </div>
    </div>
  );
};

export default JobPosterDashboard; 