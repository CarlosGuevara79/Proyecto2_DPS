// src/screens/Auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet,
  TextInput, TouchableOpacity, Alert
} from 'react-native';
import { registerUser } from '../../services/apiHandlers';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const onRegister = async () => {
    setLoading(true);
    try {
      await registerUser(email, password);
      Alert.alert('Éxito', 'Cuenta creada con rol MIEMBRO');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regístrate</Text>
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
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creando...' : 'Registrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Ingresa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex:1, padding:20, justifyContent:'center' },
  title:       { fontSize:24, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  input:       { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:10, marginBottom:15 },
  button:      { backgroundColor:'#007AFF', padding:12, borderRadius:8, alignItems:'center' },
  buttonDisabled: { backgroundColor:'#aaccee' },
  buttonText:  { color:'#fff', fontSize:16 },
  link:        { color:'#007AFF', textAlign:'center', marginTop:10 }
});
