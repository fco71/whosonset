// src/firebase.ts
import { initializeApp } from "firebase/app";
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
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore with settings to prevent internal assertion errors
const db = initializeFirestore(app, {
  cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
  experimentalForceLongPolling: true, // Use long polling instead of WebSocket
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

// Firestore-specific rejection swallower. The global handler in index.tsx
// already catches benign timeouts; this one specifically suppresses Firestore
// internal rejections that have a `.code` (e.g. 'unavailable',
// 'deadline-exceeded') but no .message, which previously leaked through.
window.addEventListener('unhandledrejection', (event) => {
  const r: any = event.reason;
  if (!r) return;
  const text = (r.message || r.code || '') + '';
  if (
    text.includes('FIRESTORE') ||
    text.includes('firestore') ||
    text === 'unavailable' ||
    text === 'deadline-exceeded' ||
    text === 'cancelled' ||
    text === 'aborted'
  ) {
    console.warn('[Firestore]', text || r);
    event.preventDefault();
  }
});

// Export Firestore utilities
export { 
  app, 
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
