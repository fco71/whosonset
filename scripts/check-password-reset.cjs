const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://my-film-jobs.firebaseio.com'
});

async function checkUserStatus(email) {
  try {
    console.log(`\n🔍 Checking user: ${email}`);
    
    // Try to get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    console.log(`✅ User found!`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Display Name: ${userRecord.displayName || 'Not set'}`);
    console.log(`   Email Verified: ${userRecord.emailVerified}`);
    console.log(`   Account Created: ${userRecord.metadata.creationTime}`);
    console.log(`   Last Sign In: ${userRecord.metadata.lastSignInTime || 'Never'}`);
    console.log(`   Disabled: ${userRecord.disabled}`);
    console.log(`   Provider: ${userRecord.providerData.map(p => p.providerId).join(', ')}`);
    
    // Check if user has password (not OAuth only)
    const hasPassword = userRecord.providerData.some(p => p.providerId === 'password');
    console.log(`   Has Password: ${hasPassword}`);
    
    if (!hasPassword) {
      console.log(`⚠️  WARNING: This user only has OAuth accounts (Google, etc.) - password reset won't work!`);
      console.log(`   They need to use "Sign in with Google" instead.`);
    }
    
    return { exists: true, hasPassword, userRecord };
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`❌ User not found in Firebase Auth`);
      console.log(`   This means the email was never used to create an account.`);
      return { exists: false, hasPassword: false, userRecord: null };
    } else {
      console.log(`❌ Error checking user: ${error.message}`);
      return { exists: false, hasPassword: false, userRecord: null };
    }
  }
}

async function checkFirebaseLogs(email) {
  console.log(`\n📋 Checking Firebase logs for recent activity...`);
  console.log(`   Note: Firebase Auth logs are limited in the console.`);
  console.log(`   You can check the Firebase Console > Authentication > Users > ${email}`);
  console.log(`   Look for recent sign-in attempts or password reset requests.`);
}

async function testPasswordReset(email) {
  console.log(`\n🧪 Testing password reset for: ${email}`);
  console.log(`   This would normally send a password reset email.`);
  console.log(`   Since we're using admin SDK, we can't trigger the actual email.`);
  console.log(`   But we can verify the user exists and has a password.`);
}

async function main() {
  const emails = [
    'adalpiantini@gmail.com',
    'mariadanielaguzman@gmail.com'
  ];
  
  console.log('🔍 Password Reset Investigation Tool');
  console.log('=====================================');
  
  for (const email of emails) {
    const result = await checkUserStatus(email);
    
    if (result.exists) {
      await checkFirebaseLogs(email);
      await testPasswordReset(email);
      
      if (!result.hasPassword) {
        console.log(`\n💡 SOLUTION: User should use "Sign in with Google" instead of password reset.`);
      } else {
        console.log(`\n💡 NEXT STEPS:`);
        console.log(`   1. Check if user checked spam/junk folder`);
        console.log(`   2. Verify Firebase email templates are configured`);
        console.log(`   3. Test password reset manually in the app`);
        console.log(`   4. Check Firebase Console > Authentication > Users for activity`);
      }
    } else {
      console.log(`\n💡 SOLUTION: User needs to create an account first.`);
    }
    
    console.log('\n' + '='.repeat(50));
  }
  
  console.log('\n📊 Summary:');
  console.log('To check Firebase Auth logs manually:');
  console.log('1. Go to Firebase Console > Authentication > Users');
  console.log('2. Search for each email address');
  console.log('3. Check "Sign-in method" tab for password vs OAuth');
  console.log('4. Look for recent activity in the user details');
  
  process.exit(0);
}

main().catch(console.error);
