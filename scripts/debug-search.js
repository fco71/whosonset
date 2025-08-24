const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function debugSearch() {
  console.log('🔍 Debugging search functionality...\n');

  try {
    // 1. Check all crew profiles
    console.log('📋 All Crew Profiles:');
    const crewSnapshot = await db.collection('crewProfiles').get();
    const crewProfiles = crewSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`Found ${crewProfiles.length} crew profiles:`);
    crewProfiles.forEach(profile => {
      console.log(`- ID: ${profile.id}`);
      console.log(`  Name: ${profile.name || 'N/A'}`);
      console.log(`  Display Name: ${profile.displayName || 'N/A'}`);
      console.log(`  Email: ${profile.email || 'N/A'}`);
      console.log(`  Username: ${profile.username || 'N/A'}`);
      console.log(`  isPublished: ${profile.isPublished}`);
      console.log(`  Job Titles: ${JSON.stringify(profile.jobTitles || [])}`);
      console.log('---');
    });

    // 2. Search for "My Film Jobs" specifically
    console.log('\n🔎 Searching for "My Film Jobs":');
    const searchTerms = ['my', 'film', 'jobs', 'myfilmjobs', 'iam'];
    
    searchTerms.forEach(term => {
      console.log(`\nSearching for "${term}":`);
      const matches = crewProfiles.filter(profile => {
        const profileText = [
          profile.name,
          profile.displayName,
          profile.email,
          profile.username,
          profile.bio,
          ...(profile.jobTitles || []).map(job => job.title)
        ].filter(Boolean).join(' ').toLowerCase();
        
        return profileText.includes(term.toLowerCase());
      });
      
      if (matches.length > 0) {
        matches.forEach(match => {
          console.log(`✅ Found: ${match.name} (${match.email})`);
        });
      } else {
        console.log(`❌ No matches found for "${term}"`);
      }
    });

    // 3. Check published vs unpublished profiles
    console.log('\n📊 Published vs Unpublished Profiles:');
    const published = crewProfiles.filter(p => p.isPublished === true);
    const unpublished = crewProfiles.filter(p => p.isPublished !== true);
    const undefinedPublished = crewProfiles.filter(p => p.isPublished === undefined);
    
    console.log(`Published: ${published.length}`);
    console.log(`Unpublished: ${unpublished.length}`);
    console.log(`Undefined isPublished: ${undefinedPublished.length}`);

    if (unpublished.length > 0) {
      console.log('\nUnpublished profiles:');
      unpublished.forEach(p => {
        console.log(`- ${p.name} (${p.email}) - isPublished: ${p.isPublished}`);
      });
    }

    // 4. Test the exact search logic from the app
    console.log('\n🧪 Testing app search logic:');
    const testQuery = 'myfilmjobs';
    const searchTermsFromQuery = testQuery.toLowerCase().split(' ').filter(term => term.length > 0);
    
    console.log(`Search terms for "${testQuery}":`, searchTermsFromQuery);
    
    const filtered = crewProfiles.filter(profile => {
      const profileText = [
        profile.name,
        profile.displayName,
        profile.email,
        profile.username,
        profile.bio,
        ...(profile.jobTitles || []).map(job => job.title)
      ].filter(Boolean).join(' ').toLowerCase();
      
      console.log(`Profile "${profile.name}": "${profileText}"`);
      
      return searchTermsFromQuery.some(term => profileText.includes(term));
    });
    
    console.log(`\nResults for "${testQuery}":`, filtered.length);
    filtered.forEach(f => console.log(`- ${f.name} (${f.email})`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

debugSearch();
