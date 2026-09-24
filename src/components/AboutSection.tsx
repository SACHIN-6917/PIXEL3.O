import React from 'react';
import { Cpu, Lightbulb, Trophy, Sparkles } from 'lucide-react';
import { WHAT_AWAITS_YOU } from '../data/pixeloData';

export const AboutSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-foreground group-hover:text-phoenix-orange transition-colors" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6 text-foreground group-hover:text-phoenix-red transition-colors" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-foreground group-hover:text-phoenix-gold transition-colors" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-foreground group-hover:text-phoenix-magenta transition-colors" />;
    }
  };

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle abstract Phoenix feather backdrop at low opacity */}
      <div
        className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FF6A00 0%, #E0008A 45%, #6A00FF 90%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-3">
            01 / ABOUT
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            ABOUT PIXELO 3.O
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-foreground-secondary text-base sm:text-lg leading-relaxed border-l-2 border-border pl-6">
            <p>
              PIXELO 3.O is a National Level Technical Symposium organized by the{' '}
              <strong className="text-foreground font-semibold">
                Department of Computer Science and Engineering, Adhiparasakthi Engineering College
              </strong>
              , in association with the{' '}
              <strong className="text-foreground font-semibold">
                Computer Society of India – Kanchipuram Chapter
              </strong>
              .
            </p>
            <p>
              The symposium brings together technology, creativity, problem-solving and competition, providing students with a platform to showcase their technical skills, explore innovative ideas and experience a day filled with challenges.
            </p>
          </div>
        </div>

        {/* Section Subsection: WHAT AWAITS YOU */}
        <div className="pt-8">
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              WHAT AWAITS YOU
            </h3>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHAT_AWAITS_YOU.map((item, idx) => (
              <div
                key={item.title}
                className="group p-6 rounded-2xl bg-background-warm/60 border border-border hover:border-phoenix-orange/40 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    {getIcon(item.icon)}
                  </div>
                  <h4 className="text-base font-bold tracking-tight text-foreground mb-2 group-hover:text-darkAccent">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold tracking-wider text-foreground-muted">
                  <span>0{idx + 1}</span>
                  <span className="w-0 group-hover:w-8 h-[2px] bg-gradient-to-r from-phoenix-orange to-phoenix-magenta transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
