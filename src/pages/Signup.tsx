import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addUser, loginPatient } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Signup = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '', age: '', gender: '', bloodGroup: '' });
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    const id = `u${Date.now()}`;
    addUser({
      id, name: form.name, email: form.email, password: form.password, role: 'patient',
      phone: form.phone, age: parseInt(form.age) || undefined, gender: form.gender, bloodGroup: form.bloodGroup,
      createdAt: new Date().toISOString().split('T')[0],
    });
    loginPatient(form.email, form.password);
    refresh();
    toast.success('Account created successfully!');
    navigate('/dashboard');
  };

  const u = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-card p-8 shadow-elevated">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center text-2xl mx-auto mb-4">✚</div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join MediCare Plus for better healthcare</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input-field" placeholder="Full Name" required value={form.name} onChange={e => u('name', e.target.value)} />
            <input className="input-field" placeholder="Phone Number" required value={form.phone} onChange={e => u('phone', e.target.value)} />
            <input className="input-field" type="email" placeholder="Email Address" required value={form.email} onChange={e => u('email', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <input className="input-field" type="password" placeholder="Password" required value={form.password} onChange={e => u('password', e.target.value)} />
              <input className="input-field" type="password" placeholder="Confirm Password" required value={form.confirmPassword} onChange={e => u('confirmPassword', e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <input className="input-field" type="number" placeholder="Age" value={form.age} onChange={e => u('age', e.target.value)} />
              <select className="select-field" value={form.gender} onChange={e => u('gender', e.target.value)}>
                <option value="">Gender</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
              <select className="select-field" value={form.bloodGroup} onChange={e => u('bloodGroup', e.target.value)}>
                <option value="">Blood Group</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full btn-primary">Create Account</button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
