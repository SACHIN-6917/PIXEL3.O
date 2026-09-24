import React from 'react';
import { PhoenixHeroGraphic } from './PhoenixHeroGraphic';
import { ArrowDown, ArrowUpRight, Calendar, MapPin, Sparkles } from 'lucide-react';
import { EVENT_DATE_STRING, REPORTING_TIME, VENUE_COLLEGE } from '../data/pixeloData';

interface HeroProps {
  onRegisterClick: () => void;
  onExploreEventsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick, onExploreEventsClick }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-gradient-to-b from-background via-background-warm to-background"
    >
      {/* Background Phoenix and Ember layer */}
      <PhoenixHeroGraphic />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center items-center">
        {/* Institutional Affiliation Badge */}
        <div className="mb-6 inline-flex flex-col items-center space-y-1 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-border shadow-sm text-[11px] sm:text-xs font-semibold tracking-wider text-foreground-secondary uppercase">
            <span className="w-2 h-2 rounded-full bg-phoenix-orange animate-pulse" />
            <span>ADHIPARASAKTHI ENGINEERING COLLEGE</span>
          </div>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-foreground-secondary">
            DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
          </p>
          <p className="text-[11px] sm:text-xs text-foreground-muted tracking-wider">
            IN ASSOCIATION WITH COMPUTER SOCIETY OF INDIA – KANCHIPURAM CHAPTER
          </p>
        </div>

        {/* Main Title: PIXELO 3.O */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground select-none leading-none mb-3">
          <span>PIXELO</span>{' '}
          <span className="bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta bg-clip-text text-transparent drop-shadow-sm">
            3.O
          </span>
        </h1>

        {/* Supporting Title */}
        <h2 className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] text-foreground-secondary uppercase mb-4">
          A NATIONAL LEVEL TECHNICAL SYMPOSIUM
        </h2>

        {/* Tagline */}
        <div className="mb-8">
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-darkAccent flex items-center justify-center gap-2">
            <span>IGNITE.</span>
            <span className="text-phoenix-orange">INNOVATE.</span>
            <span className="text-phoenix-red">INSPIRE.</span>
          </p>
        </div>

        {/* Event Key Meta Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 text-xs sm:text-sm font-medium text-foreground-secondary">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-border rounded-xl shadow-sm">
            <Calendar className="w-4 h-4 text-phoenix-orange" />
            <span className="font-semibold text-foreground">{EVENT_DATE_STRING}</span>
            <span className="text-foreground-muted">· {REPORTING_TIME} ONWARDS</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-border rounded-xl shadow-sm">
            <MapPin className="w-4 h-4 text-phoenix-red" />
            <span className="font-semibold text-foreground">ADHIPARASAKTHI ENGINEERING COLLEGE</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onRegisterClick}
            className="w-full sm:w-auto phoenix-gradient-btn px-9 py-4 rounded-full text-white text-sm sm:text-base font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-phoenix-glow group cursor-pointer"
          >
            <span>REGISTER NOW</span>
            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </button>

          <button
            onClick={onExploreEventsClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-darkAccent border border-border hover:border-phoenix-orange hover:text-phoenix-orange transition-all duration-300 text-sm sm:text-base font-bold tracking-wider uppercase shadow-sm cursor-pointer"
          >
            EXPLORE EVENTS
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-8">
        <a
          href="#about"
          className="group flex flex-col items-center gap-2 text-foreground-muted hover:text-phoenix-orange transition-colors duration-300"
        >
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">
            SCROLL TO EXPLORE
          </span>
          <div className="w-8 h-8 rounded-full border border-border group-hover:border-phoenix-orange flex items-center justify-center transition-colors">
            <ArrowDown className="w-4 h-4 text-foreground-secondary group-hover:text-phoenix-orange animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
};
