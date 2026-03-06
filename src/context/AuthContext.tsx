import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Doctor } from '@/data/mockData';
import { getAuth, clearAuth, getUsers, getDoctors, AuthState } from '@/lib/store';

interface AuthCtx {
  auth: AuthState | null;
  user: User | null;
  doctor: Doctor | null;
  refresh: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({ auth: null, user: null, doctor: null, refresh: () => {}, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuthState] = useState<AuthState | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const refresh = () => {
    const a = getAuth();
    setAuthState(a);
    if (a?.role === 'doctor') {
      setDoctor(getDoctors().find(d => d.id === a.userId) || null);
      setUser(null);
    } else if (a) {
      setUser(getUsers().find(u => u.id === a.userId) || null);
      setDoctor(null);
    } else {
      setUser(null);
      setDoctor(null);
    }
  };

  const logout = () => { clearAuth(); setAuthState(null); setUser(null); setDoctor(null); };

  useEffect(() => { refresh(); }, []);

  return <AuthContext.Provider value={{ auth, user, doctor, refresh, logout }}>{children}</AuthContext.Provider>;
};
