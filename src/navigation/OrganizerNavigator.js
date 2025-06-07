import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import EventCreateScreen from './EventCreateNavigator';
import EditarEventoScreen from '../screens/Events/EditarEventoScreen';

const Stack = createNativeStackNavigator();

export default function OrganizerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
      />
      <Stack.Screen
        name="EventCreate"
        component={EventCreateScreen}
      />
      <Stack.Screen name="EditarEvento" component={EditarEventoScreen} />
    </Stack.Navigator>
  );
}
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/