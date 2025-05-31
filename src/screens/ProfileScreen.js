// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the placeholder icon (ensure @expo/vector-icons is installed)

// Import your AuthContext hook to get user data
import { useAuthContext } from '../hooks/useAuthContext'; // Adjust path if necessary

export default function ProfileScreen() {
  const { user, role } = useAuthContext(); // Get user and role from context

  // Extract user details (using optional chaining for safety)
  const userName = user?.displayName || user?.email || 'Usuario Desconocido';
  const userEmail = user?.email || 'No disponible';
  const userRole = role || 'No asignado';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Photo Placeholder Section */}
          <View style={styles.profilePhotoContainer}>
            {/* You can replace this with an actual Image component later */}
            {/* Example: <Image source={require('../../assets/profile_pic.png')} style={styles.profilePhoto} /> */}
            <Ionicons name="person-circle-outline" size={100} color="#ccc" />
          </View>

          {/* User Information Section */}
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <Text style={styles.userRole}>Rol: {userRole}</Text>

          {/* Placeholder for other profile details or options */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Acerca de mí</Text>
            <Text style={styles.cardText}>
              Aquí puedes añadir una breve biografía o descripción del usuario.
              Esto es un placeholder para futuras funcionalidades.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Configuración</Text>
            <Text style={styles.cardText}>
              Opciones de configuración de la cuenta, notificaciones, privacidad, etc.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Mis Eventos Creados</Text>
            <Text style={styles.cardText}>
              Lista de eventos que el usuario ha organizado o creado.
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Light grey background
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center', // Center content horizontally
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400, // Max width for content on larger screens (web/tablet)
    alignItems: 'center', // Center items within the container
  },
  profilePhotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60, // Makes it a circle
    backgroundColor: '#e0e0e0', // Light grey background for the placeholder
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden', // Ensures image/icon stays within bounds
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30, // Space before info cards
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});