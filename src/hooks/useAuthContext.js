import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export const useAuthContext = () => useContext(AuthContext);
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/