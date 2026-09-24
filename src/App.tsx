import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CountdownSection } from './components/CountdownSection';
import { AboutSection } from './components/AboutSection';
import { EventsSection } from './components/EventsSection';
import { AgendaSection } from './components/AgendaSection';
import { VenuesSection } from './components/VenuesSection';
import { ExperienceSection } from './components/ExperienceSection';
import { StaffCoordinatorsSection } from './components/StaffCoordinatorsSection';
import { StudentCoordinatorsSection } from './components/StudentCoordinatorsSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';

export const App: React.FC = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedEventForReg, setSelectedEventForReg] = useState<string | undefined>(undefined);
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

  const handleOpenRegistration = (eventId?: string) => {
    setSelectedEventForReg(eventId);
    setIsRegistrationOpen(true);
  };

  const handleScrollToEvents = () => {
    const eventsElem = document.getElementById('events');
    if (eventsElem) {
      eventsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-phoenix-orange/20 selection:text-phoenix-red">
      {/* Sticky Navbar */}
      <Navbar onRegisterClick={() => handleOpenRegistration()} />

      <main className="flex-1">
        {/* 100vh Hero Section with Phoenix Background */}
        <Hero
          onRegisterClick={() => handleOpenRegistration()}
          onExploreEventsClick={handleScrollToEvents}
        />

        {/* Live Registration Countdown */}
        <CountdownSection
          onRegisterClick={() => handleOpenRegistration()}
          isClosed={isRegistrationClosed}
          setIsClosed={setIsRegistrationClosed}
        />

        {/* 01 / About Section & What Awaits You */}
        <AboutSection />

        {/* 02 / Confirmed 4 Events Section */}
        <EventsSection
          onRegisterEvent={(eventId) => handleOpenRegistration(eventId)}
        />

        {/* 03 / Symposium Agenda Timeline */}
        <AgendaSection />

        {/* 04 / Interactive Venues Guide */}
        <VenuesSection />

        {/* Participant Perks & Experience */}
        <ExperienceSection />

        {/* 05 / Staff Coordinators & Leadership */}
        <StaffCoordinatorsSection />

        {/* 06 / Student Coordinators */}
        <StudentCoordinatorsSection />

        {/* Warm White Final CTA */}
        <FinalCTASection
          onRegisterClick={() => handleOpenRegistration()}
          isClosed={isRegistrationClosed}
        />
      </main>

      {/* Compact Dark Footer */}
      <Footer onRegisterClick={() => handleOpenRegistration()} />

      {/* Global Interactive Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        preSelectedEventId={selectedEventForReg}
        isClosed={isRegistrationClosed}
      />
    </div>
  );
};

export default App;
