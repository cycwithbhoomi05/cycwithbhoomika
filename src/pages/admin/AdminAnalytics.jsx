import { useState, useEffect } from 'react';
import { getAllPayments } from '../../services/paymentService';
import { getCourses } from '../../services/courseService';
import { getAllEnrollments } from '../../services/enrollmentService';
import Card from '../../components/ui/Card';
import { formatPrice } from '../../utils/helpers';
import { HiTrendingUp, HiCurrencyRupee, HiUsers, HiAcademicCap } from 'react-icons/hi';

const AdminAnalytics = () => {
  const [data, setData] = useState({ payments: [], courses: [], enrollments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [payments, courses, enrollments] = await Promise.all([
          getAllPayments(), getCourses(), getAllEnrollments()
        ]);
        setData({ payments, courses, enrollments });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const totalRevenue = data.payments.filter(p => p.status === 'captured').reduce((s, p) => s + (p.amount || 0), 0);
  const avgOrderValue = data.payments.length > 0 ? totalRevenue / data.payments.filter(p => p.status === 'captured').length : 0;

  // Course popularity
  const courseEnrollCounts = {};
  data.enrollments.forEach(e => {
    courseEnrollCounts[e.courseId] = (courseEnrollCounts[e.courseId] || 0) + 1;
  });

  const popularCourses = data.courses
    .map(c => ({ ...c, enrollCount: courseEnrollCounts[c.id] || 0 }))
    .sort((a, b) => b.enrollCount - a.enrollCount)
    .slice(0, 5);

  // Category distribution
  const categoryDist = {};
  data.courses.forEach(c => {
    categoryDist[c.category] = (categoryDist[c.category] || 0) + 1;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-dark-800">Analytics</h1>
        <p className="text-dark-500 mt-1">Platform performance overview</p>
      </div>

      {loading ? <p className="text-center py-12 text-dark-400">Loading analytics...</p> : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: HiCurrencyRupee, color: 'text-green-600 bg-green-100' },
              { label: 'Total Enrollments', value: data.enrollments.length, icon: HiUsers, color: 'text-blue-600 bg-blue-100' },
              { label: 'Active Courses', value: data.courses.filter(c => c.isPublished).length, icon: HiAcademicCap, color: 'text-purple-600 bg-purple-100' },
              { label: 'Avg Order Value', value: formatPrice(avgOrderValue || 0), icon: HiTrendingUp, color: 'text-amber-600 bg-amber-100' },
            ].map((stat, i) => (
              <Card key={i}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-500">{stat.label}</p>
                    <p className="font-heading text-xl font-bold text-dark-800">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Courses */}
            <Card>
              <h3 className="font-heading font-bold text-dark-800 mb-4">Popular Courses</h3>
              {popularCourses.length > 0 ? (
                <div className="space-y-3">
                  {popularCourses.map((course, i) => (
                    <div key={course.id} className="flex items-center gap-3 p-3 bg-dark-50 rounded-xl">
                      <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark-800 text-sm truncate">{course.title}</p>
                      </div>
                      <span className="text-sm font-semibold text-dark-600">{course.enrollCount} enrolls</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-dark-400 text-sm">No enrollment data yet.</p>}
            </Card>

            {/* Category Distribution */}
            <Card>
              <h3 className="font-heading font-bold text-dark-800 mb-4">Courses by Category</h3>
              {Object.keys(categoryDist).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(categoryDist).map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between p-3 bg-dark-50 rounded-xl">
                      <span className="text-sm text-dark-700 capitalize">{cat.replace(/-/g, ' ')}</span>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-dark-400 text-sm">No courses created yet.</p>}
            </Card>

            {/* Payment Types */}
            <Card>
              <h3 className="font-heading font-bold text-dark-800 mb-4">Payment Types</h3>
              {data.payments.length > 0 ? (
                <div className="space-y-3">
                  {['full', 'installment', 'advance'].map(type => {
                    const count = data.payments.filter(p => p.paymentType === type).length;
                    const total = data.payments.filter(p => p.paymentType === type && p.status === 'captured')
                      .reduce((s, p) => s + (p.amount || 0), 0);
                    return (
                      <div key={type} className="flex items-center justify-between p-3 bg-dark-50 rounded-xl">
                        <div>
                          <span className="text-sm font-medium text-dark-700 capitalize">{type}</span>
                          <span className="text-xs text-dark-400 ml-2">({count} payments)</span>
                        </div>
                        <span className="font-semibold text-dark-800 text-sm">{formatPrice(total)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-dark-400 text-sm">No payments yet.</p>}
            </Card>

            {/* Conversion */}
            <Card>
              <h3 className="font-heading font-bold text-dark-800 mb-4">Conversion Metrics</h3>
              <div className="space-y-4">
                <div className="p-4 bg-dark-50 rounded-xl">
                  <p className="text-xs text-dark-500">Completion Rate</p>
                  <p className="font-heading text-2xl font-bold text-dark-800">
                    {data.enrollments.length > 0
                      ? Math.round((data.enrollments.filter(e => e.progress >= 100).length / data.enrollments.length) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="p-4 bg-dark-50 rounded-xl">
                  <p className="text-xs text-dark-500">Average Progress</p>
                  <p className="font-heading text-2xl font-bold text-dark-800">
                    {data.enrollments.length > 0
                      ? Math.round(data.enrollments.reduce((s, e) => s + (e.progress || 0), 0) / data.enrollments.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
