import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { CountdownSection } from '../components/CountdownSection';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowRight, Cpu, Film, Swords, Zap, UtensilsCrossed, Coffee, Trophy, Award } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

const EVENTS_PREVIEW = [
  { name: 'PAPERQUEST',   category: 'TECHNICAL',      icon: <Cpu className="w-6 h-6" />,    color: 'from-phoenix-orange to-phoenix-red',    team: 'Team of 4',  desc: 'Present your research paper before an expert panel.' },
  { name: 'AI FILMFORGE', category: 'TECHNICAL',      icon: <Film className="w-6 h-6" />,   color: 'from-phoenix-red to-phoenix-magenta',   team: 'Solo',       desc: 'Craft a compelling AI-generated short film.' },
  { name: 'CHECKMATE',    category: 'NON-TECHNICAL',  icon: <Swords className="w-6 h-6" />, color: 'from-phoenix-magenta to-phoenix-purple', team: 'Solo',       desc: 'Prove your strategic mastery on the chess board.' },
  { name: 'MINE RELAY',   category: 'NON-TECHNICAL',  icon: <Zap className="w-6 h-6" />,   color: 'from-phoenix-purple to-phoenix-orange',  team: 'Team of 4',  desc: 'Navigate the minefield as a team and win together.' },
];

const BENEFITS = [
  { icon: <UtensilsCrossed className="w-6 h-6" />, title: 'VEGETARIAN LUNCH',      desc: 'Complimentary vegetarian lunch provided for all participants.' },
  { icon: <Coffee className="w-6 h-6" />,          title: 'REFRESHMENTS',          desc: 'Refreshments and snacks available throughout the day.' },
  { icon: <Trophy className="w-6 h-6" />,          title: 'PRIZES & RECOGNITION',  desc: 'Exciting prizes and trophies for top-performing teams.' },
  { icon: <Award className="w-6 h-6" />,           title: 'CERTIFICATES',          desc: 'Participation certificates for all registered participants.' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      {/* Hero */}
      <Hero />

      {/* Countdown */}
      <CountdownSection />

      {/* Short Intro */}
      <section id="intro" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal animation="up">
            <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-4">WELCOME</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              WELCOME TO PIXEL-3.O
            </h2>
            <p className="text-base sm:text-lg text-foreground-secondary max-w-3xl mx-auto leading-relaxed mb-8">
              A National Level Technical Symposium crafted by the Department of CSE, Adhiparasakthi Engineering College,
              in collaboration with the Computer Society of India — Kanchipuram Chapter.
              A day filled with innovation, competition, and camaraderie.
            </p>
            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-background-warm border border-border hover:border-phoenix-orange hover:text-phoenix-orange text-sm font-bold tracking-wider uppercase transition-all duration-200 text-foreground-secondary"
            >
              DISCOVER PIXEL-3.O
              <ArrowRight className="w-4 h-4" />
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-20 bg-background-warm/50 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="up">
            <div className="text-center mb-14">
              <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-3">CONFIRMED EVENTS</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">THE EVENTS</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EVENTS_PREVIEW.map((event, i) => (
              <ScrollReveal key={event.name} animation="up" delay={i * 80}>
                <div className="group p-7 rounded-2xl bg-white border border-border hover:border-transparent hover:shadow-phoenix-subtle transition-all duration-300 relative overflow-hidden cursor-pointer"
                  onClick={() => navigate('/registration')}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-border group-hover:bg-gradient-to-r group-hover:from-phoenix-orange group-hover:to-phoenix-magenta transition-all duration-300" />

                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center text-white shrink-0`}>
                      {event.icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-background-warm border border-border text-foreground-secondary">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground mb-1">{event.name}</h3>
                  <p className="text-xs font-bold text-phoenix-magenta uppercase tracking-wider mb-3">{event.team}</p>
                  <p className="text-sm text-foreground-secondary leading-relaxed">{event.desc}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-phoenix-orange uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    REGISTER <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="up">
            <div className="text-center mb-14">
              <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-3">PARTICIPANT EXPERIENCE</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">MORE THAN A SYMPOSIUM</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <ScrollReveal key={b.title} animation="scale" delay={i * 70}>
                <div className="group p-6 rounded-2xl bg-background-warm border border-border hover:border-phoenix-orange/40 hover:bg-white transition-all duration-300 shadow-sm h-full">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center mb-5 text-foreground group-hover:text-phoenix-orange transition-colors group-hover:scale-105 transform duration-300">
                    {b.icon}
                  </div>
                  <h3 className="text-sm font-bold tracking-wider text-foreground mb-2">{b.title}</h3>
                  <p className="text-xs text-foreground-secondary leading-relaxed">{b.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-darkAccent text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(255,106,0,0.2) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <ScrollReveal animation="up">
            <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-4">DON'T MISS OUT</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              READY TO IGNITE YOUR POTENTIAL?
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-8">The stage is set. The challenges await.</p>
            <p className="text-white/80 font-semibold mb-8">14 OCTOBER 2026</p>
            <button
              onClick={() => navigate('/registration')}
              className="phoenix-gradient-btn px-10 py-4 rounded-full text-white font-bold tracking-wider uppercase text-sm sm:text-base inline-flex items-center gap-2 shadow-phoenix-glow"
            >
              REGISTER NOW <ArrowRight className="w-5 h-5" />
            </button>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};
