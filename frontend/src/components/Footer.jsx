/**
 * Footer Component
 */

import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-white font-bold">ProjectHub AI</span>
            </div>
            <p className="text-slate-400 text-sm">
              Smart Projects. Better Learning.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/projects" className="text-slate-400 hover:text-white text-sm transition">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/custom-project" className="text-slate-400 hover:text-white text-sm transition">
                  Custom Projects
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} ProjectHub AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition">
              Twitter
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition">
              LinkedIn
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
