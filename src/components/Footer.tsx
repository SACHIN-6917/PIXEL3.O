import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowUp, Mail, Globe } from 'lucide-react';

const IconInstagram = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const IconFacebook = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const IconX = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const SocialLink: React.FC<{ href: string; title: string; children: React.ReactNode; accent?: string }> = ({ href, title, children, accent = 'hover:border-phoenix-orange hover:text-phoenix-orange' }) => (
  <a href={href} target="_blank" rel="noreferrer" title={title}
    className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 ${accent} flex items-center justify-center text-neutral-400 transition-all duration-200`}>
    {children}
  </a>
);

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-darkAccent text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">PIXELO</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta bg-clip-text text-transparent">3.O</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              National Level Technical Symposium · Department of CSE · Adhiparasakthi Engineering College · in association with CSI – Kanchipuram Chapter.
            </p>
            <div className="text-xs text-neutral-500 space-y-1 font-medium">
              <p>Adhiparasakthi Engineering College, Melmaruvathur - 603319</p>
              <p>Tamil Nadu, India</p>
              <a href="https://apec.edu.in" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-phoenix-orange/80 hover:text-phoenix-orange transition-colors">
                <Globe className="w-3 h-3" /> apec.edu.in
              </a>
            </div>

            {/* PIXELO social */}
            <div>
              <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-2">PIXELO 3.O</p>
              <div className="flex items-center gap-2">
                <SocialLink href="https://www.instagram.com/pixelora_2k26/" title="PIXELO Instagram" accent="hover:border-phoenix-magenta hover:text-phoenix-magenta">
                  <IconInstagram />
                </SocialLink>
                <span className="text-xs text-neutral-500">@pixelora_2k26</span>
              </div>
            </div>

            {/* College socials */}
            <div>
              <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-3">ADHIPARASAKTHI ENGINEERING COLLEGE</p>
              <div className="flex flex-wrap items-center gap-2">
                <SocialLink href="https://www.instagram.com/apec1984/" title="APEC Instagram" accent="hover:border-phoenix-magenta hover:text-phoenix-magenta"><IconInstagram /></SocialLink>
                <SocialLink href="https://www.facebook.com/apec1984" title="APEC Facebook" accent="hover:border-blue-400 hover:text-blue-400"><IconFacebook /></SocialLink>
                <SocialLink href="https://x.com/apec1984" title="APEC X" accent="hover:border-neutral-200 hover:text-white"><IconX /></SocialLink>
                <SocialLink href="https://apec.edu.in" title="APEC Website" accent="hover:border-phoenix-orange hover:text-phoenix-orange"><Globe className="w-4 h-4" /></SocialLink>
                <SocialLink href="mailto:cse@adhiparasakthi.in" title="Email" accent="hover:border-phoenix-orange hover:text-phoenix-orange"><Mail className="w-4 h-4" /></SocialLink>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                <span className="text-[10px] text-neutral-500">Instagram · Facebook · X: /apec1984</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">NAVIGATION</h4>
            <ul className="space-y-2 text-xs font-semibold tracking-wider text-neutral-400">
              {[
                { label: 'HOME',                 to: '/' },
                { label: 'ABOUT',                to: '/about' },
                { label: 'AGENDA',               to: '/agenda' },
                { label: 'VENUES',               to: '/venues' },
                { label: 'STAFF COORDINATORS',   to: '/staff-coordinators' },
                { label: 'STUDENT COORDINATORS', to: '/student-coordinators' },
                { label: 'REGISTER NOW',         to: '/registration' },
              ].map(link => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.to === '/'} className={({ isActive }) => `hover:text-phoenix-orange transition-colors ${isActive ? 'text-phoenix-orange' : ''}`}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">REGISTER FOR PIXELO 3.O</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">Registration closes 13 October 2026 at 10:00 PM. Secure your spot now.</p>
            <button onClick={() => navigate('/registration')} className="w-full phoenix-gradient-btn py-3 rounded-full text-white text-xs font-bold tracking-wider uppercase">
              REGISTER NOW
            </button>
            <div className="pt-3 space-y-1.5">
              <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">EVENT DATE</p>
              <p className="text-sm font-bold text-neutral-200">14 OCTOBER 2026</p>
              <p className="text-xs text-neutral-500">09:00 AM · Melmaruvathur</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 PIXELO 3.O · Adhiparasakthi Engineering College. All rights reserved.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-phoenix-orange" />
          </button>
        </div>
      </div>
    </footer>
  );
};
