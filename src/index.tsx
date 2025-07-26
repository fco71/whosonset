
// Initialize console filter BEFORE anything else to catch Firebase errors
// import './utilities/consoleFilter';

import './styles/globals.css';
import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

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
  if (e.reason && typeof e.reason === 'string' && e.reason.includes('blob:') && e.reason.includes('net::ERR_FILE_NOT_FOUND')) {
    // Prevent the error from being logged to console
    e.preventDefault();
    console.warn('Blob URL not found, this is expected when blobs are cleaned up');
  }
});

const RootWithProvider = () => (
  <AuthProvider>
    <App />
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

