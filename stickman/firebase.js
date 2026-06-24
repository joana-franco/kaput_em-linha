// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHj0gbdNNCuNeqYLRG32-uQF--yrEoSH8",
  authDomain: "kaput-emlinha.firebaseapp.com",
  projectId: "kaput-emlinha",
  storageBucket: "kaput-emlinha.firebasestorage.app",
  messagingSenderId: "461983977669",
  appId: "1:461983977669:web:9febf826695918f5eda0ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export for use in app.js
export { db, collection, addDoc, getDocs, query, orderBy };
