#!/usr/bin/env node

const https = require('https');

// Test the Firebase function endpoint
const testEmailEndpoint = async () => {
  const data = JSON.stringify({
    to: 'test@example.com',
    subject: 'Test Email',
    message: 'This is a test message',
    senderName: 'Test Sender'
  });

  const options = {
    hostname: 'us-central1-whosonsetdepez.cloudfunctions.net',
    path: '/simpleEmailTest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseData);
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

console.log('Testing Firebase Function endpoint...');
console.log('URL: https://us-central1-whosonsetdepez.cloudfunctions.net/simpleEmailTest');
console.log('');

testEmailEndpoint()
  .then(() => console.log('\nTest completed'))
  .catch((error) => console.error('\nTest failed:', error));