// src/screens/Auth/WelcomeScreen.js
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import bgWelcome from '../../../assets/fondoinicio.jpg';  // 1) Importamos la imagen

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {  // 2) Desestructuramos navigation
  return (
    <SafeAreaView style={styles.flex}>
      <ImageBackground
        source={bgWelcome}           // uso de la importación
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Eventos Comunitarios</Text>
          <Text style={styles.subtitle}>
            Conecta, comparte y participa en tu comunidad.
          </Text>

          <TouchableOpacity
            style={styles.outlinedButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.outlinedButtonText}>Comenzar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// 3) Validación de props
WelcomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  background: {
    width,
    height
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 30
  },
  outlinedButton: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 40
  },
  outlinedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});
