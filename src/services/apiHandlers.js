// src/services/apiHandlers.js
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc,collection,addDoc } from 'firebase/firestore';
import { ROLE_MIEMBRO } from './roles';

export async function registerUser(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = cred.user;

  await setDoc(doc(db, 'users', uid), {
    email,
    role: ROLE_MIEMBRO,
    createdAt: new Date()
  });
  return cred.user;
}

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const { uid } = cred.user;

  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) {
    throw new Error('Usuario no encontrado en Firestore');
  }
  const userData = snap.data();
  return {
    user: cred.user,
    role: userData.role,
    nombre: userData.nombre
  };
}


export async function createEvent(eventData) {
  const eventosRef = collection(db, 'eventos'); 
  const docRef = await addDoc(eventosRef, eventData);
  return docRef.id;
}

