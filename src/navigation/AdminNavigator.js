import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import EventCreateScreen from '../screens/Events/EventCreateScreen';
const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
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
    </Stack.Navigator>
  );
}
