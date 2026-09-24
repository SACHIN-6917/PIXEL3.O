import React, { useState } from 'react';
import { CONFIRMED_EVENTS, PixeloEvent } from '../data/pixeloData';
import { ArrowUpRight, MapPin, Clock, Users, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface EventsSectionProps {
  onRegisterEvent: (eventId: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onRegisterEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<PixeloEvent | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  return (
    <section id="events" className="py-24 bg-white border-t border-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <ScrollReveal animation="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-border">
            <div>
              <div className="inline-block text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-3">
                02 / EVENTS
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                EXPLORE THE EVENTS
              </h2>
            </div>
            <div className="mt-4 md:mt-0 text-xs sm:text-sm font-semibold tracking-wider text-foreground-muted uppercase">
              4 CONFIRMED ARENAS · 2 TECHNICAL · 2 NON-TECHNICAL
            </div>
          </div>
        </ScrollReveal>

        {/* Large Editorial Rows */}
        <div className="divide-y divide-border border-b border-border">
          {CONFIRMED_EVENTS.map((event, idx) => {
            const isHovered = hoveredEventId === event.id;
            return (
              <ScrollReveal key={event.id} animation="left" delay={idx * 70}>
                <div
                  onMouseEnter={() => setHoveredEventId(event.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  onClick={() => setSelectedEvent(event)}
                  className={`group cursor-pointer relative py-8 sm:py-10 px-4 sm:px-6 transition-all duration-300 ${isHovered ? 'bg-background-warm/60 -translate-y-0.5' : 'bg-white'}`}
                >
                  {/* Gradient top border on hover */}
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-6 sm:gap-10">
                      <span className={`text-2xl sm:text-3xl md:text-4xl font-mono font-bold tracking-tight transition-colors duration-300 ${isHovered ? 'text-phoenix-orange' : 'text-foreground-muted'}`}>
                        {event.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground group-hover:translate-x-1.5 transition-transform duration-300">
                            {event.name}
                          </h3>
                          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-background-secondary border border-border text-foreground-secondary">
                            {event.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground-muted line-clamp-1 max-w-xl">{event.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-8 pl-12 sm:pl-0">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-foreground-secondary group-hover:text-darkAccent">
                        <MapPin className="w-4 h-4 text-phoenix-red flex-shrink-0" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-wider text-phoenix-orange uppercase hidden sm:inline-block">VIEW RULES</span>
                        <div className="w-10 h-10 rounded-full border border-border group-hover:border-phoenix-orange group-hover:bg-phoenix-orange group-hover:text-white flex items-center justify-center transition-all duration-300">
                          <ArrowUpRight className="w-4 h-4 text-foreground group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkAccent/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-border relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-background-secondary text-foreground-secondary hover:text-darkAccent transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono font-bold text-phoenix-orange">EVENT {selectedEvent.number}</span>
              <span className="text-xs px-2.5 py-0.5 font-bold uppercase rounded-full bg-background-warm border border-border text-foreground-secondary">{selectedEvent.category}</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">{selectedEvent.name}</h3>
            <p className="text-sm sm:text-base text-foreground-secondary mb-6 leading-relaxed">{selectedEvent.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-background-warm/70 border border-border mb-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-phoenix-red flex-shrink-0" />
                <div><div className="text-[10px] text-foreground-muted uppercase font-bold">VENUE</div><div className="font-semibold text-foreground">{selectedEvent.venue}</div></div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-phoenix-orange flex-shrink-0" />
                <div><div className="text-[10px] text-foreground-muted uppercase font-bold">TIMING</div><div className="font-semibold text-foreground">{selectedEvent.timing}</div></div>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-phoenix-magenta flex-shrink-0" />
                <div><div className="text-[10px] text-foreground-muted uppercase font-bold">TEAM SIZE</div><div className="font-semibold text-foreground">{selectedEvent.teamSize}</div></div>
              </div>
            </div>
            <div className="mb-8">
              <h4 className="text-sm font-bold tracking-wider uppercase text-foreground mb-3">RULES & FORMAT</h4>
              <ul className="space-y-2.5">
                {selectedEvent.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground-secondary">
                    <CheckCircle2 className="w-4 h-4 text-phoenix-orange flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border">
              <button onClick={() => setSelectedEvent(null)} className="w-full sm:w-auto px-6 py-3 rounded-full border border-border text-foreground-secondary hover:text-darkAccent text-xs font-bold uppercase tracking-wider transition-colors">CLOSE</button>
              <button onClick={() => { setSelectedEvent(null); onRegisterEvent(selectedEvent.id); }} className="w-full sm:w-auto phoenix-gradient-btn px-8 py-3 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2">
                <span>REGISTER FOR {selectedEvent.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
