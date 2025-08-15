const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Use environment variables for Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create backup directory with timestamp on desktop
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(process.env.HOME, 'Desktop', `firestore-backup-${timestamp}`);

// Collections to backup
const collections = [
  'crewProfiles',
  'users', 
  'projects',
  'followRequests',
  'notifications',
  'crewFavorites',
  'userPreferences'
];

async function backupCollection(collectionName) {
  console.log(`📦 Backing up ${collectionName}...`);
  
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    
    querySnapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        data: doc.data()
      });
    });
    
    const collectionData = {
      collection: collectionName,
      count: documents.length,
      timestamp: new Date().toISOString(),
      documents: documents
    };
    
    const outputFile = path.join(backupDir, `${collectionName}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(collectionData, null, 2));
    
    console.log(`✅ ${collectionName}: ${documents.length} documents backed up`);
    return documents.length;
  } catch (error) {
    console.error(`❌ Error backing up ${collectionName}:`, error.message);
    return 0;
  }
}

async function backupAllCollections() {
  try {
    console.log('🔄 Starting Firestore backup to Desktop...');
    console.log(`📁 Backup location: ${backupDir}`);
    
    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });
    
    let totalDocuments = 0;
    
    // Backup each collection
    for (const collection of collections) {
      const count = await backupCollection(collection);
      totalDocuments += count;
    }
    
    // Create backup info
    const backupInfo = {
      timestamp: new Date().toISOString(),
      project: 'my-film-jobs',
      collections: collections,
      totalCollections: collections.length,
      totalDocuments: totalDocuments,
      backupLocation: backupDir
    };
    
    fs.writeFileSync(
      path.join(backupDir, 'backup-info.json'), 
      JSON.stringify(backupInfo, null, 2)
    );
    
    console.log('\n🎉 Firestore backup completed successfully!');
    console.log(`📁 Backup saved to: ${backupDir}`);
    console.log(`📊 Total documents: ${totalDocuments}`);
    console.log('🎉 Backup is now on your Desktop!');
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
  }
}

backupAllCollections();
