// src/services/googleAuth.js
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import Constants from 'expo-constants';
import { ROLE_MIEMBRO } from './roles'; 

let promptAsyncGlobal;

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:  Constants.expoConfig.extra.expoClientId,
    iosClientId:  Constants.expoConfig.extra.iosClientId,
    androidClientId:  Constants.expoConfig.extra.androidClientId,
    webClientId: Constants.expoConfig.extra.webClientId,
  });

  promptAsyncGlobal = promptAsync;

  return { request, response, promptAsync };
}

export async function handleGoogleSignIn(response) {
  if (response?.type === 'success') {
    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);

    const userCredential = await signInWithCredential(auth, credential);
    const { uid, displayName, email } = userCredential.user;

    const userRef = doc(db, 'usuarios', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        nombre: displayName,
        correo: email,
        rol: ROLE_MIEMBRO,
        creado: new Date()
      });
    }
    return userCredential.user;
  } else {
    throw new Error('Inicio con Google cancelado o fallido.');
  }
}
