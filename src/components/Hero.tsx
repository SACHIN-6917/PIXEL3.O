import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoenixHeroGraphic } from './PhoenixHeroGraphic';
import { ArrowDown, ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { EVENT_DATE_STRING, REPORTING_TIME } from '../data/pixeloData';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-black">
      <PhoenixHeroGraphic />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center items-center">
        {/* Institutional Badge */}
        <div className="mb-6 inline-flex flex-col items-center space-y-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm text-[11px] sm:text-xs font-semibold tracking-wider text-white/90 uppercase">
            <span className="w-2 h-2 rounded-full bg-phoenix-orange animate-pulse" />
            <span>ADHIPARASAKTHI ENGINEERING COLLEGE</span>
          </div>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-white/70">
            DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
          </p>
          <p className="text-[11px] sm:text-xs text-white/50 tracking-wider">
            IN ASSOCIATION WITH COMPUTER SOCIETY OF INDIA – KANCHIPURAM CHAPTER
          </p>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white select-none leading-none mb-3 drop-shadow-2xl">
          <span>PIXELO</span>{' '}
          <span className="bg-gradient-to-r from-phoenix-orange via-phoenix-red to-phoenix-magenta bg-clip-text text-transparent">3.O</span>
        </h1>

        <h2 className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] text-white/70 uppercase mb-4">
          A NATIONAL LEVEL TECHNICAL SYMPOSIUM
        </h2>

        <div className="mb-8">
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2 drop-shadow-lg">
            <span className="text-white">IGNITE.</span>
            <span className="text-phoenix-orange">INNOVATE.</span>
            <span className="text-phoenix-gold">INSPIRE.</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/20 backdrop-blur-sm rounded-xl shadow-sm text-white/90">
            <Calendar className="w-4 h-4 text-phoenix-orange" />
            <span className="font-semibold">{EVENT_DATE_STRING}</span>
            <span className="text-white/60">· {REPORTING_TIME} ONWARDS</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/20 backdrop-blur-sm rounded-xl shadow-sm text-white/90">
            <MapPin className="w-4 h-4 text-phoenix-red" />
            <span className="font-semibold">ADHIPARASAKTHI ENGINEERING COLLEGE</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/registration')}
            className="w-full sm:w-auto phoenix-gradient-btn px-9 py-4 rounded-full text-white text-sm sm:text-base font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-phoenix-glow group cursor-pointer"
          >
            <span>REGISTER NOW</span>
            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </button>
          <button
            onClick={() => navigate('/about')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 text-white border border-white/30 hover:border-phoenix-orange hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base font-bold tracking-wider uppercase shadow-sm cursor-pointer"
          >
            EXPLORE EVENTS
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center pt-8">
        <a href="#intro" className="group flex flex-col items-center gap-2 text-white/50 hover:text-phoenix-orange transition-colors duration-300">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">SCROLL TO EXPLORE</span>
          <div className="w-8 h-8 rounded-full border border-white/20 group-hover:border-phoenix-orange flex items-center justify-center transition-colors">
            <ArrowDown className="w-4 h-4 group-hover:text-phoenix-orange animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
};
