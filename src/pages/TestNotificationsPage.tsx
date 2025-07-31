import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessagingService } from '../utilities/messagingService';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';

const TestNotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const sendTestMessage = async () => {
    if (!currentUser) {
      setResult('Error: No user logged in');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      // Send a test message to yourself
      const messageId = await MessagingService.sendDirectMessage(
        currentUser.uid,
        currentUser.uid, // Send to yourself for testing
        'This is a test message to verify notifications are working!',
        'text'
      );

      setResult(`✅ Test message sent successfully! Message ID: ${messageId}`);
    } catch (error) {
      console.error('Error sending test message:', error);
      setResult(`❌ Error sending test message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testNotificationDirectly = async () => {
    if (!currentUser) {
      setResult('Error: No user logged in');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      // Create a test notification directly
      await MessagingService.createMessageNotification(
        currentUser.uid,
        currentUser.uid,
        'test-message-id',
        'This is a direct test notification',
        'text'
      );

      setResult('✅ Test notification created directly!');
    } catch (error) {
      console.error('Error creating test notification:', error);
      setResult(`❌ Error creating test notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Test Notifications</h1>
          <p className="text-gray-600">Please log in to test notifications.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Test Notifications</h1>
        <p className="text-gray-600 mb-6">
          This page helps test the notification system. Use these buttons to verify that notifications are working properly.
        </p>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Message Notification</h2>
            <p className="text-sm text-gray-600 mb-3">
              This will send a test message to yourself, which should trigger a notification.
            </p>
            <Button 
              onClick={sendTestMessage} 
              disabled={loading}
              className="mr-3"
            >
              {loading ? 'Sending...' : 'Send Test Message'}
            </Button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Test Direct Notification</h2>
            <p className="text-sm text-gray-600 mb-3">
              This will create a notification directly without sending a message.
            </p>
            <Button 
              onClick={testNotificationDirectly} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Creating...' : 'Create Test Notification'}
            </Button>
          </div>

          {result && (
            <div className={`mt-4 p-4 rounded-lg ${
              result.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={result.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                {result}
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How to Test:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Click "Send Test Message" to trigger a message notification</li>
              <li>2. Check the notification bell in the navigation bar</li>
              <li>3. Open the notification center to see the notification</li>
              <li>4. Check your email for email notifications (if enabled)</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestNotificationsPage; 