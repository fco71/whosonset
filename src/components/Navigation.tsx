// src/components/Navigation.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Search, Bell, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/DropdownMenu';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCenter from './NotificationCenter';

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

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

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
        return activePath === path;
    };

    const navigationLinks = [
        { to: '/', label: 'Home' },
        { to: '/crew', label: 'Crew' },
        { to: '/jobs', label: 'Jobs' },
        { to: '/my-projects', label: 'Projects' },
        { to: '/collaboration', label: 'Collaboration' },
    ];

    const authenticatedLinks = [
        { to: '/social', label: 'Social' },
        { to: '/favorites', label: 'Favorites' },
        { to: '/edit-profile', label: 'Resume Builder' },
    ];

    const jobManagementLinks = [
        { to: '/jobs/posted', label: 'My Posted Jobs' },
        { to: '/jobs/analytics', label: 'Job Analytics' },
        { to: '/post-job', label: 'Post New Job' },
    ];

    const { notifications, loading, markAsRead } = useNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
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
                                <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent tracking-tight">
                                    WHOSONSET
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigationLinks.map((link) => {
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
                                            <span>Jobs</span>
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
                                                    Browse Jobs
                                                </Link>
                                                {authUser && (
                                                    <>
                                                        <Link 
                                                            to="/jobs/posted" 
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                            onClick={closeAllMenus}
                                                        >
                                                            My Posted Jobs
                                                        </Link>
                                                        <Link 
                                                            to="/jobs/analytics" 
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                            onClick={closeAllMenus}
                                                        >
                                                            Job Analytics
                                                        </Link>
                                                        <Link 
                                                            to="/post-job" 
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                            onClick={closeAllMenus}
                                                        >
                                                            Post New Job
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
                        {/* Notification Bell */}
                        <button
                            onClick={() => setShowNotificationCenter(true)}
                            className="relative ml-2 p-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <Bell className="w-6 h-6 text-gray-700" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow-lg">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-3">
                        {authUser ? (
                            <>
                                {/* Quick Actions */}
                                <div className="hidden md:flex items-center space-x-2">
                                    <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors">
                                        <Search size={18} />
                                    </button>
                                </div>
                                
                                {/* User Menu */}
                                <div className="relative">
                                    <button 
                                        onClick={toggleUserMenu}
                                        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 group"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                            {authUser.email?.[0].toUpperCase() || 'U'}
                                        </div>
                                        <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                            {authUser.email?.split('@')[0] || 'User'}
                                        </span>
                                        <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/50 py-2 z-50 backdrop-blur-sm">
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
                                                    📝 My Applications
                                                </Link>
                                                <Link 
                                                    to="/jobs/posted" 
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                    onClick={closeAllMenus}
                                                >
                                                    💼 Posted Jobs
                                                </Link>
                                                <Link 
                                                    to="/settings" 
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                    onClick={closeAllMenus}
                                                >
                                                    <Settings size={16} className="mr-2" />
                                                    Settings
                                                </Link>
                                            </div>
                                            
                                            <div className="border-t border-gray-100 pt-2">
                                                <button 
                                                    onClick={() => {
                                                        userSignOut();
                                                        closeAllMenus();
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    Sign Out
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
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                        
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
                                aria-label="Toggle mobile menu"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
                    <div className="px-4 py-6 space-y-4">
                        {/* Navigation Links */}
                        <div className="space-y-2">
                            {navigationLinks.map((link) => (
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
                                            📝 My Applications
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
                                            💼 Posted Jobs
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
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
                                        onClick={closeAllMenus}
                                    >
                                        Get Started
                                    </Link>
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
                                        Sign Out
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
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeAllMenus}
                    style={{ top: '64px' }}
                />
            )}

            {/* Notification Center */}
            <NotificationCenter 
                isOpen={showNotificationCenter}
                onClose={() => setShowNotificationCenter(false)}
            />
        </nav>
    );
}

export default Navigation;
