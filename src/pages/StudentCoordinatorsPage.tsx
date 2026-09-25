import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { ScrollReveal } from '../components/ScrollReveal';
import { STUDENT_LEADERSHIP, STUDENT_COMMITTEE, EVENT_COORDINATORS } from '../data/pixeloData';

/* ── badge colours ── */
const LEADERSHIP_COLOR = 'text-phoenix-orange';
const COORD_COLOR = 'text-phoenix-red';

export const StudentCoordinatorsPage: React.FC = () => (
  <PageTransition>
    <div className="min-h-screen bg-background-warm/40 pt-24">

      {/* ── Hero Band ── */}
      <div className="bg-darkAccent text-white py-16 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(229,27,35,0.18) 0%, transparent 70%)' }}
        />
        <div className="relative z-10">
          <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-2">CSE DEPT · PIXELO 3.O 2026</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">STUDENT COMMITTEE</h1>
          <div className="w-12 h-[3px] bg-gradient-to-r from-phoenix-orange to-phoenix-magenta rounded-full mx-auto mb-4" />
          <p className="text-white/60 text-sm">ADHIPARASAKTHI ENGINEERING COLLEGE</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-20">

        {/* ══════════════════════════════════════════
            SECTION 1 — STUDENT COMMITTEE LEADERSHIP
        ══════════════════════════════════════════ */}
        <div>
          <ScrollReveal animation="up">
            <div className="mb-10 pb-6 border-b border-border">
              <div className="text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-2">01 / LEADERSHIP</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">STUDENT COMMITTEE LEADERSHIP</h2>
              <p className="text-sm text-foreground-secondary mt-2">Core executive positions of PIXELO 3.O student body.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {STUDENT_LEADERSHIP.map((item, i) => (
              <ScrollReveal key={item.role} animation="up" delay={i * 60}>
                <div className="group relative p-7 rounded-2xl bg-white border-2 border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle h-full flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-phoenix-orange/0 to-phoenix-magenta/0 group-hover:from-phoenix-orange/5 group-hover:to-phoenix-magenta/5 transition-all duration-300 rounded-2xl" />
                  <div className="relative z-10">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-background-warm ${LEADERSHIP_COLOR} border border-border inline-block mb-5 leading-normal`}>
                      {item.role}
                    </span>
                    <div className="space-y-1">
                      {item.members.map((name) => (
                        <h3 key={name} className="text-xl font-bold text-foreground group-hover:text-darkAccent transition-colors">
                          {name}
                        </h3>
                      ))}
                    </div>
                  </div>
                  <div className="relative z-10 mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                    <span className="font-semibold uppercase tracking-wider">Executive</span>
                    <div className="w-2 h-2 rounded-full bg-border group-hover:bg-phoenix-orange transition-colors" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 2 — STUDENT COORDINATORS
        ══════════════════════════════════════════ */}
        <div>
          <ScrollReveal animation="up">
            <div className="mb-10 pb-6 border-b border-border">
              <div className="text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-2">02 / COMMITTEE HEADS</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">STUDENT COORDINATORS</h2>
              <p className="text-sm text-foreground-secondary mt-2">Committee-wise student heads responsible for each domain.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STUDENT_COMMITTEE.map((item, i) => (
              <ScrollReveal key={item.role + i} animation="up" delay={i * 30}>
                <div className="group p-6 rounded-2xl bg-white border border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle relative h-full flex flex-col justify-between">
                  <div className="absolute top-0 left-8 right-8 h-[2px] bg-border group-hover:bg-gradient-to-r group-hover:from-phoenix-orange group-hover:via-phoenix-red group-hover:to-phoenix-magenta transition-all duration-300 rounded-b" />
                  <div>
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-background-warm ${COORD_COLOR} border border-border inline-block mb-4 leading-normal`}>
                      {item.role}
                    </span>
                    <div className="space-y-1.5 mt-1">
                      {item.members.map((name) => (
                        <h3 key={name} className="text-lg font-bold text-foreground group-hover:text-darkAccent transition-colors">
                          {name}
                        </h3>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                    <span>Student Head</span>
                    <div className="w-2 h-2 rounded-full bg-border group-hover:bg-phoenix-orange transition-colors" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 3 — EVENT COORDINATORS
        ══════════════════════════════════════════ */}
        <div>
          <ScrollReveal animation="up">
            <div className="mb-10 pb-6 border-b border-border">
              <div className="text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-2">03 / EVENT COORDINATORS</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">EVENT COORDINATORS</h2>
              <p className="text-sm text-foreground-secondary mt-2">Student coordinators assigned event-wise for PIXELO 3.O 2026.</p>
            </div>
          </ScrollReveal>

          {/* — Technical — */}
          <ScrollReveal animation="up">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-phoenix-orange bg-phoenix-orange/8 border border-phoenix-orange/20 px-3 py-1 rounded-full">
                TECHNICAL EVENT COORDINATORS
              </span>
              <div className="flex-1 h-[1px] bg-border" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {EVENT_COORDINATORS.filter(g => g.category === 'Technical').map((group, i) => (
              <ScrollReveal key={group.event} animation="up" delay={i * 60}>
                <div className="group relative p-6 rounded-2xl bg-white border border-border hover:border-phoenix-orange transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle h-full flex flex-col justify-between overflow-hidden">
                  {/* gradient top accent */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-phoenix-orange to-phoenix-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Event badge */}
                    <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-phoenix-orange/8 text-phoenix-orange border border-phoenix-orange/20 inline-block mb-4 leading-normal">
                      {group.event}
                    </span>
                    <div className="space-y-1.5">
                      {group.coordinators.map((name) => (
                        <h3 key={name} className="text-lg font-bold text-foreground group-hover:text-darkAccent transition-colors">
                          {name}
                        </h3>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                    <span>Technical · Event Coordinator</span>
                    <div className="w-2 h-2 rounded-full bg-border group-hover:bg-phoenix-orange transition-colors" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* — Non-Technical — */}
          <ScrollReveal animation="up">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-phoenix-magenta bg-phoenix-magenta/8 border border-phoenix-magenta/20 px-3 py-1 rounded-full">
                NON-TECHNICAL EVENT COORDINATORS
              </span>
              <div className="flex-1 h-[1px] bg-border" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {EVENT_COORDINATORS.filter(g => g.category === 'Non-Technical').map((group, i) => (
              <ScrollReveal key={group.event} animation="up" delay={i * 60}>
                <div className="group relative p-6 rounded-2xl bg-white border border-border hover:border-phoenix-magenta transition-all duration-300 shadow-sm hover:shadow-phoenix-subtle h-full flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-phoenix-magenta to-phoenix-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-phoenix-magenta/8 text-phoenix-magenta border border-phoenix-magenta/20 inline-block mb-4 leading-normal">
                      {group.event}
                    </span>
                    <div className="space-y-1.5">
                      {group.coordinators.map((name) => (
                        <h3 key={name} className="text-lg font-bold text-foreground group-hover:text-darkAccent transition-colors">
                          {name}
                        </h3>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-foreground-muted">
                    <span>Non-Technical · Event Coordinator</span>
                    <div className="w-2 h-2 rounded-full bg-border group-hover:bg-phoenix-magenta transition-colors" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </div>
  </PageTransition>
);
