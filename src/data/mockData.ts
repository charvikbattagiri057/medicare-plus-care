export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'admin';
  phone?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  profileComplete?: boolean;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  password: string;
  specialization: string;
  experience: number;
  qualification: string;
  phone: string;
  bio: string;
  consultationFee: number;
  availableDays: string[];
  availableHours: string;
  emoji: string;
  rating: number;
  totalPatients: number;
  isActive: boolean;
  role: 'doctor';
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  doctorEmail: string;
  specialization: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Cancelled' | 'Rejected';
  paymentMode: 'online' | 'clinic';
  paymentStatus: 'Paid' | 'Unpaid';
  consultationFee: number;
  notes?: string;
  prescription?: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
const fmt = (d: Date) => d.toISOString().split('T')[0];

export const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Dermatology', 'Orthopedics',
  'Pediatrics', 'General Medicine', 'Ophthalmology', 'Oncology',
  'ENT', 'Psychiatry', 'Urology', 'Gynecology', 'Pulmonology', 'Gastroenterology'
] as const;

export const SPECIALITY_DATA = [
  { name: 'Cardiology', emoji: '❤️', color: 'hsl(0 72% 51% / 0.1)', description: 'Heart and cardiovascular system specialists' },
  { name: 'Neurology', emoji: '🧠', color: 'hsl(262 83% 58% / 0.1)', description: 'Brain and nervous system experts' },
  { name: 'Dermatology', emoji: '✨', color: 'hsl(39 46% 61% / 0.1)', description: 'Skin, hair, and nail care specialists' },
  { name: 'Orthopedics', emoji: '🦴', color: 'hsl(218 32% 15% / 0.1)', description: 'Bone, joint, and muscle specialists' },
  { name: 'Pediatrics', emoji: '👶', color: 'hsl(182 80% 26% / 0.1)', description: 'Child healthcare and development' },
  { name: 'General Medicine', emoji: '🩺', color: 'hsl(142 71% 45% / 0.1)', description: 'Primary care and general health' },
  { name: 'Ophthalmology', emoji: '👁️', color: 'hsl(217 91% 60% / 0.1)', description: 'Eye care and vision specialists' },
  { name: 'Oncology', emoji: '🔬', color: 'hsl(0 72% 51% / 0.1)', description: 'Cancer treatment and research' },
];

export const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];

export const seedUsers: User[] = [
  { id: 'u1', name: 'Admin', email: 'admin@medicare.com', password: 'admin123', role: 'admin', phone: '9999999999', createdAt: '2024-01-01' },
  { id: 'u2', name: 'Rahul Sharma', email: 'rahul@demo.com', password: 'pass123', role: 'patient', phone: '9876543210', age: 32, gender: 'Male', bloodGroup: 'B+', createdAt: '2024-06-15' },
  { id: 'u3', name: 'Priya Nair', email: 'priya@demo.com', password: 'pass123', role: 'patient', phone: '9876543211', age: 28, gender: 'Female', bloodGroup: 'O+', createdAt: '2024-07-20' },
  { id: 'u4', name: 'Arun Kumar', email: 'arun@demo.com', password: 'pass123', role: 'patient', phone: '9876543212', age: 45, gender: 'Male', bloodGroup: 'A+', createdAt: '2024-08-10' },
];

