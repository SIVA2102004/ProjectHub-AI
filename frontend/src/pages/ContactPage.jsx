import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!form.name || !form.email || !form.message) {
      return setStatus({ type: 'error', text: 'Name, email, and message are required' });
    }
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      setStatus({ type: 'success', text: res.data.message });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions about our projects or want to request custom features? Contact our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="text-white font-bold text-lg mb-2">Email Us</h3>
                <p className="text-gray-400 text-sm mb-3">Drop us a line and we will reply within 24 hours.</p>
                <a href="mailto:support@projecthub.ai" className="text-primary-400 hover:text-primary-300 font-semibold text-sm">
                  support@projecthub.ai
                </a>
              </div>

              <div className="glass-card p-6">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="text-white font-bold text-lg mb-2">Call Us</h3>
                <p className="text-gray-400 text-sm mb-3">Our support lines are open Mon-Sat, 9 AM - 6 PM.</p>
                <a href="tel:+919876543210" className="text-primary-400 hover:text-primary-300 font-semibold text-sm">
                  +91 98765 43210
                </a>
              </div>

              <div className="glass-card p-6">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-white font-bold text-lg mb-2">Office Address</h3>
                <p className="text-gray-400 text-sm">
                  ProjectHub AI Inc.
                  <br />
                  First Floor, Innovation Hub,
                  <br />
                  Connaught Place, New Delhi - 110001
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>

                {status.text && (
                  <div
                    className={`mb-6 p-4 rounded-xl text-sm ${
                      status.type === 'success'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {status.type === 'success' ? '✅' : '⚠️'} {status.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Inquiry about custom project"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message details here..."
                      rows="5"
                      className="input-field resize-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="loader w-5 h-5 inline-block animate-spin rounded-full border-2 border-t-transparent border-white" />{' '}
                        Sending...
                      </>
                    ) : (
                      '📩 Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
