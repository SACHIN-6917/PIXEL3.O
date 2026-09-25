import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { ScrollReveal } from '../components/ScrollReveal';
import { MapPin, Clock } from 'lucide-react';

const VENUES = [
  { session: 'MORNING SESSION', time: '10:30 AM – 12:10 PM', events: [
    { name: 'PAPERQUEST',   venue: 'Main Auditorium', cat: 'Technical', color: 'from-phoenix-orange to-phoenix-red', desc: 'Large seating, projector, presentation setup for paper reading.' },
    { name: 'AI FILMFORGE', venue: 'Main CSE Lab',  cat: 'Technical', color: 'from-phoenix-red to-phoenix-magenta', desc: 'Main CSE Lab with high-speed systems for AI content creation and screening.' },
  ]},
  { session: 'AFTERNOON SESSION', time: '01:40 PM – 03:30 PM', events: [
    { name: 'CHECKMATE',  venue: 'Main CSE Lab',  cat: 'Non-Technical', color: 'from-phoenix-magenta to-phoenix-purple', desc: 'Spacious lab set up with chess boards for tournament play.' },
    { name: 'MINE RELAY', venue: 'Auditorium',    cat: 'Non-Technical', color: 'from-phoenix-purple to-phoenix-orange', desc: 'Open floor in the auditorium for the team relay challenge.' },
  ]},
  { session: 'LUNCH BREAK', time: '12:20 PM – 01:40 PM', events: [
    { name: 'LUNCH & REFRESHMENTS', venue: 'College Canteen', cat: 'Meal', color: 'from-phoenix-gold to-phoenix-orange', desc: 'Complimentary vegetarian lunch and refreshments for all participants.' },
  ]},
];

export const VenuesPage: React.FC = () => (
  <PageTransition>
    <div className="min-h-screen bg-white pt-24">
      <div className="bg-darkAccent text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,106,0,0.15) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-2">EVENT LOCATIONS</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">VENUES</h1>
          <div className="w-12 h-[3px] bg-gradient-to-r from-phoenix-orange to-phoenix-magenta rounded-full mx-auto mb-4" />
          <p className="text-white/60 text-sm">ADHIPARASAKTHI ENGINEERING COLLEGE, MELMARUVATHUR</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-14">
        {VENUES.map((section, si) => (
          <div key={section.session}>
            <ScrollReveal animation="up">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-phoenix-orange uppercase">{section.session}</div>
                  <div className="flex items-center gap-1.5 text-xs text-foreground-secondary font-medium">
                    <Clock className="w-3.5 h-3.5" /> {section.time}
                  </div>
                </div>
                <div className="flex-1 h-[1px] bg-border" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {section.events.map((ev, i) => (
                <ScrollReveal key={ev.name} animation="up" delay={i * 80}>
                  <div className="p-6 rounded-2xl bg-background-warm border border-border hover:border-phoenix-orange/40 transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle group h-full">
                    <div className={`inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-gradient-to-r ${ev.color} text-white mb-4`}>{ev.cat}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-darkAccent">{ev.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-phoenix-red shrink-0" />
                      <span className="text-sm font-bold text-phoenix-red">{ev.venue}</span>
                    </div>
                    <p className="text-xs text-foreground-secondary leading-relaxed">{ev.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        ))}

        {/* College map placeholder */}
        <ScrollReveal animation="up">
          <div className="p-6 rounded-2xl bg-background-warm border border-border text-center">
            <MapPin className="w-8 h-8 text-phoenix-orange mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">ADHIPARASAKTHI ENGINEERING COLLEGE</h3>
            <p className="text-sm text-foreground-secondary mb-4">Melmaruvathur, Kanchipuram District, Tamil Nadu - 603319</p>
            <a href="https://apec.edu.in" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full phoenix-gradient-btn text-white text-xs font-bold tracking-wider uppercase">
              VISIT WEBSITE
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </PageTransition>
);
