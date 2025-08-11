import { AdPerformanceMetrics, AdRevenueData } from './adConfig';

export interface AdAnalyticsEvent {
  type: 'impression' | 'click' | 'view' | 'error' | 'load';
  placementId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AdRevenueReport {
  totalRevenue: number;
  currency: string;
  period: 'daily' | 'weekly' | 'monthly';
  placements: AdRevenueData[];
  summary: {
    totalImpressions: number;
    totalClicks: number;
    averageCTR: number;
    averageCPM: number;
  };
}

class AdAnalytics {
  private events: AdAnalyticsEvent[] = [];
  private performanceMetrics: Map<string, AdPerformanceMetrics> = new Map();
  private revenueData: AdRevenueData[] = [];

  // Track ad events
  trackEvent(event: AdAnalyticsEvent) {
    this.events.push(event);
    
    // Send to analytics service if configured
    if (process.env.REACT_APP_ANALYTICS_ENABLED === 'true') {
      this.sendToAnalytics(event);
    }
    
    // Store locally for reporting
    this.storeEvent(event);
  }

  // Track ad impression
  trackImpression(placementId: string, metadata?: Record<string, any>) {
    this.trackEvent({
      type: 'impression',
      placementId,
      timestamp: new Date(),
      metadata,
    });
  }

  // Track ad click
  trackClick(placementId: string, metadata?: Record<string, any>) {
    this.trackEvent({
      type: 'click',
      placementId,
      timestamp: new Date(),
      metadata,
    });
  }

  // Track ad view (viewability)
  trackView(placementId: string, viewability: number, metadata?: Record<string, any>) {
    this.trackEvent({
      type: 'view',
      placementId,
      timestamp: new Date(),
      metadata: { viewability, ...metadata },
    });
  }

  // Track ad load
  trackLoad(placementId: string, loadTime: number, metadata?: Record<string, any>) {
    this.trackEvent({
      type: 'load',
      placementId,
      timestamp: new Date(),
      metadata: { loadTime, ...metadata },
    });
  }

  // Track ad error
  trackError(placementId: string, error: any, metadata?: Record<string, any>) {
    this.trackEvent({
      type: 'error',
      placementId,
      timestamp: new Date(),
      metadata: { error: error?.message || error, ...metadata },
    });
  }

  // Update performance metrics
  updatePerformanceMetrics(placementId: string, metrics: Partial<AdPerformanceMetrics>) {
    const existing = this.performanceMetrics.get(placementId) || {
      placementId,
      loadTime: 0,
      viewability: 0,
      clicks: 0,
      impressions: 0,
      revenue: 0,
      timestamp: new Date(),
    };

    this.performanceMetrics.set(placementId, {
      ...existing,
      ...metrics,
      timestamp: new Date(),
    });
  }

  // Add revenue data
  addRevenueData(data: AdRevenueData) {
    this.revenueData.push(data);
  }

  // Get performance metrics for a placement
  getPerformanceMetrics(placementId: string): AdPerformanceMetrics | undefined {
    return this.performanceMetrics.get(placementId);
  }

  // Get all performance metrics
  getAllPerformanceMetrics(): AdPerformanceMetrics[] {
    return Array.from(this.performanceMetrics.values());
  }

  // Get revenue report
  getRevenueReport(period: 'daily' | 'weekly' | 'monthly' = 'daily'): AdRevenueReport {
    const now = new Date();
    const filteredData = this.revenueData.filter(data => {
      const dataDate = new Date(data.date);
      switch (period) {
        case 'daily':
          return dataDate.toDateString() === now.toDateString();
        case 'weekly':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return dataDate >= weekAgo;
        case 'monthly':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return dataDate >= monthAgo;
        default:
          return true;
      }
    });

    const totalRevenue = filteredData.reduce((sum, data) => sum + data.revenue, 0);
    const totalImpressions = filteredData.reduce((sum, data) => sum + data.impressions, 0);
    const totalClicks = filteredData.reduce((sum, data) => sum + data.clicks, 0);
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averageCPM = totalImpressions > 0 ? (totalRevenue / totalImpressions) * 1000 : 0;

    return {
      totalRevenue,
      currency: filteredData[0]?.currency || 'USD',
      period,
      placements: filteredData,
      summary: {
        totalImpressions,
        totalClicks,
        averageCTR,
        averageCPM,
      },
    };
  }

  // Get events for a specific placement
  getEventsForPlacement(placementId: string): AdAnalyticsEvent[] {
    return this.events.filter(event => event.placementId === placementId);
  }

  // Get events by type
  getEventsByType(type: AdAnalyticsEvent['type']): AdAnalyticsEvent[] {
    return this.events.filter(event => event.type === type);
  }

  // Get recent events
  getRecentEvents(limit: number = 100): AdAnalyticsEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Clear old events (keep last 1000 events)
  clearOldEvents() {
    if (this.events.length > 1000) {
      this.events = this.events
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 1000);
    }
  }

  // Export analytics data
  exportAnalyticsData() {
    return {
      events: this.events,
      performanceMetrics: Array.from(this.performanceMetrics.values()),
      revenueData: this.revenueData,
      exportDate: new Date(),
    };
  }

  // Send event to external analytics service
  private sendToAnalytics(event: AdAnalyticsEvent) {
    // Implementation for sending to Google Analytics, Firebase Analytics, etc.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_' + event.type, {
        placement_id: event.placementId,
        event_timestamp: event.timestamp.toISOString(),
        ...event.metadata,
      });
    }

    // Send to Firebase Analytics if available
    if (typeof window !== 'undefined' && window.firebase?.analytics) {
      window.firebase.analytics().logEvent('ad_' + event.type, {
        placement_id: event.placementId,
        ...event.metadata,
      });
    }
  }

  // Store event locally
  private storeEvent(event: AdAnalyticsEvent) {
    // Store in localStorage for persistence
    try {
      const storedEvents = JSON.parse(localStorage.getItem('ad_analytics_events') || '[]');
      storedEvents.push({
        ...event,
        timestamp: event.timestamp.toISOString(),
      });
      
      // Keep only last 1000 events
      if (storedEvents.length > 1000) {
        storedEvents.splice(0, storedEvents.length - 1000);
      }
      
      localStorage.setItem('ad_analytics_events', JSON.stringify(storedEvents));
    } catch (error) {
      console.error('Failed to store ad analytics event:', error);
    }
  }

  // Load stored events
  loadStoredEvents() {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('ad_analytics_events') || '[]');
      this.events = storedEvents.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }));
    } catch (error) {
      console.error('Failed to load stored ad analytics events:', error);
    }
  }
}

// Create singleton instance
export const adAnalytics = new AdAnalytics();

// Load stored events on initialization
adAnalytics.loadStoredEvents();

// Clean up old events periodically
setInterval(() => {
  adAnalytics.clearOldEvents();
}, 60000); // Every minute 