export const seedDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Ananya Krishnan', email: 'ananya@medicare.com', password: 'doc123', specialization: 'Cardiology', experience: 12, qualification: 'MD, DM Cardiology', phone: '9800000001', bio: 'Expert cardiologist with 12 years of experience in interventional cardiology.', consultationFee: 800, availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'], availableHours: '9AM - 2PM', emoji: '👩‍⚕️', rating: 4.8, totalPatients: 2400, isActive: true, role: 'doctor', createdAt: '2023-01-01' },
  { id: 'd2', name: 'Dr. Vikram Nair', email: 'vikram@medicare.com', password: 'doc123', specialization: 'Neurology', experience: 15, qualification: 'MD, DM Neurology', phone: '9800000002', bio: 'Renowned neurologist specializing in movement disorders and epilepsy.', consultationFee: 900, availableDays: ['Monday','Wednesday','Friday'], availableHours: '10AM - 4PM', emoji: '👨‍⚕️', rating: 4.9, totalPatients: 3100, isActive: true, role: 'doctor', createdAt: '2023-01-01' },
  { id: 'd3', name: 'Dr. Sneha Patel', email: 'sneha@medicare.com', password: 'doc123', specialization: 'Dermatology', experience: 8, qualification: 'MD Dermatology', phone: '9800000003', bio: 'Cosmetic and clinical dermatologist with expertise in skin rejuvenation.', consultationFee: 600, availableDays: ['Tuesday','Thursday','Saturday'], availableHours: '11AM - 5PM', emoji: '👩‍⚕️', rating: 4.7, totalPatients: 1800, isActive: true, role: 'doctor', createdAt: '2023-03-01' },
  { id: 'd4', name: 'Dr. Rohan Gupta', email: 'rohan@medicare.com', password: 'doc123', specialization: 'Orthopedics', experience: 10, qualification: 'MS Orthopedics', phone: '9800000004', bio: 'Specialist in joint replacement and sports medicine.', consultationFee: 700, availableDays: ['Monday','Tuesday','Thursday','Friday'], availableHours: '8AM - 1PM', emoji: '👨‍⚕️', rating: 4.6, totalPatients: 2200, isActive: true, role: 'doctor', createdAt: '2023-02-01' },
  { id: 'd5', name: 'Dr. Meera Iyer', email: 'meera@medicare.com', password: 'doc123', specialization: 'Pediatrics', experience: 7, qualification: 'MD Pediatrics', phone: '9800000005', bio: 'Caring pediatrician dedicated to child health and wellness.', consultationFee: 550, availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], availableHours: '9AM - 3PM', emoji: '👩‍⚕️', rating: 4.9, totalPatients: 4200, isActive: true, role: 'doctor', createdAt: '2023-04-01' },
  { id: 'd6', name: 'Dr. Arjun Das', email: 'arjun@medicare.com', password: 'doc123', specialization: 'General Medicine', experience: 5, qualification: 'MBBS, MD', phone: '9800000006', bio: 'General physician focused on preventive care and chronic disease management.', consultationFee: 400, availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], availableHours: '8AM - 6PM', emoji: '👨‍⚕️', rating: 4.5, totalPatients: 5600, isActive: true, role: 'doctor', createdAt: '2023-05-01' },
];

export const seedAppointments: Appointment[] = [
  { id: 'a1', patientId: 'u2', doctorId: 'd1', patientName: 'Rahul Sharma', patientEmail: 'rahul@demo.com', patientPhone: '9876543210', doctorName: 'Dr. Ananya Krishnan', doctorEmail: 'ananya@medicare.com', specialization: 'Cardiology', date: fmt(tomorrow), timeSlot: '10:00 AM', reason: 'Chest pain follow-up', status: 'Approved', paymentMode: 'online', paymentStatus: 'Paid', consultationFee: 800, createdAt: fmt(today) },
  { id: 'a2', patientId: 'u3', doctorId: 'd2', patientName: 'Priya Nair', patientEmail: 'priya@demo.com', patientPhone: '9876543211', doctorName: 'Dr. Vikram Nair', doctorEmail: 'vikram@medicare.com', specialization: 'Neurology', date: fmt(today), timeSlot: '11:00 AM', reason: 'Frequent headaches', status: 'Pending', paymentMode: 'clinic', paymentStatus: 'Unpaid', consultationFee: 900, createdAt: fmt(today) },
  { id: 'a3', patientId: 'u2', doctorId: 'd3', patientName: 'Rahul Sharma', patientEmail: 'rahul@demo.com', patientPhone: '9876543210', doctorName: 'Dr. Sneha Patel', doctorEmail: 'sneha@medicare.com', specialization: 'Dermatology', date: fmt(yesterday), timeSlot: '2:00 PM', reason: 'Skin rash', status: 'Completed', paymentMode: 'online', paymentStatus: 'Paid', consultationFee: 600, notes: 'Allergic dermatitis. Avoid synthetic fabrics.', prescription: 'Tab Cetirizine 10mg - Once daily for 7 days\nCalamine lotion - Apply twice daily\nMometasone cream - Apply on affected area at night', createdAt: fmt(yesterday) },
  { id: 'a4', patientId: 'u4', doctorId: 'd4', patientName: 'Arun Kumar', patientEmail: 'arun@demo.com', patientPhone: '9876543212', doctorName: 'Dr. Rohan Gupta', doctorEmail: 'rohan@medicare.com', specialization: 'Orthopedics', date: fmt(tomorrow), timeSlot: '9:00 AM', reason: 'Knee pain', status: 'Approved', paymentMode: 'online', paymentStatus: 'Paid', consultationFee: 700, createdAt: fmt(today) },
];

export const seedAuditLog: AuditEntry[] = [
  { id: 'al1', timestamp: new Date().toISOString(), action: 'SYSTEM_INIT', details: 'System initialized with seed data' },
];
