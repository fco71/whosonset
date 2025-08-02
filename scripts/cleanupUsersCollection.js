// Cleanup script to remove users collection since we're only using crewProfiles
// Run this script if you want to completely remove the users collection

const admin = require('firebase-admin');
const serviceAccount = require('../path-to-your-service-account.json'); // Update this path

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanupUsersCollection() {
  try {
    console.log('Starting cleanup of users collection...');
    
    // Get all documents in users collection
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('No documents found in users collection.');
      return;
    }
    
    console.log(`Found ${usersSnapshot.size} documents in users collection.`);
    
    // Delete all documents in users collection
    const batch = db.batch();
    usersSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('Successfully deleted all documents in users collection.');
    
    // Note: The collection itself will be automatically removed when empty
    
  } catch (error) {
    console.error('Error cleaning up users collection:', error);
  }
}

// Run the cleanup
cleanupUsersCollection()
  .then(() => {
    console.log('Cleanup completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }); 