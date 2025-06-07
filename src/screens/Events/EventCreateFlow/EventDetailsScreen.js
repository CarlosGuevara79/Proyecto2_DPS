// src/screens/Events/EventCreateFlow/Step2EventDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { createEvent } from '../../../services/apiHandlers';
import { ROLE_ADMIN, ROLE_ORGANIZADOR } from '../../../services/roles';
import InputField from '../../../components/InputField';
import ButtonCustom from '../../../components/ButtonCustom';

export default function Step2EventDetailsScreen({ navigation, route }) {
  const { user, role } = useAuthContext();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [alcance, setAlcance] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (route.params?.eventData) {
      const {
        title,
        description,
        location,
        startDate,
        alcance,
      } = route.params.eventData;
      setTitulo(title || '');
      setDescripcion(description || '');
      setUbicacion(location || '');
      setFecha(startDate || new Date());
      setAlcance(alcance || '');
      setCreadoPor(user || '')
    }
  }, [route.params?.eventData]);


  if (role !== ROLE_ORGANIZADOR && role !== ROLE_ADMIN) {
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>No tienes permiso para crear eventos.</Text>
      </View>
    );
  }

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setFecha(selectedDate);
      setShowStartDatePicker(false);
      setShowTimePicker(true); // después de seleccionar fecha, mostrar hora
    } else {
      setShowStartDatePicker(false);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const newDate = new Date(fecha);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFecha(newDate);
    }
    setShowTimePicker(false);
  };

  const handleNext = async () => {
    if (titulo.trim() == '' || descripcion.trim() == '' || ubicacion.trim() == '' || alcance.trim() == '') {
      console.log('Completa todos los campos.', titulo, descripcion, ubicacion, alcance)
      Alert.alert('Error', 'Completa todos los campos con valores validos');
      return;
    }
    try {
      await createEvent({
        titulo,
        descripcion,
        ubicacion,
        fecha: Timestamp.fromDate(fecha),
        creadoPor: user.uid,
        alcance
      });
      navigation.navigate('CalendarEventsScreen');
      console.log('Evento guardado con exito')
      Alert.alert('Éxito', 'Evento guardado correctamente.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el evento.');
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Evento.</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <InputField
            placeholder="titulo"
            label="Titulo del evento"
            value={titulo}
            onChangeText={setTitulo}
          />
          <InputField
            placeholder="Escribe la descripcion de tu evento"
            label="Descripcion Evento"
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <Text style={styles.formSectionTitle}>Hora y Fecha del Evento</Text>

          <View style={styles.timingRow}>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerInput}>
              <InputField
                placeholder="DD/MM/YY"
                label="Fecha"
                value={fecha.toLocaleDateString()}
                editable={false}
                iconName="calendar"
                style={styles.halfWidthInput}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePickerInput}>
              <InputField
                placeholder="12:00 AM"
                label="Hora"
                value={fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                editable={false}
                iconName="time-outline"
                style={styles.halfWidthInput}
              />
            </TouchableOpacity>
          </View>

          {showStartDatePicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  const updatedDate = new Date(fecha);
                  updatedDate.setFullYear(selectedDate.getFullYear());
                  updatedDate.setMonth(selectedDate.getMonth());
                  updatedDate.setDate(selectedDate.getDate());
                  setFecha(updatedDate);
                }
                setShowStartDatePicker(false);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={fecha}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  const updatedDate = new Date(fecha);
                  updatedDate.setHours(selectedTime.getHours());
                  updatedDate.setMinutes(selectedTime.getMinutes());
                  setFecha(updatedDate);
                }
                setShowTimePicker(false);
              }}
            />
          )}

          <InputField
            placeholder="Ubicacion"
            label="Location"
            value={ubicacion}
            onChangeText={setUbicacion}
          />
          <Text style={styles.formSectionTitle}>Para cuantas personas esta proyectado el evento?</Text>
          <InputField value={alcance} onChangeText={setAlcance} placeholder="Alcance del evento" label="100" />
          <ButtonCustom
            title="Guardar Evento"
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 34,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  halfWidthInput: {
    width: '100%',
  },
  datePickerInput: {
    flex: 0.48,

  },
  guestOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  guestOptionsText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  warning: {
    marginTop: 100,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/