// src/screens/Events/EditarEventoScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, Alert, StyleSheet, Platform, ScrollView,
  TouchableOpacity, 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; 

export default function EditarEventoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [alcance, setAlcance] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const docRef = doc(db, 'eventos', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setTitulo(data.titulo);
          setDescripcion(data.descripcion);
          setUbicacion(data.ubicacion);
          setAlcance(data.alcance || '');
          setFecha(data.fecha.toDate());
        } else {
          Alert.alert('Error', 'Evento no encontrado');
          navigation.goBack();
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error al cargar evento');
      }
    };

    cargarEvento();
  }, [id, navigation]);

  const handleUpdate = async () => {
    if (!titulo || !descripcion || !ubicacion) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    try {
      const docRef = doc(db, 'eventos', id);
      await updateDoc(docRef, {
        titulo,
        descripcion,
        ubicacion,
        alcance,
        fecha: Timestamp.fromDate(fecha),
        actualizadoEn: Timestamp.now()
      });

      
      navigation.navigate('VerEvento', { id });
      Alert.alert('Éxito', 'Evento actualizado correctamente.');

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar el evento.');
    }
  };


  const handleCancelAndReturn = () => {

  
    navigation.navigate('VerEvento', { id });
  };
  


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Evento</Text>

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
      <TextInput
        style={styles.input}
        placeholder="Alcance"
        value={alcance}
        onChangeText={setAlcance}
        keyboardType="numeric"
      />

      <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
      <Text style={styles.fecha}>Fecha: {fecha.toLocaleString()}</Text>

      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setFecha(selectedDate);
          }}
        />
      )}

     
      <View style={styles.buttonSpacing}>
        <Button title="Guardar Cambios" onPress={handleUpdate} />
      </View>

     
      <TouchableOpacity
        onPress={handleCancelAndReturn}
        style={[styles.blueButton, styles.buttonSpacing]} 
      >
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.blueButtonText}>Regresar sin cambiar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  buttonSpacing: {
    marginTop: 15,
  },
  
  blueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2', 
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8, 
    justifyContent: 'center', 
  },
  blueButtonText: {
    color: 'white',
    marginLeft: 8, 
    fontWeight: 'bold',
    fontSize: 16,
  },
 
});