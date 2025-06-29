import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface UserMenuProps {
    authUser: any;
    userSignOut: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ authUser, userSignOut }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                        {authUser?.displayName?.[0] || authUser?.email?.[0] || 'U'}
                    </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {authUser?.displayName || authUser?.email?.split('@')[0] || 'User'}
                </span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                            {authUser?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">{authUser?.email}</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Actions</h3>
                        <Link
                            to="/projects/add"
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            ➕ Add Project
                        </Link>
                        <Link
                            to="/edit-profile"
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            📝 Edit Profile
                        </Link>
                    </div>

                    {/* My Stuff */}
                    <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">My Stuff</h3>
                        <Link
                            to="/applications"
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            📋 My Applications
                        </Link>
                        <Link
                            to="/my-projects"
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            🎬 My Projects
                        </Link>
                        <Link
                            to="/collections"
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            📁 My Collections
                        </Link>
                        <Link
                            to="/favorites"
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            ❤️ Favorites
                        </Link>
                    </div>

                    {/* Tools */}
                    <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tools</h3>
                        <Link
                            to="/collaboration"
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            🤝 Collaboration
                        </Link>
                        <Link
                            to="/video-conference"
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            📹 Video Calls
                        </Link>
                        <Link
                            to="/chat-test"
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            💬 Chat Demo
                        </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="px-4 py-2 border-t border-gray-100">
                        <button
                            onClick={() => {
                                userSignOut();
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                            🚪 Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu; 