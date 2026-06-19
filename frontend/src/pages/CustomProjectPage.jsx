/**
 * Custom Project Request Page
 */

import React, { useState } from 'react';
import api from '../utils/api.js';

export function CustomProjectPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    projectTitle: '',
    domain: '',
    description: '',
    budget: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const domains = [
    'AI & ML',
    'Web Development',
    'Python',
    'Data Science',
    'Blockchain',
    'IoT',
    'Android',
    'Computer Vision',
    'NLP',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.college ||
      !formData.projectTitle ||
      !formData.domain ||
      !formData.description ||
      !formData.budget
    ) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.budget < 3000) {
      setError('Minimum budget is ₹3000');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/custom-requests', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        college: '',
        projectTitle: '',
        domain: '',
        description: '',
        budget: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Custom Project Request</h1>
          <p className="text-xl text-slate-300">
            Tell us about your project requirements and we'll create it for you
          </p>
        </div>

        {/* Form */}
        <div className="card">
          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-400 mb-6">
              ✓ Request submitted successfully! We'll contact you soon.
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 mb-6">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* College */}
            <div>
              <label className="block text-white font-semibold mb-2">College Name *</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Your College"
                className="input-field"
                required
              />
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-white font-semibold mb-2">Project Title *</label>
              <input
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                placeholder="e.g., IoT-based Smart Home System"
                className="input-field"
                required
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-white font-semibold mb-2">Domain *</label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select a domain</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-semibold mb-2">Project Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project requirements, features, and specifications..."
                rows="6"
                className="input-field resize-none"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-white font-semibold mb-2">Budget (₹) *</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Minimum ₹3000"
                min="3000"
                className="input-field"
                required
              />
              <p className="text-slate-400 text-sm mt-1">Minimum budget: ₹3000</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>

          {/* Info */}
          <div className="border-t border-slate-700 mt-8 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="text-white font-semibold mb-2">Fast Turnaround</h4>
                <p className="text-slate-400 text-sm">
                  We deliver your custom project within 5-7 business days
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📋</div>
                <h4 className="text-white font-semibold mb-2">Complete Deliverables</h4>
                <p className="text-slate-400 text-sm">
                  Source code, documentation, reports, and viva questions included
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <h4 className="text-white font-semibold mb-2">Support Included</h4>
                <p className="text-slate-400 text-sm">
                  Get support and modifications throughout the project lifecycle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomProjectPage;
