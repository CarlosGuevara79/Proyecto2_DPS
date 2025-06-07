// src/components/ButtonCustom.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

export default function ButtonCustom({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  style, // Allows custom styles to be passed
  textStyle // Allows custom text styles to be passed
}) {
  return (
    <TouchableOpacity
      style={[styles.button, style, (disabled || isLoading) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7} // Visual feedback on press
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

ButtonCustom.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1877F2', // Blue from the design
    paddingVertical: 16, // Ample padding
    borderRadius: 10, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1877F2', // Blue shadow matching the button color
    shadowOffset: { width: 0, height: 5 }, // More prominent shadow
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700', // Bold
  },
  buttonDisabled: {
    opacity: 0.7, // Dim the button when disabled
    shadowOpacity: 0.1, // Less shadow when disabled
    elevation: 2,
  },
});
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/