import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page at / */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Auth Routes using AuthLayout */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Route>
          </Route>

          {/* Protected Admin Routes using AdminLayout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route
                path="employees"
                element={
                  <PlaceholderPage
                    title="Employee Directory"
                    description="Browse, filter, and inspect employee compensation profiles."
                  />
                }
              />
              <Route
                path="import"
                element={
                  <PlaceholderPage
                    title="Bulk CSV Import"
                    description="Stream high-volume employee CSV datasets directly to Rails 8 import endpoint."
                  />
                }
              />
              <Route
                path="users"
                element={
                  <PlaceholderPage
                    title="Organization Team & RBAC"
                    description="Manage organization admins, HR managers, and employee access permissions."
                  />
                }
              />
              <Route path="analytics" element={<AdminDashboardPage />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
