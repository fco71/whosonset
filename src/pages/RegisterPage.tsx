import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, X } from 'lucide-react';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText, PASSWORD_REQUIREMENTS } from '../utilities/passwordValidation';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''));
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Update password validation when password changes
  useEffect(() => {
    setPasswordValidation(validatePassword(password));
  }, [password]);

  // Check if passwords match when confirm password changes
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      return setError('First name and last name are required');
    }

    if (!passwordsMatch) {
      return setError('Passwords do not match');
    }

    if (!passwordValidation.isValid) {
      return setError('Please meet all password requirements');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, firstName.trim(), lastName.trim());
      navigate('/verify-email');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password');
      } else {
        setError('Failed to create an account. Please try again.');
      }
      console.error(err);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const { isNewUser } = await loginWithGoogle();
      
      // Redirect new users to profile builder, existing users to home
      if (isNewUser) {
        navigate('/edit-profile');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(
        error.code === 'auth/popup-closed-by-user'
          ? 'Sign-in was cancelled. Please try again.'
          : error.code === 'auth/popup-blocked'
          ? 'Sign-in popup was blocked. Please allow popups and try again.'
          : error.message && error.message.includes('not enabled')
          ? 'Google sign-in is not enabled. Please contact support.'
          : 'Google sign-in failed. Please try again.'
      );
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join the Film Community
          </h2>
          <p className="text-gray-600">
            Create your account and start connecting with industry professionals
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Google Login Button */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 py-3 flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{loading ? 'Creating account...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

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

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => setShowPasswordRequirements(false)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${getPasswordStrengthColor(passwordValidation.strength)}`}>
                      {getPasswordStrengthText(passwordValidation.strength)}
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordValidation.strength === 'weak' ? 'bg-red-500' :
                        passwordValidation.strength === 'medium' ? 'bg-yellow-500' :
                        passwordValidation.strength === 'strong' ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${passwordValidation.score}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Password Requirements */}
              {showPasswordRequirements && password && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                  <div className="space-y-1">
                    {PASSWORD_REQUIREMENTS.map((requirement) => {
                      const isMet = requirement.test(password);
                      return (
                        <div key={requirement.name} className="flex items-center text-sm">
                          {isMet ? (
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <X className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className={isMet ? 'text-green-700' : 'text-red-700'}>
                            {requirement.message}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    confirmPassword && !passwordsMatch 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Match Warning */}
              {confirmPassword && !passwordsMatch && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <X className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>Passwords do not match</span>
                </div>
              )}
              
              {/* Password Match Success */}
              {confirmPassword && passwordsMatch && password && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !passwordsMatch || !passwordValidation.isValid}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating your account...
                  </div>
                ) : !passwordsMatch ? (
                  <span>Passwords do not match</span>
                ) : !passwordValidation.isValid ? (
                  <span>Please meet password requirements</span>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Join thousands of film professionals</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Network with industry pros
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Find exciting projects
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Showcase your work
            </div>
          </div>
        </div>
        
        {/* Legal Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <Link to="/privacy-policy" className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-gray-700 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-gray-700 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
