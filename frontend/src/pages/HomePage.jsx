/**
 * Home Page
 * Landing page with hero section and features
 */

import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const features = [
    {
      icon: '📚',
      title: 'Browse Projects',
      description: 'Browse thousands of engineering projects across multiple categories',
    },
    {
      icon: '⬇️',
      title: 'Easy Downloads',
      description: 'Download source code, reports, PPTs, and documentation',
    },
    {
      icon: '🎓',
      title: 'Learn & Build',
      description: 'Learn from real projects and build your portfolio',
    },
    {
      icon: '🛠️',
      title: 'Custom Projects',
      description: 'Request custom projects tailored to your needs',
    },
  ];

  const categories = [
    { name: 'AI & ML', icon: '🤖' },
    { name: 'Web Development', icon: '🌐' },
    { name: 'Python', icon: '🐍' },
    { name: 'Data Science', icon: '📊' },
    { name: 'Blockchain', icon: '⛓️' },
    { name: 'IoT', icon: '📡' },
    { name: 'Android', icon: '📱' },
    { name: 'Computer Vision', icon: '👁️' },
  ];

  const testimonials = [
    {
      name: 'Raj Kumar',
      college: 'MIT Chennai',
      text: 'ProjectHub AI helped me complete my major project with high-quality code examples.',
    },
    {
      name: 'Priya Singh',
      college: 'Delhi University',
      text: 'The custom project feature was exactly what I needed for my specific requirements.',
    },
    {
      name: 'Arjun Patel',
      college: 'IIT Mumbai',
      text: 'Great resource for learning. The viva questions and abstracts are very helpful.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Build Better Projects with AI
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Smart Projects. Better Learning. Access thousands of engineering projects,
            source code, and learning resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects" className="btn-primary">
              Browse Projects
            </Link>
            <button className="btn-outline">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">Why Choose ProjectHub AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-xl hover:shadow-blue-500/20 text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/projects?category=${cat.name}`}
                className="card text-center hover:border-primary"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <p className="text-white font-semibold">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Starter', price: '₹499', items: ['Access to projects', 'Download source code'] },
              { name: 'Standard', price: '₹999', items: ['Everything in Starter', 'Reports & PPTs', 'Viva Questions'] },
              { name: 'Premium', price: '₹1999', items: ['Everything in Standard', 'Abstracts', 'Priority support'] },
              { name: 'Custom', price: '₹3000+', items: ['Tailored projects', 'Dedicated support', 'Custom features'] },
            ].map((plan, index) => (
              <div
                key={index}
                className={`card text-center ${
                  plan.name === 'Premium' ? 'border-primary border-2 scale-105' : ''
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-400 mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-6 text-slate-300">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <button className={plan.name === 'Premium' ? 'btn-primary w-full' : 'btn-outline w-full'}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-slate-300 mb-4">{testimonial.text}</p>
                <div className="border-t border-slate-700 pt-4">
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-slate-400 text-sm">{testimonial.college}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of students who are learning with ProjectHub AI
          </p>
          <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-slate-100 transition inline-block">
            Start Learning Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
