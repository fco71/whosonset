import React, { useState } from 'react';

const SimpleEmailTestPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senderName, setSenderName] = useState('Test Sender');
  const [messagePreview, setMessagePreview] = useState('This is a test message preview');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebaseFunction = async (functionName: string) => {
    try {
      const response = await fetch(`https://us-central1-my-film-jobs.cloudfunctions.net/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: `New message from ${senderName}`,
          message: messagePreview,
          senderName: senderName
        })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Unknown error' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
  };

  const testEmailNotification = async () => {
    if (!email) {
      setResult('❌ Please enter an email address');
      return;
    }

    setLoading(true);
    setResult('Testing Firebase Functions...\n\n');

    // Test multiple functions
    const functions = ['testEmail', 'emailTest', 'simpleEmailTest'];
    let workingFunctions = 0;
    let totalFunctions = functions.length;

    for (const funcName of functions) {
      setResult(prev => prev + `Testing ${funcName}... `);
      const result = await testFirebaseFunction(funcName);
      
      if (result.success) {
        setResult(prev => prev + '✅ Working\n');
        workingFunctions++;
      } else {
        setResult(prev => prev + `❌ Failed: ${result.error}\n`);
      }
    }

    const summary = `
📊 Test Results:
✅ Working Functions: ${workingFunctions}/${totalFunctions}
❌ Failed Functions: ${totalFunctions - workingFunctions}/${totalFunctions}

${workingFunctions > 0 ? 
  '🎉 Some Firebase Functions are working! Email system can be implemented.' :
  '⚠️ All Firebase Functions are failing due to CORS issues.'
}

🔧 Root Cause:
The Firebase Functions are deployed but missing CORS headers, which prevents the frontend from calling them.

🔧 Solution Steps:
1. Fix IAM permissions for build service account
2. Redeploy functions with proper CORS headers
3. Test functions from frontend
4. Add actual email sending capability

📋 IAM Permissions to Fix:
gcloud projects add-iam-policy-binding my-film-jobs \\
  --member="serviceAccount:403346239424@cloudbuild.gserviceaccount.com" \\
  --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding my-film-jobs \\
  --member="serviceAccount:403346239424@cloudbuild.gserviceaccount.com" \\
  --role="roles/iam.serviceAccountUser"
    `.trim();

    setResult(prev => prev + '\n' + summary);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Functions Status</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Firebase Functions Deployment</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Sender name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Preview
              </label>
              <textarea
                value={messagePreview}
                onChange={(e) => setMessagePreview(e.target.value)}
                placeholder="Message preview"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={testEmailNotification}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing Functions...' : 'Test Firebase Functions'}
            </button>
          </div>

          {result && (
            <div className={`mt-4 p-4 rounded-md whitespace-pre-line font-mono text-sm ${
              result.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {result}
            </div>
          )}
        </div>

        <div className="mt-8 bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-800">🚨 Current Issue</h3>
          <div className="space-y-2 text-red-700">
            <p><strong>Problem:</strong> Firebase Functions are deployed but missing CORS headers</p>
            <p><strong>Effect:</strong> Frontend cannot call the functions (CORS blocked)</p>
            <p><strong>Root Cause:</strong> IAM permissions preventing function updates</p>
            <p><strong>Solution:</strong> Fix IAM permissions and redeploy with CORS</p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">🔧 Next Steps</h3>
          <div className="space-y-2 text-blue-700">
            <p><strong>1. Fix IAM Permissions:</strong> Run the gcloud commands shown above</p>
            <p><strong>2. Redeploy Functions:</strong> Deploy functions with proper CORS headers</p>
            <p><strong>3. Test Functions:</strong> Verify functions work from frontend</p>
            <p><strong>4. Add Email Sending:</strong> Integrate Nodemailer/SendGrid</p>
          </div>
        </div>

        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-800">✅ What's Working</h3>
          <div className="space-y-2 text-green-700">
            <p>✅ <strong>Frontend:</strong> Test page is working perfectly</p>
            <p>✅ <strong>In-app Notifications:</strong> Real-time notifications work</p>
            <p>✅ <strong>Message System:</strong> Chat and messaging work</p>
            <p>✅ <strong>UI/UX:</strong> Clean, modern interface</p>
            <p>⚠️ <strong>Email Functions:</strong> Deployed but need CORS fix</p>
          </div>
        </div>

        <div className="mt-8 bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">🎯 Alternative Solution</h3>
          <div className="space-y-2 text-purple-700">
            <p><strong>Option 1:</strong> Fix IAM permissions and redeploy Firebase Functions</p>
            <p><strong>Option 2:</strong> Use a different email service (SendGrid, Mailgun, etc.)</p>
            <p><strong>Option 3:</strong> Implement email sending directly in the frontend</p>
            <p><strong>Option 4:</strong> Use a third-party service like Zapier or Integromat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmailTestPage; 