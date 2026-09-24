import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { ScrollReveal } from '../components/ScrollReveal';
import { Phone } from 'lucide-react';

const STUDENTS = [
  { name: 'SACHIN',          role: 'PRESIDENT',       year: 'Final Year', phone: '9940764517', badge: 'President' },
  { name: 'SHAJITHA K.',     role: 'TREASURER',       year: 'Final Year', phone: '',           badge: 'Treasurer' },
  { name: 'PADMAPRIYA S.',   role: 'VICE PRESIDENT',  year: 'Third Year', phone: '',           badge: 'Vice President' },
  { name: 'SATHISH KUMAR S.',role: 'SECRETARY',       year: 'Third Year', phone: '9360500694', badge: 'Secretary' },
  { name: 'BHARATH S.',      role: 'JOINT SECRETARY', year: 'Second Year',phone: '',           badge: 'Joint Secretary' },
];

export const StudentCoordinatorsPage: React.FC = () => (
  <PageTransition>
    <div className="min-h-screen bg-background-warm/40 pt-24">
      <div className="bg-darkAccent text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(229,27,35,0.18) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-2">EXECUTIVE COMMITTEE</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">STUDENT COORDINATORS</h1>
          <div className="w-12 h-[3px] bg-gradient-to-r from-phoenix-orange to-phoenix-magenta rounded-full mx-auto mb-4" />
          <p className="text-white/60 text-sm">CSE DEPT · ADHIPARASAKTHI ENGINEERING COLLEGE · PIXELO 3.O 2026</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENTS.map((s, i) => (
            <ScrollReveal key={s.name} animation="up" delay={i * 70}>
              <div className="group p-7 rounded-2xl bg-white border border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle relative h-full flex flex-col justify-between">
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-border group-hover:bg-gradient-to-r group-hover:from-phoenix-orange group-hover:via-phoenix-red group-hover:to-phoenix-magenta transition-all duration-300 rounded-b" />
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-background-warm text-phoenix-red border border-border inline-block mb-4">{s.role}</span>
                  <h3 className="text-xl font-bold text-foreground mb-0.5 group-hover:text-darkAccent">{s.name}</h3>
                  <p className="text-xs font-bold text-phoenix-magenta uppercase tracking-wider mb-1">{s.year}</p>
                  <p className="text-xs text-foreground-secondary font-medium">Dept. of CSE · Adhiparasakthi Engg. College</p>
                  {s.phone && (
                    <a href={`tel:${s.phone}`} className="mt-3 flex items-center gap-2 text-xs font-bold text-foreground px-3 py-2 rounded-xl bg-background-warm border border-border hover:border-phoenix-orange transition-colors w-fit">
                      <Phone className="w-3.5 h-3.5 text-phoenix-orange" /> {s.phone}
                    </a>
                  )}
                </div>
                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                  <span>{s.badge}</span>
                  <div className="w-2 h-2 rounded-full bg-border group-hover:bg-phoenix-orange transition-colors" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  </PageTransition>
);
