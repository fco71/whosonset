// src/index.tsx
import './index.css'; // Import Tailwind CSS
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App name="Movie Project" />
    </React.StrictMode>
);