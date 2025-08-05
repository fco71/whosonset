import React, { useState, useEffect } from 'react';
import { useAds } from './AdProvider';
import { adAnalytics } from '../../services/ads/adAnalytics';
import './AdTestComponent.scss';

const AdTestComponent: React.FC = () => {
  const { isAdEnabled, toggleAds, trackAdEvent } = useAds();
  const [testResults, setTestResults] = useState<{
    adSenseLoaded: boolean;
    analyticsWorking: boolean;
    eventsTracked: number;
  }>({
    adSenseLoaded: false,
    analyticsWorking: false,
    eventsTracked: 0,
  });

  useEffect(() => {
    // Test if AdSense is loaded
    const checkAdSense = () => {
      const isLoaded = typeof window !== 'undefined' && window.adsbygoogle;
      setTestResults(prev => ({ ...prev, adSenseLoaded: Boolean(isLoaded) }));
    };

    // Test analytics
    const testAnalytics = () => {
      try {
        adAnalytics.trackEvent({
          type: 'load',
          placementId: 'test-component',
          timestamp: new Date(),
          metadata: { test: true },
        });
        setTestResults(prev => ({ 
          ...prev, 
          analyticsWorking: true,
          eventsTracked: prev.eventsTracked + 1 
        }));
      } catch (error) {
        console.error('Analytics test failed:', error);
      }
    };

    checkAdSense();
    testAnalytics();

    // Check again after a delay
    const timer = setTimeout(checkAdSense, 2000);
    return () => clearTimeout(timer);
  }, []);

  const runAdTest = () => {
    trackAdEvent('test-ad', 'impression');
    setTestResults(prev => ({ 
      ...prev, 
      eventsTracked: prev.eventsTracked + 1 
    }));
  };

  const addTestRevenue = () => {
    adAnalytics.addRevenueData({
      placementId: 'test-revenue',
      revenue: Math.random() * 50,
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      impressions: Math.floor(Math.random() * 500) + 50,
      clicks: Math.floor(Math.random() * 25) + 1,
      ctr: Math.random() * 3,
      cpm: Math.random() * 5,
    });
  };

  return (
    <div className="ad-test-component">
      <div className="test-header">
        <h3>Ad System Test</h3>
        <p>Verify that the ad monetization system is working correctly</p>
      </div>

      <div className="test-status">
        <div className="status-item">
          <span className="status-label">AdSense Loaded:</span>
          <span className={`status-value ${testResults.adSenseLoaded ? 'success' : 'error'}`}>
            {testResults.adSenseLoaded ? '✅ Yes' : '❌ No'}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">Analytics Working:</span>
          <span className={`status-value ${testResults.analyticsWorking ? 'success' : 'error'}`}>
            {testResults.analyticsWorking ? '✅ Yes' : '❌ No'}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">Events Tracked:</span>
          <span className="status-value">
            {testResults.eventsTracked}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">AdSense Enabled:</span>
          <span className={`status-value ${isAdEnabled ? 'success' : 'warning'}`}>
            {isAdEnabled ? '✅ Enabled' : '⚠️ Disabled'}
          </span>
        </div>
      </div>

      <div className="test-actions">
        <button 
          className="test-btn primary"
          onClick={runAdTest}
        >
          Test Ad Event
        </button>

        <button 
          className="test-btn secondary"
          onClick={addTestRevenue}
        >
          Add Test Revenue
        </button>

        <button 
          className="test-btn secondary"
          onClick={() => toggleAds(!isAdEnabled)}
        >
          {isAdEnabled ? 'Disable' : 'Enable'} AdSense
        </button>
      </div>

      <div className="test-info">
        <h4>Test Information</h4>
        <ul>
          <li>
            <strong>AdSense Status:</strong> 
            {testResults.adSenseLoaded 
              ? 'Google AdSense script is loaded and ready' 
              : 'AdSense script not detected. Check your configuration.'
            }
          </li>
          <li>
            <strong>Analytics Status:</strong> 
            {testResults.analyticsWorking 
              ? 'Revenue tracking is working correctly' 
              : 'Analytics system needs attention'
            }
          </li>
          <li>
            <strong>Environment:</strong> 
            {process.env.NODE_ENV === 'development' ? 'Development Mode' : 'Production Mode'}
          </li>
          <li>
            <strong>Client ID:</strong> 
            {process.env.REACT_APP_ADSENSE_CLIENT_ID || 'Not configured'}
          </li>
        </ul>
      </div>

      {!testResults.adSenseLoaded && (
        <div className="test-warning">
          <h4>⚠️ AdSense Not Loaded</h4>
          <p>This could be due to:</p>
          <ul>
            <li>AdSense script not included in HTML</li>
            <li>Client ID not configured</li>
            <li>Domain not approved by Google</li>
            <li>Ad blocker preventing script loading</li>
          </ul>
          <p>
            <strong>Next Steps:</strong>
            <br />
            1. Verify your AdSense account is approved
            <br />
            2. Update the client ID in your configuration
            <br />
            3. Check that the domain is verified in AdSense
            <br />
            4. Disable ad blockers for testing
          </p>
        </div>
      )}
    </div>
  );
};

export default AdTestComponent; 