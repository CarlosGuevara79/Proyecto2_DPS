// src/services/googleAuth.js
import * as Google from 'expo-auth-session/providers/google';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import Constants from 'expo-constants';
import { auth } from './firebaseConfig'; // el auth ya inicializado

export async function signInWithGoogle() {
  // Asumiendo que ya configuraste tu expo.redirectUri
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: Constants.manifest.extra.webClientId,       // o web
    iosClientId:   Constants.manifest.extra.iosClientId,
    androidClientId: Constants.manifest.extra.androidClientId,
    webClientId:   Constants.manifest.extra.webClientId,
  });

  // Lanza la pantalla de Google
  const result = await promptAsync();
  if (result.type === 'success') {
    const { id_token } = result.params;
    const credential = GoogleAuthProvider.credential(id_token);
    // Conectar con Firebase
    const userCredential = await signInWithCredential(auth, credential);
    // userCredential.user contiene el usuario
    return userCredential.user;
  } else {
    throw new Error('Inicio con Google cancelado');
  }
}
