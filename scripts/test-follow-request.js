const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://my-film-jobs.firebaseio.com'
});

const db = admin.firestore();

async function testFollowRequest() {
  try {
    const followRequestRef = db.collection('followRequests').doc('test-request');
    await followRequestRef.set({
      toUserId: 'ozfTOauw44ZAI9FvCBkcpvAr5sy2',
      fromUserId: 'MrLprkr8VVhkDU1h87sE6EUdxfr1',
      fromUserName: 'Test User',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Follow request created successfully');
  } catch (error) {
    console.error('Error creating follow request:', error);
  } finally {
    process.exit();
  }
}

testFollowRequest();
