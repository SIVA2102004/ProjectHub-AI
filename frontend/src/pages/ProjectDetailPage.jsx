import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const difficultyColor = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
  Intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [owned, setOwned] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentOption, setPaymentOption] = useState('upi'); // upi, card, netbanking

  useEffect(() => {
    fetchProject();
    if (isAuthenticated) checkOwnership();
  }, [slug]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${slug}`);
      setProject(res.data.project);
    } catch {
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const checkOwnership = async () => {
    try {
      const res = await api.get('/orders/my');
      const orders = res.data.orders;
      const isOwned = orders.some(o => o.project_id === project?.id && o.status === 'completed');
      setOwned(isOwned);
    } catch {}
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) return navigate('/login', { state: { from: `/projects/${slug}` } });
    setPurchasing(true);
    setMessage('');
    try {
      const res = await api.post('/orders', { project_id: project.id });
      const order = res.data.order;
      if (order.status === 'completed') {
        setOwned(true);
        setMessage('✅ Project registered successfully! You can now download all files.');
      } else {
        setPendingOrderId(order.id);
        setShowPaymentModal(true);
      }
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Failed to initialize purchase'));
    } finally {
      setPurchasing(false);
    }
  };

  const handleConfirmPayment = async (status = 'success') => {
    setLoadingPayment(true);
    try {
      await api.post('/orders/verify', {
        order_id: pendingOrderId,
        status: status
      });
      setShowPaymentModal(false);
      setOwned(true);
      setMessage('✅ Payment successful! You can now download all files.');
    } catch (err) {
      setMessage('❌ Payment verification failed: ' + (err.response?.data?.error || 'Payment failed'));
      setShowPaymentModal(false);
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleDownload = async (fileType) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const response = await api.get(`/downloads/${project.id}/${fileType}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `${project.slug}-${fileType}`;
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches && matches[1]) fileName = matches[1];
      } else {
        const ext = fileType === 'source' ? 'zip' : 'pdf';
        fileName = `${project.slug}-${fileType}.${ext}`;
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to download file. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 max-w-7xl mx-auto px-4 animate-pulse">
          <div className="h-64 bg-dark-700 rounded-2xl mb-8" />
          <div className="space-y-4">
            <div className="h-8 bg-dark-700 rounded w-1/2" />
            <div className="h-4 bg-dark-700 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const includes = [
    { key: 'source', icon: '💻', label: 'Source Code', desc: 'Complete source code (ZIP)', available: project.includes_source },
    { key: 'report', icon: '📄', label: 'Project Report', desc: 'Detailed IEEE report (PDF)', available: project.includes_report },
    { key: 'ppt', icon: '📊', label: 'PPT Presentation', desc: 'Presentation slides (PPTX)', available: project.includes_ppt },
    { key: 'abstract', icon: '📋', label: 'Abstract', desc: 'Project abstract (PDF)', available: project.includes_abstract },
    { key: 'viva', icon: '🎤', label: 'Viva Questions', desc: '100+ viva Q&A (PDF)', available: project.includes_viva },
  ];

  const canDownload = project.is_free || owned;
  const isFree = project.is_free === 1 || project.is_free === true;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-400 flex gap-2">
          <Link to="/" className="hover:text-white">Home</Link> /
          <Link to="/projects" className="hover:text-white">Projects</Link> /
          <span className="text-gray-300">{project.title}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero Image */}
              <div className="glass-card overflow-hidden mb-6 h-72 flex items-center justify-center relative">
                {project.image_url ? (
                  <img src={`http://localhost:5000/uploads/${project.image_url}`} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="text-7xl mb-4 opacity-50">{project.category_icon || '💡'}</div>
                    <p className="text-gray-500">{project.category_name}</p>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {isFree && <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">FREE</span>}
                  {project.is_featured && <span className="badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">⭐ FEATURED</span>}
                </div>
              </div>

              {/* Title & Meta */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="badge border" style={{ background: `${project.category_color}20`, color: project.category_color, borderColor: `${project.category_color}30` }}>
                    {project.category_icon} {project.category_name}
                  </span>
                  <span className={`badge border ${difficultyColor[project.difficulty]}`}>{project.difficulty}</span>
                  <span className="badge bg-dark-700 text-gray-400 border border-white/10">
                    ⬇ {project.download_count} downloads
                  </span>
                  <span className="badge bg-dark-700 text-gray-400 border border-white/10">
                    👁 {project.view_count} views
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{project.title}</h1>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-dark-800 rounded-xl p-1">
                {['overview', 'tech', 'includes'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-dark-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                    {tab === 'tech' ? '🛠 Tech Stack' : tab === 'includes' ? '📦 What\'s Included' : '📋 Overview'}
                  </button>
                ))}
              </div>

              <div className="glass-card p-7">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Project Description</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{project.description}</p>
                  </div>
                )}
                {activeTab === 'tech' && (
                  <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Technology Stack</h3>
                    <div className="flex flex-wrap gap-3">
                      {project.tech_stack?.split(',').map((tech, i) => (
                        <span key={i} className="px-4 py-2 rounded-xl bg-primary-600/10 text-primary-400 border border-primary-500/20 text-sm font-medium">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'includes' && (
                  <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">What's Included</h3>
                    <div className="space-y-3">
                      {includes.map(item => (
                        <div key={item.key} className={`flex items-center gap-4 p-4 rounded-xl border ${item.available ? 'border-green-500/20 bg-green-500/5' : 'border-white/5 opacity-50'}`}>
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{item.label}</div>
                            <div className="text-gray-400 text-xs">{item.desc}</div>
                          </div>
                          {item.available ? (
                            <span className="text-green-400 text-lg">✓</span>
                          ) : (
                            <span className="text-gray-600 text-lg">✗</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                {/* Price */}
                <div className="mb-6">
                  {isFree ? (
                    <div className="text-4xl font-black text-green-400 mb-1">FREE</div>
                  ) : (
                    <>
                      <div className="text-4xl font-black text-white mb-1">₹{project.price}</div>
                      <div className="text-gray-500 text-sm">One-time purchase • Lifetime access</div>
                    </>
                  )}
                </div>

                {/* Message */}
                {message && (
                  <div className={`mb-4 p-3 rounded-xl text-sm ${message.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message}
                  </div>
                )}

                {/* Action Buttons */}
                {canDownload ? (
                  <div className="space-y-3 mb-6">
                    <p className="text-green-400 text-sm font-medium mb-3">✅ You own this project</p>
                    {includes.map(item => item.available && (
                      <button key={item.key} onClick={() => handleDownload(item.key)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-gray-300 hover:border-primary-500/50 hover:text-white transition-all duration-200 text-sm">
                        <span className="text-lg">{item.icon}</span>
                        <span>Download {item.label}</span>
                        <span className="ml-auto text-gray-500">⬇</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    <button onClick={handlePurchase} disabled={purchasing}
                      className="btn-primary w-full text-center py-4 text-base">
                      {purchasing ? '⏳ Processing...' : isFree ? '⬇ Download Free' : `💳 Buy Now — ₹${project.price}`}
                    </button>
                    {!isFree && (
                      <p className="text-center text-gray-500 text-xs">Secure payment • Instant access</p>
                    )}
                  </div>
                )}

                {/* Custom version */}
                <div className="pt-4 border-t border-white/5">
                  <Link to="/custom-request" className="w-full btn-secondary text-sm py-3 text-center block">
                    🛠 Request Custom Version
                  </Link>
                </div>

                {/* Includes summary */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  <h4 className="text-gray-400 text-xs font-semibold mb-3 uppercase">Package Includes</h4>
                  {includes.filter(i => i.available).map(item => (
                    <div key={item.key} className="flex items-center gap-2 py-1.5">
                      <span className="text-green-400 text-xs">✓</span>
                      <span className="text-gray-300 text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Simulation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">💳</div>
                <div>
                  <h3 className="font-bold text-sm">ProjectHub AI Payment</h3>
                  <p className="text-[10px] opacity-80">Razorpay Simulation Sandbox Mode</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setMessage('⚠️ Purchase cancelled.');
                }}
                className="text-white/80 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="mb-5 text-center p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-gray-400 text-xs mb-1">PAYING FOR</p>
                <h4 className="text-white font-bold text-base line-clamp-1 mb-2">{project.title}</h4>
                <p className="text-2xl font-black text-white">₹{project.price}</p>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Payment Method</label>
                <div className="space-y-3">
                  {[
                    { id: 'upi', label: 'UPI / QR Code (PhonePe, Google Pay)', icon: '📱' },
                    { id: 'card', label: 'Credit or Debit Card (Visa, MasterCard)', icon: '💳' },
                    { id: 'netbanking', label: 'Net Banking (SBI, HDFC, ICICI)', icon: '🏛️' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPaymentOption(opt.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        paymentOption === opt.id 
                          ? 'border-primary-500 bg-primary-500/10 text-white font-semibold' 
                          : 'border-white/5 hover:border-white/10 text-gray-400'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-sm">{opt.label}</span>
                      {paymentOption === opt.id && <span className="ml-auto text-primary-500">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {loadingPayment ? (
                <div className="text-center py-4">
                  <span className="loader w-8 h-8 inline-block animate-spin rounded-full border-4 border-primary-500 border-t-transparent mb-3" />
                  <p className="text-sm text-gray-400">Verifying secure mock transaction...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleConfirmPayment('fail')}
                    className="py-3.5 rounded-xl border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/10 transition-all text-sm"
                  >
                    Simulate Failure
                  </button>
                  <button
                    onClick={() => handleConfirmPayment('success')}
                    className="py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-primary-500/20 transition-all text-sm"
                  >
                    Complete Payment
                  </button>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-dark-955 p-4 border-t border-white/5 text-center flex items-center justify-center gap-2">
              <span className="text-xs text-gray-500">🔐 PCI-DSS Compliant 256-bit SSL Encryption</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
