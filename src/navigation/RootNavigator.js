import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator  from './AppNavigator';
import { AuthContext } from '../hooks/useAuthContext';

export default function RootNavigator() {
  const { user } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {user ? <AppNavigator/> : <AuthNavigator/>}
    </NavigationContainer>
  );
}
