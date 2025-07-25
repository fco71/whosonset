// src/components/Login.tsx

// test comment

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Form, FormInput, FormFieldGroup } from './ui/Form';
import { Button } from './ui/Button';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    setLoading(true);
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError(t('auth.errors.emailPasswordRequired'));
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
          ? t('auth.errors.invalidCredentials')
          : error.code === 'auth/too-many-requests'
          ? t('auth.errors.tooManyRequests')
          : t('auth.errors.loginError')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.login.title')}</h1>
          <p className="text-gray-600">{t('auth.login.subtitle')}</p>
        </div>

        {/* Login Form */}
        <div
          className="card-modern"
          style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 6px 32px rgba(0,0,0,0.08)',
            padding: '2.5rem 2rem',
            marginTop: 24,
            marginBottom: 24,
            border: '1.5px solid #f3f6fa',
            minWidth: 340,
            maxWidth: 420,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <FormFieldGroup>
              <FormInput
                label={t('auth.login.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.login.emailPlaceholder')}
                size="lg"
                variant="filled"
                required
                autoComplete="email"
              />

              <div className="relative">
                <FormInput
                  label={t('auth.login.password')}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  size="lg"
                  variant="filled"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  required
                  autoComplete="current-password"
                />
              </div>
            </FormFieldGroup>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 border-0 rounded-lg text-lg py-3"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('auth.login.signingIn')}
                </div>
              ) : (
                t('auth.login.signIn')
              )}
            </Button>
          </Form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.login.noAccount')}{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                {t('auth.login.createAccount')}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-xs text-gray-500">
            {t('auth.login.termsPrivacy')}{' '}
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

export default Login;