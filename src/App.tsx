import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './theme/ThemeProvider';
import { useAuth } from './contexts/AuthContext';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './App.module.scss';

// Import components
import Navigation from './components/Navigation';

// Import pages using relative paths
import ProducerView from './pages/ProducerView';
import HomePage from './pages/HomePage';
import MyProjectsPage from './pages/MyProjectsPage';
import FavoritesPage from './pages/FavoritesPage';
import SavedCrewProfilesPage from './pages/SavedCrewProfilesPage';
import SavedProjectsPage from './pages/SavedProjectsPage';
import CollectionsHubPage from './pages/CollectionsHubPage';
import SocialPage from './pages/SocialPage';
import CollaborationPage from './pages/CollaborationPage';
import SettingsPage from './pages/SettingsPage';
import JobsPage from './pages/JobsPage';
import PostJobPage from './pages/PostJobPage';
import JobDetailPage from './pages/JobDetailPage';
import DebugJobsPage from './pages/DebugJobsPage';
import EditProfilePage from './pages/EditProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route Component for React Router v7
const ProtectedRoute = ({ children, redirectTo = '/login' }: { children: React.ReactNode, redirectTo?: string }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

// Public Route Component
const PublicRoute = ({ children, redirectTo = '/' }: { children: React.ReactNode, redirectTo?: string }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

const fontFamily = 'Inter, sans-serif';

function App() {
  const { currentUser } = useAuth();
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navigation 
              authUser={currentUser} 
              userSignOut={() => { 
                // Handle sign out logic here
                window.location.href = '/login'; 
              }} 
            />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                {/* Public Routes */}
                <Route index element={<HomePage />} />
                <Route path="/crew" element={<ProducerView />} />
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } />
                
                {/* Protected Routes */}
                <Route path="/my-projects" element={
                  <ProtectedRoute>
                    <MyProjectsPage />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                } />
                <Route path="/saved-crew" element={
                  <ProtectedRoute>
                    <SavedCrewProfilesPage />
                  </ProtectedRoute>
                } />
                <Route path="/saved-projects" element={
                  <ProtectedRoute>
                    <SavedProjectsPage />
                  </ProtectedRoute>
                } />
                <Route path="/collections" element={
                  <ProtectedRoute>
                    <CollectionsHubPage />
                  </ProtectedRoute>
                } />
                <Route path="/social" element={
                  <ProtectedRoute>
                    <SocialPage />
                  </ProtectedRoute>
                } />
                <Route path="/collaboration" element={
                  <ProtectedRoute>
                    <CollaborationPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/edit-profile" element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                } />
                
                {/* Job Related Routes */}
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/post-job" element={
                  <ProtectedRoute>
                    <PostJobPage />
                  </ProtectedRoute>
                } />
                
                {/* Debug/Utility Routes */}
                {process.env.NODE_ENV === 'development' && (
                  <Route path="/debug-jobs" element={<DebugJobsPage />} />
                )}
                
                {/* 404 Route - Keep this last */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            {/* Footer would go here */}
          </div>
          
          
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
