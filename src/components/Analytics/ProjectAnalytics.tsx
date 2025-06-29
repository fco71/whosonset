import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ProjectAnalytics } from '../../types/Analytics';
import './ProjectAnalytics.scss';

const ProjectAnalytics: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (projectId) {
      loadProjectAnalytics();
    }
  }, [projectId]);

  const loadProjectAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockAnalytics: ProjectAnalytics = {
        projectId: projectId!,
        overview: {
          totalViews: 1250,
          uniqueVisitors: 890,
          applicationsReceived: 45,
          crewMembersHired: 12,
          budgetUtilization: 0.78,
          timelineProgress: 0.65
        },
        engagementMetrics: {
          viewsByDay: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            views: Math.floor(Math.random() * 50) + 10,
            uniqueVisitors: Math.floor(Math.random() * 30) + 5
          })),
          applicationsByDay: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            applications: Math.floor(Math.random() * 5) + 1,
            qualifiedApplications: Math.floor(Math.random() * 3) + 1
          })),
          socialShares: 23,
          bookmarks: 67
        },
        crewMetrics: {
          totalCrewMembers: 12,
          crewByDepartment: [
            { department: 'Camera', count: 3, averageRate: 450 },
            { department: 'Lighting', count: 2, averageRate: 380 },
            { department: 'Sound', count: 2, averageRate: 420 },
            { department: 'Production', count: 3, averageRate: 350 },
            { department: 'Art', count: 2, averageRate: 320 }
          ],
          crewRetentionRate: 0.92,
          averageCrewRating: 4.7
        },
        budgetMetrics: {
          totalBudget: 150000,
          spentBudget: 117000,
          remainingBudget: 33000,
          budgetByCategory: [
            { category: 'Crew', budgeted: 80000, spent: 65000, variance: -15000 },
            { category: 'Equipment', budgeted: 30000, spent: 28000, variance: -2000 },
            { category: 'Location', budgeted: 20000, spent: 15000, variance: -5000 },
            { category: 'Post-Production', budgeted: 20000, spent: 9000, variance: -11000 }
          ],
          costOverruns: 0,
          savings: 11000
        },
        timelineMetrics: {
          totalPhases: 8,
          completedPhases: 5,
          delayedPhases: 1,
          averagePhaseDuration: 12,
          criticalPathDelays: 0,
          timelineEfficiency: 0.87
        },
        performanceMetrics: {
          onTimeDelivery: true,
          qualityScore: 4.8,
          clientSatisfaction: 4.9,
          teamProductivity: 0.92,
          riskAssessment: 'low'
        },
        lastUpdated: new Date()
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading project analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewSection = () => {
    if (!analytics) return null;

    return (
      <div className="project-analytics-overview">
        <div className="overview-metrics">
          <div className="metric-card primary">
            <div className="metric-icon">👁️</div>
            <div className="metric-content">
              <h3>{analytics.overview.totalViews.toLocaleString()}</h3>
              <p>Total Views</p>
              <span className="metric-subtitle">{analytics.overview.uniqueVisitors} unique visitors</span>
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-icon">📝</div>
            <div className="metric-content">
              <h3>{analytics.overview.applicationsReceived}</h3>
              <p>Applications</p>
              <span className="metric-subtitle">{analytics.overview.crewMembersHired} hired</span>
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>${analytics.budgetMetrics.spentBudget.toLocaleString()}</h3>
              <p>Budget Spent</p>
              <span className="metric-subtitle">
                {Math.round(analytics.overview.budgetUtilization * 100)}% utilized
              </span>
            </div>
          </div>

          <div className="metric-card info">
            <div className="metric-icon">📅</div>
            <div className="metric-content">
              <h3>{Math.round(analytics.overview.timelineProgress * 100)}%</h3>
              <p>Timeline Progress</p>
              <span className="metric-subtitle">{analytics.timelineMetrics.completedPhases}/{analytics.timelineMetrics.totalPhases} phases</span>
            </div>
          </div>
        </div>

        <div className="overview-charts">
          <div className="chart-container">
            <h3>Engagement Over Time</h3>
            <div className="chart-placeholder">
              <p>Views and applications trend chart</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>Budget Utilization</h3>
            <div className="chart-placeholder">
              <p>Budget breakdown by category</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCrewSection = () => {
    if (!analytics) return null;

    return (
      <div className="project-analytics-crew">
        <div className="crew-overview">
          <div className="crew-stats">
            <div className="stat-card">
              <h3>{analytics.crewMetrics.totalCrewMembers}</h3>
              <p>Total Crew</p>
            </div>
            <div className="stat-card">
              <h3>{Math.round(analytics.crewMetrics.crewRetentionRate * 100)}%</h3>
              <p>Retention Rate</p>
            </div>
            <div className="stat-card">
              <h3>{analytics.crewMetrics.averageCrewRating.toFixed(1)}</h3>
              <p>Avg. Rating</p>
            </div>
          </div>

          <div className="crew-departments">
            <h3>Crew by Department</h3>
            <div className="department-list">
              {analytics.crewMetrics.crewByDepartment.map((dept, index) => (
                <div key={index} className="department-item">
                  <div className="department-info">
                    <h4>{dept.department}</h4>
                    <span>{dept.count} members</span>
                  </div>
                  <div className="department-rate">
                    ${dept.averageRate}/day avg.
                  </div>
                  <div className="department-bar">
                    <div 
                      className="department-progress" 
                      style={{ width: `${(dept.count / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBudgetSection = () => {
    if (!analytics) return null;

    return (
      <div className="project-analytics-budget">
        <div className="budget-overview">
          <div className="budget-summary">
            <div className="budget-card total">
              <h3>${analytics.budgetMetrics.totalBudget.toLocaleString()}</h3>
              <p>Total Budget</p>
            </div>
            <div className="budget-card spent">
              <h3>${analytics.budgetMetrics.spentBudget.toLocaleString()}</h3>
              <p>Spent</p>
            </div>
            <div className="budget-card remaining">
              <h3>${analytics.budgetMetrics.remainingBudget.toLocaleString()}</h3>
              <p>Remaining</p>
            </div>
            <div className="budget-card savings">
              <h3>${analytics.budgetMetrics.savings.toLocaleString()}</h3>
              <p>Savings</p>
            </div>
          </div>

          <div className="budget-breakdown">
            <h3>Budget by Category</h3>
            <div className="category-list">
              {analytics.budgetMetrics.budgetByCategory.map((category, index) => (
                <div key={index} className="category-item">
                  <div className="category-header">
                    <h4>{category.category}</h4>
                    <span className={`variance ${category.variance < 0 ? 'positive' : 'negative'}`}>
                      ${Math.abs(category.variance).toLocaleString()} {category.variance < 0 ? 'saved' : 'over'}
                    </span>
                  </div>
                  <div className="category-bars">
                    <div className="budget-bar">
                      <div className="bar-label">Budgeted</div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill budgeted" 
                          style={{ width: `${(category.budgeted / 80000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="bar-value">${category.budgeted.toLocaleString()}</div>
                    </div>
                    <div className="budget-bar">
                      <div className="bar-label">Spent</div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill spent" 
                          style={{ width: `${(category.spent / 80000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="bar-value">${category.spent.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTimelineSection = () => {
    if (!analytics) return null;

    return (
      <div className="project-analytics-timeline">
        <div className="timeline-overview">
          <div className="timeline-stats">
            <div className="stat-card">
              <h3>{analytics.timelineMetrics.totalPhases}</h3>
              <p>Total Phases</p>
            </div>
            <div className="stat-card">
              <h3>{analytics.timelineMetrics.completedPhases}</h3>
              <p>Completed</p>
            </div>
            <div className="stat-card">
              <h3>{analytics.timelineMetrics.delayedPhases}</h3>
              <p>Delayed</p>
            </div>
            <div className="stat-card">
              <h3>{Math.round(analytics.timelineMetrics.timelineEfficiency * 100)}%</h3>
              <p>Efficiency</p>
            </div>
          </div>

          <div className="timeline-visualization">
            <h3>Project Timeline</h3>
            <div className="timeline-chart">
              <div className="chart-placeholder">
                <p>Gantt chart visualization</p>
                <small>Showing project phases and progress</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPerformanceSection = () => {
    if (!analytics) return null;

    return (
      <div className="project-analytics-performance">
        <div className="performance-metrics">
          <div className="performance-card">
            <div className="performance-header">
              <h3>Project Performance</h3>
              <span className={`risk-level ${analytics.performanceMetrics.riskAssessment}`}>
                {analytics.performanceMetrics.riskAssessment.toUpperCase()} RISK
              </span>
            </div>
            <div className="performance-grid">
              <div className="performance-item">
                <div className="performance-icon">✅</div>
                <div className="performance-content">
                  <h4>On-Time Delivery</h4>
                  <span className={`status ${analytics.performanceMetrics.onTimeDelivery ? 'success' : 'warning'}`}>
                    {analytics.performanceMetrics.onTimeDelivery ? 'On Track' : 'At Risk'}
                  </span>
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-icon">⭐</div>
                <div className="performance-content">
                  <h4>Quality Score</h4>
                  <span className="score">{analytics.performanceMetrics.qualityScore}/5.0</span>
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-icon">😊</div>
                <div className="performance-content">
                  <h4>Client Satisfaction</h4>
                  <span className="score">{analytics.performanceMetrics.clientSatisfaction}/5.0</span>
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-icon">📊</div>
                <div className="performance-content">
                  <h4>Team Productivity</h4>
                  <span className="score">{Math.round(analytics.performanceMetrics.teamProductivity * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewSection();
      case 'crew':
        return renderCrewSection();
      case 'budget':
        return renderBudgetSection();
      case 'timeline':
        return renderTimelineSection();
      case 'performance':
        return renderPerformanceSection();
      default:
        return renderOverviewSection();
    }
  };

  if (loading) {
    return (
      <div className="project-analytics loading">
        <div className="loading-spinner"></div>
        <p>Loading project analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="project-analytics error">
        <div className="error-icon">❌</div>
        <h3>Unable to load analytics</h3>
        <p>There was an error loading the project analytics data.</p>
      </div>
    );
  }

  return (
    <div className="project-analytics">
      <div className="analytics-header">
        <div className="header-content">
          <h1>Project Analytics</h1>
          <p>Comprehensive insights and metrics for your project</p>
        </div>
        <div className="last-updated">
          Last updated: {analytics.lastUpdated.toLocaleDateString()}
        </div>
      </div>

      <div className="analytics-navigation">
        <button 
          className={`nav-button ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-button ${activeSection === 'crew' ? 'active' : ''}`}
          onClick={() => setActiveSection('crew')}
        >
          Crew
        </button>
        <button 
          className={`nav-button ${activeSection === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveSection('budget')}
        >
          Budget
        </button>
        <button 
          className={`nav-button ${activeSection === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveSection('timeline')}
        >
          Timeline
        </button>
        <button 
          className={`nav-button ${activeSection === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveSection('performance')}
        >
          Performance
        </button>
      </div>

      <div className="analytics-content">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default ProjectAnalytics; 