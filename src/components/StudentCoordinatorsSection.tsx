import React from 'react';
import { STUDENT_LEADERSHIP, STUDENT_COORDINATORS } from '../data/pixeloData';
import { Users, ExternalLink } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useNavigate } from 'react-router-dom';

export const StudentCoordinatorsSection: React.FC = () => {
  const navigate = useNavigate();
  const openDetailPage = () => navigate('/student-coordinators');

  return (
    <section id="students" className="py-24 bg-background-warm/60 border-t border-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <ScrollReveal animation="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-border">
            <div>
              <div className="inline-block text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-3">06 / STUDENT COMMITTEE</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">STUDENT COMMITTEE</h2>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="text-xs sm:text-sm font-semibold text-foreground-muted flex items-center gap-2">
                <Users className="w-4 h-4 text-phoenix-magenta" />
                <span>STUDENT LEADERSHIP</span>
              </span>
              <button
                onClick={openDetailPage}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-border hover:border-phoenix-orange hover:text-phoenix-orange text-xs font-bold tracking-wider uppercase text-foreground-secondary transition-all duration-200"
              >
                <ExternalLink className="w-3.5 h-3.5" /> VIEW FULL DETAILS
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Leadership sub-heading ── */}
        <ScrollReveal animation="up">
          <div className="text-xs font-bold tracking-[0.2em] text-foreground-muted uppercase mb-5">
            COMMITTEE LEADERSHIP
          </div>
        </ScrollReveal>

        {/* ── 5 Leadership cards (prominent) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          {STUDENT_LEADERSHIP.map((leader, idx) => (
            <ScrollReveal key={leader.role} animation="up" delay={idx * 50}>
              <div
                onClick={openDetailPage}
                className="group relative p-6 rounded-2xl bg-white border-2 border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle cursor-pointer h-full flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-phoenix-orange/0 to-phoenix-magenta/0 group-hover:from-phoenix-orange/5 group-hover:to-phoenix-magenta/5 transition-all duration-300 rounded-2xl" />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-background-warm text-phoenix-orange border border-border inline-block mb-4 leading-normal">
                    {leader.role}
                  </span>
                  <div className="space-y-1">
                    {leader.members.map((m) => (
                      <h3 key={m} className="text-lg font-bold text-foreground group-hover:text-darkAccent transition-colors">
                        {m}
                      </h3>
                    ))}
                  </div>
                </div>
                <div className="relative z-10 mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                  <span>Executive</span>
                  <div className="w-2 h-2 rounded-full bg-border group-hover:bg-phoenix-orange transition-colors" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ── Coordinators sub-heading ── */}
        <ScrollReveal animation="up">
          <div className="text-xs font-bold tracking-[0.2em] text-foreground-muted uppercase mb-5">
            COMMITTEE HEADS
          </div>
        </ScrollReveal>

        {/* ── Coordinator cards (show first 6 as preview) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {STUDENT_COORDINATORS.slice(0, 6).map((student, idx) => (
            <ScrollReveal key={student.role + idx} animation="up" delay={idx * 35}>
              <div
                onClick={openDetailPage}
                className="group p-6 rounded-2xl bg-white border border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle flex flex-col justify-between cursor-pointer h-full"
              >
                <div className="absolute top-0 left-8 right-8 h-[2px]" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-background-warm text-phoenix-red border border-border">
                      {student.role}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-phoenix-orange/40 group-hover:bg-phoenix-orange transition-colors" />
                  </div>
                  <div className="space-y-1 mt-2">
                    {student.members && student.members.map((m) => (
                      <h3 key={m} className="text-lg font-bold tracking-tight text-foreground group-hover:text-darkAccent transition-colors">
                        {m}
                      </h3>
                    ))}
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                  <span>Student Head</span>
                  <div className="flex items-center gap-1.5 group-hover:text-phoenix-orange transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">VIEW ALL</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ── CTA button ── */}
        <ScrollReveal animation="fade" delay={200}>
          <div className="mt-10 flex justify-center">
            <button
              onClick={openDetailPage}
              className="phoenix-gradient-btn px-8 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center gap-2 shadow-sm"
            >
              <ExternalLink className="w-4 h-4" /> VIEW FULL STUDENT COMMITTEE
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
