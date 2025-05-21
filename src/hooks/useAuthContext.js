// src/hooks/useAuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  role: null,
  setUser: () => {},
  setRole: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}
