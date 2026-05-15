import './styles/globals.css';
import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { createAppRouter } from './router';
import AppErrorBoundary from './components/AppErrorBoundary';

// ---------------------------------------------------------------------------
// Global error handlers
//
// These call event.preventDefault() on known-benign errors so they don't
// surface in the webpack-dev-server / React error overlay during development
// or in unhelpful Sentry-style noise in production. Real bugs are still
// logged via console.warn (which does NOT trigger the dev overlay).
// ---------------------------------------------------------------------------

// Patterns we consider benign (Firebase transient timeouts, ad-blockers,
// React Fast Refresh artifacts, etc.) These will be suppressed silently.
const BENIGN_ERROR_PATTERNS = [
  // Browser extensions / ad-blockers
  /ERR_BLOCKED_BY_ADBLOCKER/,
  /ERR_BLOCKED_BY_CLIENT/,
  // Firebase transient network issues — common in dev, harmless
  /TimeoutError/i,
  /operation timed out/i,
  /deadline-exceeded/i,
  /Failed to fetch/i,
  /NetworkError when attempting/i,
  /Load failed/i,                     // Safari fetch failure on intermittent network
  /Listen for Query.*failed/i,        // Firestore long-polling reconnect noise
  /firestore\.googleapis\.com/i,
  // React Fast Refresh / HMR artifact triggered when class components
  // (AppErrorBoundary, ErrorBoundary, CollaborationErrorBoundary) are
  // hot-reloaded. Does NOT happen in production builds. Safe to ignore.
  /Cannot call a class as a function/i,
];

function isBenign(text: string): boolean {
  if (!text) return true; // empty / "Unknown" rejections — not actionable, hide them
  return BENIGN_ERROR_PATTERNS.some((re) => re.test(text));
}

// Global window.error handler
window.addEventListener('error', function (event) {
  const filename = event.filename || '';
  const message = event.message || '';

  if (filename.startsWith('chrome-extension://') || isBenign(message)) {
    event.preventDefault();
    return;
  }

  // Only log real, actionable errors. Use console.warn so the React dev
  // overlay doesn't treat it as a fatal runtime error.
  console.warn('[GlobalError]', {
    message,
    filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
  });
});

// Global handler for all <img> errors (for blob URLs)
document.addEventListener(
  'error',
  function (e) {
    const target = e.target as HTMLImageElement;
    if (
      target.tagName === 'IMG' &&
      target.src.startsWith('blob:') &&
              !target.src.endsWith('/bust-avatar.svg')
    ) {
      // Prevent the error from being logged to console
      e.preventDefault();
              target.src = '/bust-avatar.svg';
    }
  },
  true
);

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function (e) {
  // Build a usable string from any reason shape:
  //   Error instance     -> message + name
  //   plain object       -> JSON
  //   string / number    -> String()
  //   undefined / null   -> '' (treated as benign)
  let reasonText = '';
  const r: any = e.reason;
  if (r) {
    if (typeof r === 'string') {
      reasonText = r;
    } else if (r instanceof Error) {
      reasonText = `${r.name}: ${r.message}`;
    } else if (r.message) {
      reasonText = String(r.message);
    } else {
      try {
        reasonText = JSON.stringify(r);
      } catch {
        reasonText = String(r);
      }
    }
  }

  if (isBenign(reasonText)) {
    e.preventDefault();
    return;
  }

  console.warn('[UnhandledRejection]', e.reason);
});

// Create router instance once
const router = createAppRouter();

const RootWithProvider = () => (
  <AppErrorBoundary>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </AppErrorBoundary>
);

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <RootWithProvider />
  );
}
