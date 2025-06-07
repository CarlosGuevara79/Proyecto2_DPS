// src/screens/Auth/LoginScreen.js
import React, { useState, useEffect,useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  Alert,
  Image,
  ScrollView, // <--- Import ScrollView
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc,setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import { useAuthContext } from '../../hooks/useAuthContext';


// Import the new UI components
import InputField from '../../components/InputField';
import ButtonCustom from '../../components/ButtonCustom';
import SocialIntegration from '../../components/SocialIntegration';
import { useGoogleAuth, handleGoogleSignIn } from '../../services/useGoogleAuth';
import { ROLE_MIEMBRO } from '../../services/roles';
import { loginWithFacebook } from '../../services/facebookAuth';
// Import your Login image
import LoginImage from '../../../assets/LoginImage.png';

const { width, height } = Dimensions.get('window'); // <--- Get both width and height
const FORM_MAX_WIDTH = 380;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { response, promptAsync } = useGoogleAuth();

  const { setUser, setRole } = useAuthContext();

  const validateInputs = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('El correo es obligatorio.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Formato de correo inválido.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, 'usuarios', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUser(user);
        setRole(data.rol);
        navigation.navigate('Main');
      } else {
        Alert.alert('Error', 'No se encontró información de rol del usuario.');
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      let errorMessage = 'Credenciales inválidas o problema al iniciar sesión.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No se encontró un usuario con ese correo.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo es inválido.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const processGoogleLogin = async () => {
      if (response?.type === 'success') {
        try {
          const user = await handleGoogleSignIn(response);
          const snap = await getDoc(doc(db, 'usuarios', user.uid));
          setUser(user);
          setRole(snap.data().rol);
          navigation.navigate('Main');
        } catch (err) {
          Alert.alert('Error', err.message);
        }
      }
    };
    processGoogleLogin();
  }, [response]);

  const handleGoogleLogin = () => {
    promptAsync();
  };

const handleFacebookLogin = async () => {
  try {
    const user = await loginWithFacebook(); // función definida en facebookAuth.js
    const userRef = doc(db, 'usuarios', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUser(user);
      setRole(userSnap.data().rol);
    } else {
      await setDoc(userRef, {
        nombre: user.displayName || 'Anónimo',
        correo: user.email || '',
        rol: ROLE_MIEMBRO,
        creado: new Date(),
      });
      setUser(user);
      setRole(ROLE_MIEMBRO);
    }

    navigation.replace('Main');
  } catch (error) {
    console.error('Error en Facebook Login:', error);
    Alert.alert('Error', error.message || 'Falló el inicio con Facebook');
  }
};


  return (
    <SafeAreaView style={styles.flex}>
      {/* KeyboardAvoidingView should wrap the scrollable content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Top Image Section - remains outside ScrollView as it's static */}
        <View style={styles.topImageContainer}>
          <Image source={LoginImage} style={styles.heroImage} resizeMode="cover" />
        </View>

        {/* Login Form Container - now contains a ScrollView for its content */}
        <View style={styles.formContainer}>
          {/* ScrollView wraps the actual form elements */}
          <ScrollView
            contentContainerStyle={styles.scrollContent} // Important for flexible content sizing
            showsVerticalScrollIndicator={false} // Hide scroll indicator for cleaner look
            keyboardShouldPersistTaps="handled" // Helps with dismissing keyboard when tapping outside inputs
          >
            <Text style={styles.welcomeTitle}>Bienvenido</Text>

            <InputField
              placeholder="Correo"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              iconName="mail"
            />

            <InputField
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={passwordError}
              iconName="lock"
            />

            <TouchableOpacity onPress={() => console.log('Forgot Password Pressed')} style={styles.forgotPasswordLink}>
              <Text style={styles.forgotPasswordText}>¿Haz olvidado tu contraseña?</Text>
            </TouchableOpacity>

            <ButtonCustom
              title="Ingresar"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLinkContainer}>
              <Text style={styles.registerText}>¿No eres miembro? <Text style={styles.registerLink}>Regístrate ahora</Text></Text>
            </TouchableOpacity>

            <SocialIntegration
              onGooglePress={handleGoogleLogin}
              onFacebookPress={handleFacebookLogin}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topImageContainer: {
    width: '100%',
    height: 250,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1, // Allows it to take the remaining vertical space
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20, // Overlap the image slightly
    paddingHorizontal: 25,
    paddingVertical: 30,
    alignSelf: 'center',
    width: '100%',
    maxWidth: FORM_MAX_WIDTH, // Constrain width on larger screens
    // If you uncommented temporary borders/backgrounds for debugging, remove them here:
    // borderWidth: 2,
    // borderColor: 'blue',
    // backgroundColor: 'orange',
  },
  scrollContent: {
    flexGrow: 1, // Allows content to fill the ScrollView's available space
    justifyContent: 'center', // Centers content vertically within the scroll area if there's extra space
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'left',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#1877F2',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  registerLinkContainer: {
    marginTop: 0,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  registerLink: {
    color: '#1877F2',
    fontWeight: '600',
  },
});