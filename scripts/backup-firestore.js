const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create backup directory with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(__dirname, '..', 'backups', `firestore-backup-${timestamp}`);

// Ensure backup directory exists
if (!fs.existsSync(path.dirname(backupDir))) {
  fs.mkdirSync(path.dirname(backupDir), { recursive: true });
}

console.log('🔄 Starting Firestore backup...');
console.log(`📁 Backup location: ${backupDir}`);

// Export all collections
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
  return new Promise((resolve, reject) => {
    const outputFile = path.join(backupDir, `${collectionName}.json`);
    
    const command = `firebase firestore:export ${outputFile} --collection-ids=${collectionName}`;
    
    console.log(`📦 Backing up ${collectionName}...`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error backing up ${collectionName}:`, error);
        reject(error);
        return;
      }
      
      console.log(`✅ ${collectionName} backed up successfully`);
      resolve();
    });
  });
}

async function backupAllCollections() {
  try {
    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Backup each collection
    for (const collection of collections) {
      await backupCollection(collection);
    }
    
    // Create backup info file
    const backupInfo = {
      timestamp: new Date().toISOString(),
      collections: collections,
      totalCollections: collections.length,
      backupLocation: backupDir
    };
    
    fs.writeFileSync(
      path.join(backupDir, 'backup-info.json'), 
      JSON.stringify(backupInfo, null, 2)
    );
    
    console.log('\n🎉 Firestore backup completed successfully!');
    console.log(`📁 Backup saved to: ${backupDir}`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
  }
}

backupAllCollections();
