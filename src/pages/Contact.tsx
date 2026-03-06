import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="page-hero pt-28 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark-foreground">Get in <span className="text-gradient-gold">Touch</span></h1>
          <p className="text-dark-foreground/60 mt-4">We're here to help with any questions or concerns</p>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[
              { icon: '📍', label: 'Address', value: '123 Medical Avenue, Andheri West, Mumbai 400053' },
              { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
              { icon: '✉️', label: 'Email', value: 'care@medicareplus.in' },
              { icon: '🕐', label: 'Working Hours', value: 'Mon–Sat: 8:00 AM – 8:00 PM' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-btn gradient-teal flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="bg-card rounded-card p-8 shadow-soft border border-border/50 space-y-4">
            <input className="input-field" placeholder="Your Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" type="email" placeholder="Your Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="input-field" placeholder="Subject" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <textarea className="input-field min-h-[120px]" placeholder="Your Message" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            <button type="submit" className="w-full btn-primary">Send Message</button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
