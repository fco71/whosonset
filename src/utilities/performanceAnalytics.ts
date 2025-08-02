interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'navigation' | 'api' | 'render' | 'user_interaction';
  metadata?: Record<string, any>;
}

interface UserInteraction {
  action: string;
  page: string;
  timestamp: number;
  duration?: number;
  success: boolean;
  error?: string;
}

class PerformanceAnalytics {
  private static instance: PerformanceAnalytics;
  private metrics: PerformanceMetric[] = [];
  private interactions: UserInteraction[] = [];
  private isEnabled: boolean = true;

  static getInstance(): PerformanceAnalytics {
    if (!PerformanceAnalytics.instance) {
      PerformanceAnalytics.instance = new PerformanceAnalytics();
    }
    return PerformanceAnalytics.instance;
  }

  /**
   * Track page load performance
   */
  trackPageLoad(pageName: string): void {
    if (!this.isEnabled) return;

    const navigationStart = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationStart) {
      const loadTime = navigationStart.loadEventEnd - navigationStart.loadEventStart;
      const domContentLoaded = navigationStart.domContentLoadedEventEnd - navigationStart.domContentLoadedEventStart;
      
      this.addMetric('page_load_time', loadTime, 'ms', 'navigation', { page: pageName });
      this.addMetric('dom_content_loaded', domContentLoaded, 'ms', 'navigation', { page: pageName });
    }
  }

  /**
   * Track API call performance
   */
  trackApiCall(endpoint: string, duration: number, success: boolean, error?: string): void {
    if (!this.isEnabled) return;

    this.addMetric('api_call_duration', duration, 'ms', 'api', { 
      endpoint, 
      success, 
      error 
    });
  }

  /**
   * Track component render time
   */
  trackRenderTime(componentName: string, duration: number): void {
    if (!this.isEnabled) return;

    this.addMetric('component_render_time', duration, 'ms', 'render', { 
      component: componentName 
    });
  }

  /**
   * Track user interactions
   */
  trackUserInteraction(action: string, page: string, duration?: number, success: boolean = true, error?: string): void {
    if (!this.isEnabled) return;

    const interaction: UserInteraction = {
      action,
      page,
      timestamp: Date.now(),
      duration,
      success,
      error
    };

    this.interactions.push(interaction);
    this.addMetric('user_interaction', duration || 0, 'ms', 'user_interaction', { 
      action, 
      page, 
      success, 
      error 
    });
  }

  /**
   * Track job application performance
   */
  trackJobApplication(jobId: string, duration: number, success: boolean): void {
    if (!this.isEnabled) return;

    this.trackUserInteraction('job_application', 'job_detail', duration, success);
    this.addMetric('job_application_time', duration, 'ms', 'user_interaction', { 
      jobId, 
      success 
    });
  }

  /**
   * Track search performance
   */
  trackSearch(query: string, resultsCount: number, duration: number): void {
    if (!this.isEnabled) return;

    this.addMetric('search_duration', duration, 'ms', 'user_interaction', { 
      query, 
      resultsCount 
    });
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    averagePageLoadTime: number;
    averageApiCallTime: number;
    averageRenderTime: number;
    totalInteractions: number;
    successRate: number;
  } {
    const pageLoads = this.metrics.filter(m => m.name === 'page_load_time');
    const apiCalls = this.metrics.filter(m => m.name === 'api_call_duration');
    const renders = this.metrics.filter(m => m.name === 'component_render_time');
    const interactions = this.metrics.filter(m => m.name === 'user_interaction');

    const averagePageLoadTime = pageLoads.length > 0 
      ? pageLoads.reduce((sum, m) => sum + m.value, 0) / pageLoads.length 
      : 0;

    const averageApiCallTime = apiCalls.length > 0 
      ? apiCalls.reduce((sum, m) => sum + m.value, 0) / apiCalls.length 
      : 0;

    const averageRenderTime = renders.length > 0 
      ? renders.reduce((sum, m) => sum + m.value, 0) / renders.length 
      : 0;

    const totalInteractions = interactions.length;
    const successfulInteractions = interactions.filter(m => m.metadata?.success).length;
    const successRate = totalInteractions > 0 ? (successfulInteractions / totalInteractions) * 100 : 0;

    return {
      averagePageLoadTime,
      averageApiCallTime,
      averageRenderTime,
      totalInteractions,
      successRate
    };
  }

  /**
   * Get metrics by category
   */
  getMetricsByCategory(category: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.category === category);
  }

  /**
   * Get recent interactions
   */
  getRecentInteractions(limit: number = 50): UserInteraction[] {
    return this.interactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): { metrics: PerformanceMetric[]; interactions: UserInteraction[] } {
    return {
      metrics: [...this.metrics],
      interactions: [...this.interactions]
    };
  }

  /**
   * Clear old metrics (keep last 1000)
   */
  clearOldMetrics(): void {
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
    if (this.interactions.length > 1000) {
      this.interactions = this.interactions.slice(-1000);
    }
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  private addMetric(name: string, value: number, unit: string, category: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      category: category as any,
      metadata
    };

    this.metrics.push(metric);
  }
}

// Performance monitoring hooks
export const usePerformanceTracking = () => {
  const analytics = PerformanceAnalytics.getInstance();

  const trackPageLoad = (pageName: string) => {
    analytics.trackPageLoad(pageName);
  };

  const trackApiCall = (endpoint: string, duration: number, success: boolean, error?: string) => {
    analytics.trackApiCall(endpoint, duration, success, error);
  };

  const trackUserInteraction = (action: string, page: string, duration?: number, success?: boolean, error?: string) => {
    analytics.trackUserInteraction(action, page, duration, success ?? true, error);
  };

  const trackJobApplication = (jobId: string, duration: number, success: boolean) => {
    analytics.trackJobApplication(jobId, duration, success);
  };

  const trackSearch = (query: string, resultsCount: number, duration: number) => {
    analytics.trackSearch(query, resultsCount, duration);
  };

  return {
    trackPageLoad,
    trackApiCall,
    trackUserInteraction,
    trackJobApplication,
    trackSearch
  };
};

export default PerformanceAnalytics; 