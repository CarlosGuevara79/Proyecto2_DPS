import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen'; 

import MainScreen from '../screens/MainScreen';
import EventCreateScreen from './EventCreateNavigator'; 
import EditarEventoScreen from '../screens/Events/EditarEventoScreen';
import EventDetailScreen from '../screens/Events/EventDetailScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    
      <Stack.Screen
        name="AdminDashboard" 
        component={AdminDashboardScreen}
      />

 
      <Stack.Screen name="AdminMain" component={MainScreen} />
      <Stack.Screen name="AdminEventCreate" component={EventCreateScreen} />
      <Stack.Screen name="AdminVerEvento" component={EventDetailScreen} />

     
      <Stack.Screen name="AdminEditarEvento" component={EditarEventoScreen} />

    </Stack.Navigator>
  );
}
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/