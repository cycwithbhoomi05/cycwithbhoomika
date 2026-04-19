import { useState, useEffect } from 'react';
import { getHomepageContent, updateHomepageContent, getTestimonials, updateTestimonials, getContactInfo, updateContactInfo } from '../../services/cmsService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { HiSave, HiPlus, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminCMS = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [homepage, setHomepage] = useState({ bannerText: '', bannerSubtext: '', bannerImageUrl: '' });
  const [testimonials, setTestimonials] = useState([]);
  const [contact, setContact] = useState({ phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [hp, test, ct] = await Promise.all([getHomepageContent(), getTestimonials(), getContactInfo()]);
        setHomepage(hp);
        setTestimonials(test);
        setContact(ct);
      } catch { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const saveHomepage = async () => {
    setSaving(true);
    try {
      await updateHomepageContent(homepage);
      toast.success('Homepage updated!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const saveTestimonials = async () => {
    setSaving(true);
    try {
      await updateTestimonials(testimonials);
      toast.success('Testimonials updated!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const saveContact = async () => {
    setSaving(true);
    try {
      await updateContactInfo(contact);
      toast.success('Contact info updated!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const addTestimonial = () => {
    setTestimonials([...testimonials, { name: '', role: '', text: '', rating: 5 }]);
  };

  const removeTestimonial = (i) => {
    setTestimonials(testimonials.filter((_, idx) => idx !== i));
  };

  const updateTestimonial = (i, key, value) => {
    setTestimonials(testimonials.map((t, idx) => idx === i ? { ...t, [key]: value } : t));
  };

  const tabs = [
    { id: 'homepage', label: 'Homepage' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-dark-800">CMS</h1>
        <p className="text-dark-500 mt-1">Manage website content</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-white border border-dark-200 text-dark-600 hover:bg-dark-50'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <p className="text-center py-12 text-dark-400">Loading...</p> : (
        <>
          {/* Homepage */}
          {activeTab === 'homepage' && (
            <Card>
              <h3 className="font-heading font-bold text-dark-800 mb-6">Homepage Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Banner Text</label>
                  <input type="text" value={homepage.bannerText}
                    onChange={e => setHomepage(h => ({...h, bannerText: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Banner Subtext</label>
                  <textarea rows={3} value={homepage.bannerSubtext}
                    onChange={e => setHomepage(h => ({...h, bannerSubtext: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
                <Button variant="primary" icon={HiSave} onClick={saveHomepage} loading={saving}>Save Changes</Button>
              </div>
            </Card>
          )}

          {/* Testimonials */}
          {activeTab === 'testimonials' && (
            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <Card key={i}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-dark-700">Testimonial #{i + 1}</h4>
                    <button onClick={() => removeTestimonial(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Name" value={t.name} onChange={e => updateTestimonial(i, 'name', e.target.value)}
                      className="px-3 py-2 rounded-xl border border-dark-200 text-sm focus:ring-2 focus:ring-primary-500" />
                    <input type="text" placeholder="Role / Company" value={t.role} onChange={e => updateTestimonial(i, 'role', e.target.value)}
                      className="px-3 py-2 rounded-xl border border-dark-200 text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <textarea rows={2} placeholder="Testimonial text" value={t.text} onChange={e => updateTestimonial(i, 'text', e.target.value)}
                    className="w-full mt-3 px-3 py-2 rounded-xl border border-dark-200 text-sm focus:ring-2 focus:ring-primary-500 resize-none" />
                  <div className="mt-2">
                    <label className="text-xs text-dark-500">Rating: </label>
                    <select value={t.rating} onChange={e => updateTestimonial(i, 'rating', Number(e.target.value))}
                      className="text-xs px-2 py-1 rounded border border-dark-200">
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                </Card>
              ))}
              <div className="flex gap-3">
                <Button variant="secondary" icon={HiPlus} onClick={addTestimonial}>Add Testimonial</Button>
                <Button variant="primary" icon={HiSave} onClick={saveTestimonials} loading={saving}>Save All</Button>
              </div>
            </div>
          )}

          {/* Contact */}
          {activeTab === 'contact' && (
            <Card>
              <h3 className="font-heading font-bold text-dark-800 mb-6">Contact Information</h3>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Phone</label>
                  <input type="text" value={contact.phone}
                    onChange={e => setContact(c => ({...c, phone: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
                  <input type="email" value={contact.email}
                    onChange={e => setContact(c => ({...c, email: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Address</label>
                  <textarea rows={2} value={contact.address}
                    onChange={e => setContact(c => ({...c, address: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
                <Button variant="primary" icon={HiSave} onClick={saveContact} loading={saving}>Save Contact Info</Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCMS;
