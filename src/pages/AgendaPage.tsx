import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { ScrollReveal } from '../components/ScrollReveal';
import { Clock } from 'lucide-react';

const TIMELINE = [
  { time: '09:00 AM', title: 'REGISTRATION & CHECK-IN', desc: 'Report at the venue, collect ID cards and event kits.', badge: 'ARRIVAL', highlight: false },
  { time: '09:30 AM', title: 'INAUGURATION', desc: 'Opening ceremony with the Principal, HOD and CSI chapter president.', badge: 'CEREMONY', highlight: false },
  { time: '10:30 AM', title: 'TECHNICAL EVENTS BEGIN', desc: 'PaperQuest in Main Auditorium · AI FilmForge in MM Lab', badge: 'TECHNICAL', highlight: true },
  { time: '12:10 PM', title: 'TECHNICAL EVENTS CONCLUDE', desc: 'Wrapping up technical event rounds.', badge: '', highlight: false },
  { time: '12:20 PM', title: 'LUNCH BREAK', desc: 'Complimentary vegetarian lunch and refreshments at College Canteen.', badge: 'LUNCH', highlight: false },
  { time: '01:40 PM', title: 'NON-TECHNICAL EVENTS BEGIN', desc: 'Checkmate in Main CSE Lab · Mine Relay in Auditorium', badge: 'NON-TECHNICAL', highlight: true },
  { time: '03:30 PM', title: 'EVENTS CONCLUDE', desc: 'All events conclude. Results compilation begins.', badge: '', highlight: false },
  { time: '03:30 PM', title: 'VALEDICTORY & PRIZE DISTRIBUTION', desc: 'Prize distribution, certificates, and closing remarks.', badge: 'CLOSING', highlight: true },
];

export const AgendaPage: React.FC = () => (
  <PageTransition>
    <div className="min-h-screen bg-background-warm/40 pt-24">

      {/* Hero band */}
      <div className="bg-darkAccent text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,106,0,0.15) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-2">EVENT SCHEDULE</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">AGENDA</h1>
          <div className="w-12 h-[3px] bg-gradient-to-r from-phoenix-orange to-phoenix-magenta rounded-full mx-auto mb-4" />
          <p className="text-white/60 text-sm">14 OCTOBER 2026 · A DAY CRAFTED FOR TECHNOLOGY AND INNOVATION</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px] bg-border" />

          <div className="space-y-10">
            {TIMELINE.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={item.title + item.time} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 z-10">
                    <div className={`w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${item.highlight ? 'border-phoenix-orange shadow-[0_0_10px_rgba(255,106,0,0.35)]' : 'border-border'}`}>
                      <div className={`w-2 h-2 rounded-full ${item.highlight ? 'bg-phoenix-orange' : 'bg-foreground-muted'}`} />
                    </div>
                  </div>

                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-8 w-full">
                    <ScrollReveal animation={isEven ? 'left' : 'right'} delay={i * 55}>
                      <div className={`p-5 rounded-2xl bg-white border shadow-sm transition-all duration-300 hover:shadow-phoenix-subtle ${item.highlight ? 'border-phoenix-orange/30' : 'border-border hover:border-phoenix-orange/30'}`}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-phoenix-orange">
                            <Clock className="w-3.5 h-3.5" />{item.time}
                          </div>
                          {item.badge && <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-background-secondary border border-border text-foreground-secondary">{item.badge}</span>}
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-foreground mb-1">{item.title}</h3>
                        <p className="text-xs text-foreground-secondary leading-relaxed">{item.desc}</p>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </PageTransition>
);
