import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomRequestPage from './pages/CustomRequestPage';
import ContactPage from './pages/ContactPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';

// Admin Pages
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminProjects from './pages/admin/AdminProjects';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomRequests from './pages/admin/AdminCustomRequests';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/custom-request" element={<CustomRequestPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Student Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><StudentDashboard /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute><AdminAnalytics /></AdminRoute>
          } />
          <Route path="/admin/projects" element={
            <AdminRoute><AdminProjects /></AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><AdminUsers /></AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute><AdminOrders /></AdminRoute>
          } />
          <Route path="/admin/requests" element={
            <AdminRoute><AdminCustomRequests /></AdminRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
