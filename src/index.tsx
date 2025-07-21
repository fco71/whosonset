
// Initialize console filter BEFORE anything else to catch Firebase errors
// import './utilities/consoleFilter';

import './styles/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';


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

