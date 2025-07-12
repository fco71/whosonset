import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './theme/ThemeProvider';
import { useAuth } from './contexts/AuthContext';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './App.module.scss';

// Import debug component directly for now to ensure it loads
import DebugBlobTracker from './components/DebugBlobTracker';

// Import pages
import ProducerView from './pages/ProducerView';
import MyProjectsPage from './pages/MyProjectsPage';
import FavoritesPage from './pages/FavoritesPage';
import SavedCrewProfilesPage from './pages/SavedCrewProfilesPage';
import SavedProjectsPage from './pages/SavedProjectsPage';
import CollectionsHubPage from './pages/CollectionsHubPage';
import SocialPage from './pages/SocialPage.v2';
import SettingsPage from './pages/SettingsPage';
import JobsPage from './pages/JobsPage';
import PostJobPage from './pages/PostJobPage';
import DebugJobsPage from './pages/DebugJobsPage';

const fontFamily = 'Inter, sans-serif';

function App() {
  const { currentUser } = useAuth();
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily }}>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Navigation would go here */}
            
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<ProducerView />} />
                <Route path="/my-projects" element={<MyProjectsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/saved-crew" element={<SavedCrewProfilesPage />} />
                <Route path="/saved-projects" element={<SavedProjectsPage />} />
                <Route path="/collections" element={<CollectionsHubPage />} />
                <Route path="/social" element={<SocialPage />} />
                <Route path="/settings" element={currentUser ? <SettingsPage /> : <Navigate to="/login" />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/post-job" element={currentUser ? <PostJobPage /> : <Navigate to="/login" />} />
                {/* Debug route - accessible at /debug-jobs */}
                <Route path="/debug-jobs" element={<DebugJobsPage />} />
              </Routes>
            </main>
            
            {/* Footer would go here */}
          </div>
          
          {/* Debug tools - always show in development */}
          {process.env.NODE_ENV === 'development' && (
            <DebugBlobTracker showAll={true} />
          )}
          
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              duration: 4000,
              className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100',
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: 'white',
                },
              },
            }} 
          />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
