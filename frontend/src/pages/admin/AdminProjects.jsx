import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const EMPTY_FORM = { title: '', description: '', short_description: '', category_id: '', tech_stack: '', difficulty: 'Intermediate', price: '', is_free: false, is_featured: false };

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FileUploadSection({ project }) {
  const [uploading, setUploading] = useState({});
  const [msg, setMsg] = useState('');

  const fileTypes = [
    { key: 'source', label: 'Source Code', accept: '.zip', icon: '💻' },
    { key: 'report', label: 'Report (PDF)', accept: '.pdf', icon: '📄' },
    { key: 'ppt', label: 'Presentation', accept: '.pptx,.ppt', icon: '📊' },
    { key: 'abstract', label: 'Abstract (PDF)', accept: '.pdf', icon: '📋' },
    { key: 'viva', label: 'Viva Q&A (PDF)', accept: '.pdf', icon: '🎤' },
    { key: 'image', label: 'Cover Image', accept: '.png,.jpg,.jpeg,.webp', icon: '🖼️' },
  ];

  const handleUpload = async (fileType, file) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(p => ({ ...p, [fileType]: true }));
    try {
      await api.post(`/uploads/project/${project.id}/${fileType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg(`✅ ${fileType} uploaded successfully!`);
    } catch (err) {
      setMsg(`❌ Upload failed: ${err.response?.data?.error || 'Unknown error'}`);
    } finally {
      setUploading(p => ({ ...p, [fileType]: false }));
    }
  };

  return (
    <div>
      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${msg.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {msg}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fileTypes.map(ft => (
          <label key={ft.key} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${uploading[ft.key] ? 'border-primary-500/50 bg-primary-500/5' : 'border-white/10 hover:border-primary-500/30 hover:bg-white/5'}`}>
            <span className="text-2xl">{ft.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">{ft.label}</div>
              <div className="text-gray-500 text-xs">{uploading[ft.key] ? 'Uploading...' : 'Click to upload'}</div>
            </div>
            {uploading[ft.key] && <div className="loader w-5 h-5" />}
            <input type="file" accept={ft.accept} className="hidden"
              onChange={e => e.target.files[0] && handleUpload(ft.key, e.target.files[0])} />
          </label>
        ))}
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [uploadProject, setUploadProject] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects?limit=100');
      setProjects(res.data.projects);
    } catch {} finally { setLoading(false); }
  };

  const openAdd = () => { setEditProject(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };
  const openEdit = (p) => {
    setEditProject(p);
    setForm({ title: p.title, description: p.description, short_description: p.short_description || '', category_id: p.category_id, tech_stack: p.tech_stack, difficulty: p.difficulty, price: p.price, is_free: !!p.is_free, is_featured: !!p.is_featured });
    setError('');
    setShowModal(true);
  };
  const openUpload = (p) => { setUploadProject(p); setShowUploadModal(true); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category_id || !form.tech_stack) return setError('Fill all required fields');
    setSubmitting(true);
    try {
      if (editProject) {
        await api.put(`/projects/${editProject.id}`, form);
      } else {
        await api.post('/projects', form);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) { setError(err.response?.data?.error || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  const filtered = projects.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Projects Management</h2>
            <p className="text-gray-400 text-sm">{projects.length} total projects</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-5 py-2.5">
            + Add Project
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="loader w-12 h-12" /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/5">
                  <tr>
                    {['Project', 'Category', 'Price', 'Downloads', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-gray-400 font-medium text-xs uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="text-white font-medium max-w-[200px] truncate">{p.title}</div>
                        <div className="text-gray-500 text-xs">{p.difficulty}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-300">{p.category_name}</td>
                      <td className="px-5 py-4">
                        {p.is_free ? <span className="text-green-400 font-semibold">Free</span> : <span className="text-white">₹{p.price}</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-300">{p.download_count}</td>
                      <td className="px-5 py-4">
                        <span className={`badge border text-xs ${p.is_active ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                          {p.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openUpload(p)} title="Upload Files"
                            className="p-2 rounded-lg text-primary-400 hover:bg-primary-500/10 transition-colors text-base">📤</button>
                          <button onClick={() => openEdit(p)} title="Edit"
                            className="p-2 rounded-lg text-yellow-400 hover:bg-yellow-500/10 transition-colors text-base">✏️</button>
                          <button onClick={() => handleDelete(p.id)} title="Delete"
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-base">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-500">No projects found</div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editProject ? 'Edit Project' : 'Add New Project'}>
          {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm">⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Project title" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Short Description</label>
              <input type="text" value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} placeholder="One-liner summary" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Description *</label>
              <textarea rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Detailed description..." className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} className="input-field">
                  <option value="">Select...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))} className="input-field">
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack * (comma separated)</label>
              <input type="text" value={form.tech_stack} onChange={e => setForm(p => ({ ...p, tech_stack: e.target.value }))} placeholder="Python, React, Node.js, SQLite" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="999" className="input-field" min="0" />
              </div>
              <div className="flex flex-col justify-end gap-3 pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_free} onChange={e => setForm(p => ({ ...p, is_free: e.target.checked }))} className="w-4 h-4 accent-primary-500" />
                  <span className="text-gray-300 text-sm">Free Project</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 accent-primary-500" />
                  <span className="text-gray-300 text-sm">Featured</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {submitting ? <><span className="loader w-5 h-5" /> Saving...</> : (editProject ? '💾 Update' : '+ Add Project')}
              </button>
            </div>
          </form>
        </Modal>

        {/* Upload Files Modal */}
        <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title={`📤 Upload Files — ${uploadProject?.title}`}>
          {uploadProject && <FileUploadSection project={uploadProject} />}
        </Modal>
      </div>
    </AdminLayout>
  );
}
