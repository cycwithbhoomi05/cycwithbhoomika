const Card = ({ children, className = '', hover = false, padding = 'p-6', ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-dark-100 shadow-sm ${padding} ${
        hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
