import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { getCoursesCount } from '../../services/courseService';
import { getEnrollmentsCount } from '../../services/enrollmentService';
import { getTotalRevenue } from '../../services/paymentService';
import { formatPrice } from '../../utils/helpers';
import { HiAcademicCap, HiUsers, HiCurrencyRupee, HiTrendingUp, HiExclamation } from 'react-icons/hi';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ courses: 0, enrollments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [courses, enrollments, revenue] = await Promise.all([
          getCoursesCount(),
          getEnrollmentsCount(),
          getTotalRevenue(),
        ]);
        setStats({ courses, enrollments, revenue });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleWipeData = async () => {
    if (!window.confirm("CRITICAL WARNING: This will permanently delete ALL courses, enrollments, payments, and users (except you). Are you absolutely sure?")) return;
    if (prompt("Type 'WIPE' to confirm.") !== "WIPE") {
      toast.error('Wipe cancelled.');
      return;
    }

    setWiping(true);
    let deletedCount = 0;
    try {
      const collectionsToWipe = ['courses', 'enrollments', 'payments', 'lessons'];
      for (const colName of collectionsToWipe) {
        const snap = await getDocs(collection(db, colName));
        for (const d of snap.docs) {
          await deleteDoc(doc(db, colName, d.id));
          deletedCount++;
        }
      }
      
      const usersSnap = await getDocs(collection(db, 'users'));
      for (const d of usersSnap.docs) {
        if (d.data()?.role !== 'admin' && d.id !== user?.uid) {
          await deleteDoc(doc(db, 'users', d.id));
          deletedCount++;
        }
      }

      toast.success(`System wiped successfully! Removed ${deletedCount} documents.`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to wipe some data.');
    } finally {
      setWiping(false);
    }
  };

  const statCards = [
    { title: 'Total Courses', value: stats.courses, icon: HiAcademicCap, gradient: 'from-blue-500 to-blue-600', change: '+2 this month' },
    { title: 'Total Enrollments', value: stats.enrollments, icon: HiUsers, gradient: 'from-green-500 to-green-600', change: '+12 this month' },
    { title: 'Total Revenue', value: formatPrice(stats.revenue), icon: HiCurrencyRupee, gradient: 'from-gold-500 to-gold-600', change: '+18% vs last month' },
    { title: 'Conversion Rate', value: stats.enrollments > 0 ? '12%' : '0%', icon: HiTrendingUp, gradient: 'from-purple-500 to-purple-600', change: '+3% improvement' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-dark-800">Dashboard</h1>
        <p className="text-dark-500 mt-1">Welcome back! Here's an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-6 translate-x-6`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-dark-500 font-medium">{stat.title}</p>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="font-heading text-2xl font-bold text-dark-800">
                {loading ? '...' : stat.value}
              </p>
              <p className="text-xs text-green-600 mt-1 font-medium">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-heading font-bold text-dark-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Course', href: '/admin/courses', icon: '📚' },
              { label: 'View Students', href: '/admin/students', icon: '👥' },
              { label: 'Manage Payments', href: '/admin/payments', icon: '💰' },
              { label: 'Update Homepage', href: '/admin/cms', icon: '🎨' },
            ].map((action, i) => (
              <a key={i} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 transition-colors group">
                <span className="text-xl">{action.icon}</span>
                <span className="text-sm font-medium text-dark-700 group-hover:text-primary-700">{action.label}</span>
              </a>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-heading font-bold text-dark-800 mb-4">Platform Status</h3>
          <div className="space-y-4">
            {[
              { label: 'Firebase Auth', status: 'Active', color: 'bg-green-500' },
              { label: 'Firestore', status: 'Active', color: 'bg-green-500' },
              { label: 'Storage', status: 'Active', color: 'bg-green-500' },
              { label: 'Razorpay', status: 'Setup Pending', color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-dark-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-dark-500">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <div className="mt-8">
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <HiExclamation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-red-800">Danger Zone</h3>
              <p className="text-red-600 text-sm">Wipe all demo data from the system.</p>
            </div>
          </div>
          <button 
            onClick={handleWipeData} 
            disabled={wiping}
            className="px-6 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {wiping ? 'Erasing System...' : 'Wipe Clean'}
          </button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
