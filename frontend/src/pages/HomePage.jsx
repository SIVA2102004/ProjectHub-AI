import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import api from '../api/axios';

// ── Hero Section ───────────────────────────────────────────────────────────────
function HeroSection({ stats }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] hero-gradient rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-20">
        {/* Announcement badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          🎓 Live Verified Academic Project Marketplace
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-slide-up">
          Build Better Projects
          <br />
          <span className="gradient-text text-glow">with AI</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Browse, purchase, and download complete engineering project packages.
          Get source code, reports, PPTs, abstracts & viva questions instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/register" className="btn-primary text-base px-8 py-4 text-center">
            🚀 Get Started Free
          </Link>
          <Link to="/projects" className="btn-secondary text-base px-8 py-4 text-center">
            📁 Browse Projects
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {[
            { value: stats?.projects || 0, label: 'Active Projects' },
            { value: stats?.students || 0, label: 'Registered Students' },
            { value: stats?.downloads || 0, label: 'Project Downloads' },
            { value: stats?.visits || 0, label: 'Student Visits' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-5 text-center">
              <div className="text-2xl md:text-3xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features Section ───────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: '💻', title: 'Source Code', desc: 'Get complete, well-commented source code for every project. Ready to run and present.' },
    { icon: '📄', title: 'Project Reports', desc: 'Professional IEEE-format reports with proper documentation and references.' },
    { icon: '📊', title: 'Presentations', desc: 'Beautifully designed PPTs covering all project aspects for your viva.' },
    { icon: '🎤', title: 'Viva Questions', desc: '100+ expected viva questions with detailed answers to ace your examination.' },
    { icon: '📋', title: 'Abstract', desc: 'Well-structured project abstracts for submission and reference.' },
    { icon: '🤖', title: 'Custom Projects', desc: 'Need something unique? Request a custom project built just for you.' },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Everything You Need to <span className="gradient-text">Succeed</span></h2>
          <p className="section-subtitle">Complete project packages that cover every aspect of your academic requirements</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-7 group hover:border-primary-500/30 transition-all duration-300 hover:translate-y-[-4px]">
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Categories Section ─────────────────────────────────────────────────────────
function CategoriesSection({ categories }) {
  return (
    <section className="py-24 px-4 bg-dark-800/30" id="categories">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Explore <span className="gradient-text">Categories</span></h2>
          <p className="section-subtitle">Find projects across all major engineering domains</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link key={i} to={`/projects?category=${cat.slug}`}
              className="glass-card p-6 text-center group hover:border-primary-500/30 transition-all duration-300 hover:translate-y-[-4px] cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{cat.icon}</div>
              <div className="text-white font-semibold text-sm mb-1">{cat.name}</div>
              <div className="text-gray-500 text-xs">{cat.project_count} projects</div>
              <div className="mt-3 h-0.5 rounded-full mx-auto w-0 group-hover:w-full transition-all duration-300"
                style={{ background: cat.color }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Popular Projects Section ───────────────────────────────────────────────────
function PopularProjectsSection({ projects }) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">🔥 Popular <span className="gradient-text">Projects</span></h2>
            <p className="text-gray-400">Most downloaded and featured projects</p>
          </div>
          <Link to="/projects" className="btn-secondary text-sm hidden sm:inline-flex items-center gap-2">
            View All <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link to="/projects" className="btn-secondary text-sm">View All Projects →</Link>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials Section ───────────────────────────────────────────────────────
function TestimonialsSection({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-dark-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Loved by <span className="gradient-text">Students</span></h2>
          <p className="section-subtitle">Join thousands of students who've already leveled up their projects</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card p-7 hover:border-primary-500/20 transition-all duration-300">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-lg">⭐</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.user_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.user_name}</div>
                  <div className="text-gray-500 text-xs">{t.user_college || 'Student'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing Section ────────────────────────────────────────────────────────────
function PricingSection() {
  const plans = [
    {
      name: 'Starter', price: '₹499', icon: '🚀',
      color: 'from-green-500 to-emerald-600',
      features: ['Source Code', 'Abstract', 'Basic Documentation', 'Email Support', '1 Project Download'],
      popular: false
    },
    {
      name: 'Standard', price: '₹999', icon: '⭐',
      color: 'from-primary-500 to-blue-600',
      features: ['Source Code', 'Full Report', 'PPT Presentation', 'Abstract', 'Viva Questions', '3 Project Downloads'],
      popular: true
    },
    {
      name: 'Premium', price: '₹1999', icon: '👑',
      color: 'from-purple-500 to-pink-600',
      features: ['Everything in Standard', '5 Project Downloads', 'Priority Support', 'Code Explanation Video', 'Custom Modifications', '6 Months Access'],
      popular: false
    },
    {
      name: 'Custom Major', price: '₹3000+', icon: '🏆',
      color: 'from-orange-500 to-red-600',
      features: ['Fully Custom Project', 'Complete Documentation', 'Presentation + Viva', 'Unlimited Revisions', 'Direct Developer Contact', 'Lifetime Access'],
      popular: false
    },
  ];

  return (
    <section className="py-24 px-4" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Simple, Transparent <span className="gradient-text">Pricing</span></h2>
          <p className="section-subtitle">Choose the package that fits your needs. No hidden charges.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`glass-card p-7 relative flex flex-col transition-all duration-300 hover:translate-y-[-4px] ${plan.popular ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : 'hover:border-white/10'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 text-white text-xs font-bold">
                  MOST POPULAR
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-xl mb-5`}>
                {plan.icon}
              </div>
              <div className="text-white font-bold text-lg mb-1">{plan.name}</div>
              <div className={`text-3xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent mb-6`}>
                {plan.price}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400 flex-shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/projects" className={`text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ Section ────────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: 'What files are included with each project?', a: 'Each project includes source code (zip), detailed project report, PPT presentation, abstract, and expected viva questions with answers.' },
    { q: 'How do I download purchased projects?', a: 'After purchasing, go to your Dashboard → Orders → click on the project to download any file (source code, report, PPT, etc.).' },
    { q: 'Can I get a custom project built?', a: 'Yes! Click on "Custom Project" and fill in your requirements. Our team will contact you within 24 hours with a quote.' },
    { q: 'Are the source codes original?', a: 'All projects are original and developed by our team. They are well-documented, commented, and ready for presentation.' },
    { q: 'What payment methods are accepted?', a: 'We accept UPI, Net Banking, Credit/Debit Cards, and all major payment methods through our secure payment gateway.' },
    { q: 'Is there a refund policy?', a: 'We offer a refund within 48 hours if the project files are not as described. Contact our support team for assistance.' },
  ];

  return (
    <section className="py-24 px-4 bg-dark-800/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button
                className="w-full px-7 py-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-white font-semibold text-sm md:text-base">{faq.q}</span>
                <span className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openIndex === i && (
                <div className="px-7 pb-6 text-gray-400 text-sm leading-relaxed animate-fade-in border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-purple-600/10" />
          <div className="relative z-10">
            <div className="text-5xl mb-6">🎓</div>
            <h2 className="text-4xl font-black text-white mb-4">Ready to Level Up Your Projects?</h2>
            <p className="text-gray-400 text-lg mb-8">Join thousands of engineering students who trust ProjectHub AI for their academic success.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-4">
                🚀 Start for Free
              </Link>
              <Link to="/custom-request" className="btn-secondary text-base px-8 py-4">
                🛠️ Request Custom Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main HomePage ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [stats, setStats] = useState({ projects: 0, students: 0, downloads: 0, categories: 0, visits: 0 });
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories)).catch(() => {});
    api.get('/projects?is_featured=true&limit=6').then(r => setFeaturedProjects(r.data.projects)).catch(() => {});
    api.get('/analytics/public-stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/analytics/reviews/featured').then(r => setTestimonials(r.data.reviews)).catch(() => {});
    
    // Track site visit
    api.post('/analytics/visit', { page: 'home' }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection stats={stats} />
      <FeaturesSection />
      <CategoriesSection categories={categories} />
      <PopularProjectsSection projects={featuredProjects} />
      <TestimonialsSection testimonials={testimonials} />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
