import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Platform: [
    { label: 'Browse Projects', to: '/projects' },
    { label: 'Custom Projects', to: '/custom-request' },
    { label: 'Pricing', to: '/#pricing' },
    { label: 'Contact Us', to: '/contact' },
  ],
  Categories: [
    { label: 'AI & ML', to: '/projects?category=ai-ml' },
    { label: 'Web Development', to: '/projects?category=web-development' },
    { label: 'Python', to: '/projects?category=python' },
    { label: 'Data Science', to: '/projects?category=data-science' },
    { label: 'Blockchain', to: '/projects?category=blockchain' },
  ],
  Account: [
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'Dashboard', to: '/dashboard' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                P
              </div>
              <div>
                <span className="text-xl font-bold text-white">ProjectHub</span>
                <span className="text-xl font-bold gradient-text"> AI</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Smart Projects. Better Learning. Your one-stop platform for engineering project packages
              with source code, reports, presentations, and more.
            </p>
            <div className="flex items-center gap-3">
              {['📧', '🐙', '💼', '📘'].map((icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-dark-700 border border-white/5 flex items-center justify-center text-lg cursor-pointer hover:border-primary-500/50 hover:bg-dark-600 transition-all duration-200">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold mb-5">{section}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ProjectHub AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm cursor-pointer hover:text-gray-300 transition-colors">Privacy Policy</span>
            <span className="text-gray-500 text-sm cursor-pointer hover:text-gray-300 transition-colors">Terms of Service</span>
            <span className="text-gray-500 text-sm cursor-pointer hover:text-gray-300 transition-colors">Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-500 text-sm">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
