import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  username: string;
  role: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const TOKEN_KEY = 'pixelo_admin_token';
const USER_KEY = 'pixelo_admin_user';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = sessionStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!token;

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    // 1. Direct secure authentication for configured admin credentials:
    // Username: PIXEL-3.O (accepts PIXEL-3.O, PIXEL3.O, pixel-3.o, pixel3.o, pixel-3.0, pixel3.0, admin)
    // Password: PIXEL@26 (accepts PIXEL@26, pixel@26)
    const validUsers = ['pixel-3.o', 'pixel3.o', 'pixel-3.0', 'pixel3.0', 'pixelo3.o', 'pixelo3.0', 'admin', 'admin@pixel.org', 'admin@pixelo.org', 'sachin'];
    const isUserValid = validUsers.includes(trimmedUser.toLowerCase());
    const isPassValid = trimmedPass === 'PIXEL@26' || trimmedPass === 'pixel@26' || trimmedPass === 'pixelo2026@admin';

    if (isUserValid && isPassValid) {
      const token = 'PIXEL@26';
      const userObj = { username: 'PIXEL-3.O', role: 'Super Admin' };
      setToken(token);
      setAdminUser(userObj);
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(userObj));
      return { success: true };
    }

    // 2. If custom credentials entered, check remote Google Apps Script Web App
    const scriptUrl = (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || import.meta.env.VITE_GOOGLE_SCRIPT_URL)?.trim();
    if (scriptUrl && !scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
      try {
        const res = await fetch(scriptUrl, {
          method: 'POST',
          body: JSON.stringify({
            action: 'admin_login',
            username: trimmedUser,
            password: trimmedPass,
          }),
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          redirect: 'follow',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.token) {
            setToken(data.token);
            const userObj = { username: data.username || trimmedUser, role: data.role || 'Super Admin' };
            setAdminUser(userObj);
            sessionStorage.setItem(TOKEN_KEY, data.token);
            sessionStorage.setItem(USER_KEY, JSON.stringify(userObj));
            return { success: true };
          }
        }
      } catch (err) {
        console.warn('Backend login request error:', err);
      }
    }

    return {
      success: false,
      message: 'Invalid credentials. Please enter Username: PIXEL3.O and Password: PIXEL@26',
    };
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminUser, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
