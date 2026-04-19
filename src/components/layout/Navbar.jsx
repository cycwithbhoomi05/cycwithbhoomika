import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BRAND, ROUTES } from '../../utils/constants';
import { HiMenu, HiX, HiUser, HiLogout, HiChevronDown } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, userData, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.COURSES, label: 'Courses' },
    { path: ROUTES.ABOUT, label: 'About' },
    { path: ROUTES.CONTACT, label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        scrolled ? 'shadow-sm border-b border-dark-100 py-1' : 'py-3 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-dark-800 tracking-tight">
                {BRAND.name}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-700 bg-primary-50 font-semibold'
                    : 'text-dark-600 hover:text-primary-700 hover:bg-dark-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons & User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-dark-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-bold border border-primary-200">
                    {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-dark-700 max-w-[120px] truncate">
                    {userData?.name || 'User'}
                  </span>
                  <HiChevronDown className={`w-4 h-4 text-dark-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-dark-100 py-1">
                    {isAdmin && (
                      <Link
                        to={ROUTES.ADMIN}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <MdDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to={ROUTES.DASHBOARD}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      <HiUser className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <div className="h-px bg-dark-100 my-1 px-4" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-dark-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <HiLogout className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="text-sm font-semibold text-dark-600 hover:text-primary-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-5 py-2.5 rounded-lg bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-dark-600 hover:bg-dark-50"
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-dark-100 shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-dark-600 hover:bg-dark-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-dark-100 my-4" />
            {user ? (
              <>
                {isAdmin && (
                  <Link to={ROUTES.ADMIN} className="block px-4 py-3 rounded-lg text-base font-medium text-dark-700 hover:bg-primary-50">
                    Admin Panel
                  </Link>
                )}
                <Link to={ROUTES.DASHBOARD} className="block px-4 py-3 rounded-lg text-base font-medium text-dark-700 hover:bg-primary-50">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-dark-600 hover:bg-red-50 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link to={ROUTES.LOGIN} className="w-full text-center px-4 py-3 rounded-lg border border-dark-200 text-dark-700 text-base font-medium hover:bg-dark-50">
                  Sign In
                </Link>
                <Link to={ROUTES.REGISTER} className="w-full text-center px-4 py-3 rounded-lg bg-primary-700 text-white text-base font-semibold hover:bg-primary-800">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
