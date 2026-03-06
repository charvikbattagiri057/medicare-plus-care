import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPatient } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginPatient(email, password);
    if (result && result.user.role === 'admin') {
      refresh();
      toast.success('Welcome, Administrator!');
      navigate('/admin-portal');
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, hsl(262 50% 10%) 0%, hsl(262 60% 25%) 100%)' }}>
      <div className="w-full max-w-md">
        <div className="bg-card rounded-card p-8 shadow-elevated">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(262 60% 45%))' }}>⚙️</div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Hospital Management Console</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input-field" type="email" placeholder="Admin Email" required value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input-field" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="w-full rounded-btn px-6 py-3 font-medium text-admin-foreground transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(262 60% 45%))' }}>Sign In</button>
          </form>
          <div className="mt-6 p-4 rounded-btn bg-muted/50 border border-border/50">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
            <p className="text-xs text-muted-foreground">admin@medicare.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
