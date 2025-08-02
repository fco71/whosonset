import React, { useState } from 'react';
import EmailNotificationService from '../utilities/emailNotificationService';

const EmailIntegrationTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const runTest = async (testName: string, testFunction: () => Promise<boolean>) => {
    setLoading(testName);
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: result, message: result ? 'SUCCESS' : 'FAILED' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, message: `ERROR: ${error}` }
      }));
    } finally {
      setLoading(null);
    }
  };

  const testChatNotification = async () => {
    return await EmailNotificationService.sendChatNotification(
      'franciscoadolfo@gmail.com',
      'Test User',
      'This is a test message from the integration test page',
      'http://localhost:8080/chat'
    );
  };

  const testProjectNotification = async () => {
    return await EmailNotificationService.sendProjectUpdateNotification(
      'franciscoadolfo@gmail.com',
      'Test Project',
      'created',
      'http://localhost:8080/projects/test-project'
    );
  };

  const testJobNotification = async () => {
    return await EmailNotificationService.sendJobApplicationNotification(
      'franciscoadolfo@gmail.com',
      'Test Job Position',
      'Test Applicant',
      'http://localhost:8080/applications/test-application'
    );
  };

  const testGeneralNotification = async () => {
    return await EmailNotificationService.sendGeneralNotification(
      'franciscoadolfo@gmail.com',
      'Test General Notification',
      'This is a test general notification from the integration test page.'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 Email Integration Test</h1>
          
          <div className="mb-6">
            <p className="text-gray-600">
              This page tests the email notification integration. Each test will send an email to franciscoadolfo@gmail.com.
            </p>
          </div>

          <div className="space-y-4">
            {/* Chat Notification Test */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Chat Notification Test</h3>
              <p className="text-sm text-gray-600 mb-3">Tests sending email notifications for new chat messages</p>
              <button
                onClick={() => runTest('chat', testChatNotification)}
                disabled={loading === 'chat'}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading === 'chat' ? 'Testing...' : 'Test Chat Notification'}
              </button>
              {testResults.chat && (
                <div className={`mt-2 p-2 rounded ${testResults.chat.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {testResults.chat.message}
                </div>
              )}
            </div>

            {/* Project Notification Test */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Project Notification Test</h3>
              <p className="text-sm text-gray-600 mb-3">Tests sending email notifications for project creation</p>
              <button
                onClick={() => runTest('project', testProjectNotification)}
                disabled={loading === 'project'}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading === 'project' ? 'Testing...' : 'Test Project Notification'}
              </button>
              {testResults.project && (
                <div className={`mt-2 p-2 rounded ${testResults.project.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {testResults.project.message}
                </div>
              )}
            </div>

            {/* Job Notification Test */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Job Application Notification Test</h3>
              <p className="text-sm text-gray-600 mb-3">Tests sending email notifications for job applications</p>
              <button
                onClick={() => runTest('job', testJobNotification)}
                disabled={loading === 'job'}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading === 'job' ? 'Testing...' : 'Test Job Notification'}
              </button>
              {testResults.job && (
                <div className={`mt-2 p-2 rounded ${testResults.job.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {testResults.job.message}
                </div>
              )}
            </div>

            {/* General Notification Test */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. General Notification Test</h3>
              <p className="text-sm text-gray-600 mb-3">Tests sending general email notifications</p>
              <button
                onClick={() => runTest('general', testGeneralNotification)}
                disabled={loading === 'general'}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading === 'general' ? 'Testing...' : 'Test General Notification'}
              </button>
              {testResults.general && (
                <div className={`mt-2 p-2 rounded ${testResults.general.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {testResults.general.message}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📧 Test Results</h3>
            <p className="text-sm text-blue-800">
              Check your email inbox (franciscoadolfo@gmail.com) for test messages. 
              Each successful test should send one email notification.
            </p>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• This is for testing only - emails are sent to a real address</li>
              <li>• Each test sends exactly one email per trigger</li>
              <li>• Later we'll implement a weekly limit to prevent spam</li>
              <li>• Check your email inbox for test messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailIntegrationTestPage; 