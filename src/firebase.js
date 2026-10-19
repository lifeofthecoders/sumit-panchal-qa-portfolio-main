// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAGKVXKXDwoTKbsxOO9P3c44jr7i7Oa6w",
  authDomain: "sumit-portfolio-e876a.firebaseapp.com",
  projectId: "sumit-portfolio-e876a",
  storageBucket: "sumit-portfolio-e876a.firebasestorage.app",
  messagingSenderId: "973386716761",
  appId: "1:973386716761:web:fb373663ccbac4f5ad4348"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

// Firestore
export const db = getFirestore(app);
