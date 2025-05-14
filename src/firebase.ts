// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTvNBe3q-Wbog_sMlRFjwA_gqGXpw37UM",
  authDomain: "whosonsetdepez.firebaseapp.com",
  projectId: "whosonsetdepez",
  storageBucket: "whosonsetdepez.firebasestorage.app",
  messagingSenderId: "100935772037",
  appId: "1:100935772037:web:37d83a6740e740ff37c6ec",
  measurementId: "G-HWC08Q2QCB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };