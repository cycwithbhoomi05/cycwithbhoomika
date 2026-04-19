import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/helpers';
import { HiSearch } from 'react-icons/hi';

const AdminStudents = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = users.filter(u =>
    u.role === 'student' &&
    (!search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-800">Students</h1>
          <p className="text-dark-500 mt-1">{filtered.length} registered students</p>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input
          type="text" placeholder="Search students..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <p className="text-center py-12 text-dark-400">Loading...</p>
      ) : (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Student</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Email</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Phone</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Joined</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-b border-dark-50 hover:bg-dark-50 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-dark-800 text-sm">{user.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-sm text-dark-600">{user.email}</td>
                    <td className="py-3 px-5 text-sm text-dark-600">{user.phone || '—'}</td>
                    <td className="py-3 px-5 text-sm text-dark-500">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-5"><Badge variant="primary" size="xs">{user.role}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-dark-400">No students found.</div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdminStudents;
