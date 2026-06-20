import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  in_review: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  accepted: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  completed: 'text-green-400 bg-green-400/10 border-green-400/20',
  rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
};

function RequestModal({ request, onClose, onUpdate }) {
  const [status, setStatus] = useState(request.status);
  const [notes, setNotes] = useState(request.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/custom-requests/${request.id}/status`, { status, admin_notes: notes });
      onUpdate();
      onClose();
    } catch {} finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative glass-card w-full max-w-xl p-7 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Request Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center">×</button>
        </div>

        <div className="space-y-3 mb-6">
          {[
            ['Project Title', request.project_title],
            ['Name', request.name],
            ['Email', request.email],
            ['College', request.college],
            ['Domain', request.domain],
            ['Budget', request.budget || 'Not specified'],
            ['Submitted', new Date(request.created_at).toLocaleDateString('en-IN')],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3">
              <span className="text-gray-500 text-sm w-28 flex-shrink-0">{label}</span>
              <span className="text-gray-200 text-sm">{value}</span>
            </div>
          ))}
        </div>

        <div className="mb-5 p-4 rounded-xl bg-dark-700 border border-white/5">
          <p className="text-gray-400 text-xs font-semibold mb-2 uppercase">Description</p>
          <p className="text-gray-200 text-sm leading-relaxed">{request.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Update Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="input-field">
              {['pending', 'in_review', 'accepted', 'completed', 'rejected'].map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notes (shown to student)</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Add notes for the student..." className="input-field resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <><span className="loader w-5 h-5" /> Saving...</> : '💾 Update Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCustomRequests() {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);

  useEffect(() => { fetchRequests(); }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50, ...(filter && { status: filter }) });
      const res = await api.get(`/custom-requests?${params}`);
      setRequests(res.data.requests);
      setTotal(res.data.total);
    } catch {} finally { setLoading(false); }
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Custom Project Requests</h2>
            <p className="text-gray-400 text-sm">{total} total requests</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[['', 'All'], ['pending', '⏳ Pending'], ['in_review', '🔍 In Review'], ['accepted', '✅ Accepted'], ['completed', '🎉 Completed'], ['rejected', '❌ Rejected']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === val ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="loader w-12 h-12" /></div>
        ) : (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <div className="text-6xl mb-4">🛠</div>
                <h3 className="text-white font-bold mb-2">No requests found</h3>
                <p className="text-gray-400">Custom project requests will appear here</p>
              </div>
            ) : requests.map(req => (
              <div key={req.id} className="glass-card p-6 hover:border-primary-500/20 transition-all cursor-pointer" onClick={() => setSelectedReq(req)}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-white font-semibold">{req.project_title}</h3>
                      <span className={`badge border text-xs ${statusColors[req.status]}`}>{req.status.replace('_', ' ')}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span>👤 {req.name}</span>
                      <span>📧 {req.email}</span>
                      <span>🏫 {req.college}</span>
                      <span>📂 {req.domain}</span>
                      {req.budget && <span>💰 {req.budget}</span>}
                    </div>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-1">{req.description}</p>
                    {req.admin_notes && (
                      <p className="text-blue-400 text-xs mt-2 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                        Admin Note: {req.admin_notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-gray-500 text-xs">{new Date(req.created_at).toLocaleDateString('en-IN')}</div>
                    <button className="mt-2 text-primary-400 text-xs hover:text-primary-300 font-medium">View & Update →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedReq && (
          <RequestModal
            request={selectedReq}
            onClose={() => setSelectedReq(null)}
            onUpdate={fetchRequests}
          />
        )}
      </div>
    </AdminLayout>
  );
}
