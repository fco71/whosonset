// Global type declarations for external libraries and APIs

declare global {
  interface Window {
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
  }
}

export {}; 
