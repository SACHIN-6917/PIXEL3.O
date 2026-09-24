import React, { useEffect, useState } from 'react';

const DEADLINE = new Date('2026-10-13T22:00:00+05:30').getTime();

function getTimeLeft() {
  const diff = DEADLINE - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export const CountdownSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="countdown" className="py-16 sm:py-20 bg-darkAccent text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255,106,0,0.14) 0%, rgba(229,27,35,0.08) 50%, transparent 80%)' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-3">REGISTRATION DEADLINE</div>
        {timeLeft === null ? (
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white">REGISTRATION CLOSED</div>
        ) : (
          <>
            <h2 className="text-base sm:text-lg font-semibold tracking-wider text-white/70 uppercase mb-8">
              REGISTRATION CLOSES IN — 13 OCTOBER 2026 · 10:00 PM
            </h2>
            <div className="grid grid-cols-4 gap-4 sm:gap-8">
              {[
                { label: 'DAYS',    value: timeLeft.days },
                { label: 'HOURS',   value: timeLeft.hours },
                { label: 'MINUTES', value: timeLeft.minutes },
                { label: 'SECONDS', value: timeLeft.seconds },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-square max-w-[110px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-3xl sm:text-5xl font-bold tabular-nums text-white leading-none">
                      {String(value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white/40 uppercase">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
