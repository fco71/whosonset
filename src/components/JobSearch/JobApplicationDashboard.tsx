import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, limit, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobApplication, JobPosting } from '../../types/JobApplication';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { JobApplicationService } from '../../services/jobApplicationService';
import { useAuth } from '../../contexts/AuthContext';

interface ApplicationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  interviewScheduled: number;
  responseRate: number;
  avgResponseTime: number;
}

const JobApplicationDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobDetails, setJobDetails] = useState<{[key: string]: any}>({});
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    interviewScheduled: 0,
    responseRate: 0,
    avgResponseTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'analytics' | 'saved'>('overview');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [applications]);

  const loadApplications = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const userApplications = await JobApplicationService.getUserApplications(currentUser.uid);
      setApplications(userApplications);
      
      // Fetch job details for each application
      const jobDetailsMap: {[key: string]: any} = {};
      for (const application of userApplications) {
        if (application.jobId) {
          try {
            const jobDoc = await getDoc(doc(db, 'jobPostings', application.jobId));
            if (jobDoc.exists()) {
              jobDetailsMap[application.jobId] = {
                id: jobDoc.id,
                ...jobDoc.data()
              };
            }
          } catch (error) {
            console.error('Error fetching job details for jobId:', application.jobId, error);
          }
        }
      }
      setJobDetails(jobDetailsMap);
      
      console.log('Loaded applications:', userApplications.length);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    try {
      await JobApplicationService.deleteApplication(applicationId);
      toast.success('Application withdrawn successfully');
      // Reload applications to update the list
      loadApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to withdraw application');
    }
  };

  const calculateStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const reviewed = applications.filter(app => app.status === 'reviewed').length;
    const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
    const interviewed = applications.filter(app => app.status === 'interviewed').length;
    const hired = applications.filter(app => app.status === 'hired').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    
    const responseRate = total > 0 ? ((reviewed + shortlisted + interviewed + hired + rejected) / total) * 100 : 0;
    
    // Calculate average response time using reviewedAt
    const respondedApps = applications.filter(app => 
      app.status !== 'pending' && app.reviewedAt && app.appliedAt
    );
    
    let avgResponseTime = 0;
    if (respondedApps.length > 0) {
      const totalDays = respondedApps.reduce((sum, app) => {
        const appliedDate = app.appliedAt?.toDate ? app.appliedAt.toDate() : new Date(app.appliedAt);
        const reviewedDate = app.reviewedAt?.toDate ? app.reviewedAt.toDate() : new Date(app.reviewedAt);
        return sum + (reviewedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24);
      }, 0);
      avgResponseTime = totalDays / respondedApps.length;
    }

    setStats({
      total,
      pending,
      accepted: hired, // Map hired to accepted for display
      rejected,
      interviewScheduled: interviewed,
      responseRate,
      avgResponseTime
    });
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

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Total Applications</p>
            <p className="text-3xl font-light text-gray-900">{stats.total}</p>
          </div>
          <div className="text-3xl opacity-20">📋</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Response Rate</p>
            <p className="text-3xl font-light text-gray-900">{stats.responseRate.toFixed(1)}%</p>
          </div>
          <div className="text-3xl opacity-20">📊</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Avg Response Time</p>
            <p className="text-3xl font-light text-gray-900">{stats.avgResponseTime.toFixed(1)} days</p>
          </div>
          <div className="text-3xl opacity-20">⏱️</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-gray-600">Interviews Scheduled</p>
            <p className="text-3xl font-light text-gray-900">{stats.interviewScheduled}</p>
          </div>
          <div className="text-3xl opacity-20">📅</div>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-light text-gray-900">Recent Applications</h3>
      </div>
      
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">📝</div>
          <h3 className="text-xl font-light text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600">Start applying to jobs to track your progress here.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {applications.slice(0, 10).map((application) => (
            <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link 
                      to={`/applications/${application.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {jobDetails[application.jobId]?.title || `Job #${application.jobId.slice(-6)}`}
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)} {application.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">
                    {application.projectId ? `Project #${application.projectId.slice(-6)}` : 'General Application'}
                  </p>
                  <p className="text-sm text-gray-500">Applied on {formatDate(application.appliedAt)}</p>
                </div>
                
                <div className="text-right">
                  {application.reviewedAt && (
                    <p className="text-sm text-gray-500">Reviewed {formatDate(application.reviewedAt)}</p>
                  )}
                  {application.interviewScheduled && (
                    <p className="text-sm text-blue-600 font-medium">
                      Interview: {formatDate(application.interviewScheduled)}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Link
                      to={`/applications/${application.id}`}
                      className="px-4 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/applications/${application.id}/edit`}
                      className="px-4 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteApplication(application.id)}
                      className="px-4 py-2 text-sm bg-red-600 text-white font-light rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-light text-gray-900 mb-6">Application Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Pending</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.pending}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Accepted</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.accepted / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.accepted}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Rejected</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.rejected}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Interview Scheduled</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.interviewScheduled / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.interviewScheduled}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-light text-gray-900 mb-6">Performance Metrics</h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Response Rate</p>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-light text-gray-900">{stats.responseRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">
                {stats.total > 0 ? `${stats.accepted + stats.rejected + stats.interviewScheduled} of ${stats.total} applications` : 'No applications yet'}
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Average Response Time</p>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-light text-gray-900">{stats.avgResponseTime.toFixed(1)}</div>
              <div className="text-sm text-gray-500">days</div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Success Rate</p>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-light text-gray-900">
                {stats.total > 0 ? ((stats.accepted + stats.interviewScheduled) / stats.total * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-500">
                {stats.total > 0 ? `${stats.accepted + stats.interviewScheduled} positive outcomes` : 'No positive outcomes yet'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSavedJobs = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-light text-gray-900">Saved Jobs</h3>
      </div>
      
      <div className="text-center py-12">
        <div className="text-6xl mb-4 opacity-20">💾</div>
        <h3 className="text-xl font-light text-gray-900 mb-2">Saved Jobs</h3>
        <p className="text-gray-600 mb-4">Save interesting job postings to apply later.</p>
        <Link
          to="/jobs"
          className="px-6 py-3 bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Jobs
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Application Dashboard
          </h1>
          <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track your job applications, view statistics, and manage your career progress.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'applications', label: 'Applications', icon: '📝' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'saved', label: 'Saved Jobs', icon: '💾' }
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
            {activeTab === 'applications' && renderApplications()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'saved' && renderSavedJobs()}
          </>
        )}
      </div>
    </div>
  );
};

export default JobApplicationDashboard; 