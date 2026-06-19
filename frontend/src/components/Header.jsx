/**
 * Header Component
 * Navigation bar and header for the app
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">ProjectHub AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-300 hover:text-white transition">
              Home
            </Link>
            <Link to="/projects" className="text-slate-300 hover:text-white transition">
              Browse
            </Link>
            <Link to="/custom-project" className="text-slate-300 hover:text-white transition">
              Custom Project
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-slate-300 hover:text-white transition">
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-300 text-sm hidden sm:inline">
                  {user?.firstName || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-outline text-xs sm:text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-xs sm:text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-xs sm:text-sm">
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-slate-700">
            <Link to="/" className="block py-2 text-slate-300 hover:text-white">
              Home
            </Link>
            <Link to="/projects" className="block py-2 text-slate-300 hover:text-white">
              Browse
            </Link>
            <Link to="/custom-project" className="block py-2 text-slate-300 hover:text-white">
              Custom Project
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block py-2 text-slate-300 hover:text-white">
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
