import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const tabs = [
  { id: 'overview', label: '🏠 Overview', icon: '🏠' },
  { id: 'orders', label: '📦 My Orders', icon: '📦' },
  { id: 'downloads', label: '⬇ Downloads', icon: '⬇' },
  { id: 'requests', label: '🛠 Custom Requests', icon: '🛠' },
  { id: 'profile', label: '👤 Profile', icon: '👤' },
];

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  completed: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
  in_review: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  accepted: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  refunded: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
};

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', college: user?.college || '', phone: user?.phone || '' });
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'downloads') fetchDownloads();
    if (activeTab === 'requests') fetchRequests();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try { const r = await api.get('/orders/my'); setOrders(r.data.orders); }
    catch {} finally { setLoading(false); }
  };

  const fetchDownloads = async () => {
    setLoading(true);
    try { const r = await api.get('/downloads/history'); setDownloads(r.data.downloads); }
    catch {} finally { setLoading(false); }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try { const r = await api.get('/custom-requests/my'); setCustomRequests(r.data.requests); }
    catch {} finally { setLoading(false); }
  };

  const handleProfileSave = async () => {
    try {
      const res = await api.put('/auth/profile', profileForm);
      updateUser(res.data.user);
      setProfileMsg('✅ Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch { setProfileMsg('❌ Failed to update profile'); }
  };

  const handleDownload = async (projectId, fileType, projectSlug = 'project') => {
    try {
      const response = await api.get(`/downloads/${projectId}/${fileType}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `${projectSlug}-${fileType}`;
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches && matches[1]) fileName = matches[1];
      } else {
        const ext = fileType === 'source' ? 'zip' : 'pdf';
        fileName = `${projectSlug}-${fileType}.${ext}`;
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download file. Please try again.');
    }
  };

  const totalSpent = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Header */}
        <div className="bg-dark-800/50 border-b border-white/5 px-4 py-8">
          <div className="max-w-7xl mx-auto flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-gray-400 text-sm">{user?.email} · {user?.college || 'Student'}</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-60 flex-shrink-0">
              <div className="glass-card p-3 sticky top-24">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`sidebar-item w-full text-left ${activeTab === tab.id ? 'active' : ''}`}>
                    <span>{tab.icon}</span>
                    <span className="text-sm font-medium">{tab.label.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-white mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Total Orders', value: orders.length || '—', icon: '📦', color: 'from-blue-500 to-primary-600' },
                      { label: 'Downloads', value: downloads.length || '—', icon: '⬇', color: 'from-green-500 to-emerald-600' },
                      { label: 'Total Spent', value: `₹${totalSpent || 0}`, icon: '💰', color: 'from-purple-500 to-pink-600' },
                      { label: 'Requests', value: customRequests.length || '—', icon: '🛠', color: 'from-orange-500 to-red-600' },
                    ].map((stat, i) => (
                      <div key={i} className="stat-card">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl flex-shrink-0`}>
                          {stat.icon}
                        </div>
                        <div>
                          <div className="text-2xl font-black text-white">{stat.value}</div>
                          <div className="text-gray-400 text-xs">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                      <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        {[
                          { to: '/projects', icon: '📁', label: 'Browse Projects' },
                          { to: '/custom-request', icon: '🛠', label: 'Request Custom Project' },
                          { to: '/projects?is_free=true', icon: '🆓', label: 'Free Projects' },
                        ].map((action, i) => (
                          <Link key={i} to={action.to}
                            className="flex items-center gap-3 p-3 rounded-xl bg-dark-700 hover:bg-dark-600 transition-colors text-gray-300 hover:text-white text-sm">
                            <span className="text-lg">{action.icon}</span>
                            {action.label}
                            <span className="ml-auto text-gray-500">→</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="glass-card p-6">
                      <h3 className="text-white font-semibold mb-4">Account Info</h3>
                      <div className="space-y-3 text-sm">
                        {[
                          { label: 'Name', value: user?.name },
                          { label: 'Email', value: user?.email },
                          { label: 'College', value: user?.college || 'Not set' },
                          { label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-gray-400">{item.label}</span>
                            <span className="text-white font-medium truncate max-w-[180px]">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-white mb-6">My Orders</h2>
                  {loading ? (
                    <div className="flex justify-center py-16"><div className="loader w-10 h-10" /></div>
                  ) : orders.length === 0 ? (
                    <div className="glass-card p-16 text-center">
                      <div className="text-6xl mb-4">📦</div>
                      <h3 className="text-white font-bold mb-2">No orders yet</h3>
                      <p className="text-gray-400 mb-6">Browse our projects and purchase your first one!</p>
                      <Link to="/projects" className="btn-primary inline-block px-6 py-3">Browse Projects</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="glass-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">{order.project_title}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <span className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
                              <span className={`badge border text-xs ${statusColors[order.status]}`}>{order.status}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">₹{order.amount}</div>
                            {order.status === 'completed' && (
                              <Link to={`/projects/${order.project_slug}`} className="text-primary-400 text-xs hover:text-primary-300 mt-1 block">
                                Download Files →
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Downloads Tab */}
              {activeTab === 'downloads' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-white mb-6">Download History</h2>
                  {loading ? (
                    <div className="flex justify-center py-16"><div className="loader w-10 h-10" /></div>
                  ) : downloads.length === 0 ? (
                    <div className="glass-card p-16 text-center">
                      <div className="text-6xl mb-4">⬇</div>
                      <h3 className="text-white font-bold mb-2">No downloads yet</h3>
                      <p className="text-gray-400">Purchase a project to start downloading files</p>
                    </div>
                  ) : (
                    <div className="glass-card overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="border-b border-white/5">
                          <tr>
                            {['Project', 'File Type', 'Downloaded'].map(h => (
                              <th key={h} className="text-left px-5 py-4 text-gray-400 font-medium text-xs uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {downloads.map(d => (
                            <tr key={d.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-5 py-4 text-white">{d.project_title}</td>
                              <td className="px-5 py-4">
                                <span className="badge bg-primary-500/10 text-primary-400 border border-primary-500/20 capitalize">{d.file_type}</span>
                              </td>
                              <td className="px-5 py-4 text-gray-400">{new Date(d.downloaded_at).toLocaleDateString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Requests Tab */}
              {activeTab === 'requests' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">My Custom Requests</h2>
                    <Link to="/custom-request" className="btn-primary text-sm px-4 py-2">+ New Request</Link>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-16"><div className="loader w-10 h-10" /></div>
                  ) : customRequests.length === 0 ? (
                    <div className="glass-card p-16 text-center">
                      <div className="text-6xl mb-4">🛠</div>
                      <h3 className="text-white font-bold mb-2">No custom requests yet</h3>
                      <p className="text-gray-400 mb-6">Request a project built specifically for you</p>
                      <Link to="/custom-request" className="btn-primary inline-block px-6 py-3">Request Custom Project</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customRequests.map(req => (
                        <div key={req.id} className="glass-card p-6">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <h3 className="text-white font-semibold">{req.project_title}</h3>
                            <span className={`badge border text-xs ${statusColors[req.status]}`}>{req.status.replace('_', ' ')}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                            <span>📂 {req.domain}</span>
                            <span>💰 {req.budget || 'Not specified'}</span>
                            <span>📅 {new Date(req.created_at).toLocaleDateString('en-IN')}</span>
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-2">{req.description}</p>
                          {req.admin_notes && (
                            <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                              💬 Admin: {req.admin_notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="animate-fade-in max-w-lg">
                  <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>
                  <div className="glass-card p-8">
                    {profileMsg && (
                      <div className={`mb-5 p-4 rounded-xl text-sm ${profileMsg.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {profileMsg}
                      </div>
                    )}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                          className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input type="email" value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
                        <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">College / University</label>
                        <input type="text" value={profileForm.college} onChange={e => setProfileForm(p => ({ ...p, college: e.target.value }))}
                          placeholder="Your college name" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                        <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+91 98765 43210" className="input-field" />
                      </div>
                      <button onClick={handleProfileSave} className="btn-primary w-full py-3">
                        💾 Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
