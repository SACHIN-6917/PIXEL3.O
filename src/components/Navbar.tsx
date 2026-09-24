import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onRegisterClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRegisterClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#home', newTab: false },
    { label: 'ABOUT US', href: '#about', newTab: false },
    { label: 'AGENDA', href: '#agenda', newTab: false },
    { label: 'VENUES', href: '#venues', newTab: false },
    { label: 'STAFF COORDINATORS', href: '/staff-coordinators.html', newTab: true },
    { label: 'STUDENT COORDINATORS', href: '/student-coordinators.html', newTab: true },
  ];

  const handleLinkClick = (href: string, newTab?: boolean) => {
    setMobileMenuOpen(false);
    if (newTab) {
      window.open(href, '_blank');
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md border-b border-border py-3.5'
          : 'bg-white/95 border-b border-border/80 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#home"
          className="group flex flex-col items-start focus:outline-none"
        >
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-xl sm:text-2xl text-foreground">
            <span>PIXELO</span>
            <span className="bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta bg-clip-text text-transparent">
              3.O
            </span>
          </div>
          <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta transition-all duration-300 rounded-full" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href, link.newTab)}
              className="text-xs xl:text-sm font-semibold tracking-wider text-foreground-secondary hover:text-phoenix-orange transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={onRegisterClick}
            className="phoenix-gradient-btn px-6 py-2.5 rounded-full text-white text-xs xl:text-sm font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span>REGISTER NOW</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-foreground hover:text-phoenix-orange focus:outline-none transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href, link.newTab)}
                className="text-left text-sm font-semibold tracking-wider text-foreground hover:text-phoenix-orange py-1.5 transition-colors border-b border-border/40"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRegisterClick();
                }}
                className="w-full phoenix-gradient-btn py-3 rounded-full text-white text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm"
              >
                <span>REGISTER NOW</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
