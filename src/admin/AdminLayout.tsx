import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCheck,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  Clock
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

const NAV_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/registrations', label: 'Registrations', icon: Users },
  { to: '/admin/participants', label: 'Unique Participants', icon: UserCheck },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/events', label: 'Events & Quotas', icon: CalendarDays },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] flex font-sans">
      {/* ─── DESKTOP / TABLET SIDEBAR ─── */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#E5E7EB] bg-white transition-all duration-300 z-30 shrink-0 sticky top-0 h-screen ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E7EB]">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6A00] to-[#E51B23] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                P
              </div>
              <div className="truncate">
                <span className="font-extrabold text-sm tracking-wider uppercase block text-[#171717]">
                  PIXEL-3.O
                </span>
                <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase block">
                  ADMIN PORTAL
                </span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6A00] to-[#E51B23] flex items-center justify-center text-white font-bold text-sm mx-auto shadow-sm">
              P
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#FF6A00]/10 text-[#FF6A00] font-extrabold shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile & footer */}
        <div className="p-3 border-t border-[#E5E7EB] bg-gray-50/50">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-2 py-1.5">
                <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0">
                  <Shield className="w-4 h-4 text-[#FF6A00]" />
                </div>
                <div className="truncate flex-1">
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {adminUser?.username || 'Admin'}
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium">
                    {adminUser?.role || 'Super Admin'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── MOBILE SIDEBAR ─── */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6A00] to-[#E51B23] flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider uppercase block text-[#171717]">
                PIXEL-3.O
              </span>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase block">
                ADMIN PORTAL
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#FF6A00]/10 text-[#FF6A00] font-extrabold shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Event Date: 14 October 2026</span>
              <span className="text-gray-300">·</span>
              <span className="text-[#FF6A00] font-semibold">Symposium Management</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-gray-500">System Live</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
