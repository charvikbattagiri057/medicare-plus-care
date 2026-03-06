import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAppointments, getDoctors, addAppointment, updateAppointment, updateUser, hasSlotConflict, addAuditEntry } from '@/lib/store';
import { SPECIALITY_DATA, TIME_SLOTS } from '@/data/mockData';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LayoutDashboard, CalendarPlus, Calendar, User, LogOut, Stethoscope, ShieldCheck } from 'lucide-react';

const PatientDashboard = () => {
  const { auth, user, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') || 'overview');
  const [showPayment, setShowPayment] = useState<string | null>(null);
  const [showRx, setShowRx] = useState<string | null>(null);

  if (!auth || !user) { navigate('/login'); return null; }

  const appointments = getAppointments().filter(a => a.patientId === user.id);
  const doctors = getDoctors().filter(d => d.isActive);
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'Pending').length,
    approved: appointments.filter(a => a.status === 'Approved').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  const sideLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'book', label: 'Book Appointment', icon: CalendarPlus },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-secondary text-secondary-foreground flex-col shrink-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className="text-primary text-lg">✚</span>
            <span className="font-heading text-lg font-bold">MediCare Plus</span>
          </Link>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center text-sm font-bold text-primary-foreground">{initials}</div>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-secondary-foreground/50 capitalize">{user.role}</p>
            </div>
          </div>
          <nav className="sidebar-nav">
            {sideLinks.map(l => (
              <button key={l.id} onClick={() => setTab(l.id)} className={`sidebar-link w-full text-left ${tab === l.id ? 'sidebar-link-active' : ''}`}>
                <l.icon size={18} />{l.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-2">
          <Link to="/admin-login" className="sidebar-link text-xs"><ShieldCheck size={16} />Admin Portal</Link>
          <Link to="/doctor-login" className="sidebar-link text-xs"><Stethoscope size={16} />Doctor Portal</Link>
          <button onClick={() => { logout(); navigate('/'); }} className="sidebar-link text-xs text-destructive w-full text-left"><LogOut size={16} />Logout</button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 flex">
        {sideLinks.map(l => (
          <button key={l.id} onClick={() => setTab(l.id)} className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs ${tab === l.id ? 'text-primary' : 'text-muted-foreground'}`}>
            <l.icon size={18} />{l.label.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
        {tab === 'overview' && <OverviewTab stats={stats} appointments={appointments} setTab={setTab} />}
        {tab === 'book' && <BookTab user={user} doctors={doctors} refresh={refresh} />}
        {tab === 'appointments' && <AppointmentsTab appointments={appointments} setShowPayment={setShowPayment} setShowRx={setShowRx} />}
        {tab === 'profile' && <ProfileTab user={user} refresh={refresh} />}
      </main>

      {/* Payment Modal */}
      {showPayment && <PaymentModal appointmentId={showPayment} onClose={() => { setShowPayment(null); refresh(); }} />}
      {showRx && <RxModal appointmentId={showRx} onClose={() => setShowRx(null)} />}
    </div>
  );
};

const OverviewTab = ({ stats, appointments, setTab }: any) => (
  <div>
    <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Dashboard Overview</h1>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Total', value: stats.total, color: 'text-primary' },
        { label: 'Pending', value: stats.pending, color: 'text-warning' },
        { label: 'Approved', value: stats.approved, color: 'text-success' },
        { label: 'Completed', value: stats.completed, color: 'text-info' },
      ].map(s => (
        <div key={s.label} className="stat-card">
          <p className="text-sm text-muted-foreground">{s.label}</p>
          <p className={`text-3xl font-heading font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
    <div className="table-container">
      <div className="p-4 border-b border-border/50 flex justify-between items-center">
        <h3 className="font-heading text-lg font-semibold">Recent Appointments</h3>
        <button onClick={() => setTab('appointments')} className="text-sm text-primary hover:underline">View All</button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border/50 text-left text-muted-foreground">
          <th className="p-3">Doctor</th><th className="p-3">Date</th><th className="p-3">Status</th>
        </tr></thead>
        <tbody>
          {appointments.slice(0, 5).map((a: any) => (
            <tr key={a.id} className="border-b border-border/30">
              <td className="p-3 font-medium text-foreground">{a.doctorName}</td>
              <td className="p-3 text-muted-foreground">{a.date}</td>
              <td className="p-3"><span className={`badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
            </tr>
          ))}
          {appointments.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">📋 No appointments yet</td></tr>}
        </tbody>
      </table>
    </div>
  </div>
);

const BookTab = ({ user, doctors, refresh }: any) => {
  const [spec, setSpec] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [payMode, setPayMode] = useState<'online' | 'clinic'>('clinic');

  const filteredDocs = spec ? doctors.filter((d: any) => d.specialization === spec) : doctors;
  const selectedDoc = doctors.find((d: any) => d.id === doctorId);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) { toast.error('Please select a doctor'); return; }
    if (hasSlotConflict(doctorId, date, time)) { toast.error('This time slot is already booked!'); return; }
    const apt = {
      id: `a${Date.now()}`, patientId: user.id, doctorId,
      patientName: user.name, patientEmail: user.email, patientPhone: user.phone || '',
      doctorName: selectedDoc.name, doctorEmail: selectedDoc.email, specialization: selectedDoc.specialization,
      date, timeSlot: time, reason, status: 'Pending' as const,
      paymentMode: payMode, paymentStatus: 'Unpaid' as const,
      consultationFee: selectedDoc.consultationFee, createdAt: new Date().toISOString().split('T')[0],
    };
    addAppointment(apt);
    addAuditEntry('BOOKING', `${user.name} booked with ${selectedDoc.name} on ${date}`);
    toast.success('Appointment booked successfully!');
    refresh();
    setSpec(''); setDoctorId(''); setDate(''); setTime(''); setReason('');
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Book Appointment</h1>
      <form onSubmit={handleBook} className="max-w-2xl space-y-4">
        <select className="select-field" value={spec} onChange={e => { setSpec(e.target.value); setDoctorId(''); }}>
          <option value="">Select Speciality</option>
          {SPECIALITY_DATA.map(s => <option key={s.name} value={s.name}>{s.emoji} {s.name}</option>)}
        </select>
        <select className="select-field" value={doctorId} onChange={e => setDoctorId(e.target.value)} required>
          <option value="">Select Doctor</option>
          {filteredDocs.map((d: any) => <option key={d.id} value={d.id}>{d.name} — ₹{d.consultationFee}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input className="input-field" type="date" required value={date} onChange={e => setDate(e.target.value)} />
          <select className="select-field" value={time} onChange={e => setTime(e.target.value)} required>
            <option value="">Time Slot</option>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <textarea className="input-field min-h-[100px]" placeholder="Reason for visit..." value={reason} onChange={e => setReason(e.target.value)} required />

        {selectedDoc && (
          <div className="gradient-teal rounded-card p-6 text-primary-foreground">
            <p className="text-sm opacity-80">Consultation Fee</p>
            <p className="text-2xl font-heading font-bold">₹{selectedDoc.consultationFee}</p>
            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={payMode === 'online'} onChange={() => setPayMode('online')} className="accent-gold" />
                <span className="text-sm">Pay Online</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={payMode === 'clinic'} onChange={() => setPayMode('clinic')} className="accent-gold" />
                <span className="text-sm">Pay at Clinic</span>
              </label>
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary w-full">Confirm Booking</button>
      </form>
    </div>
  );
};

const AppointmentsTab = ({ appointments, setShowPayment, setShowRx }: any) => (
  <div>
    <h1 className="font-heading text-2xl font-bold text-foreground mb-6">My Appointments</h1>
    <div className="table-container">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border/50 text-left text-muted-foreground">
          <th className="p-3">Doctor</th><th className="p-3 hidden sm:table-cell">Speciality</th><th className="p-3">Date</th><th className="p-3 hidden sm:table-cell">Time</th><th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3">Action</th>
        </tr></thead>
        <tbody>
          {appointments.map((a: any) => (
            <tr key={a.id} className="border-b border-border/30">
              <td className="p-3 font-medium text-foreground">{a.doctorName}</td>
              <td className="p-3 hidden sm:table-cell text-muted-foreground">{a.specialization}</td>
              <td className="p-3 text-muted-foreground">{a.date}</td>
              <td className="p-3 hidden sm:table-cell text-muted-foreground">{a.timeSlot}</td>
              <td className="p-3"><span className={`badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
              <td className="p-3"><span className={`badge-${a.paymentStatus.toLowerCase()}`}>{a.paymentStatus}</span></td>
              <td className="p-3 space-x-2">
                {a.paymentStatus === 'Unpaid' && a.status !== 'Cancelled' && (
                  <button onClick={() => setShowPayment(a.id)} className="text-xs btn-primary py-1 px-2">Pay</button>
                )}
                {a.status === 'Completed' && a.prescription && (
                  <button onClick={() => setShowRx(a.id)} className="text-xs btn-outline py-1 px-2">View Rx</button>
                )}
              </td>
            </tr>
          ))}
          {appointments.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">📋 No appointments yet</td></tr>}
        </tbody>
      </table>
    </div>
  </div>
);

const ProfileTab = ({ user, refresh }: any) => {
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', age: user.age?.toString() || '', gender: user.gender || '', bloodGroup: user.bloodGroup || '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, { ...form, age: parseInt(form.age) || undefined });
    refresh();
    toast.success('Profile updated!');
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">My Profile</h1>
      <form onSubmit={handleSave} className="max-w-lg space-y-4">
        <input className="input-field" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="input-field" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <div className="grid grid-cols-3 gap-4">
          <input className="input-field" placeholder="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
          <select className="select-field" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
            <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
          <select className="select-field" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
            <option value="">Blood Group</option>
            {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
};

const PaymentModal = ({ appointmentId, onClose }: { appointmentId: string; onClose: () => void }) => {
  const [card, setCard] = useState('');
  const apt = getAppointments().find(a => a.id === appointmentId);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppointment(appointmentId, { paymentStatus: 'Paid', paymentMode: 'online' });
    addAuditEntry('PAYMENT', `Payment received for appointment ${appointmentId}`);
    toast.success('Payment successful!');
    onClose();
  };

  const formatCard = (v: string) => v.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-card p-8 w-full max-w-md shadow-elevated" onClick={e => e.stopPropagation()}>
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Payment</h2>
        {apt && <p className="text-sm text-muted-foreground mb-6">Consultation Fee: <span className="font-bold text-primary">₹{apt.consultationFee}</span></p>}
        <form onSubmit={handlePay} className="space-y-4">
          <input className="input-field" placeholder="Card Number" required value={card} onChange={e => setCard(formatCard(e.target.value))} />
          <div className="grid grid-cols-2 gap-4">
            <input className="input-field" placeholder="MM/YY" required maxLength={5} />
            <input className="input-field" placeholder="CVV" required maxLength={3} type="password" />
          </div>
          <input className="input-field" placeholder="Name on Card" required />
          <button type="submit" className="w-full btn-gold">Pay ₹{apt?.consultationFee}</button>
        </form>
      </div>
    </div>
  );
};

const RxModal = ({ appointmentId, onClose }: { appointmentId: string; onClose: () => void }) => {
  const apt = getAppointments().find(a => a.id === appointmentId);
  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-card p-8 w-full max-w-md shadow-elevated" onClick={e => e.stopPropagation()}>
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">Prescription</h2>
        {apt && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-btn">
              <p className="text-xs text-muted-foreground">Doctor</p>
              <p className="font-semibold text-foreground">{apt.doctorName}</p>
            </div>
            {apt.notes && <div><p className="text-xs text-muted-foreground mb-1">Diagnosis</p><p className="text-sm text-foreground">{apt.notes}</p></div>}
            {apt.prescription && <div><p className="text-xs text-muted-foreground mb-1">Prescription</p><pre className="text-sm text-foreground whitespace-pre-wrap font-body">{apt.prescription}</pre></div>}
          </div>
        )}
        <button onClick={onClose} className="mt-6 w-full btn-outline">Close</button>
      </div>
    </div>
  );
};

export default PatientDashboard;
