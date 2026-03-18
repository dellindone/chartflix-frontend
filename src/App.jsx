// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage   from './pages/LoginPage';
import SignupPage  from './pages/SignupPage';
import AlertsPage  from './pages/AlertsPage';
import RecoPage    from './pages/RecoPage';
import ProfilePage from './pages/ProfilePage';
import './styles/globals.css';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes (wrapped in layout) */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/alerts"  element={<AlertsPage />} />
                      <Route path="/reco"    element={<RecoPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      {/* Default redirect */}
                      <Route path="*" element={<Navigate to="/alerts" replace />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
