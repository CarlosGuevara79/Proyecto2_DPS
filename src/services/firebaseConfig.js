import { initializeApp } from "firebase/app";
import { getAuth }       from "firebase/auth";
import { getFirestore }  from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0kchgYGlno_6f-gnD8hxMtT_DzfBsK4w",
  authDomain: "react-fb-auth-89e8a.firebaseapp.com",
  projectId: "react-fb-auth-89e8a",
  storageBucket: "react-fb-auth-89e8a.firebasestorage.app",
  messagingSenderId: "1068897416810",
  appId: "1:1068897416810:web:d046108b924bc32b003c13",
  measurementId: "G-CY7D9271TH"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
