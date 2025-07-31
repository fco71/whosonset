
// Initialize console filter BEFORE anything else to catch Firebase errors
// import './utilities/consoleFilter';

import './styles/globals.css';
import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { createAppRouter } from './router';
import ErrorBoundary from './components/ErrorBoundary';

// Global error handler to catch any runtime errors
window.addEventListener('error', function(event) {
  console.error('Global error caught:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    stack: event.error?.stack
  });
  
  // Only prevent default for known safe errors
  if (event.message && event.message.includes('Script error')) {
    console.warn('Suppressing generic script error');
    event.preventDefault();
  }
});

// Global handler for all <img> errors (for blob URLs)
document.addEventListener(
  'error',
  function (e) {
    const target = e.target as HTMLImageElement;
    if (
      target.tagName === 'IMG' &&
      target.src.startsWith('blob:') &&
      !target.src.endsWith('/default-avatar.svg')
    ) {
      // Prevent the error from being logged to console
      e.preventDefault();
      target.src = '/default-avatar.svg';
    }
  },
  true
);

// Global handler for unhandled promise rejections (for blob URL fetch errors)
window.addEventListener('unhandledrejection', function (e) {
  // Log the entire event for debugging
  console.error('Unhandled promise rejection event:', e);
  if (e.reason) {
    console.error('Unhandled promise rejection reason:', e.reason);
    console.error('Stack trace:', e.reason?.stack);
  } else {
    console.error('Unhandled promise rejection with unknown reason:', e);
  }
  
  // Only prevent default for known safe errors
  if (e.reason && typeof e.reason === 'string' && e.reason.includes('blob:')) {
    console.warn('Suppressing blob URL error');
    e.preventDefault();
  }
});

// Create router instance once
const router = createAppRouter();

const RootWithProvider = () => (
  <AuthProvider>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </AuthProvider>
);

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RootWithProvider />
    </React.StrictMode>
  );
}

