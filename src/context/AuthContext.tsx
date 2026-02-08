import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Role, ThemeMode } from '../types';
import type { Language } from '../i18n';
import { users as defaultUsers } from '../data';

interface AuthContextType {
  user: User | null;
  theme: ThemeMode;
  language: Language;
  login: (email: string, password: string) => boolean;
  loginAs: (role: Role) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  canAccess: (requiredRoles: Role[]) => boolean;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('theme') as ThemeMode) || 'light';
    } catch { return 'light'; }
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return (localStorage.getItem('language') as Language) || 'ru';
    } catch { return 'ru'; }
  });

  useEffect(() => {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    else localStorage.removeItem('currentUser');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const getAllUsers = (): User[] => {
    try {
      const stored = localStorage.getItem('allUsers');
      return stored ? JSON.parse(stored) : defaultUsers;
    } catch { return defaultUsers; }
  };

  const login = (email: string, _password: string): boolean => {
    const allUsers = getAllUsers();
    const found = allUsers.find((u: User) => u.email === email && u.approved);
    if (found) { setUser(found); return true; }
    return false;
  };

  const loginAs = (role: Role) => {
    const allUsers = getAllUsers();
    const found = allUsers.find((u: User) => u.role === role && u.approved);
    if (found) setUser(found);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasRole = (role: Role) => user?.role === role;
  const canAccess = (requiredRoles: Role[]) => user ? requiredRoles.includes(user.role) : false;
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const setLanguage = (lang: Language) => setLanguageState(lang);

  const updateProfile = (updates: Partial<User>) => {
    if (user) setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, theme, language, login, loginAs, logout, hasRole, canAccess, toggleTheme, setLanguage, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
