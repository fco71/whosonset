
// Initialize console filter BEFORE anything else to catch Firebase errors
// import './utilities/consoleFilter';

import './styles/globals.css';
import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { createAppRouter } from './router';
import AppErrorBoundary from './components/AppErrorBoundary';

// Global error handler to catch any runtime errors
window.addEventListener('error', function(event) {
  const filename = event.filename || '';
  const message = event.message || '';

  if (
    filename.startsWith('chrome-extension://') ||
    message.includes('ERR_BLOCKED_BY_ADBLOCKER') ||
    message.includes('ERR_BLOCKED_BY_CLIENT')
  ) {
    return;
  }

  console.error('Global error caught:', {
    message,
    filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    stack: event.error?.stack
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
  const reasonText = String((e.reason && e.reason.message) || e.reason || '');
  if (reasonText.includes('ERR_BLOCKED_BY_ADBLOCKER') || reasonText.includes('ERR_BLOCKED_BY_CLIENT')) {
    return;
  }
  console.error('Unhandled promise rejection:', e.reason);
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
