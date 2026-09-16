// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, push, update, remove, onValue, query, orderByChild } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwFBRI49HCt9De8vzYq83Li-vQr82q1HM",
  authDomain: "sakib-vhai.firebaseapp.com",
  databaseURL: "https://sakib-vhai-default-rtdb.firebaseio.com",
  projectId: "sakib-vhai",
  storageBucket: "sakib-vhai.firebasestorage.app",
  messagingSenderId: "107198726417",
  appId: "1:107198726417:web:3b45ccae9c2750cfd3ccb0",
  measurementId: "G-3T3133SNHR"
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
