import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Flame,
  Home,
  ArrowLeft,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  Compass,
  MessageCircle,
  ShieldCheck,
  Award
} from 'lucide-react';
import { WHATSAPP_COMMUNITY_LINK } from '../lib/googleSheet';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [checking, setChecking] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTestConnection = async () => {
    setChecking(true);
    try {
      const res = await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' });
      setIsOnline(res.ok || navigator.onLine);
    } catch {
      setIsOnline(navigator.onLine);
    } finally {
      setTimeout(() => setChecking(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-background-warm/50 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#FF6A00]/20 via-[#E51B23]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#D01257]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-xl w-full mx-auto text-center relative z-10 space-y-8">
        {/* Phoenix Fire Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-phoenix-orange/10 border border-phoenix-orange/25 text-phoenix-orange text-xs font-extrabold tracking-widest uppercase shadow-2xs">
          <Flame className="w-4 h-4 animate-pulse text-[#FF6A00]" />
          <span>PIXEL-3.O · NAVIGATION DETOUR</span>
        </div>

        {/* 404 Large Graphic Typography */}
        <div className="relative select-none">
          <div className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#FF6A00] via-[#E51B23] to-[#D01257] drop-shadow-sm font-display">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 text-8xl sm:text-9xl font-black text-black blur-md -z-10">
            404
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Page Lost in the Ashes
          </h1>
          <p className="text-xs sm:text-sm text-foreground-secondary max-w-md mx-auto leading-relaxed">
            The page you are looking for (<code className="px-1.5 py-0.5 rounded bg-foreground/5 text-phoenix-orange font-mono text-xs">{location.pathname}</code>) does not exist, was moved, or experienced a connection interrupt.
          </p>
        </div>

        {/* Network & Connectivity Status Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border shadow-sm text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>Network Status:</span>
                <span className={isOnline ? 'text-emerald-600' : 'text-red-600 font-extrabold'}>
                  {isOnline ? 'Online & Connected' : 'Offline / Connection Issue'}
                </span>
              </div>
              <div className="text-[11px] text-foreground-muted">
                {isOnline
                  ? 'Your connection to the PIXEL-3.O network is active.'
                  : 'Please check your internet connection or Wi-Fi.'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={checking}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-background-warm hover:bg-background-secondary border border-border text-xs font-bold text-foreground flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-phoenix-orange ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Testing...' : 'Check Signal'}</span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-border hover:border-foreground-muted bg-white text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-foreground transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto phoenix-gradient-btn px-7 py-3.5 rounded-full text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-phoenix-subtle"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>

          <Link
            to="/registration"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-darkAccent hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-phoenix-gold" /> Register Now
          </Link>
        </div>

        {/* Quick Links Navigator */}
        <div className="pt-4 border-t border-border">
          <p className="text-[10px] font-bold tracking-widest text-foreground-muted uppercase mb-3">
            EXPLORE SYMPOSIUM PAGES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <Link
              to="/about"
              className="px-3 py-1.5 rounded-lg bg-white border border-border text-foreground-secondary hover:text-phoenix-orange hover:border-phoenix-orange transition-colors"
            >
              About Event
            </Link>
            <Link
              to="/agenda"
              className="px-3 py-1.5 rounded-lg bg-white border border-border text-foreground-secondary hover:text-phoenix-orange hover:border-phoenix-orange transition-colors"
            >
              Symposium Agenda
            </Link>
            <Link
              to="/venues"
              className="px-3 py-1.5 rounded-lg bg-white border border-border text-foreground-secondary hover:text-phoenix-orange hover:border-phoenix-orange transition-colors"
            >
              Campus Venues
            </Link>
            <Link
              to="/student-coordinators"
              className="px-3 py-1.5 rounded-lg bg-white border border-border text-foreground-secondary hover:text-phoenix-orange hover:border-phoenix-orange transition-colors"
            >
              Coordinators
            </Link>
            <a
              href={WHATSAPP_COMMUNITY_LINK}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C7E] font-bold hover:bg-[#25D366]/20 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
