// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventNavigator      from './EventNavigator';
import OrganizerNavigator  from './OrganizerNavigator';
import AdminNavigator      from './AdminNavigator';
import { AuthContext }     from '../hooks/useAuthContext';
import { ROLE_ADMIN, ROLE_ORGANIZADOR } from '../services/roles';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { role } = useContext(AuthContext);

  return (
    <Tab.Navigator>
      {/* Todos los usuarios ven los eventos */}
      <Tab.Screen
        name="Eventos"
        component={EventNavigator}
      />

      {/* Solo organizadores pueden gestionar eventos */}
      {role === ROLE_ORGANIZADOR && (
        <Tab.Screen
          name="Gestionar Eventos"
          component={OrganizerNavigator}
        />
      )}

      {/* Solo administradores */}
      {role === ROLE_ADMIN && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
        />
      )}
    </Tab.Navigator>
  );
}
