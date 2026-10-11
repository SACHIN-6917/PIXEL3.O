import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { CountdownSection } from '../components/CountdownSection';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowRight, Cpu, Film, Swords, Zap, UtensilsCrossed, Coffee, Trophy, Award, MessageCircle } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

const EVENTS_PREVIEW = [
  { name: 'PAPERQUEST',   category: 'TECHNICAL',      icon: <Cpu className="w-6 h-6" />,    color: 'from-phoenix-orange to-phoenix-red',    team: 'Team of 4',  desc: 'Present your research paper before an expert panel.' },
  { name: 'AI FILMFORGE', category: 'TECHNICAL',      icon: <Film className="w-6 h-6" />,   color: 'from-phoenix-red to-phoenix-magenta',   team: 'Solo',       desc: 'Craft a compelling AI-generated short film.' },
  { name: 'CHECKMATE',    category: 'NON-TECHNICAL',  icon: <Swords className="w-6 h-6" />, color: 'from-phoenix-magenta to-phoenix-purple', team: 'Solo',       desc: 'Prove your strategic mastery on the chess board.' },
  { name: 'MINE RELAY',   category: 'NON-TECHNICAL',  icon: <Zap className="w-6 h-6" />,   color: 'from-phoenix-purple to-phoenix-orange',  team: 'Team of 4',  desc: 'Three Monkeys: Eyes, Ears, Mouth. This is the game!' },
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
                <div className="group block p-7 rounded-2xl bg-white border border-border hover:shadow-phoenix-subtle transition-all duration-300 relative overflow-hidden">
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
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* REGISTER BUTTON AND WHATSAPP GROUP BUTTON BELOW ALL FOUR EVENT CARDS */}
          <ScrollReveal animation="up" delay={350}>
            <div className="mt-12 flex flex-col items-center justify-center gap-5">
              {/* Informational Notice */}
              <div className="max-w-xl w-full p-5 rounded-2xl bg-white border border-emerald-500/30 shadow-md shadow-emerald-500/5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Important Notice</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-foreground">
                  Join our official WhatsApp group <span className="text-emerald-600 font-bold">before or after registration</span> to get all symposium information & updates!
                </p>
                <p className="text-xs text-foreground-secondary mt-1">
                  Stay informed with real-time schedule announcements, event timings, and guidelines directly from coordinators.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <a
                  href="https://forms.gle/YEnqBNgS6VuzYjJe6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-10 py-4 rounded-full phoenix-gradient-btn text-white font-bold tracking-wider uppercase text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-phoenix-glow hover:shadow-phoenix-active transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>REGISTER</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <a
                  href="https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold tracking-wider uppercase text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>JOIN PARTICIPANTS GROUP</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
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
            <p className="text-white/80 font-semibold mb-2">14 OCTOBER 2026</p>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};
