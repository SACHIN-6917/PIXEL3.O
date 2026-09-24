import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'HOME',                href: '/' },
  { label: 'ABOUT US',            href: '/about' },
  { label: 'AGENDA',              href: '/agenda' },
  { label: 'VENUES',              href: '/venues' },
  { label: 'STAFF COORDINATORS',  href: '/staff-coordinators' },
  { label: 'STUDENT COORDINATORS',href: '/student-coordinators' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [navigate]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md border-b border-border py-3'
          : 'bg-white/95 border-b border-border/70 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-1.5 shrink-0">
          <span className="text-xl font-bold tracking-tight text-foreground">PIXELO</span>
          <span className="text-xl font-bold bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta bg-clip-text text-transparent">3.O</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) =>
                `text-[11px] xl:text-xs font-bold tracking-wider uppercase transition-colors duration-200 relative pb-0.5 ${
                  isActive
                    ? 'text-phoenix-orange'
                    : 'text-foreground-secondary hover:text-phoenix-orange'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-phoenix-orange to-phoenix-red" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Register CTA */}
        <div className="hidden lg:flex items-center">
          <NavLink
            to="/registration"
            className="phoenix-gradient-btn px-5 py-2.5 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-sm"
          >
            REGISTER NOW
          </NavLink>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-background-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border px-4 py-4 space-y-3 shadow-lg">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block text-sm font-bold tracking-wider uppercase py-2 border-b border-border/40 transition-colors ${
                  isActive ? 'text-phoenix-orange' : 'text-foreground hover:text-phoenix-orange'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/registration"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full mt-3 phoenix-gradient-btn px-5 py-3 rounded-full text-white text-xs font-bold tracking-wider uppercase text-center"
          >
            REGISTER NOW
          </NavLink>
        </div>
      )}
    </header>
  );
};
