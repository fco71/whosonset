const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, limit } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const fs = require('fs');
const path = require('path');

// Use the same Firebase config as your app
const firebaseConfig = {
  apiKey: "AIzaSyBxGQoM3qGCNKC2vtvBS9NUUXOSh88xHxY",
  authDomain: "my-film-jobs.firebaseapp.com",
  projectId: "my-film-jobs",
  storageBucket: "my-film-jobs.appspot.com",
  messagingSenderId: "1097123456789",
  appId: "1:1097123456789:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Create backup directory with timestamp on desktop
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(process.env.HOME, 'Desktop', `complete-firestore-backup-${timestamp}`);

// All collections to backup
const collections = [
  'crewProfiles',
  'users', 
  'projects',
  'followRequests',
  'notifications',
  'crewFavorites',
  'userPreferences',
  'crewProjects',
  'projectCrew',
  'projectApplications',
  'messages',
  'chatRooms',
  'userSessions',
  'analytics',
  'settings'
];

async function authenticateUser() {
  try {
    console.log('🔐 Authenticating...');
    // You'll need to provide admin credentials or use service account
    // For now, we'll try without authentication first
    console.log('⚠️  Attempting backup without authentication...');
    return true;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    return false;
  }
}

async function backupCollection(collectionName) {
  console.log(`📦 Backing up ${collectionName}...`);
  
  try {
    // Try to get all documents, with pagination if needed
    let allDocuments = [];
    let lastDoc = null;
    const batchSize = 100;
    
    while (true) {
      let q = collection(db, collectionName);
      if (lastDoc) {
        q = query(q, limit(batchSize));
      } else {
        q = query(q, limit(batchSize));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach(doc => {
        documents.push({
          id: doc.id,
          data: doc.data(),
          createTime: doc.createTime?.toDate?.() || null,
          updateTime: doc.updateTime?.toDate?.() || null
        });
      });
      
      allDocuments = allDocuments.concat(documents);
      
      if (documents.length < batchSize) {
        break; // No more documents
      }
      
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    }
    
    const collectionData = {
      collection: collectionName,
      count: allDocuments.length,
      timestamp: new Date().toISOString(),
      documents: allDocuments
    };
    
    const outputFile = path.join(backupDir, `${collectionName}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(collectionData, null, 2));
    
    console.log(`✅ ${collectionName}: ${allDocuments.length} documents backed up`);
    return allDocuments.length;
  } catch (error) {
    console.error(`❌ Error backing up ${collectionName}:`, error.message);
    
    // Create empty collection file to show it was attempted
    const collectionData = {
      collection: collectionName,
      count: 0,
      timestamp: new Date().toISOString(),
      error: error.message,
      documents: []
    };
    
    const outputFile = path.join(backupDir, `${collectionName}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(collectionData, null, 2));
    
    return 0;
  }
}

async function backupImages() {
  console.log('🖼️  Creating image backup instructions...');
  
  const imageBackupInfo = {
    timestamp: new Date().toISOString(),
    instructions: [
      "IMPORTANT: This backup includes Firestore data but NOT the actual image files.",
      "To backup images, you need to:",
      "1. Go to Firebase Console > Storage",
      "2. Download all profile images and project images",
      "3. Store them in a separate folder with this backup",
      "4. Keep the image URLs in the JSON files to match with downloaded images"
    ],
    imageCollections: [
      "crewProfiles - profileImageUrl field contains image paths",
      "projects - coverImageUrl field contains image paths", 
      "users - avatarUrl field contains image paths"
    ],
    backupLocation: backupDir
  };
  
  const imageInfoFile = path.join(backupDir, 'IMAGE_BACKUP_INSTRUCTIONS.json');
  fs.writeFileSync(imageInfoFile, JSON.stringify(imageBackupInfo, null, 2));
  
  console.log('📄 Image backup instructions saved');
}

async function comprehensiveBackup() {
  try {
    console.log('🔄 Starting COMPREHENSIVE Firestore backup to Desktop...');
    console.log(`📁 Backup location: ${backupDir}`);
    
    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Authenticate if possible
    await authenticateUser();
    
    let totalDocuments = 0;
    let successfulCollections = 0;
    let failedCollections = 0;
    
    // Backup each collection
    for (const collection of collections) {
      const count = await backupCollection(collection);
      if (count > 0) {
        successfulCollections++;
        totalDocuments += count;
      } else {
        failedCollections++;
      }
    }
    
    // Create image backup instructions
    await backupImages();
    
    // Create comprehensive backup info
    const backupInfo = {
      timestamp: new Date().toISOString(),
      project: 'my-film-jobs',
      collections: collections,
      totalCollections: collections.length,
      successfulCollections: successfulCollections,
      failedCollections: failedCollections,
      totalDocuments: totalDocuments,
      backupLocation: backupDir,
      backupType: 'COMPREHENSIVE',
      includesImages: false,
      imageInstructions: 'See IMAGE_BACKUP_INSTRUCTIONS.json for image backup steps'
    };
    
    fs.writeFileSync(
      path.join(backupDir, 'COMPREHENSIVE_BACKUP_INFO.json'), 
      JSON.stringify(backupInfo, null, 2)
    );
    
    console.log('\n🎉 COMPREHENSIVE Firestore backup completed!');
    console.log(`📁 Backup saved to: ${backupDir}`);
    console.log(`📊 Total documents: ${totalDocuments}`);
    console.log(`✅ Successful collections: ${successfulCollections}`);
    console.log(`❌ Failed collections: ${failedCollections}`);
    console.log('🖼️  Check IMAGE_BACKUP_INSTRUCTIONS.json for image backup steps');
    console.log('🎉 Backup is now on your Desktop!');
    
  } catch (error) {
    console.error('❌ Comprehensive backup failed:', error);
  }
}

comprehensiveBackup();
