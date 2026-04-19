import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse, getLessons, addLesson, deleteLesson } from '../../services/courseService';
import { uploadCourseImage, uploadCourseVideo, uploadCoursePDF } from '../../services/storageService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { formatPrice, getCategoryLabel } from '../../utils/helpers';
import { CATEGORIES, SKILL_LEVELS } from '../../utils/constants';
import { HiPlus, HiPencil, HiTrash, HiEye, HiPhotograph, HiFilm, HiDocumentText } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [showLessons, setShowLessons] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', category: 'soft-skills', price: '',
    installmentEnabled: false, totalInstallments: 3, installmentAmount: '',
    advanceAmount: '', thumbnailUrl: '', trainerInfo: '', duration: '',
    skillLevel: 'beginner', isOffline: false, isPublished: false,
  });
  const [lessonForm, setLessonForm] = useState({
    title: '', moduleName: '', order: 0, duration: '', videoUrl: '', pdfUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadCourses(); }, []);

  const resetForm = () => {
    setForm({
      title: '', description: '', category: 'soft-skills', price: '',
      installmentEnabled: false, totalInstallments: 3, installmentAmount: '',
      advanceAmount: '', thumbnailUrl: '', trainerInfo: '', duration: '',
      skillLevel: 'beginner', isOffline: false, isPublished: false,
    });
    setEditCourse(null);
  };

  const handleEdit = (course) => {
    setForm({
      title: course.title || '', description: course.description || '',
      category: course.category || 'soft-skills', price: course.price || '',
      installmentEnabled: course.installmentEnabled || false,
      totalInstallments: course.installmentPlan?.totalInstallments || 3,
      installmentAmount: course.installmentPlan?.installmentAmount || '',
      advanceAmount: course.advanceAmount || '', thumbnailUrl: course.thumbnailUrl || '',
      trainerInfo: course.trainerInfo || '', duration: course.duration || '',
      skillLevel: course.skillLevel || 'beginner', isOffline: course.isOffline || false,
      isPublished: course.isPublished || false,
    });
    setEditCourse(course);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) { toast.error('Title and Price are required'); return; }

    setUploading(true);
    try {
      const courseData = {
        title: form.title, description: form.description, category: form.category,
        price: Number(form.price), installmentEnabled: form.installmentEnabled,
        installmentPlan: form.installmentEnabled ? {
          totalInstallments: Number(form.totalInstallments),
          installmentAmount: Number(form.installmentAmount),
        } : null,
        advanceAmount: Number(form.advanceAmount) || 0,
        thumbnailUrl: form.thumbnailUrl, trainerInfo: form.trainerInfo,
        duration: form.duration, skillLevel: form.skillLevel,
        isOffline: form.isOffline, isPublished: form.isPublished,
      };

      if (editCourse) {
        await updateCourse(editCourse.id, courseData);
        toast.success('Course updated!');
      } else {
        await createCourse(courseData);
        toast.success('Course created!');
      }

      await loadCourses();
      setShowForm(false);
      resetForm();
    } catch {
      toast.error('Failed to save course');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Delete this course?')) return;
    try {
      await deleteCourse(courseId);
      toast.success('Course deleted');
      loadCourses();
    } catch { toast.error('Delete failed'); }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadCourseImage(editCourse?.id || 'new', file);
      setForm(f => ({ ...f, thumbnailUrl: url }));
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  // Lessons
  const openLessons = async (course) => {
    setShowLessons(course);
    const data = await getLessons(course.id);
    setLessons(data);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title) return;
    try {
      await addLesson(showLessons.id, {
        ...lessonForm,
        order: lessons.length + 1,
      });
      toast.success('Lesson added!');
      const data = await getLessons(showLessons.id);
      setLessons(data);
      setLessonForm({ title: '', moduleName: '', order: 0, duration: '', videoUrl: '', pdfUrl: '' });
    } catch { toast.error('Failed to add lesson'); }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson(showLessons.id, lessonId);
      toast.success('Lesson deleted');
      const data = await getLessons(showLessons.id);
      setLessons(data);
    } catch { toast.error('Failed'); }
  };

  const handleLessonFileUpload = async (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      let url;
      if (type === 'video') url = await uploadCourseVideo(showLessons.id, 'new', file);
      else url = await uploadCoursePDF(showLessons.id, 'new', file);
      setLessonForm(f => ({ ...f, [type === 'video' ? 'videoUrl' : 'pdfUrl']: url }));
      toast.success(`${type} uploaded!`);
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-800">Courses</h1>
          <p className="text-dark-500 mt-1">Manage your training courses and content</p>
        </div>
        <Button variant="primary" icon={HiPlus} onClick={() => { resetForm(); setShowForm(true); }}>
          Add Course
        </Button>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="text-center py-12 text-dark-400">Loading courses...</div>
      ) : courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map(course => (
            <Card key={course.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-100 to-gold-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : <span className="text-2xl">📚</span>}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading font-bold text-dark-800 truncate">{course.title}</h3>
                  <Badge variant={course.isPublished ? 'success' : 'warning'} size="xs">
                    {course.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-dark-500 text-sm truncate">{course.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="info" size="xs">{getCategoryLabel(course.category)}</Badge>
                  <span className="text-sm font-semibold text-dark-700">{formatPrice(course.price)}</span>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openLessons(course)} className="p-2 rounded-lg hover:bg-dark-100 text-dark-400 hover:text-primary-600 transition-colors" title="Manage Lessons">
                  <HiEye className="w-5 h-5" />
                </button>
                <button onClick={() => handleEdit(course)} className="p-2 rounded-lg hover:bg-dark-100 text-dark-400 hover:text-primary-600 transition-colors" title="Edit">
                  <HiPencil className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(course.id)} className="p-2 rounded-lg hover:bg-red-50 text-dark-400 hover:text-red-600 transition-colors" title="Delete">
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-dark-400 mb-4">No courses yet. Create your first course!</p>
          <Button variant="primary" icon={HiPlus} onClick={() => setShowForm(true)}>Create Course</Button>
        </Card>
      )}

      {/* Course Form Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editCourse ? 'Edit Course' : 'New Course'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-dark-700 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-dark-700 mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Skill Level</label>
              <select value={form.skillLevel} onChange={e => setForm(f => ({...f, skillLevel: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500">
                {SKILL_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Duration</label>
              <input type="text" value={form.duration} placeholder="e.g. 4 weeks"
                onChange={e => setForm(f => ({...f, duration: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Advance Amount (₹)</label>
              <input type="number" value={form.advanceAmount} onChange={e => setForm(f => ({...f, advanceAmount: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Trainer Info</label>
              <input type="text" value={form.trainerInfo} onChange={e => setForm(f => ({...f, trainerInfo: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-dark-700 mb-1">Thumbnail</label>
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="text-sm" />
                {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />}
              </div>
            </div>

            {/* Installment Toggle */}
            <div className="sm:col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.installmentEnabled}
                  onChange={e => setForm(f => ({...f, installmentEnabled: e.target.checked}))}
                  className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm text-dark-700">Enable Installments</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isOffline}
                  onChange={e => setForm(f => ({...f, isOffline: e.target.checked}))}
                  className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm text-dark-700">Offline Training</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished}
                  onChange={e => setForm(f => ({...f, isPublished: e.target.checked}))}
                  className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm text-dark-700">Published</span>
              </label>
            </div>

            {form.installmentEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Total Installments</label>
                  <input type="number" value={form.totalInstallments}
                    onChange={e => setForm(f => ({...f, totalInstallments: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Installment Amount (₹)</label>
                  <input type="number" value={form.installmentAmount}
                    onChange={e => setForm(f => ({...f, installmentAmount: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" variant="primary" loading={uploading}>
              {editCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Lessons Modal */}
      <Modal isOpen={!!showLessons} onClose={() => setShowLessons(null)} title={`Lessons — ${showLessons?.title}`} size="xl">
        <div className="space-y-6">
          {/* Existing Lessons */}
          {lessons.length > 0 && (
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <div key={lesson.id} className="flex items-center gap-4 p-3 bg-dark-50 rounded-xl">
                  <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">{i+1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-dark-800 text-sm">{lesson.title}</p>
                    <p className="text-xs text-dark-400">{lesson.moduleName} {lesson.duration && `• ${lesson.duration}`}</p>
                  </div>
                  <div className="flex gap-1">
                    {lesson.videoUrl && <HiFilm className="w-4 h-4 text-blue-500" />}
                    {lesson.pdfUrl && <HiDocumentText className="w-4 h-4 text-red-500" />}
                  </div>
                  <button onClick={() => handleDeleteLesson(lesson.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-dark-400 hover:text-red-600">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Lesson Form */}
          <div className="border-t border-dark-100 pt-4">
            <h4 className="font-heading font-semibold text-dark-800 mb-3">Add Lesson</h4>
            <form onSubmit={handleAddLesson} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Lesson Title" value={lessonForm.title}
                  onChange={e => setLessonForm(f => ({...f, title: e.target.value}))}
                  className="px-3 py-2 rounded-xl border border-dark-200 text-sm focus:ring-2 focus:ring-primary-500" />
                <input type="text" placeholder="Module Name" value={lessonForm.moduleName}
                  onChange={e => setLessonForm(f => ({...f, moduleName: e.target.value}))}
                  className="px-3 py-2 rounded-xl border border-dark-200 text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Duration (e.g. 30 min)" value={lessonForm.duration}
                  onChange={e => setLessonForm(f => ({...f, duration: e.target.value}))}
                  className="px-3 py-2 rounded-xl border border-dark-200 text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <HiFilm className="w-4 h-4 text-blue-500" />
                  <input type="file" accept="video/*" onChange={e => handleLessonFileUpload('video', e)} className="text-xs" />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <HiDocumentText className="w-4 h-4 text-red-500" />
                  <input type="file" accept=".pdf" onChange={e => handleLessonFileUpload('pdf', e)} className="text-xs" />
                </label>
              </div>
              <Button type="submit" variant="primary" size="sm" icon={HiPlus} loading={uploading}>Add Lesson</Button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCourses;
