"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldValue = exports.QueryDocumentSnapshot = exports.Timestamp = exports.getDoc = exports.limit = exports.orderBy = exports.where = exports.query = exports.getDocs = exports.deleteDoc = exports.updateDoc = exports.setDoc = exports.doc = exports.addDoc = exports.collection = exports.serverTimestamp = exports.handleFirestoreError = exports.storage = exports.db = exports.auth = exports.app = void 0;
// src/firebase.ts
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
Object.defineProperty(exports, "serverTimestamp", { enumerable: true, get: function () { return firestore_1.serverTimestamp; } });
Object.defineProperty(exports, "collection", { enumerable: true, get: function () { return firestore_1.collection; } });
Object.defineProperty(exports, "addDoc", { enumerable: true, get: function () { return firestore_1.addDoc; } });
Object.defineProperty(exports, "doc", { enumerable: true, get: function () { return firestore_1.doc; } });
Object.defineProperty(exports, "setDoc", { enumerable: true, get: function () { return firestore_1.setDoc; } });
Object.defineProperty(exports, "updateDoc", { enumerable: true, get: function () { return firestore_1.updateDoc; } });
Object.defineProperty(exports, "deleteDoc", { enumerable: true, get: function () { return firestore_1.deleteDoc; } });
Object.defineProperty(exports, "getDocs", { enumerable: true, get: function () { return firestore_1.getDocs; } });
Object.defineProperty(exports, "query", { enumerable: true, get: function () { return firestore_1.query; } });
Object.defineProperty(exports, "where", { enumerable: true, get: function () { return firestore_1.where; } });
Object.defineProperty(exports, "orderBy", { enumerable: true, get: function () { return firestore_1.orderBy; } });
Object.defineProperty(exports, "limit", { enumerable: true, get: function () { return firestore_1.limit; } });
Object.defineProperty(exports, "getDoc", { enumerable: true, get: function () { return firestore_1.getDoc; } });
Object.defineProperty(exports, "Timestamp", { enumerable: true, get: function () { return firestore_1.Timestamp; } });
Object.defineProperty(exports, "QueryDocumentSnapshot", { enumerable: true, get: function () { return firestore_1.QueryDocumentSnapshot; } });
Object.defineProperty(exports, "FieldValue", { enumerable: true, get: function () { return firestore_1.FieldValue; } });
const storage_1 = require("firebase/storage");
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
// Initialize Firestore with settings to prevent internal assertion errors
const db = (0, firestore_1.initializeFirestore)(app, {
    cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
    experimentalForceLongPolling: true, // Use long polling instead of WebSocket
});
exports.db = db;
const storage = (0, storage_1.getStorage)(app);
exports.storage = storage;
// Error handling for Firestore
const handleFirestoreError = (error) => {
    console.error('Firestore error:', error);
    // Attempt to reconnect if there's a connection issue
    if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        console.log('Attempting to reconnect to Firestore...');
        (0, firestore_1.enableNetwork)(db).catch(console.error);
    }
};
exports.handleFirestoreError = handleFirestoreError;
// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('FIRESTORE')) {
        console.warn('Caught Firestore error:', event.reason);
        event.preventDefault();
    }
});
//# sourceMappingURL=firebase.js.map