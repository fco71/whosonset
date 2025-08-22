// Test script to verify account deletion cleanup
// Run this script to check if user data persists after account deletion

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkUserDataPersistence(userId) {
  console.log(`\n🔍 Checking for user data persistence for user: ${userId}\n`);
  
  const collectionsToCheck = [
    'users',
    'crewProfiles', 
    'UserCollections',
    'userPreferences',
    'emailTracking',
    'notifications',
    'followRequests',
    'follows',
    'activityFeed',
    'likes',
    'comments',
    'jobPostings',
    'jobApplications',
    'Projects',
    'favorites',
    'crewFavorites',
    'directMessages',
    'conversations',
    'projectCrew',
    'projectBudgets',
    'projectTimelines',
    'projectDocuments',
    'projectMilestones',
    'projectBudget',
    'crewAvailability',
    'collaborativeTasks',
    'connections',
    'collaborations',
    'workspaces',
    'breakdownElements'
  ];

  let totalDocumentsFound = 0;
  const foundData = {};

  for (const collectionName of collectionsToCheck) {
    try {
      let query = db.collection(collectionName);
      
      // Check different field names that might contain user ID
      const fieldChecks = [
        { field: 'userId', value: userId },
        { field: 'uid', value: userId },
        { field: 'createdBy', value: userId },
        { field: 'postedById', value: userId },
        { field: 'applicantId', value: userId },
        { field: 'posterId', value: userId },
        { field: 'owner_uid', value: userId },
        { field: 'assignedTo', value: userId },
        { field: 'fromUserId', value: userId },
        { field: 'toUserId', value: userId },
        { field: 'followerId', value: userId },
        { field: 'followingId', value: userId },
        { field: 'senderId', value: userId },
        { field: 'receiverId', value: userId },
        { field: 'connectedUserId', value: userId }
      ];

      let documentsFound = 0;
      
      for (const fieldCheck of fieldChecks) {
        try {
          const snapshot = await query.where(fieldCheck.field, '==', fieldCheck.value).get();
          if (!snapshot.empty) {
            documentsFound += snapshot.size;
            console.log(`❌ Found ${snapshot.size} documents in ${collectionName} with ${fieldCheck.field} = ${userId}`);
            snapshot.docs.forEach(doc => {
              console.log(`   - Document ID: ${doc.id}`);
            });
          }
        } catch (error) {
          // Field might not exist in this collection, continue
        }
      }

      // Check for array-contains queries
      try {
        const arraySnapshot = await query.where('participants', 'array-contains', userId).get();
        if (!arraySnapshot.empty) {
          documentsFound += arraySnapshot.size;
          console.log(`❌ Found ${arraySnapshot.size} documents in ${collectionName} with participants array containing ${userId}`);
          arraySnapshot.docs.forEach(doc => {
            console.log(`   - Document ID: ${doc.id}`);
          });
        }
      } catch (error) {
        // Field might not exist in this collection, continue
      }

      if (documentsFound > 0) {
        foundData[collectionName] = documentsFound;
        totalDocumentsFound += documentsFound;
      } else {
        console.log(`✅ No data found in ${collectionName}`);
      }

    } catch (error) {
      console.log(`⚠️  Error checking ${collectionName}:`, error.message);
    }
  }

  // Check subcollections
  console.log('\n🔍 Checking subcollections...\n');
  
  const subcollectionsToCheck = [
    { parent: 'users', subcollection: 'notifications' },
    { parent: 'users', subcollection: 'savedJobs' },
    { parent: 'users', subcollection: 'favoriteApplicants' },
    { parent: 'crewProfiles', subcollection: 'notifications' },
    { parent: 'collections', subcollection: 'savedProjects' },
    { parent: 'collections', subcollection: 'savedCrew' }
  ];

  for (const subcollectionCheck of subcollectionsToCheck) {
    try {
      const subcollectionRef = db.collection(subcollectionCheck.parent, userId, subcollectionCheck.subcollection);
      const snapshot = await subcollectionRef.get();
      
      if (!snapshot.empty) {
        console.log(`❌ Found ${snapshot.size} documents in ${subcollectionCheck.parent}/${userId}/${subcollectionCheck.subcollection}`);
        totalDocumentsFound += snapshot.size;
        foundData[`${subcollectionCheck.parent}/${subcollectionCheck.subcollection}`] = snapshot.size;
      } else {
        console.log(`✅ No data found in ${subcollectionCheck.parent}/${userId}/${subcollectionCheck.subcollection}`);
      }
    } catch (error) {
      console.log(`⚠️  Error checking ${subcollectionCheck.parent}/${userId}/${subcollectionCheck.subcollection}:`, error.message);
    }
  }

  // Check job application subcollections
  console.log('\n🔍 Checking job application subcollections...\n');
  
  try {
    const jobApplicationsQuery = db.collection('jobApplications').where('applicantId', '==', userId);
    const jobApplicationsSnapshot = await jobApplicationsQuery.get();
    
    for (const applicationDoc of jobApplicationsSnapshot.docs) {
      const applicationId = applicationDoc.id;
      
      // Check messages subcollection
      const messagesRef = db.collection('jobApplications', applicationId, 'messages');
      const messagesSnapshot = await messagesRef.get();
      if (!messagesSnapshot.empty) {
        console.log(`❌ Found ${messagesSnapshot.size} messages in jobApplications/${applicationId}/messages`);
        totalDocumentsFound += messagesSnapshot.size;
      }
      
      // Check interviews subcollection
      const interviewsRef = db.collection('jobApplications', applicationId, 'interviews');
      const interviewsSnapshot = await interviewsRef.get();
      if (!interviewsSnapshot.empty) {
        console.log(`❌ Found ${interviewsSnapshot.size} interviews in jobApplications/${applicationId}/interviews`);
        totalDocumentsFound += interviewsSnapshot.size;
      }
    }
  } catch (error) {
    console.log(`⚠️  Error checking job application subcollections:`, error.message);
  }

  // Summary
  console.log('\n📊 SUMMARY\n');
  console.log(`Total documents found: ${totalDocumentsFound}`);
  
  if (totalDocumentsFound === 0) {
    console.log('🎉 SUCCESS: No user data persists in the database!');
  } else {
    console.log('❌ ISSUE: User data still persists in the following collections:');
    Object.entries(foundData).forEach(([collection, count]) => {
      console.log(`   - ${collection}: ${count} documents`);
    });
  }

  return totalDocumentsFound;
}

// Usage: node test-account-deletion.js <userId>
const userId = process.argv[2];
if (!userId) {
  console.log('Usage: node test-account-deletion.js <userId>');
  process.exit(1);
}

checkUserDataPersistence(userId)
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
