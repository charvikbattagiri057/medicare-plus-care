import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { auth, user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isHome = location.pathname === '/';

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Specialities', to: '/specialities' },
    { label: 'Doctors', to: '/doctors' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary text-xl">✚</span>
            <span className="font-heading text-xl font-bold text-dark-foreground">MediCare Plus</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`text-sm font-medium transition-colors ${location.pathname === l.to ? 'text-primary' : 'text-dark-foreground/70 hover:text-dark-foreground'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/doctor-login" className="text-xs font-medium text-dark-foreground/60 hover:text-dark-foreground transition-colors">Doctor Portal</Link>
            <Link to="/admin-login" className="text-xs font-medium text-dark-foreground/60 hover:text-dark-foreground transition-colors">Admin</Link>
            {auth && (user || auth.role === 'doctor') ? (
              <Link to={auth.role === 'doctor' ? '/doctor-portal' : '/dashboard'} className="btn-primary text-sm py-2 px-4">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-dark-foreground/80 hover:text-dark-foreground transition-colors">Login</Link>
                <Link to="/doctors" className="btn-gold text-sm py-2 px-4">Book Appointment</Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-dark-foreground">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-dark-foreground/80 hover:text-dark-foreground">
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-dark-foreground/10 space-y-2">
              <Link to="/doctor-login" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-dark-foreground/60">Doctor Portal</Link>
              <Link to="/admin-login" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-dark-foreground/60">Admin</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-dark-foreground/80">Login</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
