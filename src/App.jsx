// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage   from './pages/LoginPage';
import SignupPage  from './pages/SignupPage';
import AlertsPage  from './pages/AlertsPage';
import RecoPage    from './pages/RecoPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage   from './pages/AdminPage';
import AnalystPage from './pages/AnalystPage';
import './styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
                      <Route path="/analyst" element={<AnalystPage />} />
                      <Route path="/admin"   element={<AdminPage />} />
                      <Route path="*" element={<Navigate to="/alerts" replace />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
