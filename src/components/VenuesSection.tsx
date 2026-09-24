import React, { useState } from 'react';
import { VENUES_DATA } from '../data/pixeloData';
import { MapPin, Navigation, Compass, Layers, Check } from 'lucide-react';

export const VenuesSection: React.FC = () => {
  const [activeVenue, setActiveVenue] = useState<string>('PAPERQUEST');

  return (
    <section id="venues" className="py-24 bg-white border-t border-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-border">
          <div>
            <div className="inline-block text-xs font-bold tracking-[0.25em] text-phoenix-orange uppercase mb-3">
              04 / VENUES
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              FIND YOUR VENUE
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-xs sm:text-sm font-semibold text-foreground-muted flex items-center gap-2">
            <Compass className="w-4 h-4 text-phoenix-red" />
            <span>CAMPUS VENUE DIRECTORY</span>
          </div>
        </div>

        {/* Interactive Grid: Selector List on Left, Active Venue Showcase on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Venue Selector Cards */}
          <div className="lg:col-span-6 space-y-6">
            {VENUES_DATA.map((sessionGroup) => (
              <div key={sessionGroup.session} className="space-y-3">
                <h3 className="text-xs font-bold tracking-widest uppercase text-foreground-muted">
                  {sessionGroup.session}
                </h3>

                <div className="space-y-3">
                  {sessionGroup.venues.map((v) => {
                    const isSelected = activeVenue === v.eventName;

                    return (
                      <button
                        key={v.eventName}
                        onClick={() => setActiveVenue(v.eventName)}
                        className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                          isSelected
                            ? 'bg-background-warm border-phoenix-orange shadow-phoenix-subtle ring-1 ring-phoenix-orange/40'
                            : 'bg-white border-border hover:border-border/80 hover:bg-background-secondary/40'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-phoenix-orange text-white'
                                : 'bg-background-secondary text-foreground-secondary'
                            }`}
                          >
                            <MapPin className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                {v.eventName}
                              </span>
                              <span className="text-[10px] uppercase font-semibold text-foreground-muted">
                                ({v.category})
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-foreground-secondary">
                              {v.venueName}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-phoenix-orange/10 flex items-center justify-center text-phoenix-orange">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Venue Spotlight Preview */}
          <div className="lg:col-span-6 sticky top-28">
            {(() => {
              const allVenues = VENUES_DATA.flatMap((s) => s.venues);
              const current = allVenues.find((v) => v.eventName === activeVenue) || allVenues[0];

              return (
                <div className="p-8 rounded-3xl bg-background-warm/70 border border-border shadow-sm relative overflow-hidden">
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-phoenix-orange/15 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white border border-border text-phoenix-orange">
                      <Navigation className="w-3.5 h-3.5" />
                      ACTIVE SPOTLIGHT
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground-muted">
                      {current.category}
                    </span>
                  </div>

                  <h3 className="text-3xl font-extrabold tracking-tight text-foreground mb-1">
                    {current.eventName}
                  </h3>
                  <p className="text-xl font-semibold text-phoenix-red mb-6">
                    {current.venueName}
                  </p>

                  <div className="space-y-4 pt-6 border-t border-border/80">
                    <div className="flex items-start gap-3">
                      <Layers className="w-4 h-4 text-phoenix-orange mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold tracking-wider uppercase text-foreground-muted">
                          FLOOR & LOCATION
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {current.floor}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Compass className="w-4 h-4 text-phoenix-magenta mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold tracking-wider uppercase text-foreground-muted">
                          FACILITY & CAPACITY
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {current.capacity}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 rounded-xl bg-white border border-border text-xs text-foreground-secondary leading-relaxed">
                    Volunteer student guides and directional signage with Phoenix arrows will be stationed at the main foyer to escort participants.
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};
