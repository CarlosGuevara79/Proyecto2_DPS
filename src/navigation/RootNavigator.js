import React, { useContext } from 'react';
import AuthNavigator from './AuthNavigator';
import AppNavigator  from './AppNavigator';
import { useAuthContext }     from '../hooks/useAuthContext';

export default function RootNavigator() {
  const { user } = useAuthContext();
  return user ? <AppNavigator /> : <AuthNavigator />;
}
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/