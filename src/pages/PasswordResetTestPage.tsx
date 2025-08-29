import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const PasswordResetTestPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { sendPasswordReset } = useAuth();

  const handleTestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return setError('Please enter an email address');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setError('Please enter a valid email address');
    }

    try {
      setError('');
      setLoading(true);
      setSuccess(false);
      setTestResults(null);
      
      console.log(`🧪 Testing password reset for: ${email}`);
      
      // Test the password reset
      await sendPasswordReset(email.trim());
      
      // Note: Firebase doesn't throw an error for non-existent users
      // It always returns "success" even if the user doesn't exist
      setSuccess(true);
      setTestResults({
        email: email.trim(),
        timestamp: new Date().toISOString(),
        status: 'Request processed',
        note: 'Firebase processes all requests, even for non-existent users. Check if user actually exists in Firebase Auth.'
      });
      
      console.log(`✅ Password reset email sent to: ${email}`);
      
    } catch (err: any) {
      console.error('Password reset test error:', err);
      
      setTestResults({
        email: email.trim(),
        timestamp: new Date().toISOString(),
        status: 'Failed',
        error: err.code || err.message
      });
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError(`Failed to send password reset email: ${err.message || err.code}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testSpecificEmails = async () => {
    const testEmails = [
      'adalpiantini@gmail.com',
      'mariadanielaguzman@gmail.com'
    ];
    
    // Validate email format first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = testEmails.filter(email => emailRegex.test(email));
    const invalidEmails = testEmails.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      setError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }
    
    const results = [];
    
    for (const testEmail of validEmails) {
      try {
        console.log(`🧪 Testing: ${testEmail}`);
        await sendPasswordReset(testEmail);
        results.push({
          email: testEmail,
          status: 'SUCCESS',
          timestamp: new Date().toISOString()
        });
        console.log(`✅ Success: ${testEmail}`);
      } catch (err: any) {
        results.push({
          email: testEmail,
          status: 'FAILED',
          error: err.code || err.message,
          timestamp: new Date().toISOString()
        });
        console.log(`❌ Failed: ${testEmail} - ${err.code || err.message}`);
      }
      
      // Wait a bit between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setTestResults({
      batchTest: true,
      results
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Password Reset Test Tool
          </h1>
          <p className="text-gray-600">
            Test password reset functionality for debugging purposes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manual Test */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Manual Test
            </h2>
            
            <form onSubmit={handleTestReset} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email to test"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 py-2 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Test Password Reset
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Password reset email sent successfully!</span>
              </div>
            )}
          </div>

          {/* Batch Test */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Batch Test (Specific Users)
            </h2>
            
            <p className="text-sm text-gray-600 mb-4">
              Test password reset for the specific users who reported issues.
            </p>
            
            <button
              onClick={testSpecificEmails}
              disabled={loading}
              className="w-full bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200 py-2 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Testing Users...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Test Specific Users
                </>
              )}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Results
            </h2>
            
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {/* Troubleshooting Guide */}
        <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Troubleshooting Guide
          </h2>
          
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>Important Note:</strong> Firebase always shows "success" even for non-existent users. This is normal behavior for security reasons.
            </div>
            <div>
              <strong>If "No account found":</strong> The user needs to create an account first.
            </div>
            <div>
              <strong>If "Invalid email":</strong> Check the email format.
            </div>
            <div>
              <strong>If "Too many requests":</strong> Wait a few minutes before trying again.
            </div>
            <div>
              <strong>If email sent but not received:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Check spam/junk folder</li>
                <li>• Verify email address is correct</li>
                <li>• Check Firebase email templates configuration</li>
                <li>• User might be using OAuth (Google) instead of password</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetTestPage;
