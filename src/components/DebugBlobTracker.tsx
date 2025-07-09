import { useEffect, useState, useCallback } from 'react';

// Debug logging
const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[BlobTracker]', ...args);
  }
};

// Extend the Window interface to include our tracking set
declare global {
  interface Window {
    __blobUrls?: Set<string>;
    __originalCreateObjectURL?: typeof URL.createObjectURL;
    __originalRevokeObjectURL?: typeof URL.revokeObjectURL;
  }
}

// Track all blob URLs created in the application
const blobUrls = new Set<string>();
window.__blobUrls = blobUrls;

debugLog('Initializing Blob URL tracker');

// Store original methods if not already stored
if (!window.__originalCreateObjectURL) {
  window.__originalCreateObjectURL = URL.createObjectURL;
  window.__originalRevokeObjectURL = URL.revokeObjectURL;

  // Override URL.createObjectURL to track blob URLs
  URL.createObjectURL = function(blob: Blob | MediaSource) {
    const url = window.__originalCreateObjectURL!.call(URL, blob);
    blobUrls.add(url);
    const logInfo: Record<string, any> = { stack: new Error().stack };
    
    // Only include type and size if available (they exist on Blob but not MediaSource)
    if ('type' in blob) {
      logInfo.type = blob.type;
      logInfo.size = blob.size;
    } else {
      logInfo.sourceType = 'MediaSource';
    }
    
    debugLog('Blob URL created:', url, logInfo);
    return url;
  };

  // Override URL.revokeObjectURL to track blob URL cleanup
  URL.revokeObjectURL = function(url: string) {
    debugLog('Blob URL revoked:', url);
    blobUrls.delete(url);
    return window.__originalRevokeObjectURL!.call(URL, url);
  };

  debugLog('Blob URL tracking enabled');
}

interface DebugBlobTrackerProps {
  showAll?: boolean;
}

export const DebugBlobTracker: React.FC<DebugBlobTrackerProps> = ({ showAll = false }) => {
  const [trackedBlobUrls, setTrackedBlobUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const checkBlobUrls = useCallback(() => {
    try {
      const urls = Array.from(blobUrls);
      setTrackedBlobUrls(urls);
      setError(null);
      
      // Check for broken blob URLs
      urls.forEach(url => {
        const urlStr = String(url);
        if (urlStr.startsWith('blob:')) {
          fetch(urlStr, { method: 'HEAD' })
            .catch(error => {
              console.error(`Broken blob URL detected: ${urlStr}`, error);
              setError(`Broken blob URL: ${urlStr.substring(0, 30)}...`);
            });
        }
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error checking blob URLs:', err);
      setError(`Error: ${errorMessage}`);
    }
  }, []);

  useEffect(() => {
    // Check blob URLs periodically
    const interval = setInterval(checkBlobUrls, 1000);
    checkBlobUrls(); // Initial check

    return () => clearInterval(interval);
  }, [checkBlobUrls]);

  if (!showAll && trackedBlobUrls.length === 0 && !error) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '10px',
      maxWidth: '500px',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace',
      border: '1px solid #666',
      borderRadius: '4px',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0 }}>Blob URL Tracker ({trackedBlobUrls.length})</h4>
        <button 
          onClick={checkBlobUrls}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '2px 8px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          Refresh
        </button>
      </div>
      
      {error && (
        <div style={{ color: '#ff6b6b', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {error}
        </div>
      )}
      
      <ul style={{ margin: 0, paddingLeft: '20px', maxHeight: '200px', overflowY: 'auto' }}>
        {trackedBlobUrls.map((url, i) => (
          <li key={i} style={{ wordBreak: 'break-all' }}>
            {url}
            <button 
              onClick={() => {
                console.log('URL:', url);
                console.trace('Blob URL created at:');
              }}
              style={{
                marginLeft: '5px',
                fontSize: '10px',
                padding: '0 5px',
                cursor: 'pointer'
              }}
            >
              Trace
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebugBlobTracker;
