import React from 'react';
import { useAds } from './AdProvider';
import AdComponent, { AdConfig } from './AdComponent';
import './StrategicAdBanner.scss';

interface StrategicAdBannerProps {
  position: 'top' | 'bottom' | 'sidebar' | 'inline' | 'hero';
  style?: 'minimal' | 'prominent' | 'subtle' | 'featured';
  title?: string;
  subtitle?: string;
  className?: string;
  showBorder?: boolean;
  showBackground?: boolean;
  responsive?: boolean;
}

const StrategicAdBanner: React.FC<StrategicAdBannerProps> = ({
  position,
  style = 'minimal',
  title,
  subtitle,
  className = '',
  showBorder = true,
  showBackground = true,
  responsive = true
}) => {
  const { trackAdEvent } = useAds();

  const getAdConfig = (): AdConfig => {
    const baseConfig = {
      client: process.env.REACT_APP_ADSENSE_CLIENT_ID,
      responsive: responsive,
    };

    switch (position) {
      case 'top':
        return {
          ...baseConfig,
          id: 'strategic-top-banner',
          type: 'adsense' as const,
          position: 'header',
          size: 'banner',
          slot: 'strategic-top-slot',
        };
      
      case 'bottom':
        return {
          ...baseConfig,
          id: 'strategic-bottom-banner',
          type: 'adsense' as const,
          position: 'footer',
          size: 'banner',
          slot: 'strategic-bottom-slot',
        };
      
      case 'sidebar':
        return {
          ...baseConfig,
          id: 'strategic-sidebar-banner',
          type: 'adsense' as const,
          position: 'sidebar',
          size: 'medium-rectangle',
          slot: 'strategic-sidebar-slot',
        };
      
      case 'inline':
        return {
          ...baseConfig,
          id: 'strategic-inline-banner',
          type: 'adsense' as const,
          position: 'inline',
          size: 'responsive',
          slot: 'strategic-inline-slot',
        };
      
      case 'hero':
        return {
          ...baseConfig,
          id: 'strategic-hero-banner',
          type: 'adsense' as const,
          position: 'content',
          size: 'large-rectangle',
          slot: 'strategic-hero-slot',
        };
      
      default:
        return {
          ...baseConfig,
          id: 'strategic-default-banner',
          type: 'adsense' as const,
          position: 'content',
          size: 'responsive',
          slot: 'strategic-default-slot',
        };
    }
  };

  const handleAdEvent = (eventType: 'load' | 'error' | 'click') => {
    trackAdEvent(`strategic-${position}-banner`, eventType);
  };

  return (
    <div className={`strategic-ad-banner strategic-${position} strategic-${style} ${className}`}>
      {(title || subtitle) && (
        <div className="banner-header">
          {title && <h3 className="banner-title">{title}</h3>}
          {subtitle && <p className="banner-subtitle">{subtitle}</p>}
        </div>
      )}
      
      <div className="banner-content">
        <AdComponent
          config={getAdConfig()}
          onAdLoad={() => handleAdEvent('load')}
          onAdError={(error) => handleAdEvent('error')}
          className={`strategic-ad strategic-${style}`}
        />
      </div>
    </div>
  );
};

export default StrategicAdBanner; 