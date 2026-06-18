// src/firebase.ts
import { initializeApp } from "firebase/app";
import {
  AppCheck,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { 
  Firestore as FirestoreType, 
  initializeFirestore, 
  enableNetwork,
  serverTimestamp,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  Timestamp,
  DocumentData as FirebaseDocumentData,
  QueryDocumentSnapshot,
  FieldValue
} from "firebase/firestore";

// Define DocumentData type for compatibility
type DocumentData = FirebaseDocumentData;
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:     process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:  process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:      process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Google Analytics (GA4). Dynamically imported and self-guarded so it
// never blocks startup and is a no-op where analytics isn't supported.
import('./utilities/analytics')
  .then(({ initAnalytics }) => initAnalytics(app))
  .catch(() => {/* analytics is best-effort */});

const appCheckSiteKey = process.env.REACT_APP_FIREBASE_APP_CHECK_SITE_KEY;
const appCheckDebugToken = process.env.REACT_APP_FIREBASE_APP_CHECK_DEBUG_TOKEN;
const hostname = typeof window === 'undefined' ? '' : window.location.hostname;
const isLocalDevelopment = hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname === '::1';

let appCheck: AppCheck | null = null;
if (appCheckSiteKey && (!isLocalDevelopment || appCheckDebugToken)) {
  if (isLocalDevelopment && appCheckDebugToken) {
    const debugTarget = globalThis as typeof globalThis & {
      FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
    };
    debugTarget.FIREBASE_APPCHECK_DEBUG_TOKEN =
      appCheckDebugToken === 'true' ? true : appCheckDebugToken;
  }

  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true
  });
}

const auth = getAuth(app);

// Let Firestore detect when long polling is required. Forcing it globally makes
// Safari keep more Listen/channel requests open and commonly produces a noisy
// "due to access control checks" message when a request is interrupted during
// navigation. Auto-detection has been Firebase's default since SDK 9.22.
const db = initializeFirestore(app, {
  cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
  experimentalAutoDetectLongPolling: true,
  // Drop undefined fields instead of throwing "Unsupported field value: undefined".
  // Matches the Admin SDK config (functions) and prevents a whole class of write
  // failures from optional fields (e.g. a member with no email).
  ignoreUndefinedProperties: true,
});

const storage = getStorage(app);

// Error handling for Firestore
const handleFirestoreError = (error: any) => {
  console.error('Firestore error:', error);
  // Attempt to reconnect if there's a connection issue
  if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
    console.log('Attempting to reconnect to Firestore...');
    enableNetwork(db).catch(console.error);
  }
};

// Export Firestore utilities
export { 
  app, 
  appCheck,
  auth, 
  db, 
  storage, 
  handleFirestoreError,
  serverTimestamp,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  FieldValue
};

// Export types
export type { FirestoreType as Firestore };
