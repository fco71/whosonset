import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SocialAnalytics as SocialAnalyticsType } from '../../types/Social';
import { performanceMonitor } from '../../utilities/performanceUtils';
import './SocialAnalytics.scss';

interface SocialAnalyticsProps {
  userId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const SocialAnalytics: React.FC<SocialAnalyticsProps> = ({ userId }) => {
  const [analytics, setAnalytics] = useState<SocialAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        performanceMonitor.start('loadSocialAnalytics');
        setLoading(true);
        setError(null);

        // Simulate loading analytics data
        // In a real implementation, this would fetch from Firebase
        const mockAnalytics: SocialAnalyticsType = {
          userId,
          profileViews: 1247,
          profileViewsHistory: [
            { date: '2024-01-01', views: 45 },
            { date: '2024-01-02', views: 52 },
            { date: '2024-01-03', views: 38 },
            { date: '2024-01-04', views: 67 },
            { date: '2024-01-05', views: 89 },
            { date: '2024-01-06', views: 76 },
            { date: '2024-01-07', views: 94 }
          ],
          engagementRate: 0.087,
          topPosts: ['post1', 'post2', 'post3'],
          followerGrowth: [
            { date: '2024-01-01', followers: 156 },
            { date: '2024-01-02', followers: 162 },
            { date: '2024-01-03', followers: 168 },
            { date: '2024-01-04', followers: 175 },
            { date: '2024-01-05', followers: 183 },
            { date: '2024-01-06', followers: 191 },
            { date: '2024-01-07', followers: 198 }
          ],
          activityScore: 85,
          influenceScore: 72,
          reachScore: 68,
          recommendationsGiven: 23,
          recommendationsReceived: 15,
          groupsJoined: 8,
          eventsAttended: 12,
          skillsEndorsed: 45,
          achievementsEarned: 7
        };

        setAnalytics(mockAnalytics);
        performanceMonitor.end('loadSocialAnalytics');
      } catch (err) {
        console.error('Error loading social analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [userId, timeRange]);

  // Memoized chart data
  const chartData = useMemo(() => {
    if (!analytics) return [];

    const data = analytics.profileViewsHistory.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      views: item.views
    }));

    return data;
  }, [analytics]);

  const followerData = useMemo(() => {
    if (!analytics) return [];

    return analytics.followerGrowth.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      followers: item.followers
    }));
  }, [analytics]);

  const engagementData = useMemo(() => {
    if (!analytics) return [];

    return [
      { name: 'Activity Score', value: analytics.activityScore },
      { name: 'Influence Score', value: analytics.influenceScore },
      { name: 'Reach Score', value: analytics.reachScore }
    ];
  }, [analytics]);

  const activityBreakdown = useMemo(() => {
    if (!analytics) return [];

    return [
      { name: 'Recommendations', value: analytics.recommendationsGiven + analytics.recommendationsReceived },
      { name: 'Groups', value: analytics.groupsJoined },
      { name: 'Events', value: analytics.eventsAttended },
      { name: 'Skills Endorsed', value: analytics.skillsEndorsed },
      { name: 'Achievements', value: analytics.achievementsEarned }
    ];
  }, [analytics]);

  if (loading) {
    return (
      <div className="social-analytics">
        <div className="analytics-header">
          <h2>Social Analytics</h2>
          <div className="loading-skeleton">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="social-analytics">
        <div className="analytics-header">
          <h2>Social Analytics</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="social-analytics">
        <div className="analytics-header">
          <h2>Social Analytics</h2>
          <div className="no-data">No analytics data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="social-analytics">
      <div className="analytics-header">
        <h2>Social Analytics</h2>
        <div className="time-range-selector">
          <button 
            className={timeRange === '7d' ? 'active' : ''} 
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''} 
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </button>
          <button 
            className={timeRange === '90d' ? 'active' : ''} 
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics Cards */}
        <div className="metrics-cards">
          <div className="metric-card">
            <div className="metric-icon">👁️</div>
            <div className="metric-content">
              <h3>Profile Views</h3>
              <div className="metric-value">{analytics.profileViews.toLocaleString()}</div>
              <div className="metric-change positive">+12% from last week</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <h3>Engagement Rate</h3>
              <div className="metric-value">{(analytics.engagementRate * 100).toFixed(1)}%</div>
              <div className="metric-change positive">+2.3% from last week</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>Followers</h3>
              <div className="metric-value">{analytics.followerGrowth[analytics.followerGrowth.length - 1]?.followers || 0}</div>
              <div className="metric-change positive">+{analytics.followerGrowth[analytics.followerGrowth.length - 1]?.followers - analytics.followerGrowth[0]?.followers || 0} this week</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⭐</div>
            <div className="metric-content">
              <h3>Activity Score</h3>
              <div className="metric-value">{analytics.activityScore}/100</div>
              <div className="metric-change positive">+5 points this week</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-section">
          <div className="chart-container">
            <h3>Profile Views Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Follower Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={followerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="followers" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Engagement Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Activity Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="insights-section">
          <h3>Key Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">🚀</div>
              <div className="insight-content">
                <h4>Growing Engagement</h4>
                <p>Your engagement rate has increased by 2.3% this week. Keep posting quality content!</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <h4>Peak Activity Times</h4>
                <p>Your posts perform best on Tuesdays and Thursdays between 2-4 PM.</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h4>Network Growth</h4>
                <p>You've gained 42 new followers this week. Your network is expanding!</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">💡</div>
              <div className="insight-content">
                <h4>Recommendation Opportunity</h4>
                <p>You've given 23 recommendations but only received 15. Consider asking for endorsements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 