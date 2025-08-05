// Global type declarations for external libraries and APIs

declare global {
  interface Window {
    // Google AdSense
    adsbygoogle: any[];
    
    // Google Analytics (gtag)
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    
    // Firebase Analytics
    firebase?: {
      analytics: () => {
        logEvent: (eventName: string, parameters?: Record<string, any>) => void;
      };
    };
    
    // Google Tag Manager
    dataLayer: any[];
    
    // Custom analytics events
    trackAdEvent?: (eventType: string, data: any) => void;
  }
}

// AdSense specific types
export interface AdSenseConfig {
  client: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  fullWidthResponsive?: boolean;
}

// Analytics event types
export interface AnalyticsEvent {
  type: string;
  placementId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Revenue tracking types
export interface RevenueData {
  placementId: string;
  revenue: number;
  currency: string;
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
}

export {}; 