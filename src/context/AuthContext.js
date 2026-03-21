// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiCall, logoutAPI } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from stored token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await apiCall(API_ENDPOINTS.USER_PROFILE, { method: 'GET' });
          if (response.ok) {
            const user = await response.json();
            setCurrentUser(user);
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.SIGNIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.detail || 'Login failed' };
      }

      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      // Fetch user profile
      const userRes = await apiCall(API_ENDPOINTS.USER_PROFILE, { method: 'GET' });
      if (!userRes.ok) {
        return { success: false, error: 'Failed to fetch user profile' };
      }

      const user = await userRes.json();
      setCurrentUser(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Server error' };
    }
  };

  const signup = async (data) => {
    const { name, email, phone, password, confirmPassword } = data;

    // Client-side validation
    if (!name || !email || password.length < 6) {
      return { success: false, error: 'Fill all fields (min 6 char password).' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.detail || 'Signup failed' };
      }

      // Store tokens from signup response
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);

      // Fetch user profile
      const userRes = await apiCall(API_ENDPOINTS.USER_PROFILE, { method: 'GET' });
      if (!userRes.ok) {
        return { success: false, error: 'Failed to fetch user profile' };
      }

      const user = await userRes.json();
      setCurrentUser(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Server error' };
    }
  };

  const logout = async () => {
    // Call logout endpoint to invalidate token on backend
    await logoutAPI();

    // Clear tokens and user state
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setCurrentUser(null);
    navigate('/login');
  };

  const updateProfile = async (updates) => {
    try {
      const response = await apiCall(API_ENDPOINTS.USER_PROFILE, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        return { success: false, error: 'Failed to update profile' };
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Server error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, signup, logout, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
