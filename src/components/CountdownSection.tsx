import React, { useState, useEffect } from 'react';
import { REGISTRATION_DEADLINE } from '../data/pixeloData';
import { Clock, AlertCircle } from 'lucide-react';

interface CountdownSectionProps {
  onRegisterClick: () => void;
  isClosed: boolean;
  setIsClosed: (closed: boolean) => void;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  onRegisterClick,
  isClosed,
  setIsClosed,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = new Date(REGISTRATION_DEADLINE).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsClosed(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsClosed(false);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [setIsClosed]);

  const timeUnits = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <section className="py-20 bg-background-warm border-y border-border relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Label */}
        <div className="inline-flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-phoenix-orange" />
          <span className="text-xs font-bold tracking-[0.25em] text-foreground-secondary uppercase">
            REGISTRATION DEADLINE
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
          {isClosed ? 'REGISTRATION CLOSED' : 'REGISTRATION CLOSES IN'}
        </h2>

        {/* Target Date text */}
        <p className="text-sm font-medium text-foreground-muted mb-12">
          13 OCTOBER 2026 · 10:00 PM IST
        </p>

        {/* Live Countdown Display */}
        {isClosed ? (
          <div className="max-w-lg mx-auto p-6 bg-white border border-phoenix-red/30 rounded-2xl shadow-sm text-center">
            <AlertCircle className="w-8 h-8 text-phoenix-red mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">Registration Portal is Now Closed</p>
            <p className="text-xs text-foreground-muted mt-1">
              The deadline of 13 October 2026, 10:00 PM has elapsed. We look forward to hosting all registered participants on 14 October 2026.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto mb-10">
            {timeUnits.map((unit, index) => (
              <div
                key={unit.label}
                className="flex flex-col items-center bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-border/80 shadow-sm relative group hover:border-phoenix-orange/50 transition-all duration-300"
              >
                {/* Tiny Phoenix Accent Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta rounded-full" />
                
                <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground font-mono">
                  {unit.value}
                </span>
                <span className="text-xs font-semibold tracking-widest text-foreground-secondary uppercase mt-2">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Quick action button */}
        {!isClosed && (
          <div>
            <button
              onClick={onRegisterClick}
              className="phoenix-gradient-btn px-8 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold tracking-wider uppercase shadow-sm cursor-pointer"
            >
              SECURE YOUR SPOT BEFORE CLOSING
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
