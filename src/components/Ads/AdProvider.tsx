import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import AdManager, { AdPlacement } from './AdManager';
import { AD_PLACEMENTS, PAGE_AD_CONFIGS, ADSENSE_CONFIG } from '../../services/ads/adConfig';
import { adAnalytics } from '../../services/ads/adAnalytics';

interface AdContextType {
  placements: AdPlacement[];
  currentPagePlacements: AdPlacement[];
  isAdEnabled: boolean;
  toggleAds: (enabled: boolean) => void;
  getPlacementsForPage: (pageName: string) => AdPlacement[];
  trackAdEvent: (placementId: string, eventType: 'impression' | 'click' | 'view' | 'error' | 'load') => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

interface AdProviderProps {
  children: ReactNode;
}

export const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const [placements, setPlacements] = useState<AdPlacement[]>(AD_PLACEMENTS);
  const [isAdEnabled, setIsAdEnabled] = useState(ADSENSE_CONFIG.enabled);
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || !isAdEnabled) {
      return;
    }

    const scriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CONFIG.client)}`;
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-adsense-script="true"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = scriptUrl;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-adsense-script', 'true');
    script.onerror = () => {
      // Ad blockers may block this request. Keep app runtime stable.
      console.warn('[AdProvider] AdSense script failed to load (often caused by ad blockers).');
    };

    document.head.appendChild(script);
  }, [isAdEnabled]);

  useEffect(() => {
    // Load ad preferences from localStorage
    const savedAdEnabled = localStorage.getItem('ads_enabled');
    if (savedAdEnabled !== null) {
      setIsAdEnabled(savedAdEnabled === 'true');
    }
  }, []);

  useEffect(() => {
    // Track page view for analytics
    adAnalytics.trackEvent({
      type: 'view',
      placementId: 'page-view',
      timestamp: new Date(),
      metadata: {
        path: location.pathname,
        page: getCurrentPageName(),
      },
    });
  }, [location.pathname]);

  const toggleAds = (enabled: boolean) => {
    setIsAdEnabled(enabled);
    localStorage.setItem('ads_enabled', enabled.toString());
    
    // Update placements based on ad enabled state
    const updatedPlacements = AD_PLACEMENTS.map(placement => ({
      ...placement,
      enabled: placement.config.type === 'adsense' ? enabled : placement.enabled,
    }));
    setPlacements(updatedPlacements);
  };

  const getCurrentPageName = (): string => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/projects')) return 'projects';
    if (path.startsWith('/crew')) return 'crew';
    if (path.startsWith('/social')) return 'social';
    if (path.startsWith('/analytics')) return 'analytics';
    return 'other';
  };

  const getPlacementsForPage = (pageName: string): AdPlacement[] => {
    const pageConfig = PAGE_AD_CONFIGS[pageName];
    if (pageConfig) {
      return pageConfig.filter(placement => 
        placement.enabled && (placement.config.type !== 'adsense' || isAdEnabled)
      );
    }
    
    // Return default placements if no page-specific config
    return placements.filter(placement => 
      placement.enabled && (placement.config.type !== 'adsense' || isAdEnabled)
    );
  };

  const trackAdEvent = (placementId: string, eventType: 'impression' | 'click' | 'view' | 'error' | 'load') => {
    adAnalytics.trackEvent({
      type: eventType,
      placementId,
      timestamp: new Date(),
      metadata: {
        page: getCurrentPageName(),
        path: location.pathname,
      },
    });
  };

  const currentPagePlacements = getPlacementsForPage(getCurrentPageName());

  const value: AdContextType = {
    placements,
    currentPagePlacements,
    isAdEnabled,
    toggleAds,
    getPlacementsForPage,
    trackAdEvent,
  };

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = (): AdContextType => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};

export default AdProvider; 
