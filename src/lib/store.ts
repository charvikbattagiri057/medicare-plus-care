import { User, Doctor, Appointment, AuditEntry, seedUsers, seedDoctors, seedAppointments, seedAuditLog } from '@/data/mockData';

const KEYS = {
  users: 'mc_users',
  doctors: 'mc_doctors',
  appointments: 'mc_appointments',
  audit: 'mc_audit',
  auth: 'mc_auth',
};

function get<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) { localStorage.setItem(key, JSON.stringify(seed)); return seed; }
  return JSON.parse(raw);
}

function set<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Users
export const getUsers = () => get<User>(KEYS.users, seedUsers);
export const addUser = (u: User) => { const all = getUsers(); all.push(u); set(KEYS.users, all); };
export const updateUser = (id: string, data: Partial<User>) => {
  const all = getUsers().map(u => u.id === id ? { ...u, ...data } : u);
  set(KEYS.users, all);
};

// Doctors
export const getDoctors = () => get<Doctor>(KEYS.doctors, seedDoctors);
export const addDoctor = (d: Doctor) => { const all = getDoctors(); all.push(d); set(KEYS.doctors, all); };
export const updateDoctor = (id: string, data: Partial<Doctor>) => {
  const all = getDoctors().map(d => d.id === id ? { ...d, ...data } : d);
  set(KEYS.doctors, all);
};
export const deleteDoctor = (id: string) => {
  set(KEYS.doctors, getDoctors().filter(d => d.id !== id));
};

// Appointments
export const getAppointments = () => get<Appointment>(KEYS.appointments, seedAppointments);
export const addAppointment = (a: Appointment) => { const all = getAppointments(); all.push(a); set(KEYS.appointments, all); };
export const updateAppointment = (id: string, data: Partial<Appointment>) => {
  const all = getAppointments().map(a => a.id === id ? { ...a, ...data } : a);
  set(KEYS.appointments, all);
};
export const deleteAppointment = (id: string) => {
  set(KEYS.appointments, getAppointments().filter(a => a.id !== id));
};

export const hasSlotConflict = (doctorId: string, date: string, timeSlot: string, excludeId?: string) => {
  return getAppointments().some(a =>
    a.doctorId === doctorId && a.date === date && a.timeSlot === timeSlot &&
    !['Cancelled', 'Rejected'].includes(a.status) && a.id !== excludeId
  );
};

// Audit
export const getAuditLog = () => get<AuditEntry>(KEYS.audit, seedAuditLog);
export const addAuditEntry = (action: string, details: string) => {
  const all = getAuditLog();
  all.unshift({ id: `al${Date.now()}`, timestamp: new Date().toISOString(), action, details });
  set(KEYS.audit, all);
};

// Auth
export interface AuthState {
  userId: string;
  role: 'patient' | 'admin' | 'doctor';
  token: string;
}

export const getAuth = (): AuthState | null => {
  const raw = localStorage.getItem(KEYS.auth);
  return raw ? JSON.parse(raw) : null;
};

export const setAuth = (auth: AuthState) => localStorage.setItem(KEYS.auth, JSON.stringify(auth));
export const clearAuth = () => localStorage.removeItem(KEYS.auth);

export const loginPatient = (email: string, password: string): { user: User; auth: AuthState } | null => {
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) return null;
  const auth: AuthState = { userId: user.id, role: user.role, token: `tok_${Date.now()}` };
  setAuth(auth);
  addAuditEntry('LOGIN', `${user.role} ${user.name} logged in`);
  return { user, auth };
};

export const loginDoctor = (email: string, password: string): { doctor: Doctor; auth: AuthState } | null => {
  const doc = getDoctors().find(d => d.email === email && d.password === password);
  if (!doc) return null;
  const auth: AuthState = { userId: doc.id, role: 'doctor', token: `tok_${Date.now()}` };
  setAuth(auth);
  addAuditEntry('DOCTOR_LOGIN', `Dr. ${doc.name} logged in`);
  return { doctor: doc, auth };
};

export const resetStore = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
};
