import React from 'react';
import { ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { EVENT_DATE_STRING, REPORTING_TIME } from '../data/pixeloData';

interface FinalCTASectionProps {
  onRegisterClick: () => void;
  isClosed: boolean;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onRegisterClick,
  isClosed,
}) => {
  return (
    <section className="py-28 bg-background-warm border-t border-border relative overflow-hidden text-center">
      {/* Large faint Phoenix feather silhouette backdrop */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,106,0,0.5) 0%, rgba(229,27,35,0.3) 40%, rgba(106,0,255,0.15) 80%, transparent 100%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border shadow-sm text-xs font-bold tracking-[0.2em] text-phoenix-orange uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JOIN THE NATIONAL TECH ARENA</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6">
          READY TO IGNITE YOUR POTENTIAL?
        </h2>

        <p className="text-lg sm:text-xl text-foreground-secondary font-medium mb-8 max-w-xl mx-auto">
          The stage is set. <br />
          The challenges await.
        </p>

        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-border mb-10 shadow-sm text-xs sm:text-sm font-semibold text-foreground-secondary">
          <Calendar className="w-4 h-4 text-phoenix-orange" />
          <span>{EVENT_DATE_STRING}</span>
          <span className="text-foreground-muted">·</span>
          <span>{REPORTING_TIME} ONWARDS</span>
        </div>

        <div>
          {isClosed ? (
            <div className="inline-block px-8 py-4 rounded-full bg-background-secondary border border-border text-foreground-muted font-bold text-sm tracking-wider uppercase">
              REGISTRATION CLOSED
            </div>
          ) : (
            <button
              onClick={onRegisterClick}
              className="phoenix-gradient-btn px-10 py-4.5 rounded-full text-white text-base sm:text-lg font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-phoenix-glow hover:shadow-phoenix-active cursor-pointer"
            >
              <span>REGISTER NOW</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
