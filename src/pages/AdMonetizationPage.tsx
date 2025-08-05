import React, { useState } from 'react';
import { useAds } from '../components/Ads/AdProvider';
import AdManager from '../components/Ads/AdManager';
import AdRevenueDashboard from '../components/Ads/AdRevenueDashboard';
import { adAnalytics } from '../services/ads/adAnalytics';
import './AdMonetizationPage.scss';

const AdMonetizationPage: React.FC = () => {
  const { isAdEnabled, toggleAds, getPlacementsForPage, trackAdEvent } = useAds();
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'dashboard' | 'settings'>('overview');

  const currentPagePlacements = getPlacementsForPage('analytics');

  const handleAdToggle = () => {
    toggleAds(!isAdEnabled);
  };

  const handleAdEvent = (placementId: string, eventType: 'impression' | 'click' | 'view' | 'error' | 'load') => {
    trackAdEvent(placementId, eventType);
  };

  const addSampleRevenueData = () => {
    // Add sample revenue data for demonstration
    const sampleData = {
      placementId: 'header-banner',
      revenue: Math.random() * 100,
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      impressions: Math.floor(Math.random() * 1000) + 100,
      clicks: Math.floor(Math.random() * 50) + 5,
      ctr: Math.random() * 5,
      cpm: Math.random() * 10,
    };
    
    adAnalytics.addRevenueData(sampleData);
    setShowDashboard(true);
  };

  return (
    <div className="ad-monetization-page">
      <div className="page-header">
        <h1>Ad Monetization System</h1>
        <p>Manage your website's advertising and track revenue performance</p>
      </div>

      <div className="page-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Revenue Dashboard
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="tab-content overview">
          <div className="overview-stats">
            <div className="stat-card">
              <h3>Ad Status</h3>
              <div className="stat-value">
                <span className={`status-indicator ${isAdEnabled ? 'enabled' : 'disabled'}`}>
                  {isAdEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p>Google AdSense is currently {isAdEnabled ? 'active' : 'inactive'}</p>
            </div>

            <div className="stat-card">
              <h3>Active Placements</h3>
              <div className="stat-value">{currentPagePlacements.length}</div>
              <p>Ad placements currently active</p>
            </div>

            <div className="stat-card">
              <h3>Revenue Tracking</h3>
              <div className="stat-value">Active</div>
              <p>Analytics and revenue tracking enabled</p>
            </div>
          </div>

          <div className="ad-demo-section">
            <h2>Ad Placement Demo</h2>
            <p>Below are examples of different ad placements on this page:</p>

            <div className="demo-ads">
              <div className="demo-section">
                <h3>Header Banner Ad</h3>
                <AdManager
                  placements={currentPagePlacements.filter(p => p.position === 'header')}
                  onAdLoad={(placementId) => handleAdEvent(placementId, 'load')}
                  onAdError={(placementId, error) => handleAdEvent(placementId, 'error')}
                />
              </div>

              <div className="demo-section">
                <h3>Content Inline Ad</h3>
                <AdManager
                  placements={currentPagePlacements.filter(p => p.position === 'inline')}
                  onAdLoad={(placementId) => handleAdEvent(placementId, 'load')}
                  onAdError={(placementId, error) => handleAdEvent(placementId, 'error')}
                />
              </div>

              <div className="demo-section">
                <h3>Footer Banner Ad</h3>
                <AdManager
                  placements={currentPagePlacements.filter(p => p.position === 'footer')}
                  onAdLoad={(placementId) => handleAdEvent(placementId, 'load')}
                  onAdError={(placementId, error) => handleAdEvent(placementId, 'error')}
                />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>
              View Revenue Dashboard
            </button>
            <button className="btn-secondary" onClick={addSampleRevenueData}>
              Add Sample Data
            </button>
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="tab-content dashboard">
          <AdRevenueDashboard />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="tab-content settings">
          <div className="settings-section">
            <h2>Ad Settings</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Google AdSense</h3>
                <p>Enable or disable Google AdSense ads on your website</p>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isAdEnabled}
                    onChange={handleAdToggle}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Analytics Tracking</h3>
                <p>Track ad performance and revenue analytics</p>
              </div>
              <div className="setting-control">
                <span className="status-badge enabled">Enabled</span>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Ad Placement Strategy</h3>
                <p>Configure ad placement priorities and positions</p>
              </div>
              <div className="setting-control">
                <button className="btn-secondary">Configure</button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>AdSense Configuration</h2>
            <div className="config-info">
              <p><strong>Client ID:</strong> ca-pub-XXXXXXXXXXXXXXXX</p>
              <p><strong>Status:</strong> {isAdEnabled ? 'Active' : 'Inactive'}</p>
              <p><strong>Test Mode:</strong> {process.env.NODE_ENV === 'development' ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="config-actions">
              <button className="btn-secondary">Update Client ID</button>
              <button className="btn-secondary">View Ad Units</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdMonetizationPage; 