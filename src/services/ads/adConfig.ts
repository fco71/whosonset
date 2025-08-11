import { AdPlacement } from '../../components/Ads/AdManager';
import { AdConfig } from '../../components/Ads/AdComponent';

// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  client: process.env.REACT_APP_ADSENSE_CLIENT_ID || 'ca-pub-9402509441119301', // Your real AdSense client ID
  enabled: process.env.REACT_APP_ADSENSE_ENABLED === 'true' || process.env.NODE_ENV === 'development',
  testMode: process.env.NODE_ENV === 'development',
};

// Debug: Log current configuration (commented out for production)
// console.log('[AdConfig] ADSENSE_CONFIG:', ADSENSE_CONFIG);
// console.log('[AdConfig] NODE_ENV:', process.env.NODE_ENV);

// Default ad configurations
export const DEFAULT_AD_CONFIGS: Record<string, AdConfig> = {
  headerBanner: {
    id: 'header-banner',
    type: 'adsense',
    position: 'header',
    size: 'banner',
    client: ADSENSE_CONFIG.client,
    slot: '1234567890', // Replace with your ad slot ID
    responsive: true,
  },
  
  sidebarRectangle: {
    id: 'sidebar-rectangle',
    type: 'adsense',
    position: 'sidebar',
    size: 'medium-rectangle',
    client: ADSENSE_CONFIG.client,
    slot: '1234567891', // Replace with your ad slot ID
    responsive: true,
  },
  
  contentInline: {
    id: 'content-inline',
    type: 'adsense',
    position: 'inline',
    size: 'responsive',
    client: ADSENSE_CONFIG.client,
    slot: '1234567892', // Replace with your ad slot ID
    responsive: true,
  },
  
  footerBanner: {
    id: 'footer-banner',
    type: 'adsense',
    position: 'footer',
    size: 'banner',
    client: ADSENSE_CONFIG.client,
    slot: '1234567893', // Replace with your ad slot ID
    responsive: true,
  },
  
  // Display ads (fallback when AdSense is not available)
  displayHeader: {
    id: 'display-header',
    type: 'display',
    position: 'header',
    size: 'banner',
  },
  
  displaySidebar: {
    id: 'display-sidebar',
    type: 'display',
    position: 'sidebar',
    size: 'medium-rectangle',
  },
  
  // Sponsored content
  sponsoredContent: {
    id: 'sponsored-content',
    type: 'sponsored',
    position: 'content',
    size: 'responsive',
  },
  
  // Resume download popup ad - optimized for high-value action
  resumeDownloadPopup: {
    id: 'resume-download-popup',
    type: 'adsense',
    position: 'content',
    size: 'large-rectangle', // 336x280 - good for popup
    client: ADSENSE_CONFIG.client,
    slot: 'resume-download-slot', // Replace with your ad slot ID
    responsive: true,
  },
  
  // High-performance ad sizes for better monetization
  leaderboard: {
    id: 'leaderboard-banner',
    type: 'adsense',
    position: 'header',
    size: 'leaderboard', // 728x90 - higher CPM
    client: ADSENSE_CONFIG.client,
    slot: 'leaderboard-slot',
    responsive: true,
  },
  
  wideSkyscraper: {
    id: 'wide-skyscraper',
    type: 'adsense',
    position: 'sidebar',
    size: 'wide-skyscraper', // 160x600 - premium sidebar
    client: ADSENSE_CONFIG.client,
    slot: 'wide-skyscraper-slot',
    responsive: true,
  },
  
  largeRectangle: {
    id: 'large-rectangle',
    type: 'adsense',
    position: 'content',
    size: 'large-rectangle', // 336x280 - high engagement
    client: ADSENSE_CONFIG.client,
    slot: 'large-rectangle-slot',
    responsive: true,
  },
};

