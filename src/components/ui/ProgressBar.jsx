const ProgressBar = ({ progress = 0, size = 'md', showLabel = true, className = '' }) => {
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getColor = (p) => {
    if (p >= 80) return 'from-green-400 to-green-500';
    if (p >= 50) return 'from-blue-400 to-blue-500';
    if (p >= 25) return 'from-amber-400 to-amber-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-dark-500">Progress</span>
          <span className="text-xs font-bold text-dark-700">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-dark-100 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} bg-gradient-to-r ${getColor(progress)} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
