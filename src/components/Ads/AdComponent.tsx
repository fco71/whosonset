import React, { useEffect, useRef, useState } from 'react';
import './AdComponent.scss';

export interface AdConfig {
  id: string;
  type: 'adsense' | 'display' | 'sponsored' | 'banner';
  position: 'header' | 'sidebar' | 'footer' | 'content' | 'inline';
  size: 'banner' | 'medium-rectangle' | 'large-rectangle' | 'leaderboard' | 'skyscraper' | 'wide-skyscraper' | 'responsive';
  client?: string; // AdSense client ID
  slot?: string; // AdSense ad slot
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface AdComponentProps {
  config: AdConfig;
  className?: string;
  style?: React.CSSProperties;
  onAdLoad?: () => void;
  onAdError?: (error: any) => void;
}

const AdComponent: React.FC<AdComponentProps> = ({
  config,
  className = '',
  style = {},
  onAdLoad,
  onAdError
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (config.type === 'adsense' && window.adsbygoogle && adRef.current && !hasLoaded) {
      // Check if this ad element already has ads loaded
      const adElement = adRef.current.querySelector('ins.adsbygoogle');
      if (adElement && !adElement.hasAttribute('data-ad-status')) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setHasLoaded(true);
          onAdLoad?.();
        } catch (error) {
          console.error('AdSense error:', error);
          onAdError?.(error);
        }
      }
    }
  }, [config.id, onAdLoad, onAdError, hasLoaded]);

  const getAdSize = () => {
    switch (config.size) {
      case 'banner':
        return { width: 728, height: 90 };
      case 'medium-rectangle':
        return { width: 300, height: 250 };
      case 'large-rectangle':
        return { width: 336, height: 280 };
      case 'leaderboard':
        return { width: 728, height: 90 };
      case 'skyscraper':
        return { width: 160, height: 600 };
      case 'wide-skyscraper':
        return { width: 160, height: 600 }; // Same as skyscraper but with different name
      case 'responsive':
        return { width: 'auto', height: 'auto' };
      default:
        return { width: 300, height: 250 };
    }
  };

  const renderAdSense = () => {
    const { width, height } = getAdSize();
    
    return (
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
        data-ad-client={config.client}
        data-ad-slot={config.slot}
        data-ad-format="auto"
        data-full-width-responsive={config.responsive ? "true" : "false"}
      />
    );
  };

  const renderPlaceholderAd = () => {
    const { width, height } = getAdSize();
    return (
      <div 
        className="ad-placeholder"
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          backgroundColor: '#f0f0f0',
          border: '2px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px',
          textAlign: 'center',
          padding: '10px'
        }}
      >
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Ad Space</div>
          <div style={{ fontSize: '12px' }}>{config.id}</div>
          <div style={{ fontSize: '10px', marginTop: '5px' }}>{typeof width === 'number' ? width : 'auto'} × {typeof height === 'number' ? height : 'auto'}</div>
        </div>
      </div>
    );
  };

  const renderDisplayAd = () => {
    return (
      <div className="ad-display">
        <div className="ad-label">Advertisement</div>
        <div className="ad-content">
          {/* Placeholder for display ads */}
          <div className="ad-placeholder">
            <div className="ad-placeholder-text">Ad Space</div>
          </div>
        </div>
      </div>
    );
  };

  const renderSponsoredContent = () => {
    return (
      <div className="ad-sponsored">
        <div className="sponsored-label">Sponsored</div>
        <div className="sponsored-content">
          {/* Placeholder for sponsored content */}
          <div className="sponsored-placeholder">
            <div className="sponsored-placeholder-text">Sponsored Content</div>
          </div>
        </div>
      </div>
    );
  };

  const renderAd = () => {
    switch (config.type) {
      case 'adsense':
        // Show placeholder if AdSense is not available or in development
        if (!window.adsbygoogle || process.env.NODE_ENV === 'development') {
          return renderPlaceholderAd();
        }
        return renderAdSense();
      case 'display':
        return renderDisplayAd();
      case 'sponsored':
        return renderSponsoredContent();
      default:
        return renderDisplayAd();
    }
  };

  return (
    <div
      ref={adRef}
      className={`ad-component ad-${config.position} ${className}`}
      style={style}
      data-ad-id={config.id}
      key={`ad-${config.id}-${config.type}`}
    >
      {renderAd()}
    </div>
  );
};

export default AdComponent; 