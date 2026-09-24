import React from 'react';
import { UtensilsCrossed, Coffee, Trophy, Award } from 'lucide-react';
import { EXPERIENCE_PERKS } from '../data/pixeloData';
import { ScrollReveal } from './ScrollReveal';

export const ExperienceSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-6 h-6 text-foreground group-hover:text-phoenix-orange transition-colors" />;
      case 'Coffee': return <Coffee className="w-6 h-6 text-foreground group-hover:text-phoenix-red transition-colors" />;
      case 'Trophy': return <Trophy className="w-6 h-6 text-foreground group-hover:text-phoenix-gold transition-colors" />;
      case 'Award': default: return <Award className="w-6 h-6 text-foreground group-hover:text-phoenix-magenta transition-colors" />;
    }
  };

  return (
    <section className="py-24 bg-background-warm border-t border-border relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-3">PARTICIPANT EXPERIENCE</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">MORE THAN A SYMPOSIUM</h2>
            <p className="text-sm sm:text-base text-foreground-secondary">
              Thoughtfully planned hospitality, high-stakes recognitions, and an unforgettable collegiate experience.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERIENCE_PERKS.map((perk, idx) => (
            <ScrollReveal key={perk.title} animation="scale" delay={idx * 80}>
              <div className="group p-7 rounded-2xl bg-white border border-border hover:border-phoenix-orange/40 transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle flex flex-col justify-between h-full">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-background-warm border border-border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                    {getIcon(perk.icon)}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground mb-2 group-hover:text-darkAccent">{perk.title}</h3>
                  <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">{perk.description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-border/60">
                  <span className="text-[11px] font-bold tracking-wider text-phoenix-orange uppercase group-hover:translate-x-1 inline-block transition-transform">
                    INCLUDED COMPLIMENTARY
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
