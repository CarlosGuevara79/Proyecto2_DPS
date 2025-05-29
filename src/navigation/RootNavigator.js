import React, { useContext } from 'react';
import AuthNavigator from './AuthNavigator';
import AppNavigator  from './AppNavigator';
import { useAuthContext }     from '../hooks/useAuthContext';

export default function RootNavigator() {
  const { user } = useAuthContext();
  return user ? <AppNavigator /> : <AuthNavigator />;
}
