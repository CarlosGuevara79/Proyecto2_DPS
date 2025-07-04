// src/components/StarRating.js
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

export default function StarRating({ rating, onRatingChange, disabled = false }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => !disabled && onRatingChange(star)}
          disabled={disabled}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={24}
            color={disabled ? '#ccc' : '#FFD700'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func,
  disabled: PropTypes.bool,
};
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/