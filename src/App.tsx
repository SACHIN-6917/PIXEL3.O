import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Public Components & Pages
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AgendaPage } from './pages/AgendaPage';
import { VenuesPage } from './pages/VenuesPage';
import { StaffCoordinatorsPage } from './pages/StaffCoordinatorsPage';
import { StudentCoordinatorsPage } from './pages/StudentCoordinatorsPage';
import { VerificationPassPage } from './pages/VerificationPassPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEOHead } from './components/SEOHead';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

function AppRoutes() {
  const location = useLocation();

  // Public Symposium Website (Preserves existing layout, Phoenix graphic, Navigation, and Footer)
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SEOHead />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"                     element={<HomePage />} />
            <Route path="/about"                element={<AboutPage />} />
            <Route path="/registration"         element={<Navigate to="/" replace />} />
            <Route path="/register"             element={<Navigate to="/" replace />} />
            <Route path="/verify"               element={<VerificationPassPage />} />
            <Route path="/pass"                 element={<VerificationPassPage />} />
            <Route path="/agenda"               element={<AgendaPage />} />
            <Route path="/venues"               element={<VenuesPage />} />
            <Route path="/staff-coordinators"   element={<StaffCoordinatorsPage />} />
            <Route path="/student-coordinators" element={<StudentCoordinatorsPage />} />
            <Route path="/404"                  element={<NotFoundPage />} />
            <Route path="*"                     element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
