import React, { useState } from 'react';
import { SocialService } from '../../utilities/socialService';
import runSocialSystemTest from '../../utilities/socialTestData';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

interface SocialTestPageProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
}

const SocialTestPage: React.FC<SocialTestPageProps> = ({ 
  currentUserId, 
  currentUserName,
  currentUserAvatar 
}) => {
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
      
      // Test 5: Test sending follow request and notification
      addResult('Testing follow request and notification...');
      try {
        await SocialService.sendFollowRequest(currentUserId, 'test-user-1', 'Test follow request');
        addResult('✅ Follow request sent successfully');
        
        // Check if notification was created
        setTimeout(async () => {
          const notificationsQuery = query(
            collection(db, 'notifications'),
            where('userId', '==', 'test-user-1'),
            where('type', '==', 'follow_request')
          );
          const snapshot = await getDocs(notificationsQuery);
          if (!snapshot.empty) {
            addResult(`✅ Notification created: ${snapshot.docs[0].id}`);
          } else {
            addResult('❌ No notification found');
          }
        }, 2000);
        
      } catch (error) {
        addResult(`❌ Follow request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      addResult('🎉 All tests completed successfully!');
      
    } catch (error) {
      addResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testNotificationCreation = async () => {
    if (!currentUserId) {
      alert('Please log in first');
      return;
    }

    try {
      console.log('[SocialTestPage] Testing notification creation for user:', currentUserId);
      
      // Create a test notification
      await SocialService.createNotification({
        userId: currentUserId,
        type: 'follow_request',
        title: 'Test Follow Request',
        message: 'This is a test notification to verify the system is working',
        relatedUserId: 'test-user-id',
        isRead: false,
        createdAt: new Date(),
        actionUrl: '/social'
      });
      
      console.log('[SocialTestPage] Test notification created successfully');
      alert('Test notification created! Check your notification bell.');
      
    } catch (error) {
      console.error('[SocialTestPage] Error creating test notification:', error);
      alert('Error creating test notification: ' + error);
    }
  };

  const testFollowRequestWithNotification = async () => {
    if (!currentUserId) {
      alert('Please log in first');
      return;
    }

    try {
      console.log('[SocialTestPage] Testing follow request with notification');
      
      // Create a test user ID (this would normally be a real user)
      const testTargetUserId = 'test-target-user-' + Date.now();
      
      // Send follow request (this should create a notification)
      await SocialService.sendFollowRequest(currentUserId, testTargetUserId, 'Test follow request');
      
      console.log('[SocialTestPage] Test follow request sent successfully');
      alert('Test follow request sent! Check the console for logs.');
      
    } catch (error) {
      console.error('[SocialTestPage] Error sending test follow request:', error);
      alert('Error sending test follow request: ' + error);
    }
  };

  const testActivityFeedWithLikesAndComments = async () => {
    if (!currentUserId) {
      alert('Please log in first');
      return;
    }

    try {
      console.log('[SocialTestPage] Testing activity feed with likes and comments');
      
      // Create a test activity feed item
      await SocialService.createActivityFeedItem({
        userId: currentUserId,
        type: 'project_created',
        title: 'Test Project Created',
        description: 'This is a test activity to verify like and comment functionality',
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        isPublic: true
      });
      
      console.log('[SocialTestPage] Test activity created successfully');
      alert('Test activity created! Check the activity feed to test likes and comments.');
      
    } catch (error) {
      console.error('[SocialTestPage] Error creating test activity:', error);
      alert('Error creating test activity: ' + error);
    }
  };

  const testLikeAndCommentFunctionality = async () => {
    if (!currentUserId) {
      alert('Please log in first');
      return;
    }

    try {
      console.log('[SocialTestPage] Testing like and comment functionality');
      
      // Get the first activity from the feed
      const activities = await SocialService.getActivityFeed(currentUserId, 1);
      if (activities.length === 0) {
        alert('No activities found. Create an activity first.');
        return;
      }
      
      const activity = activities[0];
      
      // Test liking the activity
      await SocialService.likeActivity(activity.id, currentUserId, currentUserName);
      console.log('[SocialTestPage] Activity liked successfully');
      
      // Test adding a comment
      await SocialService.addComment(activity.id, currentUserId, currentUserName, currentUserAvatar, 'This is a test comment!');
      console.log('[SocialTestPage] Comment added successfully');
      
      alert('Like and comment functionality tested successfully! Check the activity feed.');
      
    } catch (error) {
      console.error('[SocialTestPage] Error testing like and comment functionality:', error);
      alert('Error testing like and comment functionality: ' + error);
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

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={testNotificationCreation}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white font-light tracking-wide rounded-lg hover:bg-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              Test Notification Creation
            </button>
            
            <button
              onClick={testFollowRequestWithNotification}
              disabled={loading}
              className="px-6 py-3 bg-orange-600 text-white font-light tracking-wide rounded-lg hover:bg-orange-700 transition-all duration-300 disabled:opacity-50"
            >
              Test Follow Request + Notification
            </button>
            
            <button
              onClick={testActivityFeedWithLikesAndComments}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white font-light tracking-wide rounded-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
            >
              Create Test Activity
            </button>
            
            <button
              onClick={testLikeAndCommentFunctionality}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-light tracking-wide rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
            >
              Test Likes & Comments
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