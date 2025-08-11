import React, { useState, useEffect } from 'react';
import { adAnalytics, AdRevenueReport } from '../../services/ads/adAnalytics';
import { AdPerformanceMetrics } from '../../services/ads/adConfig';
import './AdRevenueDashboard.scss';

interface AdRevenueDashboardProps {
  className?: string;
}

const AdRevenueDashboard: React.FC<AdRevenueDashboardProps> = ({ className = '' }) => {
  const [revenueReport, setRevenueReport] = useState<AdRevenueReport | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<AdPerformanceMetrics[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = () => {
    setIsLoading(true);
    
    // Load revenue report
    const report = adAnalytics.getRevenueReport(selectedPeriod);
    setRevenueReport(report);
    
    // Load performance metrics
    const metrics = adAnalytics.getAllPerformanceMetrics();
    setPerformanceMetrics(metrics);
    
    setIsLoading(false);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getTopPerformingPlacement = () => {
    if (!performanceMetrics.length) return null;
    
    return performanceMetrics.reduce((top, current) => 
      current.revenue > top.revenue ? current : top
    );
  };

  const getTotalImpressions = () => {
    return performanceMetrics.reduce((sum, metric) => sum + metric.impressions, 0);
  };

  const getTotalClicks = () => {
    return performanceMetrics.reduce((sum, metric) => sum + metric.clicks, 0);
  };

  const getAverageCTR = () => {
    const totalImpressions = getTotalImpressions();
    const totalClicks = getTotalClicks();
    return totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className={`ad-revenue-dashboard loading ${className}`}>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-revenue-dashboard ${className}`}>
      <div className="dashboard-header">
        <h2>Ad Revenue Dashboard</h2>
        <div className="period-selector">
          <button
            className={selectedPeriod === 'daily' ? 'active' : ''}
            onClick={() => setSelectedPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={selectedPeriod === 'weekly' ? 'active' : ''}
            onClick={() => setSelectedPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            className={selectedPeriod === 'monthly' ? 'active' : ''}
            onClick={() => setSelectedPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">
              {revenueReport ? formatCurrency(revenueReport.totalRevenue, revenueReport.currency) : '$0.00'}
            </p>
            <p className="stat-period">{selectedPeriod} period</p>
          </div>
        </div>

        <div className="stat-card impressions">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h3>Impressions</h3>
            <p className="stat-value">{formatNumber(getTotalImpressions())}</p>
            <p className="stat-period">Total views</p>
          </div>
        </div>

        <div className="stat-card clicks">
          <div className="stat-icon">🖱️</div>
          <div className="stat-content">
            <h3>Clicks</h3>
            <p className="stat-value">{formatNumber(getTotalClicks())}</p>
            <p className="stat-period">Total clicks</p>
          </div>
        </div>

        <div className="stat-card ctr">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>CTR</h3>
            <p className="stat-value">{formatPercentage(getAverageCTR())}</p>
            <p className="stat-period">Click-through rate</p>
          </div>
        </div>
      </div>

      {revenueReport && (
        <div className="dashboard-details">
          <div className="detail-section">
            <h3>Revenue Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Average CPM:</span>
                <span className="value">
                  {formatCurrency(revenueReport.summary.averageCPM / 1000, revenueReport.currency)}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Average CTR:</span>
                <span className="value">{formatPercentage(revenueReport.summary.averageCTR)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Total Impressions:</span>
                <span className="value">{formatNumber(revenueReport.summary.totalImpressions)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Total Clicks:</span>
                <span className="value">{formatNumber(revenueReport.summary.totalClicks)}</span>
              </div>
            </div>
          </div>

          {performanceMetrics.length > 0 && (
            <div className="detail-section">
              <h3>Top Performing Placements</h3>
              <div className="placements-list">
                {performanceMetrics
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((metric) => (
                    <div key={metric.placementId} className="placement-item">
                      <div className="placement-info">
                        <h4>{metric.placementId}</h4>
                        <p className="placement-stats">
                          {formatNumber(metric.impressions)} impressions • {formatNumber(metric.clicks)} clicks
                        </p>
                      </div>
                      <div className="placement-revenue">
                        <span className="revenue-amount">
                          {formatCurrency(metric.revenue)}
                        </span>
                        <span className="revenue-ctr">
                          CTR: {formatPercentage((metric.clicks / metric.impressions) * 100)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="dashboard-actions">
        <button 
          className="refresh-btn"
          onClick={loadDashboardData}
        >
          Refresh Data
        </button>
        <button 
          className="export-btn"
          onClick={() => {
            const data = adAnalytics.exportAnalyticsData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ad-analytics-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Data
        </button>
      </div>
    </div>
  );
};

export default AdRevenueDashboard; 