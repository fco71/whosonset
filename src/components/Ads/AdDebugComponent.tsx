import React, { useState, useEffect } from 'react';
import StrategicAdBanner from './StrategicAdBanner';
import ResumeDownloadButton from '../ResumeDownloadButton';
import './AdDebugComponent.scss';

const AdDebugComponent: React.FC = () => {
  const [adSenseLoaded, setAdSenseLoaded] = useState(false);
  const [adErrors, setAdErrors] = useState<string[]>([]);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    setAdSenseLoaded(Boolean(window.adsbygoogle));
  }, []);

  const testAdPopup = () => {
    console.log('Testing ad popup...');
  };

  return (
    <div className="ad-debug-component">
      <div className="debug-header">
        <h3>🔧 Ad System Debug</h3>
        <div className="debug-stats">
          <span>Render Count: {renderCount}</span>
          <span>AdSense Loaded: {adSenseLoaded ? '✅' : '❌'}</span>
          <span>Errors: {adErrors.length}</span>
        </div>
      </div>

      <div className="debug-content">
        <div className="debug-section">
          <h4>Test Strategic Ad Banners</h4>
          <div className="ad-test-grid">
            <div>
              <h5>Minimal Style</h5>
              <StrategicAdBanner
                position="inline"
                style="minimal"
                title="Test Ad"
                subtitle="Debug test"
              />
            </div>
            <div>
              <h5>Prominent Style</h5>
              <StrategicAdBanner
                position="inline"
                style="prominent"
                title="Test Ad"
                subtitle="Debug test"
              />
            </div>
          </div>
        </div>

        <div className="debug-section">
          <h4>Test Resume Download</h4>
          <ResumeDownloadButton
            resumeUrl="/api/resume/test"
            fileName="test-resume.pdf"
            variant="primary"
            size="medium"
            showAdPopup={true}
          />
        </div>

        <div className="debug-section">
          <h4>Environment Info</h4>
          <div className="env-info">
            <div>NODE_ENV: {process.env.NODE_ENV}</div>
            <div>AdSense Client: {process.env.REACT_APP_ADSENSE_CLIENT_ID || 'Not set'}</div>
            <div>AdSense Enabled: {process.env.REACT_APP_ADSENSE_ENABLED || 'Not set'}</div>
          </div>
        </div>

        {adErrors.length > 0 && (
          <div className="debug-section">
            <h4>Errors</h4>
            <div className="error-list">
              {adErrors.map((error, index) => (
                <div key={index} className="error-item">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdDebugComponent; 