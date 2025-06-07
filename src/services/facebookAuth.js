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