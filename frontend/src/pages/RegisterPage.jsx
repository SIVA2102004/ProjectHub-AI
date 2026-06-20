import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', college: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Full name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email address';
    return null;
  };

  const validateStep2 = () => {
    if (!form.password) return 'Password is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) return setError(err);
    setError('');
    setStep(2);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validateStep2();
    if (err) return setError(err);
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
        college: form.college, phone: form.phone,
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 'Strong' :
    form.password.length >= 6 ? 'Medium' : form.password.length > 0 ? 'Weak' : '';
  const strengthColor = { Strong: 'text-green-400', Medium: 'text-yellow-400', Weak: 'text-red-400' };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animated-gradient relative overflow-hidden py-10">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-2xl font-bold">P</div>
            <div className="text-left">
              <div className="text-xl font-bold text-white">ProjectHub <span className="gradient-text">AI</span></div>
              <div className="text-xs text-gray-500">Smart Projects. Better Learning.</div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join 10,000+ engineering students</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step >= s ? 'text-primary-400' : 'text-gray-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${step >= s ? 'border-primary-500 bg-primary-500/20' : 'border-gray-700 bg-dark-700'}`}>
                  {step > s ? '✓' : s}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s === 1 ? 'Basic Info' : 'Security'}</span>
              </div>
              {s < 2 && <div className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${step > s ? 'bg-primary-500' : 'bg-dark-600'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Rahul Sharma" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="rahul@example.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">College / University</label>
                <input type="text" name="college" value={form.college} onChange={handleChange}
                  placeholder="IIT Delhi, VIT Vellore..." className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className="input-field" />
              </div>
              <button type="button" onClick={handleNext} className="btn-primary w-full py-4 text-base">
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Create Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password"
                    value={form.password} onChange={handleChange}
                    placeholder="Min. 6 characters" className="input-field pr-12" />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm">
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {form.password && (
                  <p className={`text-xs mt-1.5 font-medium ${strengthColor[strength]}`}>
                    Password strength: {strength}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password *</label>
                <input type="password" name="confirmPassword"
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter your password" className="input-field" />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs mt-1.5 text-red-400">Passwords don't match</p>
                )}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                  {loading ? <><span className="loader w-5 h-5" /> Creating...</> : '🚀 Create Account'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
