import { Link } from 'react-router-dom';
import { formatPrice, getCategoryLabel, getCategoryColor, truncateText } from '../../utils/helpers';
import Badge from '../ui/Badge';
import { HiClock, HiAcademicCap } from 'react-icons/hi';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-gold-50 overflow-hidden">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl opacity-30">📚</div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(course.category)}`}>
              {getCategoryLabel(course.category)}
            </span>
          </div>

          {/* Offline Badge */}
          {course.isOffline && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" size="xs">Offline</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading font-bold text-dark-800 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-dark-500 text-sm mb-4 line-clamp-2">
            {truncateText(course.description, 100)}
          </p>

          <div className="flex items-center gap-4 mb-4 text-dark-400 text-xs">
            {course.duration && (
              <span className="flex items-center gap-1">
                <HiClock className="w-3.5 h-3.5" />
                {course.duration}
              </span>
            )}
            {course.skillLevel && (
              <span className="flex items-center gap-1">
                <HiAcademicCap className="w-3.5 h-3.5" />
                {course.skillLevel}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-dark-50">
            <div>
              <span className="text-xl font-bold text-dark-800">{formatPrice(course.price)}</span>
              {course.installmentEnabled && (
                <span className="text-xs text-dark-400 block">EMI available</span>
              )}
            </div>
            <span className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold group-hover:bg-primary-700 transition-colors">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
