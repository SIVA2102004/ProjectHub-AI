import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  completed: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
  refunded: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => { fetchOrders(); }, [filter, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit, ...(filter && { status: filter }) });
      const res = await api.get(`/orders?${params}`);
      setOrders(res.data.orders);
      setTotal(res.data.total);
    } catch {} finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount, 0);

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Orders Management</h2>
            <p className="text-gray-400 text-sm">{total} total orders · ₹{totalRevenue.toLocaleString('en-IN')} shown revenue</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[['', 'All Orders'], ['pending', 'Pending'], ['completed', 'Completed'], ['cancelled', 'Cancelled'], ['refunded', 'Refunded']].map(([val, label]) => (
            <button key={val} onClick={() => { setFilter(val); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === val ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="loader w-12 h-12" /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/5">
                  <tr>
                    {['Order #', 'Student', 'Project', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-gray-400 font-medium text-xs uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 text-gray-400 text-xs font-mono">#{order.id.toString().padStart(4, '0')}</td>
                      <td className="px-5 py-4">
                        <div className="text-white font-medium">{order.user_name}</div>
                        <div className="text-gray-500 text-xs truncate max-w-[140px]">{order.user_email}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-300 max-w-[180px] truncate">{order.project_title}</td>
                      <td className="px-5 py-4 text-white font-bold">₹{order.amount}</td>
                      <td className="px-5 py-4">
                        <span className={`badge border text-xs ${statusColors[order.status]}`}>{order.status}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-4">
                        <select
                          defaultValue={order.status}
                          onChange={e => handleStatusUpdate(order.id, e.target.value)}
                          className="text-xs bg-dark-700 border border-white/10 text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary-500"
                        >
                          {['pending', 'completed', 'cancelled', 'refunded'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div className="text-center py-12 text-gray-500">No orders found</div>}
            </div>

            {total > limit && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
                <span className="text-gray-400 text-sm">Page {page} of {Math.ceil(total / limit)}</span>
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
