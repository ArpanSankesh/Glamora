// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFTiDr7BTZn0DihhNNccafMuGo0EpDctk",
  authDomain: "prettynbeauty-66faf.firebaseapp.com",
  projectId: "prettynbeauty-66faf",
  storageBucket: "prettynbeauty-66faf.firebasestorage.app",
  messagingSenderId: "966357488506",
  appId: "1:966357488506:web:b827acb4e62dff32d8fcc3",
  measurementId: "G-JKLVQT37M7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set auth language
auth.languageCode = 'en';

// Configuration for reCAPTCHA v2
if (typeof window !== 'undefined') {
  // Disable App Check for development to avoid token issues
  // This allows reCAPTCHA v2 to work without App Check complications
  console.log('Firebase initialized for reCAPTCHA v2');
  
  // Optional: Set up development overrides
  window.FIREBASE_AUTH_EMULATOR_HOST = false; // Ensure we're not using emulator
}

// Helper logout function
const handleLogout = async () => {
  try {
    // Clean up any reCAPTCHA verifier before logout
    if (typeof window !== 'undefined' && window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.error('Error clearing reCAPTCHA:', error);
      }
      window.recaptchaVerifier = null;
    }
    
    await auth.signOut();
    console.log("User logged out successfully!");
  } catch (error) {
    console.error("Error logging out: ", error);
  }
};

// Export all services and helpers
export { 
  app,
  auth, 
  db, 
  storage, 
  handleLogout 
};