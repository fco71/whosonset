// src/components/Navigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
    authUser: any;
    userSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ authUser, userSignOut }) => {
    const location = useLocation();

    // Function to get user initials from email or display name
    const getUserInitials = (user: any) => {
        if (user?.displayName) {
            const names = user.displayName.split(' ');
            if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
            }
            return names[0][0].toUpperCase();
        }
        
        if (user?.email) {
            const emailName = user.email.split('@')[0];
            if (emailName.length >= 2) {
                return emailName.substring(0, 2).toUpperCase();
            }
            return emailName[0].toUpperCase();
        }
        
        return 'U';
    };

    // Function to get user display name
    const getUserDisplayName = (user: any) => {
        if (user?.displayName) {
            return user.displayName;
        }
        
        if (user?.email) {
            const emailName = user.email.split('@')[0];
            // Capitalize first letter and limit length
            return emailName.charAt(0).toUpperCase() + emailName.slice(1, 12);
        }
        
        return 'User';
    };

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
                            <div className="flex items-center space-x-3">
                                {/* User Avatar and Name */}
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                        {getUserInitials(authUser)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                        {getUserDisplayName(authUser)}
                                    </span>
                                </div>
                                
                                {/* Sign Out Button */}
                                <button 
                                    onClick={userSignOut}
                                    className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
