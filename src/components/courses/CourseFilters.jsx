import { CATEGORIES, SKILL_LEVELS } from '../../utils/constants';
import { HiX } from 'react-icons/hi';

const CourseFilters = ({ filters, onChange, onClear }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const hasFilters = filters.category || filters.skillLevel || filters.priceRange;

  return (
    <div className="bg-white rounded-2xl border border-dark-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-dark-800">Filters</h3>
        {hasFilters && (
          <button onClick={onClear} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            <HiX className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div className="mb-6">
        <h4 className="font-heading font-semibold text-sm text-dark-700 mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.id}
                onChange={() => handleChange('category', filters.category === cat.id ? '' : cat.id)}
                className="w-4 h-4 text-primary-600 border-dark-300 focus:ring-primary-500"
              />
              <span className="text-sm text-dark-600 group-hover:text-primary-700 transition-colors">
                {cat.icon} {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Skill Level */}
      <div className="mb-6">
        <h4 className="font-heading font-semibold text-sm text-dark-700 mb-3">Skill Level</h4>
        <div className="space-y-2">
          {SKILL_LEVELS.map((level) => (
            <label key={level.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="skillLevel"
                checked={filters.skillLevel === level.id}
                onChange={() => handleChange('skillLevel', filters.skillLevel === level.id ? '' : level.id)}
                className="w-4 h-4 text-primary-600 border-dark-300 focus:ring-primary-500"
              />
              <span className="text-sm text-dark-600 group-hover:text-primary-700 transition-colors">
                {level.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-heading font-semibold text-sm text-dark-700 mb-3">Price Range</h4>
        <div className="space-y-2">
          {[
            { id: 'free', label: 'Free' },
            { id: 'under-1000', label: 'Under ₹1,000' },
            { id: '1000-5000', label: '₹1,000 - ₹5,000' },
            { id: '5000-plus', label: '₹5,000+' },
          ].map((range) => (
            <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === range.id}
                onChange={() => handleChange('priceRange', filters.priceRange === range.id ? '' : range.id)}
                className="w-4 h-4 text-primary-600 border-dark-300 focus:ring-primary-500"
              />
              <span className="text-sm text-dark-600 group-hover:text-primary-700 transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;
