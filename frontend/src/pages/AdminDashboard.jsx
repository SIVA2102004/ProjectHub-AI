/**
 * Admin Dashboard Page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      // Fetch analytics
      const analyticsRes = await api.get('/admin/analytics');
      setAnalytics(analyticsRes.data.data);

      // Fetch projects
      const projectsRes = await api.get('/projects');
      setProjects(projectsRes.data.data);

      // Fetch users
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data.data);

      // Fetch orders
      const ordersRes = await api.get('/admin/orders');
      setOrders(ordersRes.data.data);

      // Fetch custom requests
      const requestsRes = await api.get('/custom-requests');
      setCustomRequests(requestsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }

    setIsLoading(false);
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your platform and track analytics</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'projects', label: 'Projects' },
            { id: 'users', label: 'Users' },
            { id: 'orders', label: 'Orders' },
            { id: 'requests', label: 'Custom Requests' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold transition border-b-2 ${
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                {
                  label: 'Total Users',
                  value: analytics.summary.totalUsers,
                  icon: '👥',
                },
                {
                  label: 'Total Projects',
                  value: analytics.summary.totalProjects,
                  icon: '📚',
                },
                {
                  label: 'Total Downloads',
                  value: analytics.summary.totalDownloads,
                  icon: '⬇️',
                },
                {
                  label: 'Total Orders',
                  value: analytics.summary.totalOrders,
                  icon: '🛒',
                },
                {
                  label: 'Revenue',
                  value: `₹${analytics.summary.totalRevenue}`,
                  icon: '💰',
                },
              ].map((kpi, index) => (
                <div key={index} className="card">
                  <div className="text-3xl mb-3">{kpi.icon}</div>
                  <p className="text-slate-400 text-sm">{kpi.label}</p>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {analytics.recentUsers.map((user, index) => (
                    <div key={index} className="flex justify-between items-center pb-3 border-b border-slate-700">
                      <div>
                        <p className="text-white font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                      <span className="text-slate-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {analytics.recentOrders.map((order, index) => (
                    <div key={index} className="flex justify-between items-center pb-3 border-b border-slate-700">
                      <div>
                        <p className="text-white font-semibold">{order.title}</p>
                        <p className="text-slate-400 text-sm">{order.email}</p>
                      </div>
                      <span className="text-blue-400 font-semibold">₹{order.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Projects by Category</h3>
              <div className="space-y-3">
                {analytics.categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white">{category.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(category.projectCount / Math.max(...analytics.categoryBreakdown.map(c => c.projectCount))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-blue-400 font-semibold w-12 text-right">
                        {category.projectCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Projects ({projects.length})</h3>
              <button className="btn-primary text-sm">Add New Project</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400">Title</th>
                    <th className="text-left py-3 px-4 text-slate-400">Category</th>
                    <th className="text-left py-3 px-4 text-slate-400">Price</th>
                    <th className="text-left py-3 px-4 text-slate-400">Downloads</th>
                    <th className="text-left py-3 px-4 text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.slice(0, 10).map((project) => (
                    <tr key={project.id} className="border-b border-slate-700 hover:bg-slate-800 transition">
                      <td className="py-3 px-4 text-white">{project.title}</td>
                      <td className="py-3 px-4 text-slate-300">{project.categoryName}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {project.isFree ? 'Free' : `₹${project.price}`}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{project.downloadCount}</td>
                      <td className="py-3 px-4 text-sm space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-6">Users ({users.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400">Name</th>
                    <th className="text-left py-3 px-4 text-slate-400">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400">College</th>
                    <th className="text-left py-3 px-4 text-slate-400">Role</th>
                    <th className="text-left py-3 px-4 text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map((user) => (
                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-800 transition">
                      <td className="py-3 px-4 text-white">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{user.email}</td>
                      <td className="py-3 px-4 text-slate-300">{user.college || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-6">Orders ({orders.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400">Project</th>
                    <th className="text-left py-3 px-4 text-slate-400">User</th>
                    <th className="text-left py-3 px-4 text-slate-400">Amount</th>
                    <th className="text-left py-3 px-4 text-slate-400">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-800 transition">
                      <td className="py-3 px-4 text-white">{order.title}</td>
                      <td className="py-3 px-4 text-slate-300">{order.email}</td>
                      <td className="py-3 px-4 text-slate-300">₹{order.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${order.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Custom Requests Tab */}
        {activeTab === 'requests' && (
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-6">Custom Requests ({customRequests.length})</h3>
            <div className="space-y-4">
              {customRequests.map((request) => (
                <div key={request.id} className="border border-slate-700 rounded-lg p-4 hover:border-primary transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-semibold">{request.projectTitle}</h4>
                      <p className="text-slate-400 text-sm">
                        {request.name} • {request.college}
                      </p>
                    </div>
                    <span className={`badge ${request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{request.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-slate-400">
                      Budget: <span className="text-white font-semibold">₹{request.budget}</span>
                    </div>
                    <div className="space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">View</button>
                      <button className="text-green-400 hover:text-green-300">Accept</button>
                      <button className="text-red-400 hover:text-red-300">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