// Ad placement strategies
export const AD_PLACEMENTS: AdPlacement[] = [
  // Header leaderboard - highest priority, better CPM
  {
    id: 'header-leaderboard',
    position: 'header',
    config: DEFAULT_AD_CONFIGS.leaderboard,
    enabled: true, // Always enabled for testing
    priority: 100,
  },
  
  // Sidebar wide skyscraper - premium placement
  {
    id: 'sidebar-wide-skyscraper',
    position: 'sidebar',
    config: DEFAULT_AD_CONFIGS.wideSkyscraper,
    enabled: ADSENSE_CONFIG.enabled,
    priority: 80,
  },
  
  // Content inline ads
  {
    id: 'content-inline-1',
    position: 'inline',
    config: DEFAULT_AD_CONFIGS.contentInline,
    enabled: ADSENSE_CONFIG.enabled,
    priority: 60,
  },
  
  {
    id: 'content-inline-2',
    position: 'inline',
    config: DEFAULT_AD_CONFIGS.contentInline,
    enabled: ADSENSE_CONFIG.enabled,
    priority: 40,
  },
  
  // Footer banner
  {
    id: 'footer-banner',
    position: 'footer',
    config: DEFAULT_AD_CONFIGS.footerBanner,
    enabled: ADSENSE_CONFIG.enabled,
    priority: 20,
  },
  
  // Fallback display ads - only show one per position
  {
    id: 'display-header-fallback',
    position: 'header',
    config: DEFAULT_AD_CONFIGS.displayHeader,
    enabled: (!ADSENSE_CONFIG.enabled || process.env.NODE_ENV === 'development') && false, // Disabled to prevent duplicates
    priority: 90,
  },
  
  {
    id: 'display-sidebar-fallback',
    position: 'sidebar',
    config: DEFAULT_AD_CONFIGS.displaySidebar,
    enabled: (!ADSENSE_CONFIG.enabled || process.env.NODE_ENV === 'development') && false, // Disabled to prevent duplicates
    priority: 70,
  },
  
  // Sponsored content
  {
    id: 'sponsored-content-1',
    position: 'content',
    config: DEFAULT_AD_CONFIGS.sponsoredContent,
    enabled: true, // Always enabled as fallback
    priority: 30,
  },
  
  // Resume download popup ad
  {
    id: 'resume-download-popup',
    position: 'content',
    config: DEFAULT_AD_CONFIGS.resumeDownloadPopup,
    enabled: ADSENSE_CONFIG.enabled,
    priority: 50,
  },
];

// Page-specific ad configurations
export const PAGE_AD_CONFIGS: Record<string, AdPlacement[]> = {
  home: [
    {
      id: 'home-hero-banner',
      position: 'header',
      config: DEFAULT_AD_CONFIGS.headerBanner,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 100,
    },
    {
      id: 'home-sidebar',
      position: 'sidebar',
      config: DEFAULT_AD_CONFIGS.sidebarRectangle,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 80,
    },
  ],
  
  projects: [
    {
      id: 'projects-header',
      position: 'header',
      config: DEFAULT_AD_CONFIGS.headerBanner,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 100,
    },
    {
      id: 'projects-sidebar',
      position: 'sidebar',
      config: DEFAULT_AD_CONFIGS.sidebarRectangle,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 80,
    },
    {
      id: 'projects-content-1',
      position: 'inline',
      config: DEFAULT_AD_CONFIGS.contentInline,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 60,
    },
  ],
  
  crew: [
    {
      id: 'crew-header',
      position: 'header',
      config: DEFAULT_AD_CONFIGS.headerBanner,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 100,
    },
    {
      id: 'crew-sidebar',
      position: 'sidebar',
      config: DEFAULT_AD_CONFIGS.sidebarRectangle,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 80,
    },
  ],
  
  social: [
    {
      id: 'social-header',
      position: 'header',
      config: DEFAULT_AD_CONFIGS.headerBanner,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 100,
    },
    {
      id: 'social-content-1',
      position: 'inline',
      config: DEFAULT_AD_CONFIGS.contentInline,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 70,
    },
    {
      id: 'social-content-2',
      position: 'inline',
      config: DEFAULT_AD_CONFIGS.contentInline,
      enabled: ADSENSE_CONFIG.enabled,
      priority: 50,
    },
  ],
};

// Ad loading and error handling
export const AD_LOADING_CONFIG = {
  timeout: 5000, // 5 seconds timeout
  retryAttempts: 3,
  retryDelay: 1000, // 1 second between retries
  enableAnalytics: true,
  trackPerformance: true,
};

// Ad performance tracking
export interface AdPerformanceMetrics {
  placementId: string;
  loadTime: number;
  viewability: number;
  clicks: number;
  impressions: number;
  revenue: number;
  timestamp: Date;
}

// Ad revenue tracking
export interface AdRevenueData {
  placementId: string;
  revenue: number;
  currency: string;
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
} 