import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const domains = ['AI & ML', 'Web Development', 'Python', 'Data Science', 'Blockchain', 'IoT', 'Android', 'Computer Vision', 'NLP', 'Other'];
const budgets = ['₹1000 - ₹2000', '₹2000 - ₹3000', '₹3000 - ₹5000', '₹5000 - ₹10000', '₹10000+'];

export default function CustomRequestPage() {
  const [form, setForm] = useState({ name: '', email: '', college: '', project_title: '', domain: '', description: '', budget: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const required = ['name', 'email', 'college', 'project_title', 'domain', 'description'];
    for (const field of required) {
      if (!form[field].trim()) return setError(`Please fill in all required fields`);
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/custom-requests', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-lg w-full text-center">
            <div className="glass-card p-12">
              <div className="text-7xl mb-6 animate-float">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-4">Request Submitted!</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Thank you <span className="text-white font-semibold">{form.name}</span>! Your custom project request has been received.
                Our team will review it and contact you at <span className="text-primary-400">{form.email}</span> within <strong className="text-white">24–48 hours</strong>.
              </p>
              <div className="glass-card p-5 mb-8 text-left">
                <h4 className="text-white font-semibold mb-3 text-sm">Request Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Project</span><span className="text-white">{form.project_title}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Domain</span><span className="text-white">{form.domain}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Budget</span><span className="text-white">{form.budget || 'Not specified'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-yellow-400 font-semibold">Pending Review</span></div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/" className="btn-secondary flex-1 text-center py-3 text-sm">← Back to Home</Link>
                <Link to="/projects" className="btn-primary flex-1 text-center py-3 text-sm">Browse Projects</Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
              🛠️ Custom Project Service
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get a <span className="gradient-text">Custom Project</span> Built
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tell us your requirements and we'll build a unique, fully documented project just for you. Starting from ₹3000.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8">
                <h2 className="text-xl font-bold text-white mb-6">📋 Project Requirements</h2>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="Your full name" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="your@email.com" className="input-field" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">College / University *</label>
                    <input type="text" name="college" value={form.college} onChange={handleChange}
                      placeholder="e.g. IIT Delhi, VIT Vellore, Anna University..." className="input-field" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
                    <input type="text" name="project_title" value={form.project_title} onChange={handleChange}
                      placeholder="e.g. Smart Parking System using IoT" className="input-field" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Domain / Category *</label>
                      <select name="domain" value={form.domain} onChange={handleChange} className="input-field">
                        <option value="">Select domain...</option>
                        {domains.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                      <select name="budget" value={form.budget} onChange={handleChange} className="input-field">
                        <option value="">Select budget...</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange}
                      rows={5} placeholder="Describe your project requirements in detail. Include features needed, tech stack preferences, deadline, and any specific requirements..."
                      className="input-field resize-none" />
                    <p className="text-gray-500 text-xs mt-1.5">{form.description.length}/1000 characters</p>
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
                    {loading ? <><span className="loader w-5 h-5" /> Submitting...</> : '🚀 Submit Request'}
                  </button>
                </form>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-5">
              <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-4">📦 What You Get</h3>
                <ul className="space-y-3">
                  {[
                    { icon: '💻', text: 'Complete Source Code' },
                    { icon: '📄', text: 'Detailed Project Report' },
                    { icon: '📊', text: 'PPT Presentation' },
                    { icon: '📋', text: 'Project Abstract' },
                    { icon: '🎤', text: 'Viva Questions & Answers' },
                    { icon: '🔄', text: 'Unlimited Revisions' },
                    { icon: '📞', text: 'Direct Developer Support' },
                    { icon: '♾️', text: 'Lifetime Access' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-4">⏱ Timeline</h3>
                <div className="space-y-3">
                  {[
                    { step: '24h', desc: 'Initial review & quote' },
                    { step: '2-3d', desc: 'Development begins' },
                    { step: '5-7d', desc: 'Project delivery' },
                    { step: '∞', desc: 'Revisions & support' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-600/20 text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {item.step}
                      </div>
                      <span className="text-gray-300 text-sm">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-2">💰 Pricing</h3>
                <div className="text-3xl font-black gradient-text mb-1">₹3000+</div>
                <p className="text-gray-400 text-sm">Based on complexity and requirements</p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-gray-400 text-sm">100% money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
