import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => { fetchUsers(); }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit, ...(search && { search }) });
      const res = await api.get(`/users?${params}`);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch {} finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleToggleActive = async (id, currentStatus) => {
    await api.patch(`/users/${id}/toggle-active`);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this user?')) return;
    try { await api.delete(`/users/${id}`); fetchUsers(); }
    catch (err) { alert(err.response?.data?.error || 'Failed to delete'); }
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Users Management</h2>
            <p className="text-gray-400 text-sm">{total} total registered users</p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
          </div>
          <button type="submit" className="btn-primary px-5">Search</button>
        </form>

        {loading ? (
          <div className="flex justify-center py-16"><div className="loader w-12 h-12" /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/5">
                  <tr>
                    {['User', 'College', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-gray-400 font-medium text-xs uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {u.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{u.name}</div>
                            <div className="text-gray-500 text-xs">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 max-w-[150px] truncate">{u.college || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`badge border text-xs ${u.role === 'admin' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-4">
                        <span className={`badge border text-xs ${u.is_active ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {u.role !== 'admin' && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleToggleActive(u.id, u.is_active)}
                              className={`p-2 rounded-lg text-sm transition-colors ${u.is_active ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                              title={u.is_active ? 'Deactivate' : 'Activate'}>
                              {u.is_active ? '🚫' : '✅'}
                            </button>
                            <button onClick={() => handleDelete(u.id)}
                              className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm" title="Delete">
                              🗑️
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div className="text-center py-12 text-gray-500">No users found</div>}
            </div>

            {/* Pagination */}
            {total > limit && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
                <span className="text-gray-400 text-sm">Showing {((page-1)*limit)+1}–{Math.min(page*limit, total)} of {total}</span>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40">← Prev</button>
                  <button disabled={page * limit >= total} onClick={() => setPage(p => p+1)} className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40">Next →</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
