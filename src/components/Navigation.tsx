// src/components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
    authUser: any;
    userSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ authUser, userSignOut }) => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm z-50 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight hover:text-blue-700 transition-colors select-none uppercase" style={{ letterSpacing: '-0.02em', fontFamily: 'Inter, Helvetica, Arial, sans-serif' }}>
                            WHOSONSET
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8 ml-8">
                        <Link to="/" className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Home</Link>
                        <Link to="/projects" className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Projects</Link>
                        <Link to="/jobs" className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Jobs</Link>
                        <Link to="/crew" className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Crew</Link>
                        {/* Hide these links for unlogged users */}
                        {authUser && <Link to="/my-projects" className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors">My Projects</Link>}
                        {authUser && <Link to="/edit-profile" className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Resume Builder</Link>}
                        {authUser && <Link to="/social" className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Social</Link>}
                        {authUser && <Link to="/collaboration" className="nav-link text-gray-800 text-base font-normal hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Collaboration</Link>}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
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
                            <>
                                <button 
                                    onClick={userSignOut} 
                                    className="px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;