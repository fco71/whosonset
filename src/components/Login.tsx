// src/components/Login.tsx

// test comment

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Successfully Logged In");
      navigate('/');
    } catch (error: any) {
      setError(error.message);
      console.error("Login failed:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
            whosonset
          </h1>
          <h2 className="text-2xl font-light text-gray-600 tracking-wide">
            Welcome back
          </h2>
          <p className="text-base font-light text-gray-500 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-slide-up-delay">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="w-full px-6 py-4 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm font-light text-gray-500">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors duration-300 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-slide-up-delay-2">
          <p className="text-xs font-light text-gray-400 tracking-wide">
            © 2024 whosonset. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;