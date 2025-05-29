// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventNavigator from './EventNavigator';
import OrganizerNavigator from './OrganizerNavigator';
import AdminNavigator from './AdminNavigator';
import EventCreateScreen from '../screens/Events/EventCreateScreen';
import { useAuthContext } from '../hooks/useAuthContext';
import { ROLE_ADMIN, ROLE_ORGANIZADOR } from '../services/roles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabRoutes() {
  const { role } = useAuthContext();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Eventos" component={EventNavigator} />
      {role === ROLE_ORGANIZADOR && (
        <Tab.Screen name="Gestionar Eventos" component={OrganizerNavigator} />
      )}
      {role === ROLE_ADMIN && (
        <Tab.Screen name="Admin" component={AdminNavigator} />
      )}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={TabRoutes} />
      <Stack.Screen name="EventCreate" component={EventCreateScreen} />
    </Stack.Navigator>
  );
}
