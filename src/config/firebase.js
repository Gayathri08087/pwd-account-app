import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPqjcrMDPzoDDyl-2xL3ONQE-nqQmVri8",
  authDomain: "pwd-account-app.firebaseapp.com",
  projectId: "pwd-account-app",
  storageBucket: "pwd-account-app.firebasestorage.app",
  messagingSenderId: "465462627330",
  appId: "1:465462627330:web:232faa2f0cca246385eb1b",
  measurementId: "G-V73NZSJTZZ"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure Google Sign-In Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
