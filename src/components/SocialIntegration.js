// src/components/SocialIntegration.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome'; // You'll need to install this library

export default function SocialIntegration({ onGooglePress, onFacebookPress }) {
  return (
    <View style={styles.socialContainer}>
      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>o continúa con</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={onGooglePress} activeOpacity={0.7}>
          <Icon name="google" size={24} color="#DB4437" /> {/* Google Red */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={onFacebookPress} activeOpacity={0.7}>
          <Icon name="facebook" size={24} color="#4267B2" /> {/* Facebook Blue */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

SocialIntegration.propTypes = {
  onGooglePress: PropTypes.func.isRequired,
  onFacebookPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  socialContainer: {
    alignItems: 'center',
    marginTop: 20, // Space above social section
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0', // Light grey line
  },
  separatorText: {
    marginHorizontal: 15,
    color: '#888', // Medium grey text
    fontSize: 14,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15, // Space between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});