import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowRight, Cpu, Film, Swords, Zap, BookOpen, Users, Trophy } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="min-h-screen bg-white pt-24">

        {/* Hero Band */}
        <div className="bg-darkAccent text-white py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255,106,0,0.18) 0%, transparent 70%)' }} />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-3">ABOUT</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">PIXEL-3.O</h1>
            <div className="w-16 h-[3px] bg-gradient-to-r from-phoenix-orange to-phoenix-magenta rounded-full mx-auto mb-6" />
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              National Level Technical Symposium · Adhiparasakthi Engineering College · 14 October 2026
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 space-y-20">

          {/* About block */}
          <ScrollReveal animation="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-3">WHO WE ARE</div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground mb-5">ABOUT THE SYMPOSIUM</h2>
                <p className="text-foreground-secondary leading-relaxed mb-4">
                  PIXEL-3.O is a National Level Technical Symposium organized by the <strong className="text-foreground">Department of Computer Science and Engineering</strong>,
                  Adhiparasakthi Engineering College, Melmaruvathur, in association with the <strong className="text-foreground">Computer Society of India – Kanchipuram Chapter</strong>.
                </p>
                <p className="text-foreground-secondary leading-relaxed">
                  This symposium is a celebration of technology, creativity, and collaborative problem-solving — bringing together brilliant minds from across Tamil Nadu to compete, learn, and inspire.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <BookOpen className="w-5 h-5" />, label: '4', sub: 'Events' },
                  { icon: <Users className="w-5 h-5" />,   label: '∞', sub: 'Participants' },
                  { icon: <Trophy className="w-5 h-5" />,  label: '🏆', sub: 'Prizes' },
                  { icon: <Cpu className="w-5 h-5" />,     label: '1 Day', sub: 'Symposium' },
                ].map(({ icon, label, sub }) => (
                  <div key={sub} className="p-5 rounded-2xl bg-background-warm border border-border text-center">
                    <div className="text-phoenix-orange mb-2 flex justify-center">{icon}</div>
                    <div className="text-2xl font-bold text-foreground">{label}</div>
                    <div className="text-xs text-foreground-muted font-semibold uppercase tracking-wider">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Events */}
          <div>
            <ScrollReveal animation="up">
              <div className="text-center mb-10">
                <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-3">EVENTS</div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">THE FOUR ARENAS</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: 'PAPERQUEST', cat: 'TECHNICAL', icon: <Cpu className="w-6 h-6 text-white" />, color: 'from-phoenix-orange to-phoenix-red', team: 'Team of 4', rules: ['Present a research paper before a panel', 'Topics related to CS, AI, ML, IoT', 'Q&A round after presentation', 'Synopsis submission mandatory'] },
                { name: 'AI FILMFORGE', cat: 'TECHNICAL', icon: <Film className="w-6 h-6 text-white" />, color: 'from-phoenix-red to-phoenix-magenta', team: 'Solo', rules: ['Generate a short AI film (5–7 min)', 'Must use AI tools for visuals/script', 'Submit before 10:00 AM on event day', 'Judged on creativity and concept'] },
                { name: 'CHECKMATE', cat: 'NON-TECHNICAL', icon: <Swords className="w-6 h-6 text-white" />, color: 'from-phoenix-magenta to-phoenix-purple', team: 'Solo', rules: ['Standard chess rules apply', 'Timed rounds', 'Tournament bracket format', 'Top 3 players receive prizes'] },
                { name: 'MINE RELAY', cat: 'NON-TECHNICAL', icon: <Zap className="w-6 h-6 text-white" />, color: 'from-phoenix-purple to-phoenix-orange', team: 'Team of 4', rules: ['Navigate a virtual minefield as a team', 'Communication and strategy are key', 'Fastest team wins each round', 'Double elimination format'] },
              ].map((e, i) => (
                <ScrollReveal key={e.name} animation="up" delay={i * 70}>
                  <div className="p-6 rounded-2xl bg-white border border-border hover:border-phoenix-orange/40 transition-all duration-300 shadow-sm h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center mb-4`}>{e.icon}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-foreground">{e.name}</h3>
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-background-warm border border-border text-foreground-muted">{e.cat}</span>
                    </div>
                    <p className="text-xs font-bold text-phoenix-orange uppercase tracking-wider mb-3">{e.team}</p>
                    <ul className="space-y-2">
                      {e.rules.map(r => (
                        <li key={r} className="flex items-start gap-2 text-xs text-foreground-secondary">
                          <span className="w-1 h-1 rounded-full bg-phoenix-orange mt-1.5 shrink-0" />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* CSI */}
          <ScrollReveal animation="up">
            <div className="p-8 rounded-3xl bg-background-warm border border-border text-center">
              <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-3">IN ASSOCIATION WITH</div>
              <h2 className="text-2xl font-bold text-foreground mb-3">COMPUTER SOCIETY OF INDIA</h2>
              <p className="text-foreground-secondary max-w-2xl mx-auto">
                PIXEL-3.O is proudly conducted in association with the <strong className="text-foreground">CSI – Kanchipuram Chapter</strong>, bringing the credibility and network of India's premier computer science professional body to the symposium.
              </p>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal animation="up">
            <div className="text-center">
              <button onClick={() => navigate('/registration')} className="phoenix-gradient-btn px-10 py-4 rounded-full text-white font-bold tracking-wider uppercase text-sm inline-flex items-center gap-2">
                REGISTER NOW <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
};
