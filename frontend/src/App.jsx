/**
 * Main App Component
 * Routing and layout setup
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetailsPage from './pages/ProjectDetailsPage.jsx';
import CustomProjectPage from './pages/CustomProjectPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Styles
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-900 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/custom-project" element={<CustomProjectPage />} />

              {/* Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-slate-900">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                      <p className="text-xl text-slate-300">Page not found</p>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
