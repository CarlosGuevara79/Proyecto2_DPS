import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AsistenciaSelector({ asistencia, onSelect, eventoFinalizado }) {
  const handlePress = (valor) => {
    if (!eventoFinalizado) {
      onSelect(valor);
    }
  };

  const renderTexto = () => {
    if (eventoFinalizado) {
      if (asistencia === 'si') return 'Asististe al evento';
      if (asistencia === 'no') return 'No asististe al evento';
      return 'No confirmaste tu asistencia';
    }
    return '¿Vas a asistir a este evento?';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{renderTexto()}</Text>
      {!eventoFinalizado && (
        <View style={styles.botones}>
          <TouchableOpacity
            style={[
              styles.boton,
              asistencia === 'si' && styles.botonActivoSi
            ]}
            onPress={() => handlePress('si')}
          >
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text style={styles.textoBoton}>Sí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boton,
              asistencia === 'no' && styles.botonActivoNo
            ]}
            onPress={() => handlePress('no')}
          >
            <Ionicons name="close-circle" size={24} color="white" />
            <Text style={styles.textoBoton}>No</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600'
  },
  botones: {
    flexDirection: 'row',
    gap: 20
  },
  boton: {
    flexDirection: 'row',
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  botonActivoSi: {
    backgroundColor: '#4CAF50'
  },
  botonActivoNo: {
    backgroundColor: '#F44336'
  },
  textoBoton: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold'
  }
});
