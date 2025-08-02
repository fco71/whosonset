const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // <-- Place your Firebase service account key here

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

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

async function seed() {
  // Seed countries
  for (const country of countries) {
    await db.collection('countries').doc(country.code).set(country);
    console.log(`Seeded country: ${country.name}`);
  }
  // Seed cities
  for (const city of cities) {
    await db.collection('cities').add(city);
    console.log(`Seeded city: ${city.name} (${city.countryCode})`);
  }
  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
}); 