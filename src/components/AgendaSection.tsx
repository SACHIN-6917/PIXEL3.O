import React from 'react';
import { AGENDA_ITEMS } from '../data/pixeloData';
import { Clock } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const AgendaSection: React.FC = () => {
  return (
    <section id="agenda" className="py-24 bg-background-warm/60 border-t border-border relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <ScrollReveal animation="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-3">
              03 / AGENDA
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              THE DAY AT PIXELO 3.O
            </h2>
            <p className="text-sm sm:text-base text-foreground-secondary">
              14 OCTOBER 2026 · A choreographed schedule engineered for maximum learning, innovation, and intense competition.
            </p>
          </div>
        </ScrollReveal>

        {/* Animated Vertical Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px] bg-border" />

          <div className="space-y-12">
            {AGENDA_ITEMS.map((item, index) => {
              const isEven = index % 2 === 0;
              const animation = isEven ? 'left' : 'right';

              return (
                <div key={item.title} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} group`}>

                  {/* Timeline Dot */}
                  <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 z-10 flex items-center justify-center">
                    <div className={`w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center transition-all duration-300 ${item.highlight ? 'border-phoenix-orange shadow-[0_0_12px_rgba(255,106,0,0.4)]' : 'border-border'}`}>
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${item.highlight ? 'bg-gradient-to-r from-phoenix-orange to-phoenix-gold' : 'bg-foreground-muted'}`} />
                    </div>
                  </div>

                  {/* Card — alternates left/right on desktop */}
                  <div className="ml-14 md:ml-0 md:w-1/2 md:px-8 w-full">
                    <ScrollReveal animation={animation} delay={index * 60}>
                      <div className={`p-6 sm:p-7 rounded-2xl bg-white border transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle ${item.highlight ? 'border-phoenix-orange/40 bg-gradient-to-br from-white via-white to-background-warm' : 'border-border hover:border-phoenix-orange/30'}`}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-phoenix-orange">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.time}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-background-secondary border border-border text-foreground-secondary">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">{item.title}</h3>
                        {item.subtitle && <p className="text-xs sm:text-sm font-semibold text-phoenix-red tracking-wide mb-2">{item.subtitle}</p>}
                        {item.description && <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">{item.description}</p>}
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
