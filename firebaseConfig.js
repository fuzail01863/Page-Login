import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { query, where, onSnapshot, deleteDoc, doc, setDoc, getFirestore, addDoc, collection, getDocs  } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEOf1sjrrUmhE2bOH4pB959aUi4SVN8Vg",
  authDomain: "page-login-3c1dc.firebaseapp.com",
  projectId: "page-login-3c1dc",
  storageBucket: "page-login-3c1dc.firebasestorage.app",
  messagingSenderId: "701404812631",
  appId: "1:701404812631:web:cd13f7fa48f70999e95a12",
  measurementId: "G-F2XJ084PE6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log('Firebase initialized');

const db = getFirestore(app);
const auth = getAuth(app);

export { auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, deleteUser, EmailAuthProvider, reauthenticateWithCredential, onSnapshot, doc, setDoc, db, addDoc, collection, getDocs, deleteDoc, where, query  };