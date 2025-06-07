// src/screens/Auth/RegisterScreen.js
import React, { useState } from 'react';
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
  ScrollView, // Import ScrollView for potentially long content
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import { ROLE_MIEMBRO } from '../../services/roles'; // Assuming this import is correct

// Import the reusable UI components
import InputField from '../../components/InputField';
import ButtonCustom from '../../components/ButtonCustom';

const { width } = Dimensions.get('window');
const FORM_MAX_WIDTH = 380; // Max width for the form container

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState(''); // New state for 'Nombre'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for 'Confirma tu contraseña'
  const [acceptTerms, setAcceptTerms] = useState(false); // State for checkbox
  const [isLoading, setIsLoading] = useState(false); // For button loading state

  // Error states for validation feedback
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  const validateInputs = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setTermsError('');

    if (!name.trim()) {
      setNameError('El nombre es obligatorio.');
      isValid = false;
    }

    if (!email.trim()) {
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

    if (!confirmPassword) {
      setConfirmPasswordError('Debes confirmar la contraseña.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      isValid = false;
    }

    if (!acceptTerms) {
      setTermsError('Debes aceptar los términos y condiciones.');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Creando usuario con:', {
        uid: user?.uid,
        email,
        name, // Include name when storing user data
        rol: ROLE_MIEMBRO
      });

      await setDoc(doc(db, 'usuarios', user.uid), {
        email,
        name, // Store name in Firestore
        rol: ROLE_MIEMBRO
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente.');
      navigation.replace('Login'); // Navigate back to login after successful registration
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      let errorMessage = 'No se pudo registrar el usuario.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico es inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.formContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Regístrate</Text>
            <Text style={styles.subtitle}>Crea una cuenta para empezar</Text>

            <InputField
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
              autoCapitalize="words" // Capitalize first letter of each word
              error={nameError}
              iconName="user" // Example icon for name
            />

            <InputField
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              iconName="mail"
            />

            <InputField
              placeholder="Crea una contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={passwordError}
              iconName="lock"
            />

            <InputField
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={confirmPasswordError}
              iconName="lock" // Same icon as password
            />

            {/* Terms and Conditions Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setAcceptTerms(!acceptTerms);
                setTermsError(''); // Clear error when toggling
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                He leído y acepto los <Text style={styles.termsLink}>Términos y Condiciones</Text> y la <Text style={styles.termsLink}>Política de Privacidad</Text>.
              </Text>
            </TouchableOpacity>
            {termsError ? <Text style={styles.errorMessage}>{termsError}</Text> : null}


            <ButtonCustom
              title="Registrar"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.registerButton}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? <Text style={styles.loginLink}>Ingresa</Text></Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

RegisterScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff', // Overall background for the screen
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    // No top image, so no overlapping effect needed here
    paddingHorizontal: 25,
    paddingVertical: 30, // Added padding for top/bottom
    alignSelf: 'center',
    width: '100%',
    maxWidth: FORM_MAX_WIDTH,
  },
  scrollContent: {
    flexGrow: 1, // Allows content to fill the ScrollView's available space
    justifyContent: 'flex-start', // Align content to the top
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10, // Space below title
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30, // Space below subtitle and above first input
    textAlign: 'left',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align text to start if it wraps
    marginBottom: 20, // Space below checkbox
    marginTop: 10, // Space above checkbox
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#1877F2', // Blue when checked
    borderColor: '#1877F2',
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1, // Allows text to wrap
    fontSize: 14,
    color: '#666',
    lineHeight: 20, // Adjust for better readability
  },
  termsLink: {
    color: '#1877F2', // Blue for links
    fontWeight: '600',
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: -10, // Pull up closer to the checkbox if there's an error
    marginBottom: 10,
    marginLeft: 30, // Align with checkbox text
  },
  registerButton: {
    marginTop: 10, // Space above button
    marginBottom: 20, // Space below button
  },
  loginLinkContainer: {
    marginTop: 0,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    color: '#1877F2',
    fontWeight: '600',
  },

});

// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/