import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Public Components & Pages
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { AgendaPage } from './pages/AgendaPage';
import { VenuesPage } from './pages/VenuesPage';
import { StaffCoordinatorsPage } from './pages/StaffCoordinatorsPage';
import { StudentCoordinatorsPage } from './pages/StudentCoordinatorsPage';

// Admin System
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { AdminProtectedRoute } from './admin/AdminProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { AdminRegistrationsPage } from './admin/pages/AdminRegistrationsPage';
import { AdminParticipantsPage } from './admin/pages/AdminParticipantsPage';
import { AdminPaymentsPage } from './admin/pages/AdminPaymentsPage';
import { AdminEventsPage } from './admin/pages/AdminEventsPage';
import { AdminAnalyticsPage } from './admin/pages/AdminAnalyticsPage';
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage';

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');

  // Global Shortcut: Ctrl + F1 opens Admin Portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'F1' || e.code === 'F1')) {
        e.preventDefault();
        navigate('/admin/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // If navigating through Admin routes, render dedicated admin container
  if (isAdmin) {
    return (
      <Routes>
        {/* Unprotected Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes within AdminLayout */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="registrations" element={<AdminRegistrationsPage />} />
          <Route path="participants" element={<AdminParticipantsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  // Public Symposium Website (Preserves existing layout, Phoenix, Navigation, and Footer)
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
            <Route path="*"                     element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AppRoutes />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
