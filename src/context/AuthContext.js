// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Seed demo user
const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@chartflix.com',
  password: 'demo123',
  phone: '+91 98765 43210',
  location: 'Chennai, India',
  photo: null,
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([DEMO_USER]);
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password.' };
    setCurrentUser({ ...user });
    return { success: true };
  };

  const signup = (data) => {
    const { name, email, phone, password, confirmPassword } = data;
    if (!name || !email || password.length < 6)
      return { success: false, error: 'Fill all fields (min 6 char password).' };
    if (password !== confirmPassword)
      return { success: false, error: 'Passwords do not match.' };
    if (users.find((u) => u.email === email))
      return { success: false, error: 'Email already registered.' };

    const newUser = { name, email, phone, password, location: '', photo: null };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser({ ...newUser });
    return { success: true };
  };

  const logout = () => setCurrentUser(null);

  const updateProfile = (updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
