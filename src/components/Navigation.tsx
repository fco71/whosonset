// src/components/Navigation.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';

interface NavigationProps {
    authUser: any;
    userSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ authUser, userSignOut }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Close user menu when mobile menu opens
        if (!isMobileMenuOpen) {
            setIsUserMenuOpen(false);
        }
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
        // Close mobile menu when user menu opens
        if (!isUserMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    const navigationLinks = [
        { to: '/', label: 'Home' },
        { to: '/projects', label: 'Projects' },
        { to: '/jobs', label: 'Jobs' },
        { to: '/crew', label: 'Crew' },
    ];

    const authenticatedLinks = [
        { to: '/my-projects', label: 'My Projects' },
        { to: '/edit-profile', label: 'Resume Builder' },
        { to: '/social', label: 'Social' },
        { to: '/collaboration', label: 'Collaboration' },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm z-50 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="text-2xl font-bold text-gray-900 tracking-tight hover:text-blue-700 transition-colors select-none uppercase" 
                            style={{ letterSpacing: '-0.02em', fontFamily: 'Inter, Helvetica, Arial, sans-serif' }}
                            onClick={closeAllMenus}
                        >
                            WHOSONSET
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8 ml-8">
                        {navigationLinks.map((link) => (
                            <Link 
                                key={link.to}
                                to={link.to} 
                                className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {/* Hide these links for unlogged users */}
                        {authUser && authenticatedLinks.map((link) => (
                            <Link 
                                key={link.to}
                                to={link.to} 
                                className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!authUser ? (
                            <>
                                <Link 
                                    to="/login" 
                                    className="px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-700 transition-all duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-all duration-200 shadow-sm"
                                >
                                    Create Account
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                <button 
                                    onClick={toggleUserMenu}
                                    className="flex items-center space-x-2 px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 transition-colors rounded-lg hover:bg-gray-50"
                                >
                                    <User size={20} />
                                    <span>{authUser.email?.split('@')[0] || 'User'}</span>
                                    <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* User Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{authUser.email}</p>
                                        </div>
                                        <Link 
                                            to="/profile" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors"
                                            onClick={closeAllMenus}
                                        >
                                            Profile
                                        </Link>
                                        <Link 
                                            to="/settings" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors"
                                            onClick={closeAllMenus}
                                        >
                                            Settings
                                        </Link>
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
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-lg text-gray-700 hover:text-blue-700 hover:bg-gray-50 transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur">
                        <div className="px-4 py-6 space-y-4">
                            {/* Navigation Links */}
                            <div className="space-y-2">
                                {navigationLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="block px-4 py-3 text-base font-medium text-gray-800 hover:text-blue-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={closeAllMenus}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Authenticated Links */}
                            {authUser && (
                                <>
                                    <div className="border-t border-gray-200 pt-4">
                                        <p className="px-4 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            My Account
                                        </p>
                                        <div className="space-y-2">
                                            {authenticatedLinks.map((link) => (
                                                <Link
                                                    key={link.to}
                                                    to={link.to}
                                                    className="block px-4 py-3 text-base font-medium text-gray-800 hover:text-blue-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                    onClick={closeAllMenus}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Auth Buttons */}
                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                {!authUser ? (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block w-full px-4 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-700 transition-all duration-200 text-center"
                                            onClick={closeAllMenus}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block w-full px-4 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-all duration-200 shadow-sm text-center"
                                            onClick={closeAllMenus}
                                        >
                                            Create Account
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{authUser.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-3 text-base font-medium text-gray-800 hover:text-blue-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            onClick={closeAllMenus}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-3 text-base font-medium text-gray-800 hover:text-blue-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            onClick={closeAllMenus}
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                userSignOut();
                                                closeAllMenus();
                                            }}
                                            className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop for mobile menu */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeAllMenus}
                />
            )}
        </nav>
    );
};

export default Navigation;