import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://my-film-jobs.firebaseio.com'
});

async function listAllUsers(nextPageToken?: string): Promise<admin.auth.UserRecord[]> {
  try {
    // List batch of users, 1000 at a time
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    const users = listUsersResult.users;
    
    // If there are more users, recursively fetch them
    if (listUsersResult.pageToken) {
      const nextPageUsers = await listAllUsers(listUsersResult.pageToken);
      return [...users, ...nextPageUsers];
    }
    
    return users;
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
}

async function exportUserEmails() {
  try {
    console.log('Fetching all users...');
    const users = await listAllUsers();
    
    // Filter out users without email
    const usersWithEmail = users.filter(user => user.email);
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '../user-exports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Create CSV content
    const csvContent = [
      ['Email', 'UID', 'Display Name', 'Email Verified', 'Account Created', 'Last Sign In', 'Disabled'],
      ...usersWithEmail.map(user => [
        `"${user.email}"`,
        `"${user.uid}"`,
        `"${user.displayName || ''}"`,
        `"${user.emailVerified}"`,
        `"${user.metadata.creationTime}"`,
        `"${user.metadata.lastSignInTime || 'Never'}"`,
        `"${user.disabled}"`
      ])
    ].map(row => row.join(',')).join('\n');
    
    // Write to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(outputDir, `users-${timestamp}.csv`);
    fs.writeFileSync(filePath, csvContent);
    
    console.log(`\n✅ Successfully exported ${usersWithEmail.length} users to: ${filePath}`);
    console.log('\nFirst few users:');
    console.log(usersWithEmail.slice(0, 5).map(u => `- ${u.email} (${u.displayName || 'No name'})`).join('\n'));
    
  } catch (error) {
    console.error('Error exporting user emails:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

exportUserEmails();
