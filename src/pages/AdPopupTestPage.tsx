import React, { useState } from 'react';
import ResumeDownloadButton from '../components/ResumeDownloadButton';
import './AdPopupTestPage.scss';

const AdPopupTestPage: React.FC = () => {
  const [testCount, setTestCount] = useState(0);

  const handleTestClick = () => {
    setTestCount(prev => prev + 1);
    console.log('Test button clicked!');
  };

  return (
    <div className="ad-popup-test-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 Ad Popup Test Page
          </h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Test Resume Download with Ad Popup
            </h2>
            
            <p className="text-gray-600 mb-8">
              Click the download button below to test the ad popup functionality. 
              You should see a full-page popup with a 5-second countdown before the download starts.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Test Download Button</h3>
                <ResumeDownloadButton
                  resumeUrl="/api/resume/test"
                  fileName="test-resume.pdf"
                  variant="primary"
                  size="medium"
                  showAdPopup={true}
                />
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Debug Info</h3>
              <p className="text-blue-700 text-sm">
                Test count: {testCount} | 
                Ad popup should appear when you click any download button above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPopupTestPage; 