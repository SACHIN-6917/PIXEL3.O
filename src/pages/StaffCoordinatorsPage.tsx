import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { ScrollReveal } from '../components/ScrollReveal';

const STAFF = [
  { name: 'Dr. J. Raja',            role: 'PRINCIPAL',          dept: 'Adhiparasakthi Engineering College',  badge: 'Patron' },
  { name: 'Dr. A. Bhuwaneswari',    role: 'VICE PRINCIPAL',     dept: 'Adhiparasakthi Engineering College',  badge: 'Co-Patron' },
  { name: 'Dr. V. Ramasamy',        role: 'DEAN',               dept: 'Adhiparasakthi Engineering College',  badge: 'Co-Patron' },
  { name: 'Dr. C. Dhaya',           role: 'HEAD OF DEPARTMENT', dept: 'Dept. of Computer Science & Engg.',   badge: 'HOD' },
  { name: 'Mrs. P. Gajalakshmi',    role: 'CONVENER',           dept: 'Asst. Professor / CSE',               badge: 'Convener' },
  { name: 'Mr. K. Charimadhurai',   role: 'STAFF COORDINATOR',  dept: 'Asst. Professor / CSE',               badge: 'Coordinator' },
];

export const StaffCoordinatorsPage: React.FC = () => (
  <PageTransition>
    <div className="min-h-screen bg-white pt-24">
      <div className="bg-darkAccent text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,106,0,0.15) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-2">LEADERSHIP</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">STAFF COORDINATORS</h1>
          <div className="w-12 h-[3px] bg-gradient-to-r from-phoenix-orange to-phoenix-magenta rounded-full mx-auto mb-4" />
          <p className="text-white/60 text-sm">INSTITUTIONAL LEADERSHIP · PIXELO 3.O 2026</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STAFF.map((s, i) => (
            <ScrollReveal key={s.name} animation="up" delay={i * 70}>
              <div className="group p-7 rounded-2xl bg-white border border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle relative h-full flex flex-col justify-between">
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-border group-hover:bg-gradient-to-r group-hover:from-phoenix-orange group-hover:via-phoenix-red group-hover:to-phoenix-magenta transition-all duration-300 rounded-b" />
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-background-warm text-phoenix-orange border border-border inline-block mb-4">{s.role}</span>
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-darkAccent">{s.name}</h3>
                  <p className="text-xs text-foreground-secondary font-medium">{s.dept}</p>
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
