// lib/firebaseConfig.js

// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: publicRuntimeConfig.config.firebase.apiKey,
  authDomain: publicRuntimeConfig.config.firebase.authDomain,
  projectId: publicRuntimeConfig.config.firebase.projectId,
  storageBucket: publicRuntimeConfig.config.firebase.storageBucket,
  messagingSenderId: publicRuntimeConfig.config.firebase.messagingSenderId,
  appId: publicRuntimeConfig.config.firebase.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
