// src/screens/Auth/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet,
  TextInput, TouchableOpacity, Alert
} from 'react-native';
import { loginUser } from '../../services/apiHandlers';
import { AuthContext } from '../../hooks/useAuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { setUser, setRole }    = useContext(AuthContext);

  const onLogin = async () => {
    setLoading(true);
    try {
      const { user, role } = await loginUser(email, password);
      setUser(user);
      setRole(role);
      // navega al stack principal según rol
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Error al iniciar sesión', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={onLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  title:     { fontSize:24, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  input:     { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:10, marginBottom:15 },
  button:    { backgroundColor:'#007AFF', padding:12, borderRadius:8, alignItems:'center' },
  disabled:  { backgroundColor:'#aaccee' },
  buttonText:{ color:'#fff', fontSize:16 },
  link:      { color:'#007AFF', textAlign:'center', marginTop:10 }
});
