import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7NK0FidNh9ylqxXFgsKd_1oXgQdGVOVs",
  authDomain: "inventory-3b92f.firebaseapp.com",
  projectId: "inventory-3b92f",
  storageBucket: "inventory-3b92f.firebasestorage.app",
  messagingSenderId: "50762709687",
  appId: "1:50762709687:web:16cfab5eeed259fcacab32",
  measurementId: "G-Z6PTFCFQVF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };