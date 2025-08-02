const EmailNotificationService = require('./src/utilities/emailNotificationService.ts');

async function testEmailIntegration() {
  console.log('🧪 Testing Email Integration...\n');

  // Test 1: Chat notification
  console.log('1. Testing Chat Notification...');
  try {
    const chatResult = await EmailNotificationService.sendChatNotification(
      'franciscoadolfo@gmail.com',
      'Test User',
      'This is a test message from the integration test',
      'http://localhost:8080/chat'
    );
    console.log(`   ✅ Chat notification: ${chatResult ? 'SUCCESS' : 'FAILED'}`);
  } catch (error) {
    console.log(`   ❌ Chat notification: ERROR - ${error.message}`);
  }

  // Test 2: Project notification
  console.log('\n2. Testing Project Notification...');
  try {
    const projectResult = await EmailNotificationService.sendProjectUpdateNotification(
      'franciscoadolfo@gmail.com',
      'Test Project',
      'created',
      'http://localhost:8080/projects/test-project'
    );
    console.log(`   ✅ Project notification: ${projectResult ? 'SUCCESS' : 'FAILED'}`);
  } catch (error) {
    console.log(`   ❌ Project notification: ERROR - ${error.message}`);
  }

  // Test 3: Job application notification
  console.log('\n3. Testing Job Application Notification...');
  try {
    const jobResult = await EmailNotificationService.sendJobApplicationNotification(
      'franciscoadolfo@gmail.com',
      'Test Job Position',
      'Test Applicant',
      'http://localhost:8080/applications/test-application'
    );
    console.log(`   ✅ Job notification: ${jobResult ? 'SUCCESS' : 'FAILED'}`);
  } catch (error) {
    console.log(`   ❌ Job notification: ERROR - ${error.message}`);
  }

  // Test 4: General notification
  console.log('\n4. Testing General Notification...');
  try {
    const generalResult = await EmailNotificationService.sendGeneralNotification(
      'franciscoadolfo@gmail.com',
      'Test General Notification',
      'This is a test general notification from the integration test.'
    );
    console.log(`   ✅ General notification: ${generalResult ? 'SUCCESS' : 'FAILED'}`);
  } catch (error) {
    console.log(`   ❌ General notification: ERROR - ${error.message}`);
  }

  console.log('\n🎉 Email Integration Test Complete!');
  console.log('Check your email inbox for test messages.');
}

// Run the test
testEmailIntegration().catch(console.error); 