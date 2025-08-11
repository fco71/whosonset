import React, { useState, useEffect } from 'react';
import { useAds } from './AdProvider';
import AdComponent from './AdComponent';
import './AdPopup.scss';

interface AdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  title?: string;
  message?: string;
  disclaimer?: string;
  adConfig?: any;
  showCountdown?: boolean;
  countdownSeconds?: number;
}

const AdPopup: React.FC<AdPopupProps> = ({
  isOpen,
  onClose,
  onContinue,
  title = "Download Resume",
  message = "Please view this short advertisement to continue with your free download.",
  disclaimer = "This service is free but you might be prompted to view a short ad upon pressing download.",
  adConfig,
  showCountdown = true,
  countdownSeconds = 5
}) => {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [canContinue, setCanContinue] = useState(false);
  const { trackAdEvent } = useAds();

  useEffect(() => {
    if (isOpen && showCountdown) {
      setCountdown(countdownSeconds);
      setCanContinue(false);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanContinue(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, showCountdown, countdownSeconds]);

  const handleContinue = () => {
    trackAdEvent('resume-download-ad', 'click');
    onContinue();
  };

  const handleClose = () => {
    trackAdEvent('resume-download-ad', 'click');
    onClose();
  };

  const defaultAdConfig = {
    id: 'resume-download-popup',
    type: 'adsense',
    position: 'content',
    size: 'large-rectangle',
    client: process.env.REACT_APP_ADSENSE_CLIENT_ID,
    slot: 'resume-download-slot', // You'll need to create this ad unit
    responsive: true,
  };

  if (!isOpen) return null;

  return (
    <div className="ad-popup-overlay">
      <div className="ad-popup-container">
        <div className="ad-popup-header">
          <h2>{title}</h2>
          <button 
            className="close-button"
            onClick={handleClose}
            aria-label="Close popup"
          >
            ×
          </button>
        </div>

        <div className="ad-popup-content">
          <div className="ad-popup-message">
            <p>{message}</p>
          </div>

          <div className="ad-popup-ad">
            <AdComponent
              config={adConfig || defaultAdConfig}
              onAdLoad={() => trackAdEvent('resume-download-ad', 'load')}
              onAdError={(error) => trackAdEvent('resume-download-ad', 'error')}
            />
          </div>

          {showCountdown && (
            <div className="ad-popup-countdown">
              <p>
                {canContinue 
                  ? "You can now continue with your download."
                  : `Please wait ${countdown} seconds before continuing...`
                }
              </p>
              {!canContinue && (
                <div className="countdown-bar">
                  <div 
                    className="countdown-progress"
                    style={{ 
                      width: `${((countdownSeconds - countdown) / countdownSeconds) * 100}%` 
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="ad-popup-disclaimer">
            <p>{disclaimer}</p>
          </div>
        </div>

        <div className="ad-popup-actions">
          <button
            className="continue-button"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            {canContinue ? "Continue Download" : `Wait ${countdown}s`}
          </button>
          
          <button
            className="cancel-button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdPopup; 