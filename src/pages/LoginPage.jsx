import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { BRAND } from '../utils/constants';
import { FcGoogle } from 'react-icons/fc';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Sign in successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
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

  return (
    <div className="min-h-screen bg-dark-50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-dark-200/20 border border-dark-100 p-8 sm:p-10">
          
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <span className="font-heading font-bold text-2xl text-dark-900 tracking-tight">{BRAND.name}</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold text-dark-900 mb-2">Welcome Back</h1>
            <p className="text-dark-500 text-sm">Please enter your details to sign in.</p>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-dark-200 hover:border-dark-300 hover:bg-dark-50 transition-all font-medium text-dark-700 mb-6 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-dark-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Email Address</label>
              <div className="relative">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-dark-200 text-dark-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-dark-200 text-dark-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 border-dark-300 rounded focus:ring-primary-500" />
                  <span className="text-sm text-dark-600">Remember me</span>
               </label>
               <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot password?</a>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full !rounded-xl !py-3">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-dark-500 text-sm mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-700 font-semibold hover:text-primary-800 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
