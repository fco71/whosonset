const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin (you'll need to add your service account key)
const serviceAccount = require('../path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

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
  
  const snapshot = await db.collection(collectionName).get();
  const documents = [];
  
  snapshot.forEach(doc => {
    documents.push({
      id: doc.id,
      data: doc.data(),
      createTime: doc.createTime,
      updateTime: doc.updateTime
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
