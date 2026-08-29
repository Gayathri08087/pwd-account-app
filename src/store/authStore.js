import { create } from 'zustand';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  updateEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // Initialize the auth listener
  init: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },

  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  },

  loginWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Email Login Error:", error);
      throw error;
    }
  },

  signUpWithEmail: async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Email Sign-Up Error:", error);
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password Reset Error:", error);
      throw error;
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      if (!auth.currentUser) throw new Error("No user logged in");
      await updateProfile(auth.currentUser, profileData);
      // Force update state
      set({ user: { ...auth.currentUser } });
    } catch (error) {
      console.error("Update Profile Error:", error);
      throw error;
    }
  },

  updateUserEmail: async (newEmail) => {
    try {
      if (!auth.currentUser) throw new Error("No user logged in");
      await updateEmail(auth.currentUser, newEmail);
      set({ user: { ...auth.currentUser } });
    } catch (error) {
      console.error("Update Email Error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  }
}));
