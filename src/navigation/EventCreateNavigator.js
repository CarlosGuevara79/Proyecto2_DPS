// src/screens/Events/EventCreateScreen.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Step2EventDetailsScreen from '../screens/Events/EventCreateFlow/EventDetailsScreen'; 
import CalendarEventsScreen from '../screens/Events/CalendarEventsScreen';
import EventDetailScreen from '../screens/Events/EventDetailScreen';
import EditarEventoScreen from '../screens/Events/EditarEventoScreen';

const Stack = createNativeStackNavigator();

export default function EventCreateScreen() {
  return (
    <Stack.Navigator
      initialRouteName="EventDetails"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="EventDetails" component={Step2EventDetailsScreen} />
      <Stack.Screen name="CalendarEventsScreen" component={CalendarEventsScreen} />
      <Stack.Screen name="VerEvento" component={EventDetailScreen} />
      <Stack.Screen name="EditarEvento" component={EditarEventoScreen} />
    </Stack.Navigator>
  );
}
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/