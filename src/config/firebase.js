import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDPMykuvFj0xsWf2m4_3TOWgG7HswVaKIg",
  authDomain: "masteryproject-b6ec2.firebaseapp.com",
  projectId: "masteryproject-b6ec2",
  storageBucket: "masteryproject-b6ec2.firebasestorage.app",
  messagingSenderId: "330510383061",
  appId: "1:330510383061:web:6a78e6076136306bdd2f5c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 