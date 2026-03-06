import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDoctors } from '@/lib/store';
import { SPECIALITY_DATA, SPECIALIZATIONS, TIME_SLOTS } from '@/data/mockData';
import { useState } from 'react';

const Index = () => {
  const doctors = getDoctors().filter(d => d.isActive);
  const [spec, setSpec] = useState('');
  const filteredDocs = spec ? doctors.filter(d => d.specialization === spec) : doctors;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-primary mb-6">
                Trusted Healthcare Since 2005
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-foreground leading-tight mb-6">
                Your Health,<br />Our <span className="text-gradient-gold">Sacred Promise</span>
              </h1>
              <p className="text-dark-foreground/60 text-lg mb-8 max-w-lg">
                Experience world-class healthcare with 150+ specialists. Book your consultation in 60 seconds.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/doctors" className="btn-gold text-base">Book Appointment</Link>
                <Link to="/doctors" className="btn-outline-light text-base">View Doctors</Link>
              </div>
              <div className="flex gap-8">
                {[['150+', 'Specialists'], ['20K+', 'Patients Served'], ['98%', 'Satisfaction']].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-heading text-2xl font-bold text-primary">{n}</div>
                    <div className="text-xs text-dark-foreground/50">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:block">
              <div className="glass-card rounded-card p-8">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">Quick Book</h3>
                <div className="space-y-4">
                  <select className="select-field" value={spec} onChange={e => setSpec(e.target.value)}>
                    <option value="">Select Speciality</option>
                    {SPECIALITY_DATA.map(s => <option key={s.name} value={s.name}>{s.emoji} {s.name}</option>)}
                  </select>
                  <select className="select-field">
                    <option value="">Select Doctor</option>
                    {filteredDocs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <input type="date" className="input-field" />
                  <select className="select-field">
                    <option value="">Select Time Slot</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <Link to="/login" className="block w-full btn-primary text-center">Confirm Booking</Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title text-foreground">Our <span className="text-primary">Specialities</span></h2>
          <p className="text-muted-foreground mt-3">Comprehensive care across all major medical disciplines</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIALITY_DATA.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to={`/doctors?spec=${s.name}`} className="block bg-card rounded-card p-6 shadow-soft card-hover border border-border/50 hover:border-primary/30">
                <div className="text-4xl mb-4">{s.emoji}</div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{s.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                <span className="text-xs text-primary font-medium">{doctors.filter(d => d.specialization === s.name).length} Doctors →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Doctors Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title text-foreground">Meet Our <span className="text-primary">Doctors</span></h2>
          <p className="text-muted-foreground mt-3">World-class specialists dedicated to your wellbeing</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 3).map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-card p-6 shadow-soft card-hover border border-border/50">
              <div className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center text-2xl mb-4">{d.emoji}</div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{d.name}</h3>
              <p className="text-sm text-primary font-medium mb-2">{d.specialization}</p>
              <p className="text-sm text-muted-foreground mb-3">{d.experience} years experience</p>
              <div className="flex items-center gap-1 mb-3">
                {'⭐'.repeat(Math.floor(d.rating))}<span className="text-xs text-muted-foreground ml-1">{d.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">₹{d.consultationFee}</span>
                <Link to="/login" className="btn-primary text-xs py-1.5 px-3">Book Now</Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/doctors" className="btn-outline">View All Doctors</Link>
        </div>
      </section>

      {/* Features */}
      <section className="gradient-hero py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title text-dark-foreground">Healthcare <span className="text-gradient-gold">Reimagined</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '⚡', title: '60-Second Booking', desc: 'Book appointments instantly with our streamlined booking system' },
              { emoji: '🔒', title: 'Secure Records', desc: 'Your medical data is encrypted and protected at all times' },
              { emoji: '📋', title: 'Digital Prescriptions', desc: 'Access your prescriptions and medical records anytime, anywhere' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass-dark rounded-card p-8 text-center">
                <div className="text-4xl mb-4">{f.emoji}</div>
                <h3 className="font-heading text-xl font-semibold text-dark-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-dark-foreground/60">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
