import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAppointments, updateAppointment, updateDoctor, addAuditEntry } from '@/lib/store';
import { toast } from 'sonner';
import { LayoutDashboard, Calendar, ClipboardList, Users, User, Settings, LogOut, Home } from 'lucide-react';

const DoctorPortal = () => {
  const { auth, doctor, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [showRxFor, setShowRxFor] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  if (!auth || auth.role !== 'doctor' || !doctor) { navigate('/doctor-login'); return null; }

  const allApts = getAppointments().filter(a => a.doctorId === doctor.id);
  const today = new Date().toISOString().split('T')[0];
  const todayApts = allApts.filter(a => a.date === today);
  const upcomingApts = allApts.filter(a => a.date > today && a.status !== 'Cancelled');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const stats = {
    total: allApts.length,
    today: todayApts.length,
    upcoming: upcomingApts.length,
    completed: allApts.filter(a => a.status === 'Completed').length,
  };

  const links = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'schedule', label: 'My Schedule', icon: Calendar },
    { id: 'appointments', label: 'All Appointments', icon: ClipboardList },
    { id: 'patients', label: 'My Patients', icon: Users },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'availability', label: 'Availability', icon: Settings },
  ];

  const handleStatusChange = (id: string, status: string) => {
    updateAppointment(id, { status: status as any });
    addAuditEntry('STATUS_CHANGE', `Dr. ${doctor.name} changed appointment ${id} to ${status}`);
    toast.success(`Appointment ${status.toLowerCase()}`);
    refresh();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-64 bg-secondary text-secondary-foreground flex-col shrink-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-1">
            <span className="text-primary text-lg">✚</span>
            <span className="font-heading text-lg font-bold">MediCare Plus</span>
          </Link>
          <p className="text-xs text-secondary-foreground/40 mb-8">Doctor Portal</p>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center text-lg">{doctor.emoji}</div>
            <div>
              <p className="text-sm font-semibold">{doctor.name}</p>
              <p className="text-xs text-secondary-foreground/50">{doctor.specialization}</p>
            </div>
          </div>
          <nav className="sidebar-nav">
            {links.map(l => (
              <button key={l.id} onClick={() => setTab(l.id)} className={`sidebar-link w-full text-left ${tab === l.id ? 'sidebar-link-active' : ''}`}>
                <l.icon size={18} />{l.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-2">
          <Link to="/" className="sidebar-link text-xs"><Home size={16} />Patient Portal</Link>
          <button onClick={() => { logout(); navigate('/'); }} className="sidebar-link text-xs text-destructive w-full text-left"><LogOut size={16} />Logout</button>
        </div>
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 flex">
        {links.slice(0, 4).map(l => (
          <button key={l.id} onClick={() => setTab(l.id)} className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs ${tab === l.id ? 'text-primary' : 'text-muted-foreground'}`}>
            <l.icon size={18} />{l.label.split(' ')[0]}
          </button>
        ))}
      </div>

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
        {tab === 'overview' && (
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">{greeting}, {doctor.name.split(' ').slice(1).join(' ')}!</h1>
            <p className="text-muted-foreground mb-6">Here's your practice at a glance</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total', value: stats.total, color: 'text-primary' },
                { label: "Today's", value: stats.today, color: 'text-warning' },
                { label: 'Upcoming', value: stats.upcoming, color: 'text-info' },
                { label: 'Completed', value: stats.completed, color: 'text-success' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className={`text-3xl font-heading font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <AptTable title="Today's Appointments" apts={todayApts} onStatus={handleStatusChange} onRx={setShowRxFor} onView={setShowDetail} />
            <div className="mt-6" />
            <AptTable title="Upcoming Appointments" apts={upcomingApts.slice(0, 5)} onStatus={handleStatusChange} onRx={setShowRxFor} onView={setShowDetail} />
          </div>
        )}

        {tab === 'schedule' && <ScheduleTab apts={allApts} onStatus={handleStatusChange} onRx={setShowRxFor} onView={setShowDetail} />}

        {tab === 'appointments' && (
          <AllAppointmentsTab apts={allApts} onStatus={handleStatusChange} onRx={setShowRxFor} onView={setShowDetail} />
        )}

        {tab === 'patients' && <PatientsTab apts={allApts} />}

        {tab === 'profile' && <DoctorProfileTab doctor={doctor} refresh={refresh} />}

        {tab === 'availability' && <AvailabilityTab doctor={doctor} refresh={refresh} />}
      </main>

      {showRxFor && <WriteRxModal aptId={showRxFor} doctorName={doctor.name} onClose={() => { setShowRxFor(null); refresh(); }} />}
      {showDetail && <DetailModal aptId={showDetail} onClose={() => setShowDetail(null)} />}
    </div>
  );
};

const AptTable = ({ title, apts, onStatus, onRx, onView }: any) => (
  <div className="table-container">
    <div className="p-4 border-b border-border/50"><h3 className="font-heading text-lg font-semibold">{title}</h3></div>
    <table className="w-full text-sm">
      <thead><tr className="border-b border-border/50 text-left text-muted-foreground">
        <th className="p-3">Time</th><th className="p-3">Patient</th><th className="p-3 hidden sm:table-cell">Reason</th><th className="p-3">Status</th><th className="p-3">Actions</th>
      </tr></thead>
      <tbody>
        {apts.map((a: any) => (
          <tr key={a.id} className="border-b border-border/30">
            <td className="p-3 font-semibold text-primary">{a.timeSlot}</td>
            <td className="p-3"><span className="font-medium text-foreground">{a.patientName}</span><br /><span className="text-xs text-muted-foreground">{a.patientPhone}</span></td>
            <td className="p-3 hidden sm:table-cell text-muted-foreground">{a.reason}</td>
            <td className="p-3"><span className={`badge-${a.status.toLowerCase()}`}>{a.status}</span> <span className={`badge-${a.paymentStatus.toLowerCase()} ml-1`}>{a.paymentStatus}</span></td>
            <td className="p-3">
              <div className="flex flex-wrap gap-1">
                {a.status === 'Pending' && <button onClick={() => onStatus(a.id, 'Approved')} className="text-xs px-2 py-1 rounded-btn bg-success/10 text-success font-medium">Approve</button>}
                {['Pending', 'Approved'].includes(a.status) && <button onClick={() => onRx(a.id)} className="text-xs px-2 py-1 rounded-btn bg-info/10 text-info font-medium">Write Rx</button>}
                {a.status === 'Pending' && <button onClick={() => onStatus(a.id, 'Cancelled')} className="text-xs px-2 py-1 rounded-btn bg-destructive/10 text-destructive font-medium">Cancel</button>}
                <button onClick={() => onView(a.id)} className="text-xs px-2 py-1 rounded-btn bg-muted text-muted-foreground font-medium">View</button>
              </div>
            </td>
          </tr>
        ))}
        {apts.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">📋 No appointments</td></tr>}
      </tbody>
    </table>
  </div>
);

const ScheduleTab = ({ apts, onStatus, onRx, onView }: any) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = selectedDate.toISOString().split('T')[0];
  const dayApts = apts.filter((a: any) => a.date === dateStr);

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const today = new Date().toISOString().split('T')[0];
  const aptDates = new Set(apts.map((a: any) => a.date));

  const prevMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  const nextMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">My Schedule</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="gradient-teal rounded-card p-6 text-primary-foreground mb-4">
            <p className="text-sm opacity-80">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <p className="text-2xl font-heading font-bold">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <p className="text-sm mt-1 opacity-70">{dayApts.length} appointment{dayApts.length !== 1 ? 's' : ''}</p>
          </div>
          {dayApts.length > 0 ? dayApts.map((a: any) => (
            <div key={a.id} className="bg-card rounded-card p-4 mb-3 shadow-soft border border-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-primary font-bold">{a.timeSlot}</span>
                  <p className="font-semibold text-foreground">{a.patientName}</p>
                  <p className="text-sm text-muted-foreground">{a.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`badge-${a.status.toLowerCase()}`}>{a.status}</span>
                  <span className={`badge-${a.paymentStatus.toLowerCase()}`}>{a.paymentStatus}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {a.status === 'Pending' && <button onClick={() => onStatus(a.id, 'Approved')} className="text-xs px-2 py-1 rounded-btn bg-success/10 text-success font-medium">Approve</button>}
                {['Pending', 'Approved'].includes(a.status) && <button onClick={() => onRx(a.id)} className="text-xs px-2 py-1 rounded-btn bg-info/10 text-info font-medium">Write Rx</button>}
              </div>
            </div>
          )) : (
            <div className="bg-card rounded-card p-8 text-center shadow-soft border border-border/50">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-muted-foreground">No appointments for this day</p>
            </div>
          )}
        </div>
        <div>
          <div className="bg-card rounded-card p-4 shadow-soft border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="text-muted-foreground hover:text-foreground p-1">←</button>
              <span className="font-heading font-semibold text-foreground">{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <button onClick={nextMonth} className="text-muted-foreground hover:text-foreground p-1">→</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-muted-foreground py-1 font-medium">{d}</div>)}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const ds = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = ds === today;
                const isSelected = ds === dateStr;
                const hasApt = aptDates.has(ds);
                return (
                  <button key={day} onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                    className={`py-1.5 rounded-btn text-xs font-medium transition-all ${isSelected ? 'bg-primary text-primary-foreground' : isToday ? 'bg-primary/20 text-primary' : hasApt ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}>
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 space-y-1">
              <p className="text-xs text-muted-foreground">Today: {apts.filter((a: any) => a.date === today).length} appointments</p>
              <p className="text-xs text-muted-foreground">This month: {apts.filter((a: any) => a.date.startsWith(`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`)).length} appointments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllAppointmentsTab = ({ apts, onStatus, onRx, onView }: any) => {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? apts : apts.filter((a: any) => a.status === filter);
  const tabs = ['All', 'Pending', 'Approved', 'Completed', 'Cancelled'];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">All Appointments</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-btn text-sm font-medium transition-all ${filter === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'}`}>{t}</button>
        ))}
      </div>
      <AptTable title="" apts={filtered} onStatus={onStatus} onRx={onRx} onView={onView} />
    </div>
  );
};

const PatientsTab = ({ apts }: any) => {
  const patients = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; visits: number; lastDate: string; lastStatus: string }>();
    apts.forEach((a: any) => {
      const existing = map.get(a.patientId);
      if (!existing || a.date > existing.lastDate) {
        map.set(a.patientId, { name: a.patientName, phone: a.patientPhone, visits: (existing?.visits || 0) + (existing ? 0 : 0), lastDate: a.date, lastStatus: a.status });
      }
      if (existing) existing.visits++;
      else map.get(a.patientId)!.visits = 1;
    });
    return Array.from(map.values());
  }, [apts]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">My Patients</h1>
      <div className="table-container">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border/50 text-left text-muted-foreground">
            <th className="p-3">Name</th><th className="p-3">Contact</th><th className="p-3">Total Visits</th><th className="p-3">Last Visit</th><th className="p-3">Last Status</th>
          </tr></thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={i} className="border-b border-border/30">
                <td className="p-3 font-medium text-foreground">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.phone}</td>
                <td className="p-3 text-foreground">{p.visits}</td>
                <td className="p-3 text-muted-foreground">{p.lastDate}</td>
                <td className="p-3"><span className={`badge-${p.lastStatus.toLowerCase()}`}>{p.lastStatus}</span></td>
              </tr>
            ))}
            {patients.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">👥 No patients yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DoctorProfileTab = ({ doctor, refresh }: any) => {
  const [form, setForm] = useState({ name: doctor.name, phone: doctor.phone, experience: doctor.experience.toString(), qualification: doctor.qualification, consultationFee: doctor.consultationFee.toString(), bio: doctor.bio });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctor(doctor.id, { ...form, experience: parseInt(form.experience), consultationFee: parseInt(form.consultationFee) });
    refresh();
    toast.success('Profile updated!');
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">My Profile</h1>
      <form onSubmit={handleSave} className="max-w-lg space-y-4">
        <input className="input-field" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="input-field" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input className="input-field bg-muted" value={doctor.email} readOnly />
        <input className="input-field bg-muted" value={doctor.specialization} readOnly />
        <div className="grid grid-cols-2 gap-4">
          <input className="input-field" placeholder="Experience (years)" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
          <input className="input-field" placeholder="Fee (₹)" value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: e.target.value })} />
        </div>
        <input className="input-field" placeholder="Qualification" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} />
        <textarea className="input-field min-h-[100px]" placeholder="Bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
};

