// src/hooks/useAuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  role: null,
  displayName: null,
  setUser: () => {},
  setRole: () => {},
  setdisplayName: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [displayName, setdisplayName] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, role,displayName, setUser, setRole,setdisplayName }}>
      {children}
    </AuthContext.Provider>
  );
}
// Este archivo está bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)
// Puedes ver el texto completo de la licencia en: https://creativecommons.org/licenses/by-nc-sa/4.0/