// Simple console filter for Firebase connection errors
// This makes development much cleaner by hiding normal Firebase connection messages

class ConsoleFilter {
  private static instance: ConsoleFilter;
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;
  private filteredCount = 0;

  private constructor() {
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
    this.setupFilter();
  }

  static getInstance(): ConsoleFilter {
    if (!ConsoleFilter.instance) {
      ConsoleFilter.instance = new ConsoleFilter();
    }
    return ConsoleFilter.instance;
  }

  private setupFilter(): void {
    // Filter console.error
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      // Check if this is a Firebase connection error we want to filter
      if (this.shouldFilter(message)) {
        this.filteredCount++;
        return; // Don't log the error
      }
      
      // Log all other errors normally
      this.originalConsoleError.apply(console, args);
    };

    // Filter console.warn
    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      
      // Check if this is a Firebase warning we want to filter
      if (this.shouldFilter(message)) {
        this.filteredCount++;
        return; // Don't log the warning
      }
      
      // Log all other warnings normally
      this.originalConsoleWarn.apply(console, args);
    };

    // Filter console.log for Firebase connection messages
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      const message = args.join(' ');
      
      // Check if this is a Firebase connection message we want to filter
      if (this.shouldFilter(message)) {
        this.filteredCount++;
        return; // Don't log the message
      }
      
      // Log all other messages normally
      originalConsoleLog.apply(console, args);
    };

    console.log('[ConsoleFilter] Firebase connection errors and messages will be filtered out');
  }

  private shouldFilter(message: string): boolean {
    // IMPORTANT: Do NOT filter legitimate permission errors
    // These are real errors that developers need to see
    if (message.includes('Missing or insufficient permissions') ||
        message.includes('Permission denied') ||
        message.includes('permission-denied')) {
      return false; // Let these through - they're real errors
    }

    const filterPatterns = [
      // Firebase connection errors (these are normal internal messages)
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
      /a_ @ index\.esm/,
      /k_ @ index\.esm/,
      /B_ @ index\.esm/,
      /q_ @ index\.esm/,
      /i_ @ index\.esm/,
      /Yu @ index\.esm/,
      /enqueue/,
      /enqueueAndForget/,
      /Promise\.then/,
      /setTimeout/,
      /auth @ index\.esm/,
      /start @ index\.esm/,
      // React internal errors that are normal
      /commitHookEffectListMount/,
      /commitPassiveMountOnFiber/,
      /commitPassiveMountEffects_complete/,
      /commitPassiveMountEffects_begin/,
      /commitPassiveMountEffects/,
      /flushPassiveEffectsImpl/,
      /flushPassiveEffects/,
      /performConcurrentWorkOnRoot/,
      /workLoop/,
      /flushWork/,
      /performWorkUntilDeadline/,
      /callCallback/,
      /invokeGuardedCallbackDev/,
      /invokeGuardedCallback/,
      /invokeGuardedCallbackAndCatchFirstError/,
      /executeDispatch/,
      /processDispatchQueueItemsInOrder/,
      /processDispatchQueue/,
      /dispatchEventsForPlugins/,
      /batchedUpdates/,
      /dispatchEventForPluginEventSystem/,
      /dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay/,
      /dispatchDiscreteEvent/,
      // Firebase persistence warnings
      /enableIndexedDbPersistence\(\) will be deprecated/,
      /Firestore has already been started/,
      /persistence can no longer be enabled/,
      // Firebase connection manager messages
      /\[FirebaseConnectionManager\]/,
      /Connection manager created/,
      /Initializing connection/,
      /Checking connection status/,
      /Connection verified successfully/,
      /Connection check failed/,
      /Retrying connection/,
      // Additional Firebase patterns
      /firestore\.googleapis\.com/,
      /google\.firestore\.v1\.Firestore/,
      /Write\/channel/,
      /SID=/,
      /RID=/,
      /zx=/,
      /gsessionid=/,
      /database=/,
      /VER=/,
      // Job application service messages (filter out verbose ones but keep success)
      /Application data:/,
      /Cleaned application data:/,
      // Network-level Firebase messages
      /webchannel_blob_es2018\.js/,
      /index\.esm2017\.js/,
      /react-dom\.development\.js/,
      /scheduler\.development\.js/
    ];

    return filterPatterns.some(pattern => pattern.test(message));
  }

  getFilteredCount(): number {
    return this.filteredCount;
  }

  resetCount(): void {
    this.filteredCount = 0;
  }
}

export const consoleFilter = ConsoleFilter.getInstance(); 