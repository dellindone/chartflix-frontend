// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
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
            const json = await response.json();
            setCurrentUser(json.data);
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
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        return { success: false, error: json.message || 'Login failed' };
      }

      // Backend wraps tokens in json.data
      localStorage.setItem('access_token', json.data.access_token);
      localStorage.setItem('refresh_token', json.data.refresh_token);

      // Fetch user profile
      const userRes = await apiCall(API_ENDPOINTS.USER_PROFILE, { method: 'GET' });
      if (!userRes.ok) {
        return { success: false, error: 'Failed to fetch user profile' };
      }

      const userJson = await userRes.json();
      setCurrentUser(userJson.data);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Server error' };
    }
  };

  const signup = async (data) => {
    const { name, email, phone, password, confirmPassword } = data;

    // Client-side validation (backend requires 8+ chars)
    if (!name || !email || password.length < 8) {
      return { success: false, error: 'Fill all fields (min 8 char password).' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, confirm_password: confirmPassword }),
      });

      const json = await response.json();

      if (!response.ok) {
        return { success: false, error: json.message || 'Signup failed' };
      }

      localStorage.setItem('access_token', json.data.access_token);
      localStorage.setItem('refresh_token', json.data.refresh_token);

      // Fetch user profile
      const userRes = await apiCall(API_ENDPOINTS.USER_PROFILE, { method: 'GET' });
      if (!userRes.ok) {
        return { success: false, error: 'Failed to fetch user profile' };
      }

      const userJson = await userRes.json();
      setCurrentUser(userJson.data);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Server error' };
    }
  };

  const logout = async () => {
    await logoutAPI();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setCurrentUser(null);
    navigate('/login');
  };

  const updateProfile = async (updates) => {
    try {
      const response = await apiCall(API_ENDPOINTS.USER_PROFILE, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        return { success: false, error: 'Failed to update profile' };
      }

      const json = await response.json();
      setCurrentUser(json.data);
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
