const Loader = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin`} />
      </div>
      {text && <p className="text-dark-500 text-sm font-medium">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
      <p className="text-dark-500 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
    <div className="skeleton h-48 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 w-20" />
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton h-6 w-24" />
        <div className="skeleton h-10 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

export default Loader;
