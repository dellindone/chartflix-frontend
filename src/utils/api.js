// src/utils/api.js
const BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  SIGNIN: `${BASE_URL}/auth/signin`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  REFRESH: `${BASE_URL}/auth/refresh`,
  USER_PROFILE: `${BASE_URL}/user/profile`,
};

// Helper to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Handle token refresh
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await fetch(API_ENDPOINTS.REFRESH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  return data.access_token;
};

// Logout helper to send refresh token
export const logoutAPI = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return;

  try {
    await apiCall(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch (error) {
    console.error('Logout API call failed:', error);
  }
};

// API request wrapper with auto token refresh
export const apiCall = async (url, options = {}) => {
  let response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(),
  });

  // If unauthorized, try to refresh token
  if (response.status === 401) {
    try {
      const newToken = await refreshAccessToken();
      return fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${newToken}`,
        },
      });
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  }

  return response;
};
