import React from 'react';
import { STAFF_COORDINATORS } from '../data/pixeloData';
import { ShieldCheck, UserCheck, ExternalLink } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const StaffCoordinatorsSection: React.FC = () => {
  const openDetailPage = () => window.open('/staff-coordinators.html', '_blank');

  return (
    <section id="staff" className="py-24 bg-white border-t border-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <ScrollReveal animation="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-border">
            <div>
              <div className="inline-block text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-3">05 / STAFF COORDINATORS</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">STAFF COORDINATORS</h2>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="text-xs sm:text-sm font-semibold text-foreground-muted flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-phoenix-orange" />
                <span>INSTITUTIONAL LEADERSHIP</span>
              </span>
              <button onClick={openDetailPage} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-background-warm border border-border hover:border-phoenix-orange hover:text-phoenix-orange text-xs font-bold tracking-wider uppercase text-foreground-secondary transition-all duration-200">
                <ExternalLink className="w-3.5 h-3.5" /> VIEW FULL DETAILS
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {STAFF_COORDINATORS.map((staff, idx) => (
            <ScrollReveal key={staff.name} animation="up" delay={idx * 70}>
              <div onClick={openDetailPage} className="group p-7 rounded-2xl bg-white border border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle relative flex flex-col justify-between cursor-pointer h-full">
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-border group-hover:bg-gradient-to-r group-hover:from-phoenix-orange group-hover:via-phoenix-red group-hover:to-phoenix-magenta transition-all duration-300" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-background-warm text-phoenix-orange border border-border">{staff.role}</span>
                    <UserCheck className="w-4 h-4 text-foreground-muted group-hover:text-phoenix-red transition-colors" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1 group-hover:text-darkAccent">{staff.name}</h3>
                  <p className="text-xs sm:text-sm font-medium text-foreground-secondary">{staff.department}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                  <span>{staff.titleBadge}</span>
                  <div className="flex items-center gap-1.5 text-foreground-muted group-hover:text-phoenix-orange transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">CLICK TO VIEW</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fade" delay={200}>
          <div className="mt-12 flex justify-center">
            <button onClick={openDetailPage} className="phoenix-gradient-btn px-8 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center gap-2 shadow-sm">
              <ExternalLink className="w-4 h-4" /> OPEN FULL STAFF COORDINATORS PAGE
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
