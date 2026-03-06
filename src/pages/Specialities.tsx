import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SPECIALITY_DATA } from '@/data/mockData';
import { getDoctors } from '@/lib/store';

const Specialities = () => {
  const doctors = getDoctors();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="page-hero pt-28 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark-foreground">Our <span className="text-gradient-gold">Specialities</span></h1>
          <p className="text-dark-foreground/60 mt-4 max-w-xl mx-auto">Expert care across 8 major medical disciplines with state-of-the-art facilities</p>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIALITY_DATA.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to={`/doctors?spec=${s.name}`} className="block bg-card rounded-card p-8 shadow-soft card-hover border-2 border-transparent hover:border-primary/30 text-center h-full">
                <div className="text-5xl mb-4">{s.emoji}</div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {doctors.filter(d => d.specialization === s.name).length} Doctors
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Specialities;
