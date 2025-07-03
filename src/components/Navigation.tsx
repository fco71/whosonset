// src/components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
    authUser: any;
    userSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ authUser, userSignOut }) => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-md z-50 transition-all">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-semibold text-gray-900 tracking-tight hover:text-blue-700 transition-colors select-none uppercase" style={{ letterSpacing: '-0.02em', fontFamily: 'Inter, Helvetica, Arial, sans-serif' }}>
                            WHOSONSET
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-10 ml-12">
                        <Link to="/" className="nav-link text-gray-800 text-lg font-light hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Home</Link>
                        <Link to="/projects" className="nav-link text-gray-800 text-lg font-light hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Projects</Link>
                        <Link to="/jobs" className="nav-link text-gray-800 text-lg font-light hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Jobs</Link>
                        <Link to="/crew" className="nav-link text-gray-800 text-lg font-light hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Crew</Link>
                        <Link to="/my-projects" className="nav-link text-gray-800 text-lg font-light hover:text-blue-700 hover:underline underline-offset-4 transition-colors">My Projects</Link>
                        <Link to="/edit-profile" className="nav-link text-gray-800 text-lg font-light hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Resume Builder</Link>
                        <Link to="/social" className="nav-link text-gray-800 text-lg font-light hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Social</Link>
                        <Link to="/collaboration" className="nav-link text-gray-800 text-lg font-light hover:text-blue-700 hover:underline underline-offset-4 transition-colors">Collaboration</Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {!authUser ? (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-base font-light text-gray-600 hover:text-gray-900 transition-colors tracking-wide"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-4 py-2 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 text-base"
                                >
                                    Create Account
                                </Link>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={userSignOut} 
                                    className="text-base font-light text-gray-600 hover:text-gray-900 transition-colors tracking-wide"
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