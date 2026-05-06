// src/components/Navigation.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Bell, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/DropdownMenu';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCenter from './NotificationCenter';
import NotificationSettings from './NotificationSettings';
import { useTranslation } from 'react-i18next';
import { trackConversion } from '../utilities/conversionTracking';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface NavigationProps {
    authUser: any;
    userSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ authUser, userSignOut }) => {
  
    
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [activePath, setActivePath] = useState('/');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotificationCenter, setShowNotificationCenter] = useState(false);
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);
    // Tracks whether the signed-in user has profileType === 'teacher' (or the
    // legacy isTeacher flag). Used to conditionally show the "My Students"
    // link in the user dropdown so it doesn't clutter non-teacher menus.
    const [isTeacherUser, setIsTeacherUser] = useState(false);
    const { t, i18n } = useTranslation();
    const activeLanguage = i18n.language.startsWith('es') ? 'es' : 'en';

    const crewDestination = authUser ? '/crew' : '/crew-public';

    const handleLanguageChange = (languageCode: string) => {
        if (activeLanguage === languageCode) {
            return;
        }

        i18n.changeLanguage(languageCode);
        const params = new URLSearchParams(location.search);
        params.set('lang', languageCode);
        const search = params.toString();
        navigate({
            pathname: location.pathname,
            search: search ? `?${search}` : '',
        }, { replace: true });
    };

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    // Look up the current user's profile once per signed-in session to decide
    // whether the dropdown should include the teacher-only "My Students" link.
    // Failures are swallowed silently — if we can't tell, just hide the link.
    useEffect(() => {
        let cancelled = false;
        if (!authUser?.uid) {
            setIsTeacherUser(false);
            return;
        }
        (async () => {
            try {
                const snap = await getDoc(doc(db, 'crewProfiles', authUser.uid));
                if (cancelled) return;
                const data: any = snap.exists() ? snap.data() : null;
                setIsTeacherUser(
                    Boolean(data && (data.profileType === 'teacher' || data.isTeacher === true))
                );
            } catch {
                if (!cancelled) setIsTeacherUser(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [authUser?.uid]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
    
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (!isMobileMenuOpen) {
            setIsUserMenuOpen(false);
        }
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
        if (!isUserMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    const isActive = (path: string) => {
        if (path === '/') {
            return activePath === '/';
        }
        return activePath === path || activePath.startsWith(`${path}/`);
    };

    const navigationLinks = [
        { to: '/', label: t('nav.home') },
        { to: crewDestination, label: t('nav.crew') },
        { to: '/jobs', label: t('nav.jobs') },
        { to: '/projects', label: t('nav.projects') },
        { to: '/collaboration', label: t('nav.collaboration') },
        { to: '/blog', label: 'Blog' },
    ];
    const blogLink = navigationLinks.find((link) => link.to === '/blog');
    const primaryNavigationLinks = navigationLinks.filter((link) => link.to !== '/blog');
    const mobileTopLinks = navigationLinks;

    const authenticatedLinks = [
        { to: '/social', label: t('nav.social') },
        { to: '/edit-profile', label: t('nav.resumeBuilder') },
    ];

    const jobManagementLinks = [
        { to: '/jobs/posted', label: t('nav.myPostedJobs') },
        { to: '/jobs/analytics', label: t('nav.jobAnalytics') },
        { to: '/post-job', label: t('nav.postNewJob') },
    ];

    const { unreadCount } = useNotifications();
    


    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'es', label: 'ES' },
    ];

    // Function to get user display name (like "franciscovaldez")
    const getUserDisplayName = (user: any) => {
        if (user?.displayName) {
            return user.displayName.toLowerCase().replace(/\s+/g, '');
        }
        
        if (user?.email) {
            const emailName = user.email.split('@')[0];
            return emailName.toLowerCase();
        }
        
        return 'user';
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
                    : 'bg-white/80 backdrop-blur-sm border-b border-gray-100/50'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link 
                                to="/" 
                                className="group flex items-center space-x-2"
                                onClick={closeAllMenus}
                            >
                                <div className="relative">
                                    <div className="text-lg font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent tracking-tight">
                                        My Film Jobs
                                    </div>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden xl:flex items-center space-x-1">
                            {primaryNavigationLinks.map((link) => {
                                // Special handling for Jobs dropdown
                                if (link.to === '/jobs') {
                                    return (
                                        <div key={link.to} className="relative group">
                                            <Link
                                                to="/jobs"
                                                className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-1 ${
                                                    isActive('/jobs') || isActive('/jobs/posted') || isActive('/jobs/analytics') || isActive('/post-job')
                                                        ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                                                }`}
                                                onClick={closeAllMenus}
                                                style={{ zIndex: 2, position: 'relative' }}
                                            >
                                                <span>{t('nav.jobs')}</span>
                                                <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </Link>
                                            {/* Dropdown Menu */}
                                            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                <div className="py-2">
                                                    <Link 
                                                        to="/jobs" 
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                        onClick={closeAllMenus}
                                                    >
                                                        {t('nav.jobs')}
                                                    </Link>
                                                    {authUser && (
                                                        <>
                                                            <Link 
                                                                to="/jobs/posted" 
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                                onClick={closeAllMenus}
                                                            >
                                                                {t('nav.myPostedJobs')}
                                                            </Link>
                                                            <Link 
                                                                to="/jobs/analytics" 
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                                onClick={closeAllMenus}
                                                            >
                                                                {t('nav.jobAnalytics')}
                                                            </Link>
                                                            <Link 
                                                                to="/post-job" 
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                                onClick={closeAllMenus}
                                                            >
                                                                {t('nav.postNewJob')}
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                
                                // Regular link handling
                                return (
                                    <Link 
                                        key={link.to}
                                        to={link.to} 
                                        className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                            isActive(link.to)
                                                ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                                        }`}
                                        onClick={closeAllMenus}
                                    >
                                        {link.label}
                                        {isActive(link.to) && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                                        )}
                                    </Link>
                                );
                            })}
                            {authUser && authenticatedLinks.map((link) => (
                                <Link 
                                    key={link.to}
                                    to={link.to} 
                                    className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                        isActive(link.to)
                                            ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                                    }`}
                                    onClick={closeAllMenus}
                                >
                                    {link.label}
                                    {isActive(link.to) && (
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                                    )}
                                </Link>
                            ))}
                            {blogLink && (
                                <Link
                                    key={blogLink.to}
                                    to={blogLink.to}
                                    className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                        isActive(blogLink.to)
                                            ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                                    }`}
                                    onClick={closeAllMenus}
                                >
                                    {blogLink.label}
                                    {isActive(blogLink.to) && (
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                                    )}
                                </Link>
                            )}
                            {authUser && (
                                <button
                                    onClick={() => setShowNotificationCenter(true)}
                                    className="relative ml-2 p-2 rounded-full hover:bg-gray-100 transition"
                                    aria-label="Open notifications"
                                >
                                    <Bell className="w-6 h-6 text-gray-700" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow-lg">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/blog"
                                className={`hidden md:inline-flex xl:hidden px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                    isActive('/blog')
                                        ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                                }`}
                                onClick={closeAllMenus}
                            >
                                Blog
                            </Link>
                            {/* Language Switcher */}
                            <div className="relative">
                                <div
                                    className="flex items-center rounded-lg border border-gray-200 bg-white px-1 py-1"
                                    role="group"
                                    aria-label="Select language"
                                >
                                    {languages.map((lang, idx) => (
                                        <React.Fragment key={lang.code}>
                                            <button
                                                type="button"
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={`min-h-[2.25rem] min-w-[2.25rem] rounded-md px-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                                    activeLanguage === lang.code
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                                aria-pressed={activeLanguage === lang.code}
                                                aria-label={`Switch language to ${lang.label}`}
                                            >
                                                {lang.label}
                                            </button>
                                            {idx < languages.length - 1 && <span className="mx-1 text-gray-300">/</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            {authUser ? (
                                <>
                                    {/* User Menu */}
                                    <div className="relative">
                                        <button 
                                            onClick={toggleUserMenu}
                                            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 group"
                                            aria-label="Toggle account menu"
                                            aria-expanded={isUserMenuOpen}
                                            aria-controls="user-menu-dropdown"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                                {authUser.email?.[0].toUpperCase() || 'U'}
                                            </div>
                                            <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                {getUserDisplayName(authUser)}
                                            </span>
                                            <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {isUserMenuOpen && (
                                            <div id="user-menu-dropdown" className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/50 py-2 z-50 backdrop-blur-sm">
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900">{authUser.email}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Film Professional</p>
                                                </div>
                                                
                                                <div className="py-2">
                                                    {authenticatedLinks.map((link) => (
                                                        <Link 
                                                            key={link.to}
                                                            to={link.to} 
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                            onClick={closeAllMenus}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    ))}
                                                    <Link 
                                                        to="/applications" 
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                        onClick={closeAllMenus}
                                                    >
                                                        📝 {t('nav.myApplications')}
                                                    </Link>
                                                    <Link
                                                        to="/jobs/posted"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                        onClick={closeAllMenus}
                                                    >
                                                        💼 {t('nav.postedJobs')}
                                                    </Link>
                                                    {/*
                                                      Teacher-only entry point.
                                                      Hidden for students/professionals so the menu stays focused.
                                                    */}
                                                    {isTeacherUser && (
                                                        <Link
                                                            to="/my-students"
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                            onClick={closeAllMenus}
                                                        >
                                                            🎓 {t('nav.myStudents')}
                                                        </Link>
                                                    )}
                                                    <Link 
                                                        to="/settings" 
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                        onClick={closeAllMenus}
                                                    >
                                                        <Settings size={16} className="mr-2" />
                                                        {t('nav.settings')}
                                                    </Link>
                                                    <button
                                                        onClick={() => setShowNotificationSettings(true)}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                    >
                                                        <Settings size={16} className="mr-2" />
                                                        {t('nav.notificationSettings')}
                                                    </button>
                                                </div>
                                                
                                                <div className="border-t border-gray-100 pt-2">
                                                    <button 
                                                        onClick={() => {
                                                            userSignOut();
                                                            closeAllMenus();
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        {t('nav.signOut')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link 
                                        to="/login" 
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                    >
                                        {t('nav.signIn')}
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            trackConversion('signup_cta_click', {
                                                placement: 'nav_desktop',
                                                destination: '/register',
                                            });
                                            closeAllMenus();
                                            window.location.href = '/register';
                                        }}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        {t('nav.getStarted')}
                                    </button>
                                </div>
                            )}
                            
                            {/* Mobile Menu Button */}
                            <div className="xl:hidden">
                                <button
                                    onClick={toggleMobileMenu}
                                    className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
                                    aria-label="Toggle mobile menu"
                                    aria-expanded={isMobileMenuOpen}
                                    aria-controls="mobile-menu-panel"
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div id="mobile-menu-panel" className="xl:hidden fixed top-16 left-0 right-0 bottom-0 bg-white z-50">
                    <div className="px-4 py-6 space-y-4 h-full overflow-y-auto">
                        
                        {/* Navigation Links */}
                        <div className="space-y-2">
                            {mobileTopLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                                        isActive(link.to)
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                    onClick={closeAllMenus}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {authUser && (
                            <>
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="px-4 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                                        My Account
                                    </p>
                                    <div className="space-y-2">
                                        {authenticatedLinks.map((link) => (
                                            <Link
                                                key={link.to}
                                                to={link.to}
                                                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                                                    isActive(link.to)
                                                        ? 'text-blue-600 bg-blue-50'
                                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                                onClick={closeAllMenus}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                        <Link
                                            to="/applications"
                                            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                                                isActive('/applications')
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                            onClick={closeAllMenus}
                                        >
                                            📝 {t('nav.myApplications')}
                                        </Link>
                                        <Link
                                            to="/jobs/posted"
                                            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                                                isActive('/jobs/posted')
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                            onClick={closeAllMenus}
                                        >
                                            💼 {t('nav.postedJobs')}
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Auth Actions */}
                        <div className="border-t border-gray-200 pt-4 space-y-3">
                            {!authUser ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="block w-full px-4 py-3 text-center font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        onClick={closeAllMenus}
                                    >
                                        {t('nav.signIn')}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            trackConversion('signup_cta_click', {
                                                placement: 'nav_mobile',
                                                destination: '/register',
                                            });
                                            closeAllMenus();
                                            window.location.href = '/register';
                                        }}
                                        className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
                                    >
                                        {t('nav.getStarted')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900">{authUser.email}</p>
                                        <p className="text-xs text-gray-500 mt-1">Film Professional</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            userSignOut();
                                            closeAllMenus();
                                        }}
                                        className="block w-full px-4 py-3 text-center font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        {t('nav.signOut')}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 xl:hidden"
                    onClick={closeAllMenus}
                    style={{ top: '64px' }}
                />
            )}

            {/* Notification Center */}
            <NotificationCenter 
                isOpen={showNotificationCenter}
                onClose={() => setShowNotificationCenter(false)}
            />

            {/* Notification Settings */}
            <NotificationSettings
                isOpen={showNotificationSettings}
                onClose={() => setShowNotificationSettings(false)}
            />
        </>
    );
};

export default Navigation;
