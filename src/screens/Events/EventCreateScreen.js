import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp } from 'firebase/firestore';
import { Keyboard } from 'react-native';
import { useAuthContext } from '../../hooks/useAuthContext';
import { createEvent } from '../../services/apiHandlers';
import { ROLE_ADMIN, ROLE_ORGANIZADOR } from '../../services/roles';

const EventCreateScreen = ({ navigation }) => {
  const { user, role } = useAuthContext();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (role !== ROLE_ORGANIZADOR && role !== ROLE_ADMIN) {
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>No tienes permiso para crear eventos.</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!titulo || !descripcion || !ubicacion) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    try {
      await createEvent({
        titulo,
        descripcion,
        ubicacion,
        fecha: Timestamp.fromDate(fecha),
        creadoPor: user.uid,
      });

      Keyboard.dismiss(); 
      
      Alert.alert('Éxito', 'Evento creado correctamente.');
      navigation.navigate('HomeTabs');
      setTitulo('');
      setDescripcion('');
      setUbicacion('');
      setFecha(new Date());
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo crear el evento.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Evento</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Ubicación"
        value={ubicacion}
        onChangeText={setUbicacion}
      />

      <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
      <Text style={styles.fecha}>Fecha: {fecha.toLocaleString()}</Text>

      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || fecha;
            setShowDatePicker(false);
            setFecha(currentDate);
          }}
        />
      )}

      <Button title="Crear Evento" onPress={handleSubmit} />
    </View>
  );
};

export default EventCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  fecha: {
    marginVertical: 10,
  },
  warning: {
    marginTop: 100,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
