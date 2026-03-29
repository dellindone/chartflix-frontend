// src/utils/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'https://chartflix-backend-production.up.railway.app/api/v1';

export const API_ENDPOINTS = {
  LOGIN:            `${BASE_URL}/auth/login`,
  REGISTER:         `${BASE_URL}/auth/register`,
  LOGOUT:           `${BASE_URL}/auth/logout`,
  REFRESH:          `${BASE_URL}/auth/refresh`,
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

// Attempt to refresh the access token using the stored refresh token
const tryRefresh = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;
  try {
    const res = await fetch(
      `${API_ENDPOINTS.REFRESH}?refresh_token=${encodeURIComponent(refreshToken)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );
    if (!res.ok) return false;
    const json = await res.json();
    if (json.data?.access_token) {
      localStorage.setItem('access_token', json.data.access_token);
      localStorage.setItem('refresh_token', json.data.refresh_token);
      return true;
    }
  } catch { /* ignore */ }
  return false;
};

// API request wrapper — auto-refreshes token on 401, clears session if refresh fails
export const apiCall = async (url, options = {}) => {
  let response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      // Retry original request with new token
      response = await fetch(url, {
        ...options,
        headers: getAuthHeaders(),
      });
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  return response;
};
