// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, connectFirestoreEmulator, enableNetwork, disableNetwork, initializeFirestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

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

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('FIRESTORE')) {
    console.warn('Caught Firestore error:', event.reason);
    event.preventDefault();
  }
});

export { app, auth, db, storage, handleFirestoreError };
