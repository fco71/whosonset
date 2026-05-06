import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './theme/ThemeProvider';
import { useAuth } from './contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './App.module.scss';
import { removeStructuredData, setPageSeo, setStructuredData } from './utilities/seo';

// Import components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

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
    pattern: /^\/jobs$/,
    title: 'Film Jobs Board | Production, Crew, and Creative Roles',
    description: 'Browse current film industry job opportunities across production, post-production, and creative departments.',
  },
  {
    pattern: /^\/jobs\/[^/]+$/,
    title: 'Film Job Opportunity | My Film Jobs',
    description: 'Explore film industry job details, requirements, and application deadlines on My Film Jobs.',
  },
  {
    pattern: /^\/blog$/,
    title: 'Film Industry Blog | News and Insights',
    description: 'Curated film industry news and insights with links to original sources and member discussion.',
  },
  {
    pattern: /^\/blog\/page\/\d+$/,
    title: 'Film Industry Blog Archive | My Film Jobs',
    description: 'Browse archived film industry news pages with opportunities and collaboration insights.',
  },
  {
    pattern: /^\/blog\/[^/]+$/,
    title: 'Film Industry Insight | My Film Jobs Blog',
    description: 'Read film industry insights and discover relevant jobs and collaboration opportunities on My Film Jobs.',
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
  const { currentUser, logout } = useAuth();
  const { i18n } = useTranslation();
  const location = useLocation();
  
  console.log('[App] Rendering with currentUser:', currentUser?.email);
  
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
    const normalizedPath = location.pathname !== '/' ? location.pathname.replace(/\/+$/, '') : '/';
    const routeSeo = SEO_ROUTES.find(route => route.pattern.test(normalizedPath)) || DEFAULT_SEO;
    const canonicalUrl = `https://myfilmjobs.com${normalizedPath}`;

    setPageSeo({
      title: routeSeo.title,
      description: routeSeo.description,
      canonicalUrl,
    });
  }, [location.pathname]);

  useEffect(() => {
    setStructuredData(GLOBAL_SITE_SCHEMA_ID, buildGlobalSiteStructuredData());
    return () => {
      removeStructuredData(GLOBAL_SITE_SCHEMA_ID);
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
