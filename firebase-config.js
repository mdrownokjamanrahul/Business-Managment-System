// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, push, update, remove, onValue, query, orderByChild } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBArWUYRcTEqdygJYpst0kVL-WN5kG1S90",
  authDomain: "sakib-37e22.firebaseapp.com",
  databaseURL: "https://sakib-37e22-default-rtdb.firebaseio.com",
  projectId: "sakib-37e22",
  storageBucket: "sakib-37e22.firebasestorage.app",
  messagingSenderId: "799424877512",
  appId: "1:799424877512:web:419bf8157c41f41daf66fd",
  measurementId: "G-6XP9WJB71G"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Cloudinary Config
const CLOUDINARY_CLOUD_NAME = "dbotalnzq";
const CLOUDINARY_UPLOAD_PRESET = "gufifpyg";

// Auth helper — সব পেজে ব্যবহার হবে
// user লগইন না থাকলে login পেজে নিয়ে যাবে
function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      window.location.href = 'login.html';
    }
  });
}

// Firebase database path — প্রতি user-এর data আলাদা
// users/{uid}/products, users/{uid}/sales, users/{uid}/settings
function userRef(uid, path) {
  return ref(db, `users/${uid}/${path}`);
}

export { db, auth, ref, set, get, push, update, remove, onValue, query, orderByChild, signInWithEmailAndPassword, signOut, onAuthStateChanged, requireAuth, userRef, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET };
