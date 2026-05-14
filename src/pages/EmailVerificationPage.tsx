import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const EmailVerificationPage: React.FC = () => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { currentUser, sendEmailVerification, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // If email is already verified, redirect to home
    if (currentUser.emailVerified) {
      navigate('/');
      return;
    }

    // Show success message immediately for better UX
    setShowSuccessMessage(true);
  }, [currentUser, navigate]);

  const handleSendVerification = async () => {
    try {
      setLoading(true);
      setError('');
      await sendEmailVerification();
      setVerificationSent(true);
    } catch (err: any) {
      if (err.message.includes('already verified')) {
        navigate('/');
      } else {
        setError('Failed to send verification email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      setError('');
      await resendVerificationEmail();
      setVerificationSent(true);
    } catch (err: any) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setLoading(true);
      setError('');

      // useEffect already redirects to /login when currentUser is null,
      // but TS can't see across the render boundary — narrow explicitly.
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Reload the user to check if email was verified
      await currentUser.reload();

      if (currentUser.emailVerified) {
        navigate('/edit-profile');
      } else {
        setError('Email not yet verified. Please check your inbox and click the verification link.');
      }
    } catch (err: any) {
      setError('Failed to check verification status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

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
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Account Created Successfully! 🎉
          </h2>
          <p className="text-gray-600">
            We've sent a verification link to <strong>{currentUser.email}</strong>
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start" role="alert">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {showSuccessMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start" role="alert">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Welcome to My Film Jobs! Your account has been created successfully.</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Instructions */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                To complete your registration, please verify your email address by clicking the link we just sent you.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                <p className="font-medium mb-2">📧 Check your email inbox</p>
                <ul className="text-left space-y-1">
                  <li>• Look for an email from My Film Jobs</li>
                  <li>• Click the "Verify Email" button in the email</li>
                  <li>• You'll be redirected to complete your profile</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={loading}
                className="w-full bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200 py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                <span>{loading ? 'Checking...' : "I've Verified My Email - Continue to Profile"}</span>
              </button>

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-all duration-200 py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="h-5 w-5" />
                <span>{loading ? 'Sending...' : 'Resend Verification Email'}</span>
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-gray-600 hover:text-gray-500 transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Can't find the email? Check your spam folder or contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage; 