import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

async function checkCrewProfile() {
  try {
    const userId = 'ozfTOauw44ZAI9FvCBkcpvAr5sy2';
    console.log(`Checking crew profile for user: ${userId}`);
    
    // Get crew profile document
    const crewDoc = await admin.firestore().collection('crewProfiles').doc(userId).get();
    
    if (!crewDoc.exists) {
      console.log('No crew profile found for user');
      return;
    }
    
    const crewData = crewDoc.data();
    console.log('Crew profile data:', JSON.stringify(crewData, null, 2));
    
    // Check for email in various locations
    console.log('Email in root:', crewData?.email);
    console.log('Email in contactInfo:', crewData?.contactInfo?.email);
    console.log('Email in notificationPreferences:', crewData?.notificationPreferences?.email);
    
  } catch (error) {
    console.error('Error checking crew profile:', error);
  } finally {
    // Close the connection
    process.exit();
  }
}

checkCrewProfile();
