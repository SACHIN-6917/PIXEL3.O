import React from 'react';
import { STUDENT_COORDINATORS } from '../data/pixeloData';
import { Users, ExternalLink, Phone } from 'lucide-react';

export const StudentCoordinatorsSection: React.FC = () => {
  const openDetailPage = () => {
    window.open('/student-coordinators.html', '_blank');
  };

  return (
    <section id="students" className="py-24 bg-background-warm/60 border-t border-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-border">
          <div>
            <div className="inline-block text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-3">
              06 / STUDENT COORDINATORS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              STUDENT COORDINATORS
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold text-foreground-muted flex items-center gap-2">
              <Users className="w-4 h-4 text-phoenix-magenta" />
              <span>EXECUTIVE COMMITTEE</span>
            </span>
            <button
              onClick={openDetailPage}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-border hover:border-phoenix-orange hover:text-phoenix-orange text-xs font-bold tracking-wider uppercase text-foreground-secondary transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              VIEW FULL DETAILS
            </button>
          </div>
        </div>

        {/* 5 Student Coordinator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {STUDENT_COORDINATORS.map((student) => (
            <div
              key={student.name}
              onClick={openDetailPage}
              className="group p-7 rounded-2xl bg-white border border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-background-warm text-phoenix-red border border-border">
                    {student.role}
                  </span>
                  {student.phone ? (
                    <div className="flex items-center gap-1 text-phoenix-orange">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-phoenix-orange/40 group-hover:bg-phoenix-orange transition-colors" />
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1 group-hover:text-darkAccent">
                  {student.name}
                </h3>

                {student.year && (
                  <p className="text-xs font-bold tracking-wider uppercase text-phoenix-magenta mb-1">
                    {student.year}
                  </p>
                )}

                <p className="text-xs sm:text-sm font-medium text-foreground-secondary">
                  {student.department} — CSE, Adhiparasakthi Engg. College
                </p>

                {/* Show phone preview if available */}
                {student.phone && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-foreground tracking-wider bg-background-warm/80 border border-border rounded-xl px-3 py-2">
                    <Phone className="w-3.5 h-3.5 text-phoenix-orange flex-shrink-0" />
                    <span>{student.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                <span>{student.titleBadge}</span>
                <div className="flex items-center gap-1.5 text-foreground-muted group-hover:text-phoenix-orange transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">CLICK TO VIEW</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Row */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={openDetailPage}
            className="phoenix-gradient-btn px-8 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center gap-2 shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            OPEN FULL STUDENT COORDINATORS PAGE
          </button>
        </div>
      </div>
    </section>
  );
};
