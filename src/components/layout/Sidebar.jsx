import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES, BRAND } from '../../utils/constants';
import {
  HiHome, HiAcademicCap, HiUsers, HiCreditCard,
  HiTemplate, HiBell, HiChartBar, HiArrowLeft, HiLogout
} from 'react-icons/hi';

const adminLinks = [
  { path: ROUTES.ADMIN, label: 'Dashboard', icon: HiHome, end: true },
  { path: ROUTES.ADMIN_COURSES, label: 'Courses', icon: HiAcademicCap },
  { path: ROUTES.ADMIN_STUDENTS, label: 'Students', icon: HiUsers },
  { path: ROUTES.ADMIN_PAYMENTS, label: 'Payments', icon: HiCreditCard },
  { path: ROUTES.ADMIN_CMS, label: 'CMS', icon: HiTemplate },
  { path: ROUTES.ADMIN_NOTIFICATIONS, label: 'Notifications', icon: HiBell },
  { path: ROUTES.ADMIN_ANALYTICS, label: 'Analytics', icon: HiChartBar },
];

const Sidebar = () => {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900 text-white flex flex-col z-50">
      {/* Brand */}
      <div className="p-5 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-white font-bold text-lg">
            C
          </div>
          <div>
            <p className="font-heading font-bold text-sm">Admin Panel</p>
            <p className="text-dark-400 text-xs">{BRAND.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {adminLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'text-dark-400 hover:bg-dark-800 hover:text-white'
              }`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700 space-y-2">
        <NavLink
          to={ROUTES.HOME}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-dark-400 hover:bg-dark-800 hover:text-white transition-all"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Site
        </NavLink>

        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center text-white text-xs font-bold">
            {userData?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userData?.name || 'Admin'}</p>
            <p className="text-xs text-dark-500 truncate">{userData?.email}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-red-400 transition-colors">
            <HiLogout className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