const AvailabilityTab = ({ doctor, refresh }: any) => {
  const [days, setDays] = useState<string[]>(doctor.availableDays);
  const [hours, setHours] = useState(doctor.availableHours);
  const allDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  const toggleDay = (d: string) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const handleSave = () => {
    updateDoctor(doctor.id, { availableDays: days, availableHours: hours });
    addAuditEntry('AVAILABILITY', `Dr. ${doctor.name} updated availability`);
    refresh();
    toast.success('Availability updated!');
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Availability Settings</h1>
      <div className="max-w-lg space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Working Days</label>
          <div className="flex flex-wrap gap-2">
            {allDays.map(d => (
              <button key={d} onClick={() => toggleDay(d)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${days.includes(d) ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'}`}>{d}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Available Hours</label>
          <input className="input-field" value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g., 9AM - 5PM" />
        </div>
        <button onClick={handleSave} className="btn-primary">Save Availability</button>
      </div>
    </div>
  );
};

const WriteRxModal = ({ aptId, doctorName, onClose }: { aptId: string; doctorName: string; onClose: () => void }) => {
  const [notes, setNotes] = useState('');
  const [rx, setRx] = useState('');
  const apt = getAppointments().find(a => a.id === aptId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppointment(aptId, { notes, prescription: rx, status: 'Completed' });
    addAuditEntry('PRESCRIPTION', `Dr. ${doctorName} wrote prescription for appointment ${aptId}`);
    toast.success('Prescription saved & appointment completed!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-card p-8 w-full max-w-lg shadow-elevated" onClick={e => e.stopPropagation()}>
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">Write Prescription</h2>
        {apt && (
          <div className="p-4 bg-muted rounded-btn mb-4">
            <p className="text-sm font-semibold text-foreground">{apt.patientName}</p>
            <p className="text-xs text-muted-foreground">{apt.reason} • {apt.date} at {apt.timeSlot}</p>
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <textarea className="input-field min-h-[80px]" placeholder="Diagnosis / Notes" value={notes} onChange={e => setNotes(e.target.value)} required />
          <textarea className="input-field min-h-[120px]" placeholder="Prescription details..." value={rx} onChange={e => setRx(e.target.value)} required />
          <button type="submit" className="w-full btn-primary">Save & Complete</button>
        </form>
      </div>
    </div>
  );
};

const DetailModal = ({ aptId, onClose }: { aptId: string; onClose: () => void }) => {
  const apt = getAppointments().find(a => a.id === aptId);
  if (!apt) return null;
  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-card p-8 w-full max-w-md shadow-elevated" onClick={e => e.stopPropagation()}>
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">Appointment Details</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium text-foreground">{apt.patientName}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{apt.date}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-foreground">{apt.timeSlot}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Reason</span><span className="text-foreground">{apt.reason}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className={`badge-${apt.status.toLowerCase()}`}>{apt.status}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className={`badge-${apt.paymentStatus.toLowerCase()}`}>{apt.paymentStatus} (₹{apt.consultationFee})</span></div>
          {apt.notes && <div><p className="text-muted-foreground mb-1">Notes</p><p className="text-foreground">{apt.notes}</p></div>}
          {apt.prescription && <div><p className="text-muted-foreground mb-1">Prescription</p><pre className="text-foreground whitespace-pre-wrap font-body">{apt.prescription}</pre></div>}
        </div>
        <button onClick={onClose} className="mt-6 w-full btn-outline">Close</button>
      </div>
    </div>
  );
};

export default DoctorPortal;
