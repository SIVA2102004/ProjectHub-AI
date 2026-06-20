import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="glass-card p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-black text-white">{value}</div>
        <div className="text-gray-400 text-sm">{label}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// Simple bar chart component
function BarChart({ data }) {
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-48 text-gray-500">No revenue data yet</div>
  );
  const max = Math.max(...data.map(d => d.revenue || 0), 1);
  return (
    <div className="flex items-end gap-3 h-48 pt-4">
      {data.map((d, i) => {
        const height = Math.max(((d.revenue || 0) / max) * 100, 2);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="text-xs text-gray-500 group-hover:text-white transition-colors">₹{(d.revenue||0).toLocaleString('en-IN')}</div>
            <div className="w-full relative" style={{ height: `${height}%`, minHeight: '4px' }}>
              <div className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xs text-gray-500 text-center">{d.month?.slice(5) || ''}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/summary').then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64"><div className="loader w-12 h-12" /></div>
    </AdminLayout>
  );

  const { summary = {}, monthlyRevenue = [], recentUsers = [], recentOrders = [], topProjects = [], categoryStats = [] } = data || {};

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard icon="👥" label="Total Students" value={summary.totalUsers?.toLocaleString() || 0} color="from-blue-500 to-primary-600" sub="Registered users" />
          <StatCard icon="📁" label="Total Projects" value={summary.totalProjects || 0} color="from-purple-500 to-pink-600" sub="Active listings" />
          <StatCard icon="⬇" label="Total Downloads" value={summary.totalDownloads?.toLocaleString() || 0} color="from-green-500 to-emerald-600" sub="All time" />
          <StatCard icon="📦" label="Completed Orders" value={summary.totalOrders || 0} color="from-orange-500 to-red-500" sub="Paid orders" />
          <StatCard icon="💰" label="Total Revenue" value={`₹${(summary.totalRevenue || 0).toLocaleString('en-IN')}`} color="from-yellow-500 to-amber-600" sub="All time earnings" />
          <StatCard icon="🛠" label="Pending Requests" value={summary.pendingRequests || 0} color="from-cyan-500 to-blue-600" sub="Awaiting review" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="glass-card p-7">
            <h3 className="text-white font-bold mb-1 text-lg">Monthly Revenue</h3>
            <p className="text-gray-400 text-sm mb-6">Last 6 months earnings</p>
            <BarChart data={monthlyRevenue} />
          </div>

          {/* Category Stats */}
          <div className="glass-card p-7">
            <h3 className="text-white font-bold mb-1 text-lg">Category Distribution</h3>
            <p className="text-gray-400 text-sm mb-6">Projects by category</p>
            <div className="space-y-3">
              {categoryStats.slice(0, 6).map((cat, i) => {
                const maxCount = Math.max(...categoryStats.map(c => c.project_count || 0), 1);
                const pct = Math.round(((cat.project_count || 0) / maxCount) * 100);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm w-28 truncate flex-shrink-0">{cat.name}</span>
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-600 to-purple-600 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-gray-400 text-xs w-6 text-right">{cat.project_count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="glass-card p-7">
            <h3 className="text-white font-bold mb-6 text-lg">Recent Registrations</h3>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">No users yet</p>
              ) : recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {u.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{u.name}</div>
                    <div className="text-gray-500 text-xs truncate">{u.email}</div>
                  </div>
                  <div className="text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass-card p-7">
            <h3 className="text-white font-bold mb-6 text-lg">Recent Orders</h3>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-sm">No orders yet</p>
              ) : recentOrders.map((order, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/50">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{order.project_title}</div>
                    <div className="text-gray-500 text-xs truncate">{order.user_name} · {order.user_email}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-bold text-sm">₹{order.amount}</div>
                    <span className={`text-xs ${order.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Projects */}
        <div className="glass-card p-7">
          <h3 className="text-white font-bold mb-6 text-lg">🔥 Top Projects by Downloads</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Project', 'Category', 'Downloads', 'Views', 'Price'].map(h => (
                    <th key={h} className="text-left pb-4 text-gray-400 font-medium text-xs uppercase pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topProjects.map((p, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-4 text-white font-medium">{p.title}</td>
                    <td className="py-4 pr-4 text-gray-400">{p.category_name}</td>
                    <td className="py-4 pr-4"><span className="text-green-400 font-bold">{p.download_count}</span></td>
                    <td className="py-4 pr-4 text-gray-400">{p.view_count}</td>
                    <td className="py-4 text-primary-400 font-semibold">{p.price === 0 ? 'Free' : `₹${p.price}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
