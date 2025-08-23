// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (from the screenshot)
const firebaseConfig = {
  apiKey: "AIzaSyChYWz8MtMfNJcJ284bQ-2EdwSyayAHZS4",
  authDomain: "parlor-5f5f1.firebaseapp.com",
  projectId: "parlor-5f5f1",
  storageBucket: "parlor-5f5f1.appspot.com",
  messagingSenderId: "596746493933",
  appId: "1:596746493933:web:e6741b86aaf0bd1fae91e4",
  measurementId: "G-ZL57ZE2HZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (this is what you’ll use in your app)
const db = getFirestore(app);

export { db };
