import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { JobApplicationService } from '../../services/jobApplicationService';
import { JobApplication } from '../../types/JobApplication';
import Card, { CardHeader, CardBody, CardTitle } from '../ui/Card';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Clock3
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

interface JobPostingSummary {
  id: string;
  title: string;
  companyName?: string;
  department?: string;
  location?: string;
  status?: string;
  postedAt?: any;
}

interface ApplicationWithJob {
  application: JobApplication;
  job: JobPostingSummary | null;
}

interface AnalyticsData {
  totalApplications: number;
  successRate: number;
  averageResponseTime: number;
  statusBreakdown: Record<string, number>;
  monthlyTrends: Array<{ month: string; count: number }>;
  topCompanies: Array<{ company: string; count: number }>;
  topDepartments: Array<{ department: string; count: number }>;
  responseTimeByStatus: Record<string, number>;
  conversionRates: Record<string, number>;
}

const ApplicationAnalytics: React.FC = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '6m' | '1y'>('90d');

  useEffect(() => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    const unsubscribe = JobApplicationService.subscribeToUserApplications(currentUser.uid, async (applications) => {
      try {
        const jobs = await Promise.all(applications.map(async (app) => {
          if (!app.jobId) return { application: app, job: null };
          const jobDoc = await getDocs(query(
            collection(db, 'jobPostings'),
            where('__name__', '==', app.jobId)
          ));
          
          if (!jobDoc.empty) {
            const jobData = jobDoc.docs[0].data();
            return {
              application: app,
              job: {
                id: jobDoc.docs[0].id,
                title: jobData.title || 'Untitled Job',
                companyName: jobData.companyName || jobData.company || '',
                department: jobData.department || '',
                location: jobData.location || '',
                status: jobData.status || '',
                postedAt: jobData.postedAt || null,
              } as JobPostingSummary
            };
          }
          
          return { application: app, job: null };
        }));
        
        setApplications(jobs);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    });
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const analyticsData = useMemo((): AnalyticsData => {
    if (applications.length === 0) {
      return {
        totalApplications: 0,
        successRate: 0,
        averageResponseTime: 0,
        statusBreakdown: {},
        monthlyTrends: [],
        topCompanies: [],
        topDepartments: [],
        responseTimeByStatus: {},
        conversionRates: {}
      };
    }

    // Filter by time range
    const now = new Date();
    const timeRangeDays = {
      '30d': 30,
      '90d': 90,
      '6m': 180,
      '1y': 365
    };
    const cutoffDate = new Date(now.getTime() - timeRangeDays[timeRange] * 24 * 60 * 60 * 1000);
    
    const filteredApplications = applications.filter(app => {
      const appliedDate = app.application.appliedAt?.toDate?.() || new Date(0);
      return appliedDate >= cutoffDate;
    });

    // Status breakdown
    const statusBreakdown: Record<string, number> = {};
    filteredApplications.forEach(app => {
      const status = app.application.status || 'pending';
      statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
    });

    // Success rate (hired / total)
    const totalApplications = filteredApplications.length;
    const hiredCount = statusBreakdown['hired'] || 0;
    const successRate = totalApplications > 0 ? (hiredCount / totalApplications) * 100 : 0;

    // Average response time
    const responseTimes: number[] = [];
    filteredApplications.forEach(app => {
      if (app.application.reviewedAt && app.application.appliedAt) {
        const appliedDate = app.application.appliedAt.toDate?.() || new Date(0);
        const reviewedDate = app.application.reviewedAt.toDate?.() || new Date(0);
        const responseTime = (reviewedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24); // days
        if (responseTime > 0) {
          responseTimes.push(responseTime);
        }
      }
    });
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    // Monthly trends
    const monthlyData: Record<string, number> = {};
    filteredApplications.forEach(app => {
      const appliedDate = app.application.appliedAt?.toDate?.() || new Date(0);
      const monthKey = `${appliedDate.getFullYear()}-${String(appliedDate.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });
    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Top companies
    const companyCounts: Record<string, number> = {};
    filteredApplications.forEach(app => {
      const company = app.job?.companyName || 'Unknown';
      companyCounts[company] = (companyCounts[company] || 0) + 1;
    });
    const topCompanies = Object.entries(companyCounts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top departments
    const departmentCounts: Record<string, number> = {};
    filteredApplications.forEach(app => {
      const department = app.job?.department || 'Unknown';
      departmentCounts[department] = (departmentCounts[department] || 0) + 1;
    });
    const topDepartments = Object.entries(departmentCounts)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Response time by status
    const responseTimeByStatus: Record<string, number> = {};
    const statusResponseTimes: Record<string, number[]> = {};
    
    filteredApplications.forEach(app => {
      const status = app.application.status || 'pending';
      if (app.application.reviewedAt && app.application.appliedAt) {
        const appliedDate = app.application.appliedAt.toDate?.() || new Date(0);
        const reviewedDate = app.application.reviewedAt.toDate?.() || new Date(0);
        const responseTime = (reviewedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (responseTime > 0) {
          if (!statusResponseTimes[status]) statusResponseTimes[status] = [];
          statusResponseTimes[status].push(responseTime);
        }
      }
    });

    Object.entries(statusResponseTimes).forEach(([status, times]) => {
      responseTimeByStatus[status] = times.reduce((sum, time) => sum + time, 0) / times.length;
    });

    // Conversion rates
    const conversionRates: Record<string, number> = {};
    const statusTransitions: Record<string, number> = {};
    
    filteredApplications.forEach(app => {
      const status = app.application.status || 'pending';
      statusTransitions[status] = (statusTransitions[status] || 0) + 1;
    });

    const total = Object.values(statusTransitions).reduce((sum, count) => sum + count, 0);
    Object.entries(statusTransitions).forEach(([status, count]) => {
      conversionRates[status] = total > 0 ? (count / total) * 100 : 0;
    });

    return {
      totalApplications,
      successRate,
      averageResponseTime,
      statusBreakdown,
      monthlyTrends,
      topCompanies,
      topDepartments,
      responseTimeByStatus,
      conversionRates
    };
  }, [applications, timeRange]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600',
      reviewed: 'text-blue-600',
      shortlisted: 'text-purple-600',
      interviewed: 'text-indigo-600',
      hired: 'text-green-600',
      rejected: 'text-red-600',
      withdrawn: 'text-gray-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      reviewed: Activity,
      shortlisted: Target,
      interviewed: BarChart3,
      hired: CheckCircle,
      rejected: XCircle,
      withdrawn: XCircle
    };
    return icons[status as keyof typeof icons] || Clock;
  };

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Application Analytics</h1>
          <p className="text-gray-600">Insights into your job application performance</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {(['30d', '90d', '6m', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {range === '30d' ? '30 Days' : 
                 range === '90d' ? '90 Days' : 
                 range === '6m' ? '6 Months' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.totalApplications}</p>
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
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.successRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.averageResponseTime > 0 
                      ? `${analyticsData.averageResponseTime.toFixed(1)} days`
                      : 'N/A'
                    }
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(analyticsData.statusBreakdown['pending'] || 0) + 
                     (analyticsData.statusBreakdown['reviewed'] || 0) + 
                     (analyticsData.statusBreakdown['shortlisted'] || 0) + 
                     (analyticsData.statusBreakdown['interviewed'] || 0)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Activity className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Application Status Breakdown</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {Object.entries(analyticsData.statusBreakdown).map(([status, count]) => {
                  const Icon = getStatusIcon(status);
                  const percentage = analyticsData.totalApplications > 0 
                    ? (count / analyticsData.totalApplications) * 100 
                    : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${getStatusColor(status)}`} />
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

          {/* Monthly Trends */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Monthly Application Trends</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {analyticsData.monthlyTrends.map(({ month, count }) => {
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
                              width: `${analyticsData.monthlyTrends.length > 0 
                                ? (count / Math.max(...analyticsData.monthlyTrends.map(m => m.count))) * 100 
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

        {/* Top Companies and Departments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Top Companies Applied To</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {analyticsData.topCompanies.map(({ company, count }, index) => (
                  <div key={company} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                      <span className="font-medium">{company}</span>
                    </div>
                    <span className="text-sm text-gray-600">{count} applications</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Top Departments</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {analyticsData.topDepartments.map(({ department, count }, index) => (
                  <div key={department} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                      <span className="font-medium">{department}</span>
                    </div>
                    <span className="text-sm text-gray-600">{count} applications</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Response Time Analysis */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle>Response Time by Status</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analyticsData.responseTimeByStatus).map(([status, avgTime]) => (
                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getStatusColor(status)}`}>
                    {avgTime.toFixed(1)}d
                  </div>
                  <div className="text-sm text-gray-600 capitalize">{status}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Insights */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {analyticsData.successRate > 0 && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Success Rate</p>
                    <p className="text-sm text-green-700">
                      You have a {analyticsData.successRate.toFixed(1)}% success rate in getting hired from your applications.
                    </p>
                  </div>
                </div>
              )}
              
              {analyticsData.averageResponseTime > 0 && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Response Time</p>
                    <p className="text-sm text-blue-700">
                      Companies typically respond within {analyticsData.averageResponseTime.toFixed(1)} days on average.
                    </p>
                  </div>
                </div>
              )}
              
              {analyticsData.topCompanies.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-800">Top Company</p>
                    <p className="text-sm text-purple-700">
                      You've applied most frequently to {analyticsData.topCompanies[0]?.company} ({analyticsData.topCompanies[0]?.count} applications).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationAnalytics; 