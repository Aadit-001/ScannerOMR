// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAH0K9AwNApmYoqXoNrrQSkFaIdxgoNo_w",
  authDomain: "ormscanner-2a06f.firebaseapp.com",
  projectId: "ormscanner-2a06f",
  storageBucket: "ormscanner-2a06f.firebasestorage.app",
  messagingSenderId: "983710728998",
  appId: "1:983710728998:web:d5b0fa61e3c12a8104f7e7",
  measurementId: "G-LWENBSGS4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const db = fireDB; // Backward compatibility
const auth = getAuth(app);

// Configure Google Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  'prompt': 'select_account'
});

// Set persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export { 
  app, 
  fireDB, 
  db,  // Keep for backward compatibility 
  auth, 
  provider,
  serverTimestamp 
};
