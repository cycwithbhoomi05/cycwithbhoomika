import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getEnrollmentsByUser } from '../services/enrollmentService';
import { getPaymentsByUser } from '../services/paymentService';
import { getCourseById } from '../services/courseService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { PageLoader } from '../components/ui/Loader';
import { formatPrice, formatDate, getCategoryLabel, calculateAge } from '../utils/helpers';
import { HiAcademicCap, HiCreditCard, HiUser, HiBadgeCheck, HiDownload } from 'react-icons/hi';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [coursesData, setCoursesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const { refreshUser } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    name: '', phone: '', countryCode: '+91', dob: '', gender: '', profession: '', state: '', country: ''
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const enrs = await getEnrollmentsByUser(user.uid);
        setEnrollments(enrs);

        const pays = await getPaymentsByUser(user.uid);
        setPayments(pays);

        const courseMap = {};
        for (const e of enrs) {
          if (!courseMap[e.courseId]) {
            const c = await getCourseById(e.courseId);
            if (c) courseMap[e.courseId] = c;
          }
        }
        setCoursesData(courseMap);
        
        if (userData) {
          setProfileForm({
            name: userData.name || '',
            phone: userData.phone || '',
            countryCode: userData.countryCode || '+91',
            dob: userData.dob || '',
            gender: userData.gender || '',
            profession: userData.profession || '',
            state: userData.state || '',
            country: userData.country || 'India',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate, userData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { ...profileForm });
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  const tabs = [
    { id: 'courses', label: 'My Courses', icon: HiAcademicCap },
    { id: 'payments', label: 'Payments', icon: HiCreditCard },
    { id: 'certificates', label: 'Certificates', icon: HiBadgeCheck },
    { id: 'profile', label: 'Profile', icon: HiUser },
  ];

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-dark-900 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold text-2xl">
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Welcome, {userData?.name || 'Learner'}!
              </h1>
              <p className="text-primary-200">{userData?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-dark-100 p-1.5 flex gap-1 mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-dark-500 hover:bg-dark-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <div>
            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map(enrollment => {
                  const course = coursesData[enrollment.courseId];
                  if (!course) return null;
                  return (
                    <Card key={enrollment.id} hover>
                      <div className="h-36 -mx-6 -mt-6 mb-4 bg-gradient-to-br from-primary-100 to-gold-50 rounded-t-2xl flex items-center justify-center">
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover rounded-t-2xl" />
                        ) : (
                          <span className="text-4xl">📚</span>
                        )}
                      </div>
                      <Badge variant="primary" size="xs">{getCategoryLabel(course.category)}</Badge>
                      <h3 className="font-heading font-bold text-dark-800 mt-2 mb-3">{course.title}</h3>
                      <ProgressBar progress={enrollment.progress || 0} />
                      <div className="mt-4 flex justify-between items-center">
                        <Badge variant={enrollment.paymentStatus === 'active' ? 'success' : 'warning'} size="xs">
                          {enrollment.paymentStatus}
                        </Badge>
                        <Link
                          to={`/courses/${enrollment.courseId}`}
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                        >
                          Continue →
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="font-heading text-xl font-bold text-dark-800 mb-2">No Courses Yet</h3>
                <p className="text-dark-500 mb-6">Start your learning journey by enrolling in a course.</p>
                <Link to="/courses" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <Card>
            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-dark-500 uppercase">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-dark-500 uppercase">Course</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-dark-500 uppercase">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-dark-500 uppercase">Amount</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-dark-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(pay => (
                      <tr key={pay.id} className="border-b border-dark-50 hover:bg-dark-50">
                        <td className="py-3 px-4 text-sm text-dark-600">{formatDate(pay.createdAt)}</td>
                        <td className="py-3 px-4 text-sm text-dark-800 font-medium">{coursesData[pay.courseId]?.title || 'Course'}</td>
                        <td className="py-3 px-4"><Badge variant="info" size="xs">{pay.paymentType}</Badge></td>
                        <td className="py-3 px-4 text-sm font-semibold text-dark-800">{formatPrice(pay.amount)}</td>
                        <td className="py-3 px-4">
                          <Badge variant={pay.status === 'captured' ? 'success' : 'warning'} size="xs">
                            {pay.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-dark-400">No payment history yet.</p>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'certificates' && (
          <div>
            {enrollments.filter(e => e.progress >= 100).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.filter(e => e.progress >= 100).map(enrollment => {
                  const course = coursesData[enrollment.courseId];
                  return (
                    <Card key={enrollment.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-2xl">
                        🏆
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading font-bold text-dark-800">{course?.title}</h4>
                        <p className="text-sm text-dark-500">Completed • Certificate Available</p>
                      </div>
                      {enrollment.certificateUrl && (
                        <a href={enrollment.certificateUrl} target="_blank" rel="noreferrer"
                          className="p-2 rounded-lg bg-gold-100 text-gold-700 hover:bg-gold-200 transition-colors">
                          <HiDownload className="w-5 h-5" />
                        </a>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="font-heading text-xl font-bold text-dark-800 mb-2">No Certificates Yet</h3>
                <p className="text-dark-500">Complete a course to earn your certificate.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <Card className="max-w-3xl">
            <h3 className="font-heading font-bold text-xl text-dark-800 mb-6">Profile Information</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1">Official Full Name</label>
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1">Email <span className="text-xs font-normal text-dark-400">(Cannot be changed)</span></label>
                  <input type="email" value={userData?.email || ''} disabled className="w-full px-4 py-3 rounded-xl border border-dark-200 bg-dark-50 text-dark-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <select value={profileForm.countryCode} onChange={e => setProfileForm({...profileForm, countryCode: e.target.value})} className="w-24 px-3 py-3 rounded-xl border border-dark-200 bg-white">
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                    </select>
                    <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="flex-1 w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1">Date of Birth</label>
                  <div className="flex gap-3">
                    <input type="date" value={profileForm.dob} onChange={e => setProfileForm({...profileForm, dob: e.target.value})} className="flex-1 px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" />
                    <div className="w-20 px-3 py-3 rounded-xl bg-primary-50 text-primary-800 text-center font-semibold">
                      {calculateAge(profileForm.dob) !== null && calculateAge(profileForm.dob) >= 0 ? `${calculateAge(profileForm.dob)}y` : '-'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1">Profession</label>
                  <input type="text" value={profileForm.profession} onChange={e => setProfileForm({...profileForm, profession: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1">Gender</label>
                  <select value={profileForm.gender} onChange={e => setProfileForm({...profileForm, gender: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-dark-200 bg-white focus:ring-2 focus:ring-primary-500">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1">State / Province</label>
                  <input type="text" value={profileForm.state} onChange={e => setProfileForm({...profileForm, state: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1">Country</label>
                  <input type="text" value={profileForm.country} onChange={e => setProfileForm({...profileForm, country: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={profileSaving} className="px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2">
                  {profileSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </Card>
        )}
      </div>

      <div className="h-16" />
    </div>
  );
};

export default DashboardPage;
