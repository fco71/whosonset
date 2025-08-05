import React, { useState } from 'react';
import StrategicAdBanner from '../components/Ads/StrategicAdBanner';
import ResumeDownloadButton from '../components/ResumeDownloadButton';
import './AdPlacementDemoPage.scss';

const AdPlacementDemoPage: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<'minimal' | 'prominent' | 'subtle' | 'featured'>('minimal');

  const sampleResumeUrl = 'https://example.com/sample-resume.pdf';

  return (
    <div className="ad-placement-demo-page">
      <div className="demo-header">
        <h1>Strategic Ad Placement Demo</h1>
        <p>Showcasing tasteful and strategic ad placements across different page sections</p>
      </div>

      {/* Top Banner Ad */}
      <StrategicAdBanner
        position="top"
        style={selectedStyle}
        title="Featured Opportunity"
        subtitle="Discover amazing film industry opportunities"
      />

      <div className="demo-content">
        <div className="content-section">
          <h2>Content Section 1</h2>
          <p>
            This is a sample content section demonstrating how ads can be tastefully integrated 
            into the page layout without disrupting the user experience. The ads are positioned 
            strategically to maximize visibility while maintaining content readability.
          </p>
          
          {/* Inline Ad */}
          <StrategicAdBanner
            position="inline"
            style={selectedStyle}
            title="Industry Insights"
            subtitle="Stay updated with the latest trends"
          />
          
          <p>
            The inline ad above demonstrates how advertisements can be seamlessly integrated 
            within content sections. This placement ensures high visibility while maintaining 
            the natural flow of the content.
          </p>
        </div>

        <div className="content-section">
          <h2>Resume Download Feature</h2>
          <p>
            Below is an example of the resume download functionality with integrated ad popup. 
            This feature provides value to users while generating revenue through tasteful 
            advertising.
          </p>
          
          <div className="resume-download-demo">
            <h3>Sample Resume Download</h3>
            <p>Click the button below to see the ad popup in action:</p>
            
            <ResumeDownloadButton
              resumeUrl={sampleResumeUrl}
              fileName="sample-resume.pdf"
              variant="primary"
              size="large"
              showAdPopup={true}
            />
          </div>
        </div>

        <div className="content-section">
          <h2>Content Section 2</h2>
          <p>
            Another content section showing how multiple ad placements can work together 
            to create a comprehensive monetization strategy. Each placement is carefully 
            chosen to balance user experience with revenue generation.
          </p>
          
          <p>
            The strategic placement of ads ensures that users can easily distinguish 
            between content and advertisements while still providing valuable exposure 
            for advertisers.
          </p>
        </div>
      </div>

      {/* Sidebar Ad */}
      <div className="demo-sidebar">
        <h3>Sidebar Section</h3>
        <StrategicAdBanner
          position="sidebar"
          style={selectedStyle}
          title="Sidebar Promotion"
          subtitle="Special offers and opportunities"
        />
        
        <div className="sidebar-content">
          <h4>Additional Features</h4>
          <ul>
            <li>Professional networking</li>
            <li>Industry insights</li>
            <li>Career opportunities</li>
            <li>Skill development</li>
          </ul>
        </div>
      </div>

      {/* Bottom Banner Ad */}
      <StrategicAdBanner
        position="bottom"
        style={selectedStyle}
        title="Stay Connected"
        subtitle="Join our community for more opportunities"
      />

      {/* Style Selector */}
      <div className="style-selector">
        <h3>Ad Style Options</h3>
        <p>Choose different ad styles to see how they affect the user experience:</p>
        
        <div className="style-buttons">
          <button
            className={selectedStyle === 'minimal' ? 'active' : ''}
            onClick={() => setSelectedStyle('minimal')}
          >
            Minimal
          </button>
          <button
            className={selectedStyle === 'subtle' ? 'active' : ''}
            onClick={() => setSelectedStyle('subtle')}
          >
            Subtle
          </button>
          <button
            className={selectedStyle === 'prominent' ? 'active' : ''}
            onClick={() => setSelectedStyle('prominent')}
          >
            Prominent
          </button>
          <button
            className={selectedStyle === 'featured' ? 'active' : ''}
            onClick={() => setSelectedStyle('featured')}
          >
            Featured
          </button>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="implementation-guide">
        <h3>Implementation Guide</h3>
        <div className="guide-content">
          <div className="guide-section">
            <h4>1. Strategic Banner Placement</h4>
            <p>
              Use <code>StrategicAdBanner</code> component with different positions:
            </p>
            <ul>
              <li><code>position="top"</code> - Header banner</li>
              <li><code>position="bottom"</code> - Footer banner</li>
              <li><code>position="sidebar"</code> - Sidebar placement</li>
              <li><code>position="inline"</code> - Content integration</li>
              <li><code>position="hero"</code> - Featured placement</li>
            </ul>
          </div>

          <div className="guide-section">
            <h4>2. Resume Download Integration</h4>
            <p>
              Use <code>ResumeDownloadButton</code> component for resume downloads:
            </p>
            <pre>
{`<ResumeDownloadButton
  resumeUrl="https://example.com/resume.pdf"
  fileName="resume.pdf"
  variant="primary"
  size="large"
  showAdPopup={true}
/>`}
            </pre>
          </div>

          <div className="guide-section">
            <h4>3. Ad Popup Configuration</h4>
            <p>
              The ad popup automatically shows with a 5-second countdown and proper disclaimer.
              Users must wait for the countdown to complete before downloading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPlacementDemoPage; 