import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPublishedCourses } from '../services/courseService';
import CourseCard from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import { SkeletonCard } from '../components/ui/Loader';
import { HiSearch, HiAdjustments } from 'react-icons/hi';

const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    skillLevel: '',
    priceRange: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublishedCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let result = [...courses];

    if (filters.category) {
      result = result.filter(c => c.category === filters.category);
    }
    if (filters.skillLevel) {
      result = result.filter(c => c.skillLevel === filters.skillLevel);
    }
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'free': result = result.filter(c => c.price === 0); break;
        case 'under-1000': result = result.filter(c => c.price > 0 && c.price < 1000); break;
        case '1000-5000': result = result.filter(c => c.price >= 1000 && c.price <= 5000); break;
        case '5000-plus': result = result.filter(c => c.price > 5000); break;
      }
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(s) ||
        c.description?.toLowerCase().includes(s)
      );
    }

    setFilteredCourses(result);
  }, [courses, filters, search]);

  return (
    <div className="min-h-screen bg-dark-50">
      <section className="bg-white border-b border-dark-100 pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark-900 mb-3">
            Explore Our <span className="text-primary-700">Courses</span>
          </h1>
          <p className="text-dark-600 max-w-2xl text-lg mb-8">
            Discover corporate training programs designed to accelerate your professional growth.
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search training programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-dark-200 text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow custom-shadow"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-dark-100 shadow-sm">
              <CourseFilters
                filters={filters}
                onChange={setFilters}
                onClear={() => setFilters({ category: '', skillLevel: '', priceRange: '' })}
              />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-4 rounded-2xl bg-primary-600 text-white shadow-xl hover:bg-primary-700 transition-colors"
            >
              <HiAdjustments className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Filter Panel */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-dark-900/50 backdrop-blur-sm">
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-4">
                <button onClick={() => setShowFilters(false)} className="mb-4 text-dark-400">✕ Close</button>
                <CourseFilters
                  filters={filters}
                  onChange={setFilters}
                  onClear={() => setFilters({ category: '', skillLevel: '', priceRange: '' })}
                />
              </div>
            </div>
          )}

          {/* Courses Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-dark-500 text-sm">
                {loading ? 'Loading...' : `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dark-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-20 h-20 mb-6 rounded-full bg-primary-50 flex items-center justify-center text-primary-400">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-dark-800 mb-2">No Courses Found</h3>
                <p className="text-dark-500 max-w-sm">We couldn't find any training programs matching your current criteria. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
