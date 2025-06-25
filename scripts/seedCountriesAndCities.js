// scripts/seedCountriesAndCities.js
// This script can be run in the browser console on your app

const countries = [
  { name: 'United States', code: 'US' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'France', code: 'FR' },
];

const cities = [
  { name: 'New York', countryCode: 'US' },
  { name: 'Los Angeles', countryCode: 'US' },
  { name: 'Santo Domingo', countryCode: 'DO' },
  { name: 'Santiago', countryCode: 'DO' },
  { name: 'Paris', countryCode: 'FR' },
  { name: 'Lyon', countryCode: 'FR' },
];

// Instructions:
// 1. Open your app in the browser
// 2. Open the browser console (F12)
// 3. Copy and paste this entire script
// 4. Press Enter to run it

async function seedData() {
  try {
    console.log('Starting to seed countries and cities...');

    // Import Firebase functions (assuming they're available globally)
    const { collection, addDoc, getDocs } = await import('firebase/firestore');
    const { db } = await import('../src/firebase');

    // Check if countries already exist
    const existingCountries = await getDocs(collection(db, 'countries'));
    if (!existingCountries.empty) {
      console.log('Countries collection already has data. Skipping...');
    } else {
      // Seed countries
      for (const country of countries) {
        await addDoc(collection(db, 'countries'), country);
        console.log(`Added country: ${country.name}`);
      }
    }

    // Check if cities already exist
    const existingCities = await getDocs(collection(db, 'cities'));
    if (!existingCities.empty) {
      console.log('Cities collection already has data. Skipping...');
    } else {
      // Seed cities
      for (const city of cities) {
        await addDoc(collection(db, 'cities'), city);
        console.log(`Added city: ${city.name} (${city.countryCode})`);
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Alternative: Manual seeding instructions
console.log(`
=== MANUAL SEEDING INSTRUCTIONS ===

If the automatic seeding doesn't work, you can manually add the data:

1. Go to Firebase Console > Firestore Database
2. Create a collection called "countries"
3. Add these documents:
   - Document 1: { name: "United States", code: "US" }
   - Document 2: { name: "Dominican Republic", code: "DO" }
   - Document 3: { name: "France", code: "FR" }

4. Create a collection called "cities"
5. Add these documents:
   - Document 1: { name: "New York", countryCode: "US" }
   - Document 2: { name: "Los Angeles", countryCode: "US" }
   - Document 3: { name: "Santo Domingo", countryCode: "DO" }
   - Document 4: { name: "Santiago", countryCode: "DO" }
   - Document 5: { name: "Paris", countryCode: "FR" }
   - Document 6: { name: "Lyon", countryCode: "FR" }

=== END INSTRUCTIONS ===
`);

// Try to run the automatic seeding
seedData(); 