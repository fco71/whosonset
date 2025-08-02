// Quick local test for email function
// Usage: node test-local-email.js

const fetch = require('node-fetch');

async function testEmail() {
  const testData = {
    to: 'test@example.com', // Change this to your email
    subject: 'Test Email from My Film Jobs',
    message: 'This is a test email to verify the SendGrid integration is working correctly.',
    senderName: 'Test User'
  };

  console.log('Testing email function locally...');
  console.log('Sending to:', testData.to);

  try {
    const response = await fetch('http://localhost:5001/my-film-jobs/us-central1/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', result);
    } else {
      console.log('❌ Error:', result);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('Make sure the emulator is running: npm run serve');
  }
}

testEmail();