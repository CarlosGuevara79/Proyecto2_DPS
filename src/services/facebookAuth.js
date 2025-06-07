import {
  LoginManager,
  AccessToken,
  Settings,
} from 'react-native-fbsdk-next';
import { FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig';

Settings.setAppID('1483064283100630');
Settings.initializeSDK();

export async function loginWithFacebook() {
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  if (result.isCancelled) throw new Error('Inicio de sesión cancelado.');

  const data = await AccessToken.getCurrentAccessToken();
  if (!data) throw new Error('No se pudo obtener el token.');

  const credential = FacebookAuthProvider.credential(data.accessToken);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
}

// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/