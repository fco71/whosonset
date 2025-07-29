// src/components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
    authUser: any;
    userSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ authUser, userSignOut }) => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold">
                        WHOSONSET
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                            Home
                        </Link>
                        <Link to="/crew" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                            Crew
                        </Link>
                        <Link to="/jobs" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                            Jobs
                        </Link>
                        <Link to="/projects" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                            Projects
                        </Link>
                        <Link to="/collaboration" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                            Collaboration
                        </Link>
                        {authUser && (
                            <>
                                <Link to="/social" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                                    Social
                                </Link>
                                <Link to="/edit-profile" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                                    Resume Builder
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-3">
                        {authUser ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-700">{authUser.email}</span>
                                <button 
                                    onClick={userSignOut}
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link 
                                    to="/login" 
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <button 
                                    onClick={() => {
                                        window.location.href = '/register';
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Get Started
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
