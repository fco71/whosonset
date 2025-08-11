import React, { useState } from 'react';
import StrategicAdBanner from '../components/Ads/StrategicAdBanner';
import ResumeDownloadButton from '../components/ResumeDownloadButton';
import AdTestComponent from '../components/Ads/AdTestComponent';
import AdDebugComponent from '../components/Ads/AdDebugComponent';
import './AdTestPage.scss';

const AdTestPage: React.FC = () => {
  const [showAdPopup, setShowAdPopup] = useState(false);

  return (
    <div className="ad-test-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎬 Ad Monetization Test Page
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This page demonstrates all the ad components and monetization features. 
              You can see strategic ad banners, resume download buttons with ad popups, and test the ad system.
            </p>
          </div>

          {/* Top Strategic Ad Banner */}
          <StrategicAdBanner
            position="top"
            style="prominent"
            title="Featured Opportunity"
            subtitle="Discover amazing film industry opportunities"
          />

          {/* Test Component */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔧 Ad System Test
            </h2>
            <AdTestComponent />
          </div>

          {/* Debug Component */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🐛 Debug Information
            </h2>
            <AdDebugComponent />
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  📄 Resume Download Demo
                </h2>
                <p className="text-gray-600 mb-6">
                  Click the download button below to test the ad popup functionality. 
                  You'll see a 5-second countdown with an ad before the download starts.
                </p>
                
                <div className="space-y-4">
                  <ResumeDownloadButton
                    resumeUrl="/api/resume/sample"
                    fileName="sample-resume.pdf"
                    variant="primary"
                    size="medium"
                    showAdPopup={true}
                  />
                  
                  <ResumeDownloadButton
                    resumeUrl="/api/resume/sample"
                    fileName="sample-resume.pdf"
                    variant="outline"
                    size="small"
                    showAdPopup={true}
                  />
                  
                  <ResumeDownloadButton
                    resumeUrl="/api/resume/sample"
                    fileName="sample-resume.pdf"
                    variant="secondary"
                    size="large"
                    showAdPopup={true}
                  />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  📊 Ad Analytics
                </h2>
                <p className="text-gray-600 mb-4">
                  Track ad performance and revenue in real-time.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-900">Impressions</span>
                    <span className="text-lg font-bold text-blue-600">1,234</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-900">Clicks</span>
                    <span className="text-lg font-bold text-green-600">89</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-900">CTR</span>
                    <span className="text-lg font-bold text-purple-600">7.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-900">Revenue</span>
                    <span className="text-lg font-bold text-orange-600">$45.67</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Ad Banners Showcase */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                🎨 Strategic Ad Banner Styles
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Minimal Style</h3>
                  <StrategicAdBanner
                    position="inline"
                    style="minimal"
                    title="Clean & Simple"
                    subtitle="Unobtrusive advertising"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Subtle Style</h3>
                  <StrategicAdBanner
                    position="inline"
                    style="subtle"
                    title="Light Background"
                    subtitle="Gentle visual integration"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Prominent Style</h3>
                  <StrategicAdBanner
                    position="inline"
                    style="prominent"
                    title="Featured Content"
                    subtitle="High-visibility placement"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Featured Style</h3>
                  <StrategicAdBanner
                    position="inline"
                    style="featured"
                    title="Premium Placement"
                    subtitle="Gradient-enhanced design"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Strategic Ad Banner */}
          <StrategicAdBanner
            position="bottom"
            style="minimal"
            title="Stay Connected"
            subtitle="Join our community for more opportunities"
          />

          {/* Implementation Guide */}
          <div className="bg-gray-50 rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📚 Implementation Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Strategic Ad Banners</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`<StrategicAdBanner
  position="inline"
  style="prominent"
  title="Your Title"
  subtitle="Your subtitle"
/>`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Resume Download Button</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`<ResumeDownloadButton
  resumeUrl="/api/resume/user-id"
  fileName="user-resume.pdf"
  variant="primary"
  size="medium"
  showAdPopup={true}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdTestPage; 