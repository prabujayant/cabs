import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVRmo3ws9Cyepm5Xpi_c_K2LeRYBmoSwA",
  authDomain: "onlycabs-5b111.firebaseapp.com",
  projectId: "onlycabs-5b111",
  storageBucket: "onlycabs-5b111.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "1087131485319",
  appId: "1:1087131485319:web:46557d012452e7856de422",
  measurementId: "G-SF0XB2CNEY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
