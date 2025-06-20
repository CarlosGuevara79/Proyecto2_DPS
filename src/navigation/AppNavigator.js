// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';


import EditarEventoScreen from '../screens/Events/EditarEventoScreen';
import EventDetailScreen from '../screens/Events/EventDetailScreen'; 
import CalendarEventsScreen from '../screens/Events/CalendarEventsScreen';

import OrganizerNavigator from './OrganizerNavigator';
import AdminNavigator from './AdminNavigator';
import EventCreateScreen from './EventCreateNavigator'; 
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MainScreen from '../screens/MainScreen';

import { useAuthContext } from '../hooks/useAuthContext';
import { ROLE_ADMIN, ROLE_ORGANIZADOR } from '../services/roles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabRoutes() {
  const { role } = useAuthContext();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Eventos') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Crear Evento') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Mensajes') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          else if (route.name === 'Gestionar Eventos') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1877F2',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 70 : 60,
          paddingBottom: Platform.OS === 'ios' ? 10 : 0,
        },
        tabBarLabelStyle: {
            fontSize: 12,
        }
      })}
    >
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="Eventos" component={CalendarEventsScreen} />
      <Tab.Screen name="Crear Evento" component={EventCreateScreen} />
      <Tab.Screen name="Mensajes" component={MessagesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />

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
      <Stack.Screen name="VerEvento" component={EventDetailScreen} />
      <Stack.Screen name="EditarEvento" component={EditarEventoScreen} />
    </Stack.Navigator>
  );
}

// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/