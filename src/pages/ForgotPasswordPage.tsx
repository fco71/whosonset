import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { sendPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return setError('Please enter your email address');
    }

    try {
      setError('');
      setLoading(true);
      await sendPasswordReset(email.trim());
      setSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-block text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent tracking-tight"
            >
              My Film Jobs
            </Link>
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start" role="alert">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-6">
                <p className="font-medium mb-2">Can't find the email?</p>
                <ul className="text-left space-y-1">
                  <li>• Check your spam/junk folder</li>
                  <li>• Make sure you entered the correct email address</li>
                  <li>• Wait a few minutes for the email to arrive</li>
                </ul>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending reset link...
                    </div>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Back to Login */}
          {!success && (
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 