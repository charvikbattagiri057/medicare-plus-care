import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDoctors } from '@/lib/store';
import { SPECIALITY_DATA } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const DoctorsPage = () => {
  const [params] = useSearchParams();
  const [filter, setFilter] = useState(params.get('spec') || '');
  const doctors = getDoctors().filter(d => d.isActive);
  const filtered = filter ? doctors.filter(d => d.specialization === filter) : doctors;
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="page-hero pt-28 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark-foreground">Our <span className="text-gradient-gold">Doctors</span></h1>
          <p className="text-dark-foreground/60 mt-4">Find the right specialist for your needs</p>
        </div>
      </section>
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilter('')} className={`px-4 py-2 rounded-btn text-sm font-medium transition-all ${!filter ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'}`}>All</button>
          {SPECIALITY_DATA.map(s => (
            <button key={s.name} onClick={() => setFilter(s.name)} className={`px-4 py-2 rounded-btn text-sm font-medium transition-all ${filter === s.name ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'}`}>
              {s.emoji} {s.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-card p-6 shadow-soft card-hover border border-border/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full gradient-teal flex items-center justify-center text-xl shrink-0">{d.emoji}</div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{d.name}</h3>
                  <p className="text-sm text-primary font-medium">{d.specialization}</p>
                  <p className="text-xs text-muted-foreground">{d.qualification}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  {'⭐'.repeat(Math.floor(d.rating))}<span className="text-muted-foreground ml-1">{d.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground">🕐 {d.experience} years experience</p>
                <p className="text-sm text-muted-foreground">📅 {d.availableHours}</p>
                <div className="flex flex-wrap gap-1">
                  {d.availableDays.map(day => (
                    <span key={day} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{day.slice(0, 3)}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-lg font-bold font-heading text-foreground">₹{d.consultationFee}</span>
                <Link to={auth ? '/dashboard?tab=book' : '/login'} className="btn-primary text-sm py-2 px-4">Book Appointment</Link>
              </div>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-muted-foreground">No doctors found for this speciality</p>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default DoctorsPage;
