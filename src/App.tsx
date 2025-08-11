import React, { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
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
import Footer from './components/Footer';
import { AdProvider, useAds } from './components/Ads/AdProvider';
import AdManager from './components/Ads/AdManager';

function AppContent() {
  const { currentUser, logout } = useAuth();
  const { currentPagePlacements, trackAdEvent } = useAds();
  
  console.log('[App] Rendering with currentUser:', currentUser?.email);
  
  // Global error handler for unhandled promise rejections
  useEffect(() => {
    console.log('[App] Setting up global error handlers...');
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    const handleUnhandledError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleUnhandledError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleUnhandledError);
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      await logout();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navigation 
              authUser={currentUser} 
              userSignOut={handleSignOut} 
            />
            
            {/* Header Ad Banner - Temporarily disabled for professional launch */}
            {/* <div className="pt-16">
              <AdManager 
                placements={currentPagePlacements.filter(p => p.position === 'header')}
                onAdLoad={(placementId) => trackAdEvent(placementId, 'load')}
                onAdError={(placementId, error) => trackAdEvent(placementId, 'error')}
              />
            </div> */}
            
            <main className="container mx-auto px-4 py-8 pt-24">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              }>
                <Outlet />
              </Suspense>
            </main>
            
            {/* Footer Ad Banner - Temporarily disabled for professional launch */}
            {/* <AdManager 
              placements={currentPagePlacements.filter(p => p.position === 'footer')}
              onAdLoad={(placementId) => trackAdEvent(placementId, 'load')}
              onAdError={(placementId, error) => trackAdEvent(placementId, 'error')}
            /> */}
            
            <Footer />
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
      </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AdProvider>
        <AppContent />
      </AdProvider>
    </ThemeProvider>
  );
}

export default App;
