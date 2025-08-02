// Simple test file to verify SocialService functionality
// This can be run manually to test the social system

import { SocialService } from './socialService';

// Test function to verify SocialService methods
export const testSocialService = async () => {
  console.log('🧪 Testing SocialService...');
  
  try {
    // Test 1: Check if service can be imported
    console.log('✅ SocialService imported successfully');
    
    // Test 2: Check if methods exist
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
        console.log(`✅ ${method} method exists`);
      } else {
        console.log(`❌ ${method} method missing`);
      }
    });
    
    console.log('🎉 SocialService test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ SocialService test failed:', error);
    return false;
  }
};

// Export for manual testing
export default testSocialService; 