import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyD0kchgYGlno_6f-gnD8hxMtT_DzfBsK4w",
  authDomain: "react-fb-auth-89e8a.firebaseapp.com",
  projectId: "react-fb-auth-89e8a",
  storageBucket: "react-fb-auth-89e8a.firebasestorage.app",
  messagingSenderId: "1068897416810",
  appId: "1:1068897416810:web:d046108b924bc32b003c13",
  measurementId: "G-CY7D9271TH"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
