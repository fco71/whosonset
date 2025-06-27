import React, { useState, useEffect, useCallback } from 'react';
import { performanceMonitor } from '../utilities/performanceUtils';
import './PerformanceMonitor.scss';

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  componentCount: number;
  bundleSize: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showDetails?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = process.env.NODE_ENV === 'development',
  showDetails = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    componentCount: 0,
    bundleSize: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [performanceLogs, setPerformanceLogs] = useState<string[]>([]);

  const updateMetrics = useCallback(() => {
    if (!enabled) return;

    const memory = (performance as any).memory;
    const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;
    
    // Count React components (rough estimate)
    const componentCount = document.querySelectorAll('[data-reactroot], [data-reactid]').length;
    
    // Estimate bundle size (this would be more accurate with webpack bundle analyzer)
    const bundleSize = Math.round(performance.now() / 1000); // Placeholder

    setMetrics({
      memoryUsage,
      renderTime: Math.round(performance.now()),
      componentCount,
      bundleSize
    });
  }, [enabled]);

  const addPerformanceLog = useCallback((message: string) => {
    if (!enabled) return;
    
    setPerformanceLogs(prev => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev.slice(0, 9) // Keep only last 10 logs
    ]);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Monitor performance metrics
    const interval = setInterval(updateMetrics, 2000);
    
    // Monitor long tasks
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          addPerformanceLog(`Long task: ${Math.round(entry.duration)}ms`);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task observer not supported in all browsers
    }

    // Monitor memory usage
    if ((performance as any).memory) {
      const memoryObserver = setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // > 100MB
          addPerformanceLog(`High memory usage: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`);
        }
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [enabled, updateMetrics, addPerformanceLog]);

  if (!enabled) return null;

  return (
    <div className="performance-monitor">
      {/* Toggle Button */}
      <button
        className="monitor-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Toggle Performance Monitor"
      >
        📊
      </button>

      {/* Monitor Panel */}
      {isVisible && (
        <div className="monitor-panel">
          <div className="monitor-header">
            <h3>Performance Monitor</h3>
            <button 
              className="close-button"
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>

          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">Memory</span>
              <span className="metric-value">{metrics.memoryUsage}MB</span>
            </div>
            <div className="metric">
              <span className="metric-label">Render Time</span>
              <span className="metric-value">{metrics.renderTime}ms</span>
            </div>
            <div className="metric">
              <span className="metric-label">Components</span>
              <span className="metric-value">{metrics.componentCount}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Bundle Size</span>
              <span className="metric-value">{metrics.bundleSize}KB</span>
            </div>
          </div>

          {showDetails && (
            <div className="performance-logs">
              <h4>Performance Logs</h4>
              <div className="logs-container">
                {performanceLogs.map((log, index) => (
                  <div key={index} className="log-entry">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="monitor-actions">
            <button
              onClick={() => {
                performanceMonitor.clear();
                setPerformanceLogs([]);
              }}
              className="clear-button"
            >
              Clear Logs
            </button>
            <button
              onClick={() => {
                const report = {
                  timestamp: new Date().toISOString(),
                  metrics,
                  logs: performanceLogs
                };
                console.log('Performance Report:', report);
              }}
              className="export-button"
            >
              Export Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor; 