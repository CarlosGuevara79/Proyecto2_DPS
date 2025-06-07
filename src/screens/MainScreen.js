// src/screens/Auth/MainScreen.js
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { ROLE_ADMIN, ROLE_ORGANIZADOR } from '../services/roles';
import { useAuthContext } from '../hooks/useAuthContext'; 

const { width } = Dimensions.get('window'); 

export default function MainScreen({ navigation }) {
  const { user } = useAuthContext(); 
  const role = user?.role; 
  
  //const isAuthorizedToPlanEvent = true; Lo usamos para hacer pruebas

  const isAuthorizedToPlanEvent = role === ROLE_ADMIN || role === ROLE_ORGANIZADOR;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}> 
        <View style={styles.container}>
          {/* "Hola Usuario!" section */}
          <View style={styles.welcomeCard}>
            <Text style={styles.greetingText}>Hola {user?.nombre || 'Usuario'}!</Text> 
            <Text style={styles.introText}>
              ¡Hagamos que tus eventos sean extraordinarios, empezando aquí mismo!
            </Text>
            {isAuthorizedToPlanEvent && (
              <TouchableOpacity
                style={styles.planEventButton}
                onPress={() => navigation.navigate('Crear Evento')}
              >
                <Text style={styles.planEventButtonText}>Planificar un evento</Text>
              </TouchableOpacity>
            )}
          </View>

          
          <Text style={styles.sectionTitle}>Próximos eventos</Text>
          <View style={styles.emptyEventsCard}>
            <View style={styles.emptyEventsImagePlaceholder} />
            <View style={styles.emptyEventsTextContainer}>
              <Text style={styles.emptyEventsTitle}>Sin eventos</Text>
              <Text style={styles.emptyEventsDescription}>
                Tu calendario de eventos es un lienzo en blanco. Usa EventJoy para llenarlo de momentos memorables.
              </Text>
            </View>
          </View>

        
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

MainScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8', 
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 450, 
  },
  
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  greetingText: {
    fontSize: 22, 
    fontWeight: '700',
    color: '#333', 
    marginBottom: 10,
  },
  introText: {
    fontSize: 16, 
    color: '#666', 
    marginBottom: 20,
  },
  planEventButton: {
    backgroundColor: '#1877F2', 
    borderRadius: 10, 
    paddingVertical: 14,
    alignItems: 'center',
  },
  planEventButtonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: '600',
  },

 
  sectionTitle: {
    fontSize: 20, 
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },

  
  emptyEventsCard: {
    flexDirection: 'row', 
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  emptyEventsImagePlaceholder: {
    width: 70, 
    height: 70,
    borderRadius: 35, 
    backgroundColor: '#E0E0E0', 
    marginRight: 15,
  },
  emptyEventsTextContainer: {
    flex: 1, 
  },
  emptyEventsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  emptyEventsDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },


});


import { ScrollView } from 'react-native';