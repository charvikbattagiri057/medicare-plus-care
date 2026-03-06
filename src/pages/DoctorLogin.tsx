import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginDoctor } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginDoctor(email, password);
    if (result) {
      refresh();
      toast.success(`Welcome, ${result.doctor.name}!`);
      navigate('/doctor-portal');
    } else {
      toast.error('Invalid doctor credentials');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-card p-8 shadow-elevated">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center text-2xl mx-auto mb-4">🩺</div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Doctor Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage your practice</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input-field" type="email" placeholder="Doctor Email" required value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input-field" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="w-full btn-primary">Sign In</button>
          </form>
          <div className="mt-6 p-4 rounded-btn bg-muted/50 border border-border/50">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
            <p className="text-xs text-muted-foreground">ananya@medicare.com / doc123</p>
            <p className="text-xs text-muted-foreground">vikram@medicare.com / doc123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
