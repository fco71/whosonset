// src/components/Register.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Form, FormInput, FormFieldGroup } from './ui/Form';
import { Button } from './ui/Button';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const { signup, loginWithGoogle, loginWithApple } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError(t('auth.errors.nameRequired'));
      return false;
    }
    if (!formData.email.trim()) {
      setError(t('auth.errors.emailRequired'));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t('auth.errors.passwordLength'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.errors.passwordMatch'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('[Register] Calling signup with:', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      // Use the AuthContext signup method which creates crewProfiles document
      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      console.log('[Register] Signup completed successfully');
      setSuccess(t('auth.errors.accountCreated'));
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      console.error('[Register] Registration error:', error);
      setError(
        error.code === 'auth/email-already-in-use'
          ? t('auth.errors.emailInUse')
          : error.code === 'auth/weak-password'
          ? t('auth.errors.weakPassword')
          : error.code === 'auth/invalid-email'
          ? t('auth.errors.invalidEmail')
          : t('auth.errors.registrationError')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(
        error.code === 'auth/popup-closed-by-user'
          ? t('auth.errors.popupClosed')
          : error.code === 'auth/popup-blocked'
          ? t('auth.errors.popupBlocked')
          : error.message && error.message.includes('not enabled')
          ? 'Google sign-in is not enabled. Please contact support.'
          : t('auth.errors.googleSignInError')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      await loginWithApple();
      navigate('/');
    } catch (error: any) {
      console.error('Apple sign-in error:', error);
      setError(
        error.code === 'auth/popup-closed-by-user'
          ? t('auth.errors.popupClosed')
          : error.code === 'auth/popup-blocked'
          ? t('auth.errors.popupBlocked')
          : error.message && error.message.includes('not enabled')
          ? 'Apple sign-in is not enabled. Please contact support.'
          : t('auth.errors.appleSignInError')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.register.title')}</h1>
          <p className="text-gray-600">{t('auth.register.subtitle')}</p>
        </div>

        {/* Registration Form */}
        <div className="card-modern">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
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
              <span>{loading ? t('auth.register.creatingAccount') : t('auth.login.continueWithGoogle')}</span>
            </Button>

            <Button
              type="button"
              onClick={handleAppleSignIn}
              disabled={loading}
              className="w-full bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-all duration-200 py-3 flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>{loading ? t('auth.register.creatingAccount') : t('auth.login.continueWithApple')}</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('auth.login.or')}</span>
            </div>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <FormFieldGroup title={t('auth.register.personalInfo')}>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label={t('auth.register.firstName')}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder={t('auth.register.firstNamePlaceholder')}
                  leftIcon={<User size={16} />}
                  required
                  autoComplete="given-name"
                />
                <FormInput
                  label={t('auth.register.lastName')}
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder={t('auth.register.lastNamePlaceholder')}
                  leftIcon={<User size={16} />}
                  required
                  autoComplete="family-name"
                />
              </div>
            </FormFieldGroup>

            <FormFieldGroup title={t('auth.register.accountDetails')}>
              <FormInput
                label={t('auth.register.email')}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('auth.register.emailPlaceholder')}
                leftIcon={<Mail size={16} />}
                required
                autoComplete="email"
              />

              <div className="relative">
                <FormInput
                  label={t('auth.register.password')}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  required
                  autoComplete="new-password"
                  helperText={t('auth.register.passwordHelper')}
                />
              </div>

              <div className="relative">
                <FormInput
                  label={t('auth.register.confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showConfirmPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  required
                  autoComplete="new-password"
                />
              </div>
            </FormFieldGroup>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('auth.register.creatingAccount')}
                </div>
              ) : (
                t('auth.register.createAccount')
              )}
            </Button>
          </Form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.register.haveAccount')}{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                {t('auth.register.signInHere')}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {t('auth.register.termsPrivacy')}{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
              {t('auth.login.termsService')}
            </Link>{' '}
            {t('auth.login.and')}{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
              {t('auth.login.privacyPolicy')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;