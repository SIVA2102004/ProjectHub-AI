import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { id: 'analytics', icon: '📊', label: 'Analytics', path: '/admin' },
  { id: 'projects', icon: '📁', label: 'Projects', path: '/admin/projects' },
  { id: 'users', icon: '👥', label: 'Users', path: '/admin/users' },
  { id: 'orders', icon: '📦', label: 'Orders', path: '/admin/orders' },
  { id: 'requests', icon: '🛠', label: 'Custom Requests', path: '/admin/requests' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 bg-dark-800 border-r border-white/5 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">P</div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white whitespace-nowrap">ProjectHub AI</div>
                <div className="text-xs text-gray-500">Admin Panel</div>
              </div>
            )}
          </Link>
          <button onClick={() => setSidebarOpen(p => !p)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link key={item.id} to={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-2' : ''}`}
              title={!sidebarOpen ? item.label : ''}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-white/5">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-dark-700 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{user?.name}</div>
                <div className="text-gray-500 text-xs truncate">{user?.email}</div>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors text-sm" title="Logout">🚪</button>
            )}
          </div>
          {!sidebarOpen && (
            <button onClick={handleLogout} className="w-full mt-2 p-2 text-gray-400 hover:text-red-400 transition-colors text-sm">🚪</button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-dark-800 border-b border-white/5 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white">
              {navItems.find(n => isActive(n.path))?.label || 'Dashboard'}
            </h1>
            <p className="text-gray-500 text-xs">ProjectHub AI Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="btn-secondary text-xs py-2 px-3">🌐 View Site</Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
