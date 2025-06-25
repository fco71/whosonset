import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// TODO: Replace with your actual Firebase config from src/firebase.ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const countriesData = [
  {
    name: "United States",
    cities: [
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
      "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
      "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis",
      "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville",
      "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis",
      "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson",
      "Fresno", "Sacramento", "Atlanta", "Kansas City", "Long Beach",
      "Colorado Springs", "Raleigh", "Miami", "Virginia Beach", "Omaha",
      "Oakland", "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans",
      "Wichita", "Cleveland", "Bakersfield", "Aurora", "Anaheim", "Honolulu"
    ]
  },
  {
    name: "Canada",
    cities: [
      "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa",
      "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria",
      "Halifax", "Oshawa", "Windsor", "Saskatoon", "St. Catharines", "Regina",
      "St. John's", "Kelowna", "Sherbrooke", "Guelph", "Kingston", "Moncton",
      "Thunder Bay", "Saint John", "Peterborough", "Sault Ste. Marie"
    ]
  },
  {
    name: "United Kingdom",
    cities: [
      "London", "Birmingham", "Leeds", "Glasgow", "Sheffield", "Bradford",
      "Edinburgh", "Liverpool", "Manchester", "Bristol", "Wakefield", "Cardiff",
      "Coventry", "Nottingham", "Leicester", "Sunderland", "Belfast", "Newcastle",
      "Brighton", "Hull", "Plymouth", "Stoke", "Wolverhampton", "Derby",
      "Swansea", "Southampton", "Aberdeen", "Portsmouth", "Middlesbrough",
      "Oxford", "Reading", "Luton", "York", "Preston", "Norwich", "Bournemouth"
    ]
  },
  {
    name: "Australia",
    cities: [
      "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast",
      "Newcastle", "Canberra", "Sunshine Coast", "Central Coast", "Wollongong",
      "Hobart", "Geelong", "Townsville", "Cairns", "Toowoomba", "Darwin",
      "Ballarat", "Bendigo", "Albury", "Maitland", "Mackay", "Rockhampton",
      "Bunbury", "Coffs Harbour", "Wagga Wagga", "Hervey Bay", "Shepparton"
    ]
  },
  {
    name: "Germany",
    cities: [
      "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart",
      "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden",
      "Hannover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld",
      "Bonn", "Mannheim", "Karlsruhe", "Gelsenkirchen", "Münster", "Aachen",
      "Braunschweig", "Chemnitz", "Kiel", "Halle", "Magdeburg", "Freiburg",
      "Krefeld", "Lübeck", "Oberhausen", "Erfurt", "Mainz", "Rostock"
    ]
  },
  {
    name: "France",
    cities: [
      "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg",
      "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre",
      "Saint-Étienne", "Toulon", "Angers", "Grenoble", "Dijon", "Nîmes",
      "Saint-Denis", "Le Mans", "Aix-en-Provence", "Clermont-Ferrand",
      "Brest", "Tours", "Amiens", "Limoges", "Villeurbanne", "Perpignan",
      "Metz", "Besançon", "Orléans", "Rouen", "Mulhouse", "Caen", "Nancy"
    ]
  },
  {
    name: "Spain",
    cities: [
      "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga",
      "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba",
      "Valladolid", "Vigo", "Gijón", "L'Hospitalet", "A Coruña", "Vitoria",
      "Granada", "Elche", "Tarrasa", "Badalona", "Oviedo", "Cartagena",
      "Jerez de la Frontera", "Sabadell", "Móstoles", "Alcalá de Henares",
      "Pamplona", "Fuenlabrada", "Almería", "Leganés", "San Sebastián",
      "Santander", "Castellón", "Burgos", "Albacete", "Alcorcón"
    ]
  },
  {
    name: "Italy",
    cities: [
      "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna",
      "Florence", "Bari", "Catania", "Venice", "Verona", "Messina", "Padua",
      "Trieste", "Brescia", "Parma", "Taranto", "Modena", "Reggio Calabria",
      "Reggio Emilia", "Perugia", "Ravenna", "Rimini", "Syracuse", "Sassari",
      "Monza", "Pescara", "Bergamo", "Forlì", "Latina", "Vicenza", "Terni",
      "Trento", "Novara", "Piacenza", "Ancona", "Lecce", "Bolzano"
    ]
  },
  {
    name: "Japan",
    cities: [
      "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe",
      "Kyoto", "Kawasaki", "Saitama", "Hiroshima", "Sendai", "Chiba", "Kitakyushu",
      "Sakai", "Niigata", "Hamamatsu", "Kumamoto", "Sagamihara", "Shizuoka",
      "Okayama", "Kagoshima", "Funabashi", "Hachioji", "Matsuyama", "Matsudo",
      "Nishinomiya", "Kawaguchi", "Kanazawa", "Ichikawa", "Utsunomiya",
      "Oita", "Kurashiki", "Gifu", "Himeji", "Matsumoto", "Fujisawa"
    ]
  },
  {
    name: "Dominican Republic",
    cities: [
      "Santo Domingo", "Santiago", "Santo Domingo Este", "Santo Domingo Norte",
      "Santo Domingo Oeste", "San Pedro de Macorís", "La Romana", "San Francisco de Macorís",
      "San Cristóbal", "Puerto Plata", "La Vega", "Barahona", "Bonao", "San Juan de la Maguana",
      "Bajos de Haina", "Baní", "Moca", "Azua", "Higuey", "Nagua", "Cotui",
      "Villa Altagracia", "San José de Ocoa", "Constanza", "Jarabacoa", "Pedernales",
      "Dajabón", "Monte Cristi", "Samaná", "El Seibo", "Hato Mayor", "Monte Plata"
    ]
  }
];

const seedCountries = async () => {
  try {
    console.log('Starting to seed countries...');
    
    for (const country of countriesData) {
      await setDoc(doc(db, 'countries', country.name), {
        name: country.name,
        cities: country.cities
      });
      console.log(`Added country: ${country.name} with ${country.cities.length} cities`);
    }
    
    console.log('Countries seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding countries:', error);
  }
};

// Run the seeding function
seedCountries(); 