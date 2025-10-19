import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIE_vGeCvJ_qdAzcXPp7i30E-OOGnEymo",
  authDomain: "vmduk-6f75f.firebaseapp.com",
  projectId: "vmduk-6f75f",
  storageBucket: "vmduk-6f75f.firebasestorage.app",
  messagingSenderId: "101034232501",
  appId: "1:101034232501:web:fe13cd98d3f1faefa08cfc",
  measurementId: "G-L4YD8S0NWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
