import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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

const DEFAULT_SEO = {
  title: 'My Film Jobs | Film Industry Jobs and Crew Networking',
  description: 'Find film industry jobs, connect with crew members, and grow your production network on My Film Jobs.',
};

const SEO_ROUTES: { pattern: RegExp; title: string; description: string }[] = [
  {
    pattern: /^\/$/,
    title: 'My Film Jobs | Film Industry Jobs and Crew Networking',
    description: 'Find film industry jobs, connect with crew members, and grow your production network on My Film Jobs.',
  },
  {
    pattern: /^\/about$/,
    title: 'About My Film Jobs | Built for Film Professionals',
    description: 'Learn how My Film Jobs helps film professionals connect, collaborate, and find opportunities across productions.',
  },
  {
    pattern: /^\/crew-public$/,
    title: 'Film Crew Directory | Discover Crew Talent',
    description: 'Browse public film crew profiles and discover talent for your next production on My Film Jobs.',
  },
  {
    pattern: /^\/contact$/,
    title: 'Contact My Film Jobs',
    description: 'Contact the My Film Jobs team for support, partnerships, or platform inquiries.',
  },
  {
    pattern: /^\/privacy-policy$/,
    title: 'Privacy Policy | My Film Jobs',
    description: 'Read the My Film Jobs privacy policy and how we handle user data.',
  },
  {
    pattern: /^\/terms-of-service$/,
    title: 'Terms of Service | My Film Jobs',
    description: 'Review the My Film Jobs terms of service for platform usage and responsibilities.',
  },
];

function upsertMetaTag(key: string, value: string, attribute: 'name' | 'property' = 'name') {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
}

function upsertCanonicalLink(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function AppContent() {
  const { currentUser, logout } = useAuth();
  const { currentPagePlacements, trackAdEvent } = useAds();
  const location = useLocation();
  
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

  useEffect(() => {
    const normalizedPath = location.pathname !== '/' ? location.pathname.replace(/\/+$/, '') : '/';
    const routeSeo = SEO_ROUTES.find(route => route.pattern.test(normalizedPath)) || DEFAULT_SEO;
    const canonicalUrl = `https://myfilmjobs.com${normalizedPath}`;

    document.title = routeSeo.title;
    upsertMetaTag('description', routeSeo.description);
    upsertMetaTag('og:title', routeSeo.title, 'property');
    upsertMetaTag('og:description', routeSeo.description, 'property');
    upsertMetaTag('og:url', canonicalUrl, 'property');
    upsertMetaTag('twitter:title', routeSeo.title);
    upsertMetaTag('twitter:description', routeSeo.description);
    upsertCanonicalLink(canonicalUrl);
  }, [location.pathname]);
  
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
