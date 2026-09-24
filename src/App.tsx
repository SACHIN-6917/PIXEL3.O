import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { AgendaPage } from './pages/AgendaPage';
import { VenuesPage } from './pages/VenuesPage';
import { StaffCoordinatorsPage } from './pages/StaffCoordinatorsPage';
import { StudentCoordinatorsPage } from './pages/StudentCoordinatorsPage';

function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"                     element={<HomePage />} />
            <Route path="/about"                element={<AboutPage />} />
            <Route path="/registration"         element={<RegistrationPage />} />
            <Route path="/agenda"               element={<AgendaPage />} />
            <Route path="/venues"               element={<VenuesPage />} />
            <Route path="/staff-coordinators"   element={<StaffCoordinatorsPage />} />
            <Route path="/student-coordinators" element={<StudentCoordinatorsPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {/* Footer only on non-hero pages for cleaner look, always shown */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
