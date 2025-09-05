import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Enhanced phone login with better error handling
  const loginWithPhone = async (phoneNumber) => {
    try {
      // Validate phone number format
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error('Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
      }
      
      // Check if recaptcha verifier exists
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        throw new Error('reCAPTCHA verifier not initialized. Please refresh the page and try again.');
      }

      console.log('Attempting to send SMS to:', phoneNumber);
      console.log('Using reCAPTCHA verifier:', !!appVerifier);

      // Try to send verification code
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      console.log('SMS sent successfully, confirmation result:', !!confirmationResult);
      
      return confirmationResult;
    } catch (error) {
      console.error('Phone login error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });

      // Enhanced error handling
      let userFriendlyMessage = 'Failed to send verification code. ';
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          userFriendlyMessage = 'Invalid phone number format. Please use international format (e.g., +1234567890)';
          break;
        case 'auth/invalid-app-credential':
          userFriendlyMessage = 'App configuration issue. Please contact support or try again later.';
          break;
        case 'auth/too-many-requests':
          userFriendlyMessage = 'Too many attempts. Please wait a few minutes before trying again.';
          break;
        case 'auth/quota-exceeded':
          userFriendlyMessage = 'SMS quota exceeded. Please try again later or contact support.';
          break;
        case 'auth/app-not-authorized':
          userFriendlyMessage = 'This app is not authorized for phone authentication. Please contact support.';
          break;
        case 'auth/operation-not-allowed':
          userFriendlyMessage = 'Phone authentication is not enabled. Please contact support.';
          break;
        default:
          userFriendlyMessage += error.message || 'Please try again.';
      }
      
      // Create a new error with user-friendly message but preserve original error info
      const enhancedError = new Error(userFriendlyMessage);
      enhancedError.code = error.code;
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  };

  // Enhanced OTP verification
  const verifyOtp = async (confirmationResult, otp) => {
    try {
      if (!confirmationResult) {
        throw new Error('No verification session found. Please request a new code.');
      }
      
      if (!otp || otp.length < 4) {
        throw new Error('Please enter a valid verification code (at least 4 digits)');
      }

      // Clean the OTP (remove any spaces or special characters)
      const cleanOtp = otp.replace(/\D/g, '');
      
      console.log('Attempting to verify OTP:', cleanOtp.length, 'digits');
      
      const result = await confirmationResult.confirm(cleanOtp);
      console.log('OTP verification successful:', !!result.user);
      
      // Create/update user document after successful verification
      if (result.user) {
        await ensureUserDocument(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('OTP verification error:', {
        code: error.code,
        message: error.message
      });

      let userFriendlyMessage = 'Invalid verification code. ';
      
      switch (error.code) {
        case 'auth/invalid-verification-code':
          userFriendlyMessage = 'Invalid verification code. Please check and try again.';
          break;
        case 'auth/code-expired':
          userFriendlyMessage = 'Verification code expired. Please request a new code.';
          break;
        case 'auth/session-expired':
          userFriendlyMessage = 'Session expired. Please start the verification process again.';
          break;
        default:
          userFriendlyMessage += error.message || 'Please try again.';
      }
      
      const enhancedError = new Error(userFriendlyMessage);
      enhancedError.code = error.code;
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  };

  // Helper function to ensure user document exists
  const ensureUserDocument = async (user) => {
    try {
      if (!db) {
        console.warn('Firestore not available, skipping user document creation');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      const timestamp = new Date().toISOString();

      if (!docSnap.exists()) {
        const userData = {
          email: user.email || '',
          name: user.displayName || '',
          phone: user.phoneNumber || '',
          role: 'user',
          createdAt: timestamp,
          lastLoginAt: timestamp
        };
        
        await setDoc(userRef, userData);
        console.log('Created new user document for:', user.uid);
      } else {
        // Update last login time
        await setDoc(userRef, { 
          lastLoginAt: timestamp 
        }, { merge: true });
        console.log('Updated last login for:', user.uid);
      }
    } catch (error) {
      console.error('Error managing user document:', error);
      // Don't throw here - user authentication should still work even if Firestore fails
    }
  };

  // Enhanced Google login
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      // Add custom parameters for better UX
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('Starting Google sign-in...');
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in successful:', !!result.user);
      
      if (result.user) {
        await ensureUserDocument(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Google login error:', {
        code: error.code,
        message: error.message
      });

      let userFriendlyMessage = 'Google sign-in failed. ';
      
      switch (error.code) {
        case 'auth/popup-blocked':
          userFriendlyMessage = 'Popup was blocked. Please allow popups for this site and try again.';
          break;
        case 'auth/popup-closed-by-user':
          userFriendlyMessage = 'Sign-in was cancelled. Please try again.';
          break;
        case 'auth/network-request-failed':
          userFriendlyMessage = 'Network error. Please check your internet connection and try again.';
          break;
        case 'auth/internal-error':
          userFriendlyMessage = 'An internal error occurred. Please try again later.';
          break;
        default:
          userFriendlyMessage += error.message || 'Please try again.';
      }
      
      const enhancedError = new Error(userFriendlyMessage);
      enhancedError.code = error.code;
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  };

  // Enhanced logout with cleanup
  const logout = async () => {
    try {
      // Clean up recaptcha verifier
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          console.log('reCAPTCHA verifier cleared');
        } catch (error) {
          console.warn('Error clearing reCAPTCHA on logout:', error);
        }
        window.recaptchaVerifier = null;
      }

      await signOut(auth);
      console.log('User logged out successfully');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      if (!db) {
        throw new Error('Firestore not available');
      }

      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Update local state
      setCurrentUser(prev => ({ ...prev, ...updates }));
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Enhanced auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', !!user);
      setLoading(true);
      
      if (user) {
        try {
          let userData = {
            uid: user.uid,
            email: user.email,
            phoneNumber: user.phoneNumber,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'user' // default role
          };

          // Try to get additional user data from Firestore
          if (db) {
            try {
              const userRef = doc(db, 'users', user.uid);
              const docSnap = await getDoc(userRef);
              
              if (docSnap.exists()) {
                const firestoreData = docSnap.data();
                userData = { ...userData, ...firestoreData };
                console.log('Loaded user data from Firestore');
              } else {
                // Create document with default data
                const defaultData = {
                  email: user.email || '',
                  name: user.displayName || '',
                  phone: user.phoneNumber || '',
                  role: 'user',
                  createdAt: new Date().toISOString()
                };
                
                await setDoc(userRef, defaultData);
                userData = { ...userData, ...defaultData };
                console.log('Created new user document');
              }
            } catch (firestoreError) {
              console.warn('Firestore error, using auth data only:', firestoreError);
            }
          }

          setCurrentUser(userData);
        } catch (error) {
          console.error('Error processing authenticated user:', error);
          // Fallback to basic user data
          setCurrentUser({
            ...user,
            role: 'user'
          });
        }
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Utility functions
  const hasRole = (role) => currentUser?.role === role;
  const isAdmin = () => hasRole('admin');

  const value = {
    currentUser,
    loading,
    loginWithPhone,
    verifyOtp,
    loginWithGoogle,
    logout,
    updateUserProfile,
    hasRole,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};