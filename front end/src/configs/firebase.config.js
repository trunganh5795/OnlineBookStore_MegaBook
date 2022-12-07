import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'lvtn-99a2e.firebaseapp.com',
  projectId: 'lvtn-99a2e',
  storageBucket: 'lvtn-99a2e.appspot.com',
  messagingSenderId: '596111131288',
  appId: '1:596111131288:web:a4985a55b520ffd23ec6ed',
  measurementId: 'G-J1SFR3W1QV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
