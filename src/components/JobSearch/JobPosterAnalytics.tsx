import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import Card, { CardHeader, CardBody, CardTitle } from '../ui/Card';
import { BarChart3, Users, Clock, TrendingUp, TrendingDown, CheckCircle, XCircle, Activity, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobPosting {
  id: string;
  title: string;
  postedById: string;
  postedAt: any;
  status: string;
  applicationCount?: number;
  views?: number;
}

interface JobApplication {
  id: string;
  jobId: string;
  status: string;
  appliedAt: any;
  reviewedAt?: any;
  hiredAt?: any;
}

const JobPosterAnalytics: React.FC = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    // Listen to jobs posted by current user
    const jobsQuery = query(collection(db, 'jobPostings'), where('postedById', '==', currentUser.uid));
    const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobPosting));
      setJobs(jobsData);
    });
    // Listen to all applications for jobs posted by current user
    const appsQuery = query(collection(db, 'jobApplications'), where('posterId', '==', currentUser.uid));
    const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
      setApplications(appsData);
      setIsLoading(false);
    });
    return () => {
      unsubscribeJobs();
      unsubscribeApps();
    };
  }, [currentUser]);

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!jobs.length) {
      return {
        totalJobs: 0,
        totalApplications: 0,
        avgApplicationsPerJob: 0,
        timeToFill: 0,
        statusBreakdown: {},
        topJobs: [],
        monthlyTrends: []
      };
    }
    const totalJobs = jobs.length;
    const totalApplications = applications.length;
    const avgApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;
    // Time to fill (average days from posting to hired)
    const fillTimes: number[] = [];
    jobs.forEach(job => {
      const hiredApp = applications.find(app => app.jobId === job.id && app.status === 'hired' && app.hiredAt && job.postedAt);
      if (hiredApp) {
        const postedDate = job.postedAt?.toDate?.() || new Date(0);
        const hiredDate = hiredApp.hiredAt?.toDate?.() || new Date(0);
        const days = (hiredDate.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (days > 0) fillTimes.push(days);
      }
    });
    const timeToFill = fillTimes.length > 0 ? fillTimes.reduce((a, b) => a + b, 0) / fillTimes.length : 0;
    // Status breakdown
    const statusBreakdown: Record<string, number> = {};
    applications.forEach(app => {
      statusBreakdown[app.status] = (statusBreakdown[app.status] || 0) + 1;
    });
    // Top jobs by applicant count
    const jobAppCounts: Record<string, number> = {};
    applications.forEach(app => {
      jobAppCounts[app.jobId] = (jobAppCounts[app.jobId] || 0) + 1;
    });
    const topJobs = jobs
      .map(job => ({
        ...job,
        applicantCount: jobAppCounts[job.id] || 0
      }))
      .sort((a, b) => b.applicantCount - a.applicantCount)
      .slice(0, 5);
    // Monthly trends
    const monthlyData: Record<string, number> = {};
    applications.forEach(app => {
      const appliedDate = app.appliedAt?.toDate?.() || new Date(0);
      const monthKey = `${appliedDate.getFullYear()}-${String(appliedDate.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });
    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
    return {
      totalJobs,
      totalApplications,
      avgApplicationsPerJob,
      timeToFill,
      statusBreakdown,
      topJobs,
      monthlyTrends
    };
  }, [jobs, applications]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg font-light text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Job Poster Analytics</h1>
            <p className="text-gray-600">Insights into your job postings and applicants</p>
          </div>
          <Link to="/jobs/posted" className="text-blue-600 hover:underline text-sm">← Back to Dashboard</Link>
        </div>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs Posted</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalJobs}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card variant="elevated">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalApplications}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card variant="elevated">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Applications / Job</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.avgApplicationsPerJob.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card variant="elevated">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Time to Fill</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.timeToFill > 0 ? `${analytics.timeToFill.toFixed(1)} days` : 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        {/* Status Breakdown */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle>Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Object.entries(analytics.statusBreakdown).map(([status, count]) => {
                const color =
                  status === 'pending' ? 'text-yellow-600' :
                  status === 'reviewed' ? 'text-blue-600' :
                  status === 'shortlisted' ? 'text-purple-600' :
                  status === 'interviewed' ? 'text-indigo-600' :
                  status === 'hired' ? 'text-green-600' :
                  status === 'rejected' ? 'text-red-600' :
                  status === 'withdrawn' ? 'text-gray-600' : 'text-gray-600';
                const Icon =
                  status === 'pending' ? Activity :
                  status === 'reviewed' ? TrendingUp :
                  status === 'shortlisted' ? Award :
                  status === 'interviewed' ? Calendar :
                  status === 'hired' ? CheckCircle :
                  status === 'rejected' ? XCircle :
                  status === 'withdrawn' ? XCircle : Activity;
                const percentage = analytics.totalApplications > 0 ? (count / analytics.totalApplications) * 100 : 0;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${color}`} />
                      <span className="font-medium capitalize">{status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
        {/* Top Jobs by Applicants */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle>Top Jobs by Applicants</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {analytics.topJobs.map((job, idx) => (
                <div key={job.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-6">#{idx + 1}</span>
                    <span className="font-medium">{job.title}</span>
                  </div>
                  <span className="text-sm text-gray-600">{job.applicantCount} applicants</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
        {/* Monthly Trends */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Monthly Application Trends</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {analytics.monthlyTrends.map(({ month, count }) => {
                const [year, monthNum] = month.split('-');
                const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                return (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{monthName}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${analytics.monthlyTrends.length > 0 
                              ? (count / Math.max(...analytics.monthlyTrends.map(m => m.count))) * 100 
                              : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default JobPosterAnalytics; 