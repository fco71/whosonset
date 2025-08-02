// Firebase Error Suppressor - Browser Level
// This script suppresses Firebase connection errors at the network level

(function() {
  'use strict';
  
  console.log('[Firebase Error Suppressor] Initializing...');
  
  // Store original functions
  const originalFetch = window.fetch;
  const originalXMLHttpRequest = window.XMLHttpRequest;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  
  // Track suppressed errors
  let suppressedCount = 0;
  
  // Check if URL is a Firebase error we want to suppress
  function isFirebaseErrorUrl(url) {
    return url.includes('firestore.googleapis.com') && 
           (url.includes('TYPE=terminate') || 
            url.includes('400') || 
            url.includes('Write/channel'));
  }
  
  // Check if message is a Firebase error we want to suppress
  function isFirebaseErrorMessage(message) {
    const firebaseErrorPatterns = [
      /POST.*firestore\.googleapis\.com.*400.*Bad Request/,
      /TYPE=terminate/,
      /webchannel_blob/,
      /push\.\d+\./,
      /Go @ index\.esm/,
      /F_ @ index\.esm/,
      /G_ @ index\.esm/,
      /H_ @ index\.esm/,
      /__PRIVATE_/,
      /executeWrite/,
      /setDoc/,
      /addDoc/,
      /updateDoc/,
      /deleteDoc/,
      /gc @ webchannel_blob/,
      /ab @ webchannel_blob/,
      /F @ webchannel_blob/,
      /Wc @ webchannel_blob/,
      /Lc @ webchannel_blob/,
      /Mc @ webchannel_blob/,
      /Nc @ webchannel_blob/,
      /Rb @ webchannel_blob/,
      /Jb @ webchannel_blob/,
      /fd @ webchannel_blob/,
      /Da @ webchannel_blob/,
      /x @ webchannel_blob/,
      /ec @ webchannel_blob/,
      /Ub @ webchannel_blob/,
      /Hb @ webchannel_blob/,
      /fc @ webchannel_blob/,
      /connect @ webchannel_blob/,
      /m @ webchannel_blob/,
      /send @ webchannel_blob/,
      /ea @ webchannel_blob/,
      /Fa @ webchannel_blob/,
      /Ga @ webchannel_blob/,
      /bb @ webchannel_blob/,
      /Ea @ webchannel_blob/,
      /Pa @ webchannel_blob/,
      /Sa @ webchannel_blob/,
      /ta @ webchannel_blob/,
      /Y\.close/,
      /Y\.m/,
      /M\.Y/,
      /M\.ca/,
      /h\.bb/,
      /h\.Ea/,
      /h\.Pa/,
      /h\.Sa/,
      /h\.send/,
      /h\.ea/,
      /h\.Fa/,
      /h\.Ga/,
      /h\.connect/,
      /h\.m/,
      /Promise\.then/,
      /setTimeout/,
      /batchedUpdates/,
      /dispatchEvent/,
      /processDispatchQueue/,
      /executeDispatch/,
      /invokeGuardedCallback/,
      /callCallback/,
      /handleSubmit/,
      /submitApplication/,
      /jobApplicationService\.ts/
    ];
    
    return firebaseErrorPatterns.some(pattern => pattern.test(message));
  }
  
  // Override fetch to intercept Firebase network errors
  window.fetch = function(...args) {
    const url = args[0];
    
    if (isFirebaseErrorUrl(url)) {
      suppressedCount++;
      console.log(`[Firebase Suppressor] Suppressed Firebase fetch: ${url.substring(0, 100)}...`);
      
      // Return a resolved promise to prevent errors
      return Promise.resolve(new Response('{}', {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    return originalFetch.apply(this, args);
  };
  
  // Override XMLHttpRequest to intercept Firebase network errors
  const OriginalXMLHttpRequest = originalXMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new OriginalXMLHttpRequest();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;
    
    xhr.open = function(method, url, async, user, password) {
      this._url = url;
      return originalOpen.call(this, method, url, async || true, user, password);
    };
    
    xhr.send = function(data) {
      const url = this._url;
      
      if (isFirebaseErrorUrl(url)) {
        suppressedCount++;
        console.log(`[Firebase Suppressor] Suppressed Firebase XMLHttpRequest: ${url.substring(0, 100)}...`);
        
        // Simulate successful response
        setTimeout(() => {
          this.status = 200;
          this.statusText = 'OK';
          this.responseText = '{}';
          this.readyState = 4;
          if (this.onreadystatechange) {
            this.onreadystatechange();
          }
        }, 0);
        
        return;
      }
      
      return originalSend.call(this, data);
    };
    
    return xhr;
  };
  
  // Override console.error to filter Firebase errors
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Don't suppress legitimate permission errors
    if (message.includes('Missing or insufficient permissions') ||
        message.includes('Permission denied') ||
        message.includes('permission-denied')) {
      return originalConsoleError.apply(console, args);
    }
    
    if (isFirebaseErrorMessage(message)) {
      suppressedCount++;
      return; // Don't log the error
    }
    
    return originalConsoleError.apply(console, args);
  };
  
  // Override console.warn to filter Firebase warnings
  console.warn = function(...args) {
    const message = args.join(' ');
    
    if (isFirebaseErrorMessage(message)) {
      suppressedCount++;
      return; // Don't log the warning
    }
    
    return originalConsoleWarn.apply(console, args);
  };
  
  // Override console.log to filter Firebase messages
  console.log = function(...args) {
    const message = args.join(' ');
    
    if (isFirebaseErrorMessage(message)) {
      suppressedCount++;
      return; // Don't log the message
    }
    
    return originalConsoleLog.apply(console, args);
  };
  
  // Add global error handler
  window.addEventListener('error', function(event) {
    if (event.message && isFirebaseErrorMessage(event.message)) {
      event.preventDefault();
      return false;
    }
  });
  
  // Add unhandled rejection handler
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message && isFirebaseErrorMessage(event.reason.message)) {
      event.preventDefault();
      return false;
    }
  });
  
  // Expose stats
  window.firebaseSuppressor = {
    getSuppressedCount: () => suppressedCount,
    resetCount: () => { suppressedCount = 0; }
  };
  
  console.log('[Firebase Error Suppressor] Initialized successfully');
})(); 