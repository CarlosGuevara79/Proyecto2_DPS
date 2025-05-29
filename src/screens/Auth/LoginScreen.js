import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import { useAuthContext } from '../../hooks/useAuthContext';

const { width } = Dimensions.get('window');
const FORM_WIDTH = Math.min(width * 0.9, 350);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { setUser, setRole } = useAuthContext();

  const handleLogin = async () => {
    if (!email || !pass) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Obtener rol desde Firestore
      const userRef = doc(db, 'usuarios', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUser(user);         
        setRole(data.rol);   
        navigation.navigate('Main'); 

      } else {
        Alert.alert('Error', 'No se encontró información del usuario.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Credenciales inválidas o problema al iniciar sesión.');
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Iniciar sesión</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={pass}
            onChangeText={setPass}
            secureTextEntry
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    width: FORM_WIDTH,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 20
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  link: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14
  }
});