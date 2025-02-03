import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC0aW0gtuzEJw2dT9lp6EevZibbws2FkNg",
  authDomain: "peopledb-e16e9.firebaseapp.com",
  projectId: "peopledb-e16e9",
  storageBucket: "peopledb-e16e9.firebasestorage.app",
  messagingSenderId: "636099872924",
  appId: "1:636099872924:web:e5dedea483ecb9eac14559"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);