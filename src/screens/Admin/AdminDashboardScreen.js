// src/screens/Admin/AdminDashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonCustom from '../../components/ButtonCustom'; 

export default function AdminDashboardScreen({ navigation }) {
 
  const handleReturn = () => {

    navigation.navigate('HomeTabs', { screen: 'Perfil' });
  };

  const handleUpdateProfiles = () => {
    console.log('Navigating to Update User Profiles Screen (placeholder)');

  };

  const handleGetReports = () => {
    console.log('Navigating to Reports Screen (placeholder)');
  };

  return (
    <View style={styles.container}>
      
      {/*<TouchableOpacity onPress={handleReturn} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>*/}


      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, Administrator!</Text>
      <Text style={styles.infoText}>This is your central hub for administrative tasks.</Text>

      
      <View style={styles.optionsContainer}>
        <ButtonCustom
          title="Update User Profiles"
          onPress={handleUpdateProfiles}
          style={styles.button}
        />
        <ButtonCustom
          title="Generate Reports"
          onPress={handleGetReports}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    marginBottom: 15,
  },
});