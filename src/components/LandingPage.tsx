// src/components/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up">
            whosonset
          </h1>
          <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
            Film Industry Hub
          </h2>
          <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2 mb-12">
            Find and connect with film professionals. Discover the latest movie productions and the talented crews behind them.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up-delay-2">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-4 bg-gray-100 text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;