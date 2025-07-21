import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './theme/ThemeProvider';
import { useAuth } from './contexts/AuthContext';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './App.module.scss';

// Initialize console filter to suppress Firebase connection errors
import './utilities/consoleFilter';

// Import components
import Navigation from './components/Navigation';

// Lazy load pages for better performance
const ProducerView = React.lazy(() => import('./pages/ProducerView'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const MyProjectsPage = React.lazy(() => import('./pages/MyProjectsPage'));
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage'));
const SavedCrewProfilesPage = React.lazy(() => import('./pages/SavedCrewProfilesPage'));
const SavedProjectsPage = React.lazy(() => import('./pages/SavedProjectsPage'));
const CollectionsHubPage = React.lazy(() => import('./pages/CollectionsHubPage'));
const SocialPage = React.lazy(() => import('./pages/SocialPage'));
const CollaborationPage = React.lazy(() => import('./pages/CollaborationPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const JobsPage = React.lazy(() => import('./pages/JobsPage'));
const PostJobPage = React.lazy(() => import('./pages/PostJobPage'));
const JobDetailPage = React.lazy(() => import('./components/JobSearch/JobDetailPage'));
const DebugJobsPage = React.lazy(() => import('./pages/DebugJobsPage'));
const EditProfilePage = React.lazy(() => import('./pages/EditProfilePage'));
const PublicResumePage = React.lazy(() => import('./components/PublicResumePage'));
const ChatTestPage = React.lazy(() => import('./components/Chat/ChatTestPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ApplicationDetailPage = React.lazy(() => import('./pages/ApplicationDetailPage'));
const JobApplicationForm = React.lazy(() => import('./components/JobSearch/JobApplicationForm'));
const JobApplicationDashboard = React.lazy(() => import('./components/JobSearch/JobApplicationDashboard'));
const ApplicationSuccessPage = React.lazy(() => import('./components/JobSearch/ApplicationSuccessPage'));
const EditJobApplication = React.lazy(() => import('./components/JobSearch/EditJobApplication'));

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
  const { currentUser, logout } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await logout();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navigation 
              authUser={currentUser} 
              userSignOut={handleSignOut} 
            />
            <main className="container mx-auto px-4 py-8">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              }>
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
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <ChatTestPage />
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
                
                {/* Public Resume Routes */}
                <Route path="/resume/:uid" element={<PublicResumePage />} />
                
                {/* Job Related Routes */}
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:jobId" element={<JobDetailPage />} />
                <Route path="/jobs/:jobId/apply" element={
                  <ProtectedRoute>
                    <JobApplicationForm />
                  </ProtectedRoute>
                } />
                <Route path="/applications" element={
                  <ProtectedRoute>
                    <JobApplicationDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/applications/:applicationId" element={
                  <ProtectedRoute>
                    <ApplicationDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/applications/:applicationId/edit" element={
                  <ProtectedRoute>
                    <EditJobApplication />
                  </ProtectedRoute>
                } />
                <Route path="/applications/:applicationId/success" element={
                  <ProtectedRoute>
                    <ApplicationSuccessPage />
                  </ProtectedRoute>
                } />
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
              </Suspense>
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
