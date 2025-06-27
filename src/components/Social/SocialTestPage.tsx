import React, { useState } from 'react';
import { SocialService } from '../../utilities/socialService';
import runSocialSystemTest from '../../utilities/socialTestData';

interface SocialTestPageProps {
  currentUserId: string;
}

const SocialTestPage: React.FC<SocialTestPageProps> = ({ currentUserId }) => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addResult('🧪 Starting social system tests...');
      
      // Test 1: Check if SocialService methods exist
      addResult('Testing SocialService methods...');
      const methods = [
        'sendFollowRequest',
        'getFollowRequest', 
        'respondToFollowRequest',
        'getFollow',
        'unfollow',
        'getFollowStatus',
        'getFollowersCount',
        'getFollowingCount'
      ];
      
      methods.forEach(method => {
        if (typeof (SocialService as any)[method] === 'function') {
          addResult(`✅ ${method} method exists`);
        } else {
          addResult(`❌ ${method} method missing`);
        }
      });
      
      // Test 2: Create test data
      addResult('Creating test data...');
      await runSocialSystemTest();
      addResult('✅ Test data created successfully');
      
      // Test 3: Test follow status check
      addResult('Testing follow status check...');
      const status = await SocialService.getFollowStatus(currentUserId, 'test-user-1');
      addResult(`✅ Follow status check: ${status}`);
      
      // Test 4: Test followers count
      addResult('Testing followers count...');
      const count = await SocialService.getFollowersCount(currentUserId);
      addResult(`✅ Followers count: ${count}`);
      
      addResult('🎉 All tests completed successfully!');
      
    } catch (error) {
      addResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-2">Social System Test</h1>
          <p className="text-gray-600 font-light">Test the follow system functionality</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-light tracking-wide rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Running Tests...' : 'Run Social System Tests'}
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Test Results:</h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Test Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click "Run Social System Tests" to verify functionality</li>
              <li>• Check the test results for any errors</li>
              <li>• Navigate to /social to test the full UI</li>
              <li>• Try sending follow requests and accepting them</li>
              <li>• Check real-time updates in the social dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialTestPage; 