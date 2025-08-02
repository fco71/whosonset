import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Calendar, 
  MapPin, 
  DollarSign,
  Eye,
  MousePointer,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award
} from 'lucide-react';
import PerformanceAnalytics from '../../utilities/performanceAnalytics';
import { jobCache, userCache } from '../../utilities/cacheManager';

interface AnalyticsData {
  totalJobs: number;
  totalApplications: number;
  totalUsers: number;
  activeUsers: number;
  conversionRate: number;
  averageResponseTime: number;
  topDepartments: Array<{ name: string; count: number; percentage: number }>;
  topLocations: Array<{ name: string; count: number; percentage: number }>;
  applicationsByStatus: Array<{ status: string; count: number; percentage: number }>;
  recentActivity: Array<{ type: string; description: string; timestamp: any; userId: string }>;
  performanceMetrics: {
    averagePageLoadTime: number;
    averageApiCallTime: number;
    totalInteractions: number;
    successRate: number;
  };
}

interface AdvancedAnalyticsDashboardProps {
  timeframe?: '7d' | '30d' | '90d' | '1y';
  showPerformance?: boolean;
}

const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({
  timeframe = '30d',
  showPerformance = true
}) => {
  const { currentUser } = useAuth();
  const performanceAnalytics = PerformanceAnalytics.getInstance();
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeframe]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // Check cache first
      const cacheKey = `analytics_${selectedTimeframe}`;
      const cached = jobCache.get<AnalyticsData>(cacheKey);
      
      if (cached) {
        setAnalyticsData(cached);
        setIsLoading(false);
        return;
      }

      const data = await fetchAnalyticsData();
      setAnalyticsData(data);
      
      // Cache the results
      jobCache.set(cacheKey, data, 15 * 60 * 1000); // 15 minutes
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
    const now = new Date();
    const daysAgo = selectedTimeframe === '7d' ? 7 : 
                   selectedTimeframe === '30d' ? 30 : 
                   selectedTimeframe === '90d' ? 90 : 365;
    
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

    // Fetch jobs
    const jobsQuery = query(
      collection(db, 'jobPostings'),
      where('createdAt', '>=', startDate)
    );
    const jobsSnapshot = await getDocs(jobsQuery);
    const totalJobs = jobsSnapshot.size;

    // Fetch applications
    const applicationsQuery = query(
      collection(db, 'jobApplications'),
      where('createdAt', '>=', startDate)
    );
    const applicationsSnapshot = await getDocs(applicationsQuery);
    const totalApplications = applicationsSnapshot.size;

    // Fetch users
    const usersQuery = query(
      collection(db, 'users'),
      where('createdAt', '>=', startDate)
    );
    const usersSnapshot = await getDocs(usersQuery);
    const totalUsers = usersSnapshot.size;

    // Calculate department distribution
    const departmentCounts: {[key: string]: number} = {};
    jobsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const dept = data.department || 'Other';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    const topDepartments = Object.entries(departmentCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / totalJobs) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate location distribution
    const locationCounts: {[key: string]: number} = {};
    jobsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const location = data.location || 'Remote';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const topLocations = Object.entries(locationCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / totalJobs) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate application status distribution
    const statusCounts: {[key: string]: number} = {};
    applicationsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const status = data.status || 'pending';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const applicationsByStatus = Object.entries(statusCounts)
      .map(([status, count]) => ({
        status,
        count,
        percentage: (count / totalApplications) * 100
      }))
      .sort((a, b) => b.count - a.count);

    // Get performance metrics
    const performanceMetrics = performanceAnalytics.getPerformanceSummary();

    // Mock recent activity (in a real app, this would come from a separate collection)
    const recentActivity = [
      {
        type: 'application',
        description: 'New job application submitted',
        timestamp: new Date(),
        userId: 'user1'
      },
      {
        type: 'job_posted',
        description: 'New job posted in Camera department',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        userId: 'user2'
      },
      {
        type: 'user_registered',
        description: 'New user registered',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        userId: 'user3'
      }
    ];

    return {
      totalJobs,
      totalApplications,
      totalUsers,
      activeUsers: Math.floor(totalUsers * 0.7), // Mock active users
      conversionRate: totalJobs > 0 ? (totalApplications / totalJobs) * 100 : 0,
      averageResponseTime: 2.5, // Mock average response time in days
      topDepartments,
      topLocations,
      applicationsByStatus,
      recentActivity,
      performanceMetrics
    };
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'jobs': return <Briefcase className="w-5 h-5" />;
      case 'applications': return <Users className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'conversion': return <Target className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'jobs': return 'text-blue-600 bg-blue-100';
      case 'applications': return 'text-green-600 bg-green-100';
      case 'users': return 'text-purple-600 bg-purple-100';
      case 'conversion': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTimeframeLabel = (tf: string) => {
    switch (tf) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-500">Analytics data will appear here once you start using the platform.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">{getTimeframeLabel(selectedTimeframe)}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalJobs)}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12% from last period
              </p>
            </div>
            <div className={`p-3 rounded-full ${getMetricColor('jobs')}`}>
              {getMetricIcon('jobs')}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalApplications)}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8% from last period
              </p>
            </div>
            <div className={`p-3 rounded-full ${getMetricColor('applications')}`}>
              {getMetricIcon('applications')}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.activeUsers)}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15% from last period
              </p>
            </div>
            <div className={`p-3 rounded-full ${getMetricColor('users')}`}>
              {getMetricIcon('users')}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.conversionRate.toFixed(1)}%</p>
              <p className="text-sm text-red-600 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                -2% from last period
              </p>
            </div>
            <div className={`p-3 rounded-full ${getMetricColor('conversion')}`}>
              {getMetricIcon('conversion')}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Departments */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Departments</h3>
          <div className="space-y-3">
            {analyticsData.topDepartments.map((dept, index) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{dept.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${dept.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{dept.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Application Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
          <div className="space-y-3">
            {analyticsData.applicationsByStatus.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status.status === 'hired' ? 'bg-green-500' :
                    status.status === 'interviewed' ? 'bg-blue-500' :
                    status.status === 'shortlisted' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="font-medium text-gray-900 capitalize">{status.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status.status === 'hired' ? 'bg-green-500' :
                        status.status === 'interviewed' ? 'bg-blue-500' :
                        status.status === 'shortlisted' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{status.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      {showPerformance && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Avg Page Load</p>
              <p className="text-xl font-bold text-gray-900">
                {analyticsData.performanceMetrics.averagePageLoadTime.toFixed(0)}ms
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Avg API Call</p>
              <p className="text-xl font-bold text-gray-900">
                {analyticsData.performanceMetrics.averageApiCallTime.toFixed(0)}ms
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MousePointer className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Total Interactions</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(analyticsData.performanceMetrics.totalInteractions)}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {analyticsData.performanceMetrics.successRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdvancedAnalyticsDashboard; 