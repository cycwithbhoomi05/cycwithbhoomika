import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { BRAND } from '../utils/constants';
import { FcGoogle } from 'react-icons/fc';
import { HiMail, HiLockClosed, HiUser, HiPhone } from 'react-icons/hi';
import toast from 'react-hot-toast';
import logoImg from '../assets/images/logo_wb.png';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.phone);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success('Successfully signed in');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-dark-50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-dark-200/20 border border-dark-100 p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              <img src={logoImg} alt={BRAND.name} className="h-10 w-auto" />
              <span className="font-heading font-bold text-2xl text-dark-900 tracking-tight">{BRAND.name}</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold text-dark-900 mb-2">Create an Account</h1>
            <p className="text-dark-500 text-sm">Join to access world-class training programs.</p>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-dark-200 hover:border-dark-300 hover:bg-dark-50 transition-all font-medium text-dark-700 mb-6 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            <FcGoogle className="w-5 h-5" />
            Sign up with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-dark-500">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-dark-200 text-dark-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Email</label>
                <div className="relative">
                  <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-dark-200 text-dark-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Phone</label>
                <div className="relative">
                  <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-dark-200 text-dark-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow outline-none"
                    placeholder="+91"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-dark-200 text-dark-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Confirm</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => updateForm('confirmPassword', e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-dark-200 text-dark-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-dark-500 text-center mt-4">
              By creating an account, you agree to our <Link to="/terms" className="text-primary-600 hover:underline">Terms & Conditions</Link>.
            </p>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full !rounded-xl !py-3 mt-4">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-dark-500 text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-700 font-semibold hover:text-primary-800 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
