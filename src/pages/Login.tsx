import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginPatient } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginPatient(email, password);
    if (result) {
      refresh();
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-card p-8 shadow-elevated">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center text-2xl mx-auto mb-4">✚</div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your MediCare Plus account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input-field" type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input-field" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="w-full btn-primary">Sign In</button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-6">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Register</Link>
          </p>
          <div className="mt-6 p-4 rounded-btn bg-muted/50 border border-border/50">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
            <p className="text-xs text-muted-foreground">Patient: rahul@demo.com / pass123</p>
            <p className="text-xs text-muted-foreground">Admin: admin@medicare.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
