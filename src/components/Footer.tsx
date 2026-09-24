import React from 'react';
import { ArrowUp, Mail, Globe, Share2 } from 'lucide-react';

interface FooterProps {
  onRegisterClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRegisterClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-darkAccent text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Institutional Info & Logo */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">PIXELO</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta bg-clip-text text-transparent">
                3.O
              </span>
            </div>
            <p className="text-sm text-neutral-400 font-medium leading-relaxed max-w-md">
              National Level Technical Symposium organized by the Department of Computer Science and Engineering, Adhiparasakthi Engineering College, in association with Computer Society of India – Kanchipuram Chapter.
            </p>
            <div className="text-xs text-neutral-400 space-y-1">
              <p>Adhiparasakthi Engineering College, Melmaruvathur - 603319</p>
              <p>Tamil Nadu, India</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              QUICK NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-semibold tracking-wider text-neutral-300">
              <li>
                <a href="#home" className="hover:text-phoenix-orange transition-colors">
                  HOME
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-phoenix-orange transition-colors">
                  ABOUT
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-phoenix-orange transition-colors">
                  EVENTS
                </a>
              </li>
              <li>
                <a href="#agenda" className="hover:text-phoenix-orange transition-colors">
                  AGENDA
                </a>
              </li>
              <li>
                <a href="#venues" className="hover:text-phoenix-orange transition-colors">
                  VENUES
                </a>
              </li>
              <li>
                <a href="#staff" className="hover:text-phoenix-orange transition-colors">
                  STAFF COORDINATORS
                </a>
              </li>
              <li>
                <a href="#students" className="hover:text-phoenix-orange transition-colors">
                  STUDENT COORDINATORS
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              CONNECT
            </h4>
            <div className="flex items-center space-x-3">
              <a
                href="mailto:cse@adhiparasakthi.in"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-phoenix-orange flex items-center justify-center text-neutral-300 hover:text-phoenix-orange transition-colors"
                title="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://adhiparasakthi.in"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-phoenix-orange flex items-center justify-center text-neutral-300 hover:text-phoenix-orange transition-colors"
                title="College Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-phoenix-orange flex items-center justify-center text-neutral-300 hover:text-phoenix-orange transition-colors"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-phoenix-orange flex items-center justify-center text-neutral-300 hover:text-phoenix-orange transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onRegisterClick}
                className="w-full phoenix-gradient-btn py-2.5 rounded-full text-white text-xs font-bold tracking-wider uppercase"
              >
                REGISTER NOW
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© 2026 PIXELO 3.O · Adhiparasakthi Engineering College. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-phoenix-orange" />
          </button>
        </div>
      </div>
    </footer>
  );
};
