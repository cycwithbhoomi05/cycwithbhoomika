import { useState } from 'react';
import { submitContactForm } from '../services/notificationService';
import { BRAND } from '../utils/constants';
import Button from '../components/ui/Button';
import { HiPhone, HiMail, HiLocationMarker, HiPaperAirplane } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await submitContactForm(form);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Hero */}
      <section className="bg-white border-b border-dark-100 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-4">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dark-900 mb-4">
            Get in <span className="text-primary-700">Touch</span>
          </h1>
          <p className="text-dark-600 max-w-xl mx-auto text-lg leading-relaxed">
            Have a question or want to discuss training for your organization? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="space-y-4">
            {[
              { icon: HiPhone, label: 'Phone', value: BRAND.phone, href: `tel:${BRAND.phone}`, color: 'from-blue-500 to-blue-600' },
              { icon: HiMail, label: 'Email', value: BRAND.email, href: `mailto:${BRAND.email}`, color: 'from-gold-500 to-gold-600' },
              { icon: HiLocationMarker, label: 'Location', value: 'India', href: '#', color: 'from-green-500 to-green-600' },
            ].map((item, i) => (
              <a key={i} href={item.href} className="block">
                <div className="bg-white rounded-2xl border border-dark-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-dark-400 text-sm">{item.label}</p>
                      <p className="font-heading font-semibold text-dark-800">{item.value}</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-dark-100 p-8 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-dark-800 mb-2">Send us a Message</h2>
              <p className="text-dark-500 mb-8">We'll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="+91 9XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your training needs..."
                  />
                </div>

                <Button type="submit" variant="gold" size="lg" loading={loading} icon={HiPaperAirplane} className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
