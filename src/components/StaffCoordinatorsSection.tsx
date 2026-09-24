import React from 'react';
import { STAFF_COORDINATORS } from '../data/pixeloData';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const StaffCoordinatorsSection: React.FC = () => {
  return (
    <section id="staff" className="py-24 bg-white border-t border-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-border">
          <div>
            <div className="inline-block text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-3">
              05 / STAFF COORDINATORS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              STAFF COORDINATORS
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-xs sm:text-sm font-semibold text-foreground-muted flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-phoenix-orange" />
            <span>INSTITUTIONAL LEADERSHIP & PATRONS</span>
          </div>
        </div>

        {/* 6 Staff Coordinators in a balanced clean grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {STAFF_COORDINATORS.map((staff) => (
            <div
              key={staff.name}
              className="group p-7 rounded-2xl bg-white border border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle relative flex flex-col justify-between"
            >
              {/* Subtle top accent line on hover */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-border via-border to-border group-hover:from-phoenix-orange group-hover:via-phoenix-red to-phoenix-magenta transition-all duration-300" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-background-warm text-phoenix-orange border border-border">
                    {staff.role}
                  </span>
                  <UserCheck className="w-4 h-4 text-foreground-muted group-hover:text-phoenix-red transition-colors" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1 group-hover:text-darkAccent">
                  {staff.name}
                </h3>

                <p className="text-xs sm:text-sm font-medium text-foreground-secondary">
                  {staff.department}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                <span>{staff.titleBadge}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-phoenix-orange transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
