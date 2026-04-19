import { useState, useEffect } from 'react';
import { getAllPayments, updatePayment } from '../../services/paymentService';
import { getCourseById } from '../../services/courseService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatPrice, formatDate } from '../../utils/helpers';
import { HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const pays = await getAllPayments();
        setPayments(pays);

        const courseMap = {};
        for (const p of pays) {
          if (p.courseId && !courseMap[p.courseId]) {
            const c = await getCourseById(p.courseId);
            if (c) courseMap[p.courseId] = c;
          }
        }
        setCourses(courseMap);
      } catch { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      await updatePayment(paymentId, { status: newStatus });
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: newStatus } : p));
      toast.success('Payment status updated');
    } catch { toast.error('Failed to update'); }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'captured': return 'success';
      case 'created': return 'info';
      case 'failed': return 'danger';
      case 'refunded': return 'warning';
      default: return 'default';
    }
  };

  const totalRevenue = payments.filter(p => p.status === 'captured').reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-800">Payments</h1>
          <p className="text-dark-500 mt-1">Total Revenue: <span className="font-bold text-dark-800">{formatPrice(totalRevenue)}</span></p>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input type="text" placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
      </div>

      {loading ? (
        <p className="text-center py-12 text-dark-400">Loading...</p>
      ) : (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Date</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Course</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Type</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Amount</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Status</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} className="border-b border-dark-50 hover:bg-dark-50 transition-colors">
                    <td className="py-3 px-5 text-sm text-dark-600">{formatDate(payment.createdAt)}</td>
                    <td className="py-3 px-5 text-sm font-medium text-dark-800">{courses[payment.courseId]?.title || 'Course'}</td>
                    <td className="py-3 px-5"><Badge variant="info" size="xs">{payment.paymentType}</Badge></td>
                    <td className="py-3 px-5 text-sm font-semibold text-dark-800">{formatPrice(payment.amount)}</td>
                    <td className="py-3 px-5"><Badge variant={getStatusVariant(payment.status)} size="xs">{payment.status}</Badge></td>
                    <td className="py-3 px-5">
                      <select
                        value={payment.status}
                        onChange={e => handleStatusChange(payment.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg border border-dark-200 focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="created">Created</option>
                        <option value="captured">Captured</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {payments.length === 0 && <div className="text-center py-12 text-dark-400">No payments yet.</div>}
        </Card>
      )}
    </div>
  );
};

export default AdminPayments;
