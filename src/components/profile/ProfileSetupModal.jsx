import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { calculateAge } from '../../utils/helpers';
import { HiShieldCheck, HiX } from 'react-icons/hi';

const ProfileSetupModal = ({ isOpen, onClose, onComplete }) => {
  const { user, userData, refreshUser } = useAuth();
  
  const [form, setForm] = useState({
    name: userData?.name || '',
    countryCode: userData?.countryCode || '+91',
    phone: userData?.phone || '',
    dob: userData?.dob || '',
    gender: userData?.gender || '',
    profession: userData?.profession || '',
    state: userData?.state || '',
    country: userData?.country || 'India',
  });
  
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.dob || !form.gender || !form.profession) {
      toast.error('Please fill in all strictly required fields.');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...form,
        isProfileComplete: true,
      });
      await refreshUser();
      toast.success('Profile completed successfully!');
      if (onComplete) onComplete();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentAge = calculateAge(form.dob);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 custom-shadow border border-dark-100">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-dark-50 text-dark-400">
          <HiX className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <HiShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-dark-900">Complete Your Profile</h2>
              <p className="text-dark-500 text-sm">Strictly required before course enrollment.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Official Full Name *</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="As per official identification"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Mobile Number *</label>
                <div className="flex gap-2">
                  <select name="countryCode" value={form.countryCode} onChange={handleChange} className="w-24 px-3 py-3 rounded-xl border border-dark-200 bg-white outline-none">
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    className="flex-1 px-4 py-3 rounded-xl border border-dark-200 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Email Address</label>
                <input
                  type="email" value={userData?.email || ''} disabled
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 bg-dark-50 text-dark-400 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-700 mb-1">Date of Birth *</label>
                <input
                  type="date" name="dob" value={form.dob} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Age</label>
                <div className="w-full px-4 py-3 rounded-xl border border-transparent bg-primary-50 text-primary-800 font-semibold text-center">
                  {currentAge !== null && currentAge >= 0 ? `${currentAge} yrs` : '-'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-dark-200 outline-none bg-white">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Profession *</label>
                <input
                  type="text" name="profession" value={form.profession} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 outline-none"
                  placeholder="E.g., HR Professional, Student"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">State / Province</label>
                <input
                  type="text" name="state" value={form.state} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 outline-none"
                  placeholder="Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Country</label>
                <input
                  type="text" name="country" value={form.country} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-dark-200 outline-none"
                  placeholder="India"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-dark-100 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" variant="primary" loading={loading}>Save & Continue Enrollment</Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
