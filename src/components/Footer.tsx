import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-primary text-xl">✚</span>
            <span className="font-heading text-xl font-bold">MediCare Plus</span>
          </div>
          <p className="text-sm text-secondary-foreground/60 leading-relaxed">
            Delivering trusted, compassionate healthcare with cutting-edge technology since 2005.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-lg font-semibold mb-4">Navigation</h4>
          <div className="space-y-2">
            {['/', '/specialities', '/doctors', '/contact'].map((to, i) => (
              <Link key={to} to={to} className="block text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                {['Home', 'Specialities', 'Doctors', 'Contact'][i]}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading text-lg font-semibold mb-4">Portals</h4>
          <div className="space-y-2">
            <Link to="/login" className="block text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Patient Login</Link>
            <Link to="/doctor-login" className="block text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Doctor Portal</Link>
            <Link to="/admin-login" className="block text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Admin Portal</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-lg font-semibold mb-4">Contact</h4>
          <div className="space-y-2 text-sm text-secondary-foreground/60">
            <p>📍 123 Medical Avenue, Mumbai</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ care@medicareplus.in</p>
            <p>🕐 Mon–Sat: 8AM–8PM</p>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-secondary-foreground/10 text-center text-xs text-secondary-foreground/40">
        © 2025 MediCare Plus. All rights reserved. Built with care for better healthcare.
      </div>
    </div>
  </footer>
);

export default Footer;
