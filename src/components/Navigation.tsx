// src/components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
    authUser: any;
    userSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ authUser, userSignOut }) => {
    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-light text-gray-900 tracking-tight hover:text-gray-700 transition-colors">
                            whosonset
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/" 
                            className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 tracking-wide"
                        >
                            Home
                        </Link>
                        <Link 
                            to="/projects" 
                            className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 tracking-wide"
                        >
                            Projects
                        </Link>
                        <Link 
                            to="/my-projects" 
                            className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 tracking-wide"
                        >
                            My Projects
                        </Link>
                        {authUser && (
                            <>
                                <Link 
                                    to="/crew" 
                                    className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 tracking-wide"
                                >
                                    Crew
                                </Link>
                                <Link 
                                    to="/collaboration" 
                                    className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 tracking-wide"
                                >
                                    Collaboration
                                </Link>
                                <Link 
                                    to="/video-conference" 
                                    className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 tracking-wide"
                                >
                                    Video Calls
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {!authUser ? (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 tracking-wide"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-4 py-2 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 text-sm"
                                >
                                    Create Account
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/projects/add" 
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 text-sm"
                                >
                                    Add Project
                                </Link>
                                <button 
                                    onClick={userSignOut} 
                                    className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 tracking-wide"
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