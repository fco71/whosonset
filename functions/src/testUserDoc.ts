import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

async function testUserDoc() {
  try {
    const userId = 'ozfTOauw44ZAI9FvCBkcpvAr5sy2';
    
    // Get user document from users collection
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    console.log('User document data:', JSON.stringify(userDoc.data(), null, 2));
    
    // Get crew profile document
    const crewDoc = await admin.firestore().collection('crewProfiles').doc(userId).get();
    console.log('Crew profile data:', JSON.stringify(crewDoc.data(), null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    process.exit();
  }
}

testUserDoc();
