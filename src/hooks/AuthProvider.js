// src/hooks/useAuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  role: null,
  nombre: null,
  setUser: () => {},
  setRole: () => {},
  setNombre: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [nombre, setNombre] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, role,nombre, setUser, setRole,setNombre }}>
      {children}
    </AuthContext.Provider>
  );
}
