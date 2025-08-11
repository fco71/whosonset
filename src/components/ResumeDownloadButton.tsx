import React, { useState } from 'react';
import AdPopup from './Ads/AdPopup';
import './ResumeDownloadButton.scss';

interface ResumeDownloadButtonProps {
  resumeUrl: string;
  fileName?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  showAdPopup?: boolean;
  adConfig?: any;
  onCustomDownload?: () => void;
}

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  resumeUrl,
  fileName = 'resume.pdf',
  className = '',
  variant = 'primary',
  size = 'medium',
  showAdPopup = true,
  adConfig,
  onCustomDownload
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = () => {
    if (showAdPopup) {
      setShowPopup(true);
    } else {
      downloadResume();
    }
  };

  const downloadResume = () => {
    setIsDownloading(true);
    
    if (onCustomDownload) {
      // Use custom download function if provided
      onCustomDownload();
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = fileName;
      link.target = '_blank';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Reset state after a short delay
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  const handlePopupContinue = () => {
    setShowPopup(false);
    downloadResume();
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const getButtonClasses = () => {
    const baseClasses = `resume-download-btn btn-${variant} btn-${size}`;
    return `${baseClasses} ${className}`.trim();
  };

  return (
    <>
      <button
        className={getButtonClasses()}
        onClick={handleDownloadClick}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <span className="loading-spinner"></span>
            Downloading...
          </>
        ) : (
          <>
            <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Resume
          </>
        )}
      </button>

      {showAdPopup && (
        <div className="download-disclaimer">
          <p>
            <small>
              💡 <strong>Free Service:</strong> This resume download is completely free. 
              You may be prompted to view a short advertisement to support our service.
            </small>
          </p>
        </div>
      )}

      <AdPopup
        isOpen={showPopup}
        onClose={handlePopupClose}
        onContinue={handlePopupContinue}
        title="Download Resume"
        message="Please view this short advertisement to continue with your free download."
        disclaimer="This service is free but you might be prompted to view a short ad upon pressing download."
        adConfig={adConfig}
        showCountdown={true}
        countdownSeconds={5}
      />
    </>
  );
};

export default ResumeDownloadButton; 