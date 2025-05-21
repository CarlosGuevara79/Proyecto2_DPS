// src/services/apiHandlers.js
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ROLE_MIEMBRO } from './roles';

/**
 * Registra un usuario en Auth y en Firestore con rol MIEMBRO.
 */
export async function registerUser(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = cred.user;
  // persistir rol por defecto usando la constante
  await setDoc(doc(db, 'users', uid), {
    email,
    role: ROLE_MIEMBRO,
    createdAt: new Date()
  });
  return cred.user;
}

/**
 * Inicia sesión y devuelve datos del usuario + rol.
 */
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const { uid } = cred.user;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) {
    throw new Error('Usuario no encontrado en Firestore');
  }
  return { user: cred.user, role: snap.data().role };
}
