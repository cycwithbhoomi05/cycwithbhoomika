import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/helpers';
import { getEnrollmentsByUser } from '../../services/enrollmentService';
import { getCourseById } from '../../services/courseService';
import { HiSearch, HiX, HiOutlineBriefcase, HiOutlineLocationMarker, HiOutlineMap, HiDocumentText } from 'react-icons/hi';

const AdminStudents = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

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

  const handleViewStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingCourses(true);
    setStudentCourses([]);
    try {
      const enrolls = await getEnrollmentsByUser(student.id);
      const courses = [];
      for (const e of enrolls) {
        const c = await getCourseById(e.courseId);
        if (c) {
          courses.push({ ...e, courseDetails: c });
        }
      }
      setStudentCourses(courses);
    } catch (err) {
      console.error('Failed to load courses for student', err);
    } finally {
      setLoadingCourses(false);
    }
  };

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
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Contact</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Profession</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Location</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Status</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-dark-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-b border-dark-50 hover:bg-dark-50 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border border-primary-200 flex items-center justify-center text-primary-700 text-sm font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-dark-800 text-sm">{user.name || 'N/A'}</p>
                          <p className="text-xs text-dark-500">{user.gender || 'Not specified'} • {user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() + ' yrs' : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <p className="text-sm text-dark-700">{user.email}</p>
                      <p className="text-xs text-dark-500">{user.countryCode || '+91'} {user.phone || '—'}</p>
                    </td>
                    <td className="py-3 px-5 text-sm text-dark-600">{user.profession || '—'}</td>
                    <td className="py-3 px-5 text-sm text-dark-600 truncate max-w-[120px]">{user.state || user.country ? `${user.state || ''}${user.state && user.country ? ', ' : ''}${user.country || ''}` : '—'}</td>
                    <td className="py-3 px-5">
                      <Badge variant={user.isProfileComplete ? 'success' : 'warning'} size="xs">
                        {user.isProfileComplete ? 'Complete' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button 
                        onClick={() => handleViewStudent(user)}
                        className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold hover:bg-primary-100"
                      >
                        View Details
                      </button>
                    </td>
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

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)} />
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 custom-shadow border border-dark-100">
            <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-dark-50 text-dark-400">
              <HiX className="w-5 h-5" />
            </button>
            <div className="p-8">
              <h2 className="font-heading text-2xl font-bold text-dark-900 mb-6">Student Profile Overview</h2>
              
              {/* Profile Block */}
              <div className="bg-dark-50 rounded-2xl p-6 mb-8 border border-dark-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-dark-500 uppercase tracking-widest font-semibold mb-1">Official Name</p>
                  <p className="text-dark-900 font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-500 uppercase tracking-widest font-semibold mb-1">Contact</p>
                  <p className="text-dark-900 font-medium">{selectedStudent.email}</p>
                  <p className="text-dark-600 text-sm">{selectedStudent.countryCode || '+91'} {selectedStudent.phone || 'No phone'}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-500 uppercase tracking-widest font-semibold mb-1">Demographics</p>
                  <p className="text-dark-900 font-medium">{selectedStudent.gender || 'N/A'}, DOB: {selectedStudent.dob || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-500 uppercase tracking-widest font-semibold mb-1">Profession & Location</p>
                  <p className="text-dark-900 font-medium">{selectedStudent.profession || 'N/A'}</p>
                  <p className="text-dark-600 text-sm">{selectedStudent.state || 'N/A'}, {selectedStudent.country || 'N/A'}</p>
                </div>
              </div>

              {/* Enrollments Block */}
              <h3 className="font-heading font-bold text-xl text-dark-800 mb-4 flex items-center gap-2">
                <HiOutlineBriefcase className="text-primary-600" /> Active Enrollments
              </h3>
              
              {loadingCourses ? (
                <p className="text-dark-500 text-sm">Fetching enrollments...</p>
              ) : studentCourses.length > 0 ? (
                <div className="space-y-4">
                  {studentCourses.map(enr => (
                    <div key={enr.id} className="flex items-center justify-between p-4 rounded-xl border border-dark-200 hover:border-primary-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                          <HiDocumentText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-dark-800">{enr.courseDetails?.title || 'Unknown Course'}</p>
                          <p className="text-xs text-dark-500">Enrolled: {formatDate(enr.createdAt)} • Type: {enr.paymentType?.toUpperCase()}</p>
                        </div>
                      </div>
                      <Badge variant={enr.paymentStatus === 'active' ? 'success' : 'warning'} size="sm">
                        {enr.paymentStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-dark-50 rounded-xl border border-dark-100">
                  <p className="text-dark-500">No active course enrollments found for this student.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
