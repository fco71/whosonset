import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { UserAnalytics, ProjectAnalytics, PlatformAnalytics, AnalyticsInsight } from '../../types/Analytics';
import './AnalyticsDashboard.scss';

interface AnalyticsDashboardProps {
  type?: 'user' | 'project' | 'platform';
  projectId?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  type = 'user', 
  projectId 
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<UserAnalytics | ProjectAnalytics | PlatformAnalytics | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    if (currentUser) {
      loadAnalytics();
      loadInsights();
    }
  }, [currentUser, type, projectId, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would fetch analytics data from your backend
      // For now, we'll create mock data
      const mockAnalytics = generateMockAnalytics();
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      // Mock insights data
      const mockInsights: AnalyticsInsight[] = [
        {
          id: '1',
          type: 'trend',
          title: 'Profile Views Increased',
          description: 'Your profile views have increased by 25% this month',
          severity: 'info',
          category: 'engagement',
          data: { increase: 25, period: 'month' },
          actionable: true,
          actionUrl: '/profile/edit',
          createdAt: new Date(),
          dismissed: false
        },
        {
          id: '2',
          type: 'recommendation',
          title: 'Add More Skills',
          description: 'Adding more skills could increase your job matches by 40%',
          severity: 'warning',
          category: 'performance',
          data: { potentialIncrease: 40 },
          actionable: true,
          actionUrl: '/profile/skills',
          createdAt: new Date(),
          dismissed: false
        }
      ];
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const generateMockAnalytics = () => {
    if (type === 'user' && currentUser) {
      return {
        userId: currentUser.uid,
        profileViews: 1250,
        profileViewsHistory: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 50) + 10,
          uniqueVisitors: Math.floor(Math.random() * 30) + 5
        })),
        projectEngagement: {
          totalProjects: 15,
          activeProjects: 3,
          completedProjects: 12,
          averageProjectRating: 4.8
        },
        networkingMetrics: {
          followers: 234,
          following: 156,
          connections: 89,
          connectionRequests: 12,
          messagesSent: 456,
          messagesReceived: 389
        },
        jobMetrics: {
          applicationsSubmitted: 45,
          applicationsAccepted: 12,
          applicationsRejected: 8,
          averageResponseTime: 2.5,
          successRate: 0.27
        },
        availabilityMetrics: {
          totalDaysAvailable: 180,
          totalDaysBooked: 120,
          bookingRate: 0.67,
          averageBookingDuration: 15
        },
        skillMetrics: {
          topSkills: [
            { skill: 'Cinematography', endorsements: 45, projects: 12 },
            { skill: 'Lighting', endorsements: 38, projects: 10 },
            { skill: 'Camera Operation', endorsements: 32, projects: 8 }
          ],
          skillGrowth: [
            { skill: 'Drone Operation', growthRate: 0.25, newEndorsements: 5 },
            { skill: 'Color Grading', growthRate: 0.18, newEndorsements: 3 }
          ]
        },
        earningsMetrics: {
          totalEarnings: 45000,
          averageRate: 350,
          highestRate: 500,
          earningsByMonth: Array.from({ length: 12 }, (_, i) => ({
            month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
            earnings: Math.floor(Math.random() * 5000) + 2000,
            projects: Math.floor(Math.random() * 5) + 1
          }))
        },
        lastUpdated: new Date()
      } as UserAnalytics;
    }
    return null;
  };

  const renderOverviewTab = () => {
    if (!analytics || type !== 'user') return null;
    const userAnalytics = analytics as UserAnalytics;

    return (
      <div className="analytics-overview">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">👁️</div>
            <div className="metric-content">
              <h3 className="metric-value">{userAnalytics.profileViews.toLocaleString()}</h3>
              <p className="metric-label">Profile Views</p>
              <span className="metric-change positive">+12% this month</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <h3 className="metric-value">{(userAnalytics.jobMetrics.successRate * 100).toFixed(1)}%</h3>
              <p className="metric-label">Job Success Rate</p>
              <span className="metric-change positive">+5% this month</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3 className="metric-value">${userAnalytics.earningsMetrics.totalEarnings.toLocaleString()}</h3>
              <p className="metric-label">Total Earnings</p>
              <span className="metric-change positive">+18% this year</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🤝</div>
            <div className="metric-content">
              <h3 className="metric-value">{userAnalytics.networkingMetrics.connections}</h3>
              <p className="metric-label">Professional Connections</p>
              <span className="metric-change positive">+8 this month</span>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-container">
            <h3>Profile Views Trend</h3>
            <div className="chart-placeholder">
              <p>Chart visualization would go here</p>
              <small>Showing last 30 days of profile views</small>
            </div>
          </div>

          <div className="chart-container">
            <h3>Earnings by Month</h3>
            <div className="chart-placeholder">
              <p>Chart visualization would go here</p>
              <small>Monthly earnings breakdown</small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPerformanceTab = () => {
    if (!analytics || type !== 'user') return null;
    const userAnalytics = analytics as UserAnalytics;

    return (
      <div className="analytics-performance">
        <div className="performance-metrics">
          <div className="performance-card">
            <h3>Project Performance</h3>
            <div className="performance-stats">
              <div className="stat">
                <span className="stat-value">{userAnalytics.projectEngagement.totalProjects}</span>
                <span className="stat-label">Total Projects</span>
              </div>
              <div className="stat">
                <span className="stat-value">{userAnalytics.projectEngagement.averageProjectRating.toFixed(1)}</span>
                <span className="stat-label">Avg. Rating</span>
              </div>
              <div className="stat">
                <span className="stat-value">{userAnalytics.projectEngagement.completedProjects}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>

          <div className="performance-card">
            <h3>Job Application Success</h3>
            <div className="performance-stats">
              <div className="stat">
                <span className="stat-value">{userAnalytics.jobMetrics.applicationsSubmitted}</span>
                <span className="stat-label">Applications</span>
              </div>
              <div className="stat">
                <span className="stat-value">{userAnalytics.jobMetrics.applicationsAccepted}</span>
                <span className="stat-label">Accepted</span>
              </div>
              <div className="stat">
                <span className="stat-value">{userAnalytics.jobMetrics.averageResponseTime} days</span>
                <span className="stat-label">Avg. Response</span>
              </div>
            </div>
          </div>
        </div>

        <div className="skills-section">
          <h3>Top Skills Performance</h3>
          <div className="skills-grid">
            {userAnalytics.skillMetrics.topSkills.map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-header">
                  <h4>{skill.skill}</h4>
                  <span className="skill-endorsements">{skill.endorsements} endorsements</span>
                </div>
                <div className="skill-projects">
                  <span>{skill.projects} projects</span>
                </div>
                <div className="skill-bar">
                  <div 
                    className="skill-progress" 
                    style={{ width: `${(skill.endorsements / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderInsightsTab = () => {
    return (
      <div className="analytics-insights">
        <div className="insights-header">
          <h3>AI-Powered Insights</h3>
          <p>Personalized recommendations to improve your profile and career</p>
        </div>

        <div className="insights-grid">
          {insights.map((insight) => (
            <div key={insight.id} className={`insight-card ${insight.severity}`}>
              <div className="insight-header">
                <div className="insight-icon">
                  {insight.type === 'trend' && '📈'}
                  {insight.type === 'recommendation' && '💡'}
                  {insight.type === 'anomaly' && '⚠️'}
                  {insight.type === 'alert' && '🚨'}
                </div>
                <div className="insight-content">
                  <h4>{insight.title}</h4>
                  <p>{insight.description}</p>
                </div>
                {insight.actionable && (
                  <button className="insight-action">
                    Take Action
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="insights-empty">
          <div className="empty-icon">🎯</div>
          <h4>No new insights</h4>
          <p>We'll notify you when we have personalized recommendations for you</p>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'performance':
        return renderPerformanceTab();
      case 'insights':
        return renderInsightsTab();
      default:
        return renderOverviewTab();
    }
  };

  if (loading) {
    return (
      <div className="analytics-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div className="header-content">
          <h1>Analytics Dashboard</h1>
          <p>Track your performance and get insights to grow your career</p>
        </div>
        
        <div className="header-controls">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <div className="analytics-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button 
          className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
      </div>

      <div className="analytics-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 