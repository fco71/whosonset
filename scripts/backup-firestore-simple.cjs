const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
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
