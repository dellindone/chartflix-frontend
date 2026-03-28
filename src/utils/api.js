// src/utils/api.js
const BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const API_ENDPOINTS = {
  LOGIN:            `${BASE_URL}/auth/login`,
  REGISTER:         `${BASE_URL}/auth/register`,
  LOGOUT:           `${BASE_URL}/auth/logout`,
  USER_PROFILE:     `${BASE_URL}/users/me`,
  ALERTS:           `${BASE_URL}/alerts`,
  RECOMMENDATIONS:  `${BASE_URL}/recommendations`,
  ADMIN_USERS:      `${BASE_URL}/admin/users`,
  ADMIN_ROLE:       (userId) => `${BASE_URL}/admin/users/${userId}/role`,
};

// Helper to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Logout helper — backend expects refresh_token as a query param
export const logoutAPI = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return;

  try {
    await fetch(`${API_ENDPOINTS.LOGOUT}?refresh_token=${encodeURIComponent(refreshToken)}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Logout API call failed:', error);
  }
};

// API request wrapper — clears tokens on 401 (no refresh endpoint on backend)
export const apiCall = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  return response;
};
