// src/components/Register.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Form, FormInput, FormFieldGroup } from './ui/Form';
import { Button } from './ui/Button';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const { signup } = useAuth();
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