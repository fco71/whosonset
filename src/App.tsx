import React, { Suspense, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './theme/ThemeProvider';
import { useAuth } from './contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/fonts/satoshi.css';
import './App.module.scss';
import { removeStructuredData, setPageSeo, setStructuredData } from './utilities/seo';
import { getRouteRobots, getSeoForPath, normalizeSeoPath } from './utilities/routeSeo';
import { setAnalyticsUser } from './utilities/analytics';
import { db, doc, setDoc, serverTimestamp } from './firebase';

// Import components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

const GLOBAL_SITE_SCHEMA_ID = 'global-site-structured-data';

function buildGlobalSiteStructuredData(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'My Film Jobs',
        url: 'https://myfilmjobs.com/',
        inLanguage: ['en', 'es'],
      },
      {
        '@type': 'Organization',
        name: 'My Film Jobs',
        url: 'https://myfilmjobs.com/',
        logo: 'https://myfilmjobs.com/my-icon.png',
      },
    ],
  };
}

function AppContent() {
  const { currentUser, logout, requiresEmailVerification } = useAuth();
  const { i18n } = useTranslation();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedLanguage = params.get('lang');
    if (!requestedLanguage) {
      return;
    }

    const normalizedLanguage = requestedLanguage.toLowerCase();
    if ((normalizedLanguage === 'en' || normalizedLanguage === 'es') && i18n.language !== normalizedLanguage) {
      i18n.changeLanguage(normalizedLanguage);
    }
  }, [i18n, location.search]);

  useEffect(() => {
    const langCode = i18n.language.startsWith('es') ? 'es' : 'en';
    document.documentElement.lang = langCode;
  }, [i18n.language]);

  useEffect(() => {
    const normalizedPath = normalizeSeoPath(location.pathname);
    const routeSeo = getSeoForPath(normalizedPath);
    const canonicalUrl = `https://myfilmjobs.com${normalizedPath}`;

    setPageSeo({
      title: routeSeo.title,
      description: routeSeo.description,
      canonicalUrl,
      robots: getRouteRobots(normalizedPath),
    });
  }, [location.pathname]);

  useEffect(() => {
    setStructuredData(GLOBAL_SITE_SCHEMA_ID, buildGlobalSiteStructuredData());
    return () => {
      removeStructuredData(GLOBAL_SITE_SCHEMA_ID);
    };
  }, []);

  // Tie GA4 sessions to a stable user id (for returning-user / retention reporting)
  // and record a best-effort lastActiveAt so retention is also visible in Firestore.
  // Runs once per signed-in user per load; the users-doc self-write is allowed by rules.
  useEffect(() => {
    const uid = currentUser?.uid;
    if (!uid) return;
    setAnalyticsUser(uid);
    setDoc(
      doc(db, 'users', uid),
      { lastActiveAt: serverTimestamp(), lastActiveDate: new Date().toISOString().slice(0, 10) },
      { merge: true }
    ).catch(() => {/* best-effort; never block the UI */});
  }, [currentUser?.uid]);

  const handleSignOut = async () => {
    try {
      await logout();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (requiresEmailVerification && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" state={{ from: `${location.pathname}${location.search}${location.hash}` }} replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg"
          >
            Skip to main content
          </a>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navigation 
              authUser={currentUser} 
              userSignOut={handleSignOut} 
            />
            
            <main id="main-content" className="container mx-auto px-4 py-8 pt-24">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              }>
                <Outlet />
              </Suspense>
            </main>

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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
