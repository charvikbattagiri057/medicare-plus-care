import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAppointments, getDoctors, getUsers, getAuditLog, addDoctor, updateDoctor, deleteDoctor, updateAppointment, deleteAppointment, addAuditEntry } from '@/lib/store';
import { SPECIALIZATIONS } from '@/data/mockData';
import { toast } from 'sonner';
import { LayoutDashboard, ClipboardList, Stethoscope, Users, DollarSign, FileText, LogOut, Home } from 'lucide-react';

const AdminPortal = () => {
  const { auth, user, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  if (!auth || !user || user.role !== 'admin') { navigate('/admin-login'); return null; }

  const links = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: ClipboardList },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'audit', label: 'Audit Log', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-64 bg-secondary text-secondary-foreground flex-col shrink-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-1">
            <span className="text-admin text-lg">✚</span>
            <span className="font-heading text-lg font-bold">MediCare Plus</span>
          </Link>
          <p className="text-xs text-secondary-foreground/40 mb-8">Admin Management Portal</p>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-admin-foreground" style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(262 60% 45%))' }}>⚙️</div>
            <div>
              <p className="text-sm font-semibold">Administrator</p>
              <p className="text-xs text-secondary-foreground/50">Super Admin</p>
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
          <Link to="/doctor-login" className="sidebar-link text-xs"><Stethoscope size={16} />Doctor Portal</Link>
          <button onClick={() => { logout(); navigate('/'); }} className="sidebar-link text-xs text-destructive w-full text-left"><LogOut size={16} />Logout</button>
        </div>
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 flex">
        {links.slice(0, 4).map(l => (
          <button key={l.id} onClick={() => setTab(l.id)} className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs ${tab === l.id ? 'text-admin' : 'text-muted-foreground'}`}>
            <l.icon size={18} />{l.label}
          </button>
        ))}
      </div>

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
        {tab === 'overview' && <AdminOverview setTab={setTab} />}
        {tab === 'appointments' && <AdminAppointments refresh={refresh} />}
        {tab === 'doctors' && <AdminDoctors refresh={refresh} />}
        {tab === 'patients' && <AdminPatients />}
        {tab === 'revenue' && <AdminRevenue />}
        {tab === 'audit' && <AdminAudit />}
      </main>
    </div>
  );
};

const AdminOverview = ({ setTab }: any) => {
  const apts = getAppointments();
  const docs = getDoctors();
  const users = getUsers().filter(u => u.role === 'patient');
  const totalRevenue = apts.filter(a => a.paymentStatus === 'Paid').reduce((s, a) => s + a.consultationFee, 0);

  const statusCounts = { Pending: 0, Approved: 0, Completed: 0, Cancelled: 0 };
  apts.forEach(a => { if (a.status in statusCounts) (statusCounts as any)[a.status]++; });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Admin Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Appointments', value: apts.length, color: 'text-admin' },
          { label: 'Doctors on Staff', value: docs.length, color: 'text-primary' },
          { label: 'Pending Approval', value: statusCounts.Pending, color: 'text-warning' },
          { label: 'Registered Patients', value: users.length, color: 'text-info' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-3xl font-heading font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="table-container">
          <div className="p-4 border-b border-border/50 flex justify-between items-center">
            <h3 className="font-heading text-lg font-semibold">Recent Appointments</h3>
            <button onClick={() => setTab('appointments')} className="text-sm text-primary hover:underline">View All</button>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 text-left text-muted-foreground"><th className="p-3">Patient</th><th className="p-3">Doctor</th><th className="p-3">Status</th></tr></thead>
            <tbody>
              {apts.slice(0, 5).map(a => (
                <tr key={a.id} className="border-b border-border/30">
                  <td className="p-3 font-medium text-foreground">{a.patientName}</td>
                  <td className="p-3 text-muted-foreground">{a.doctorName}</td>
                  <td className="p-3"><span className={`badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="rounded-card p-6 text-admin-foreground" style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(262 60% 45%))' }}>
            <p className="text-sm opacity-80">Total Revenue</p>
            <p className="text-3xl font-heading font-bold">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-card p-6 shadow-soft border border-border/50">
            <h3 className="font-heading text-lg font-semibold mb-4">Status Breakdown</h3>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{status}</span>
                  <span className="font-medium text-foreground">{count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${status === 'Pending' ? 'bg-warning' : status === 'Approved' ? 'bg-success' : status === 'Completed' ? 'bg-info' : 'bg-destructive'}`}
                    style={{ width: `${apts.length ? (count / apts.length) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminAppointments = ({ refresh }: any) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const apts = getAppointments();
  const filtered = apts.filter(a => (filter === 'All' || a.status === filter) && (a.patientName.toLowerCase().includes(search.toLowerCase()) || a.doctorName.toLowerCase().includes(search.toLowerCase())));
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleStatus = (id: string, status: string) => {
    updateAppointment(id, { status: status as any });
    addAuditEntry('ADMIN_STATUS', `Admin changed appointment ${id} to ${status}`);
    toast.success(`Appointment ${status.toLowerCase()}`);
    refresh();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAppointment(deleteId);
      addAuditEntry('DELETE_APT', `Admin deleted appointment ${deleteId}`);
      toast.success('Appointment deleted');
      setDeleteId(null);
      refresh();
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">All Appointments</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {['All','Pending','Approved','Completed','Cancelled'].map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-btn text-sm font-medium ${filter === t ? 'bg-admin text-admin-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'}`}>{t}</button>
        ))}
      </div>
      <input className="input-field mb-4 max-w-md" placeholder="Search by patient or doctor..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="table-container">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border/50 text-left text-muted-foreground">
            <th className="p-3">Patient</th><th className="p-3">Doctor</th><th className="p-3 hidden sm:table-cell">Speciality</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b border-border/30">
                <td className="p-3"><span className="font-medium text-foreground">{a.patientName}</span><br /><span className="text-xs text-muted-foreground">{a.patientEmail}</span></td>
                <td className="p-3 text-foreground">{a.doctorName}</td>
                <td className="p-3 hidden sm:table-cell"><span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{a.specialization}</span></td>
                <td className="p-3 text-muted-foreground">{a.date}<br /><span className="text-xs">{a.timeSlot}</span></td>
                <td className="p-3"><span className={`badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                <td className="p-3"><span className={`badge-${a.paymentStatus.toLowerCase()}`}>{a.paymentStatus}</span></td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {a.status === 'Pending' && <button onClick={() => handleStatus(a.id, 'Approved')} className="text-xs px-2 py-1 rounded-btn bg-success/10 text-success font-medium">Approve</button>}
                    {a.status === 'Approved' && <button onClick={() => handleStatus(a.id, 'Completed')} className="text-xs px-2 py-1 rounded-btn bg-info/10 text-info font-medium">Complete</button>}
                    {!['Cancelled', 'Completed'].includes(a.status) && <button onClick={() => handleStatus(a.id, 'Cancelled')} className="text-xs px-2 py-1 rounded-btn bg-warning/10 text-warning font-medium">Cancel</button>}
                    <button onClick={() => setDeleteId(a.id)} className="text-xs px-2 py-1 rounded-btn bg-destructive/10 text-destructive font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">📋 No appointments found</td></tr>}
          </tbody>
        </table>
      </div>
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-card rounded-card p-8 w-full max-w-sm shadow-elevated" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">Confirm Delete</h2>
            <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete this appointment? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={handleDelete} className="flex-1 rounded-btn px-4 py-3 font-medium bg-destructive text-destructive-foreground">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDoctors = ({ refresh }: any) => {
  const [docs, setDocs] = useState(getDoctors());
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDoc, setEditDoc] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (data: any) => {
    if (editDoc) {
      updateDoctor(editDoc.id, data);
      addAuditEntry('EDIT_DOCTOR', `Admin updated Dr. ${data.name}`);
    } else {
      const newDoc = { ...data, id: `d${Date.now()}`, emoji: '👨‍⚕️', rating: 4.5, totalPatients: 0, isActive: true, role: 'doctor' as const, createdAt: new Date().toISOString().split('T')[0] };
      addDoctor(newDoc);
      addAuditEntry('ADD_DOCTOR', `Admin added Dr. ${data.name}`);
    }
    setDocs(getDoctors());
    setShowModal(false);
    setEditDoc(null);
    refresh();
    toast.success(editDoc ? 'Doctor updated!' : 'Doctor added!');
  };

  const handleDelete = () => {
    if (deleteId) {
      const doc = docs.find(d => d.id === deleteId);
      deleteDoctor(deleteId);
      addAuditEntry('DELETE_DOCTOR', `Admin deleted Dr. ${doc?.name}`);
      setDocs(getDoctors());
      setDeleteId(null);
      refresh();
      toast.success('Doctor deleted');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Manage Doctors</h1>
        <button onClick={() => { setEditDoc(null); setShowModal(true); }} className="rounded-btn px-4 py-2 font-medium text-sm text-admin-foreground" style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(262 60% 45%))' }}>+ Add Doctor</button>
      </div>
      <input className="input-field mb-4 max-w-md" placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="table-container">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border/50 text-left text-muted-foreground">
            <th className="p-3">Doctor</th><th className="p-3">Speciality</th><th className="p-3 hidden sm:table-cell">Experience</th><th className="p-3 hidden sm:table-cell">Fee</th><th className="p-3 hidden sm:table-cell">Hours</th><th className="p-3">Status</th><th className="p-3">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="border-b border-border/30">
                <td className="p-3"><div className="flex items-center gap-2"><span className="text-lg">{d.emoji}</span><div><span className="font-medium text-foreground">{d.name}</span><br /><span className="text-xs text-muted-foreground">{d.email}</span></div></div></td>
                <td className="p-3"><span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{d.specialization}</span></td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{d.experience} yrs</td>
                <td className="p-3 hidden sm:table-cell text-foreground">₹{d.consultationFee}</td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{d.availableHours}</td>
                <td className="p-3"><span className={d.isActive ? 'badge-approved' : 'badge-cancelled'}>{d.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => { setEditDoc(d); setShowModal(true); }} className="text-xs px-2 py-1 rounded-btn bg-info/10 text-info font-medium">Edit</button>
                    <button onClick={() => setDeleteId(d.id)} className="text-xs px-2 py-1 rounded-btn bg-destructive/10 text-destructive font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <DoctorFormModal initial={editDoc} onSave={handleSave} onClose={() => { setShowModal(false); setEditDoc(null); }} />}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-card rounded-card p-8 w-full max-w-sm shadow-elevated" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">Confirm Delete</h2>
            <p className="text-sm text-muted-foreground mb-6">This will permanently remove this doctor.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={handleDelete} className="flex-1 rounded-btn px-4 py-3 font-medium bg-destructive text-destructive-foreground">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DoctorFormModal = ({ initial, onSave, onClose }: any) => {
  const [form, setForm] = useState({
    name: initial?.name || '', phone: initial?.phone || '', email: initial?.email || '', password: initial?.password || '',
    specialization: initial?.specialization || '', experience: initial?.experience?.toString() || '', qualification: initial?.qualification || '',
    consultationFee: initial?.consultationFee?.toString() || '', availableHours: initial?.availableHours || '',
    availableDays: initial?.availableDays || ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    bio: initial?.bio || '',
  });
  const u = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, experience: parseInt(form.experience) || 0, consultationFee: parseInt(form.consultationFee) || 0 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-card p-8 w-full max-w-lg shadow-elevated max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">{initial ? 'Edit Doctor' : 'Add New Doctor'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input-field" placeholder="Full Name" required value={form.name} onChange={e => u('name', e.target.value)} />
          <input className="input-field" placeholder="Phone" required value={form.phone} onChange={e => u('phone', e.target.value)} />
          <input className="input-field" type="email" placeholder="Email" required value={form.email} onChange={e => u('email', e.target.value)} />
          {!initial && <input className="input-field" type="password" placeholder="Portal Password" required value={form.password} onChange={e => u('password', e.target.value)} />}
          <select className="select-field" required value={form.specialization} onChange={e => u('specialization', e.target.value)}>
            <option value="">Select Specialization</option>
            {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input className="input-field" placeholder="Experience (years)" value={form.experience} onChange={e => u('experience', e.target.value)} />
            <input className="input-field" placeholder="Consultation Fee (₹)" value={form.consultationFee} onChange={e => u('consultationFee', e.target.value)} />
          </div>
          <input className="input-field" placeholder="Qualification" value={form.qualification} onChange={e => u('qualification', e.target.value)} />
          <input className="input-field" placeholder="Available Hours (e.g., 9AM - 5PM)" value={form.availableHours} onChange={e => u('availableHours', e.target.value)} />
          <button type="submit" className="w-full btn-primary">Save Doctor</button>
        </form>
      </div>
    </div>
  );
};

const AdminPatients = () => {
  const [search, setSearch] = useState('');
  const users = getUsers().filter(u => u.role === 'patient');
  const apts = getAppointments();
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Patients</h1>
      <input className="input-field mb-4 max-w-md" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="table-container">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border/50 text-left text-muted-foreground">
            <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3 hidden sm:table-cell">Phone</th><th className="p-3">Blood Group</th><th className="p-3">Appointments</th><th className="p-3 hidden sm:table-cell">Joined</th>
          </tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-border/30">
                <td className="p-3 font-medium text-foreground">{u.name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{u.phone}</td>
                <td className="p-3">{u.bloodGroup ? <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded-full font-semibold">{u.bloodGroup}</span> : '—'}</td>
                <td className="p-3 text-foreground">{apts.filter(a => a.patientId === u.id).length}</td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{u.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminRevenue = () => {
  const apts = getAppointments();
  const paid = apts.filter(a => a.paymentStatus === 'Paid');
  const unpaid = apts.filter(a => a.paymentStatus === 'Unpaid' && a.status !== 'Cancelled');
  const totalPaid = paid.reduce((s, a) => s + a.consultationFee, 0);
  const totalUnpaid = unpaid.reduce((s, a) => s + a.consultationFee, 0);
  const avg = paid.length ? Math.round(totalPaid / paid.length) : 0;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Revenue Report</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Collected', value: `₹${totalPaid.toLocaleString()}`, color: 'text-success' },
          { label: 'Pending Collection', value: `₹${totalUnpaid.toLocaleString()}`, color: 'text-warning' },
          { label: 'Paid Consultations', value: paid.length, color: 'text-info' },
          { label: 'Avg per Consultation', value: `₹${avg}`, color: 'text-admin' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="table-container">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border/50 text-left text-muted-foreground">
            <th className="p-3">Patient</th><th className="p-3">Doctor</th><th className="p-3">Date</th><th className="p-3">Fee</th><th className="p-3">Mode</th><th className="p-3">Status</th>
          </tr></thead>
          <tbody>
            {apts.map(a => (
              <tr key={a.id} className="border-b border-border/30">
                <td className="p-3 font-medium text-foreground">{a.patientName}</td>
                <td className="p-3 text-muted-foreground">{a.doctorName}</td>
                <td className="p-3 text-muted-foreground">{a.date}</td>
                <td className="p-3 text-foreground font-medium">₹{a.consultationFee}</td>
                <td className="p-3">{a.paymentMode === 'online' ? '💻 Online' : '🏥 Clinic'}</td>
                <td className="p-3"><span className={`badge-${a.paymentStatus.toLowerCase()}`}>{a.paymentStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminAudit = () => {
  const log = getAuditLog();
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Audit Log</h1>
      <div className="table-container">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border/50 text-left text-muted-foreground">
            <th className="p-3">Timestamp</th><th className="p-3">Action</th><th className="p-3">Details</th>
          </tr></thead>
          <tbody>
            {log.map(entry => (
              <tr key={entry.id} className="border-b border-border/30">
                <td className="p-3 text-muted-foreground text-xs">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'hsl(262 83% 58% / 0.15)', color: 'hsl(262 83% 50%)' }}>{entry.action}</span></td>
                <td className="p-3 text-foreground">{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPortal;
