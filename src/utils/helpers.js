export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Profile completeness validation
export const isProfileComplete = (userData) => {
  if (!userData) return false;
  
  const requiredFields = [
    'name', 
    'phone', 
    'dob', 
    'gender', 
    'profession', 
    'countryCode'
  ];
  
  return requiredFields.every(field => {
    const val = userData[field];
    return val !== undefined && val !== null && val.toString().trim() !== '';
  });
};

// Age calculator from DOB
export const calculateAge = (dobString) => {
  if (!dobString) return null;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const truncateText = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getCategoryLabel = (categoryId) => {
  const categories = {
    'soft-skills': 'Soft Skills',
    'hr': 'HR & Leadership',
    'posh': 'POSH',
    'nutrition-fitness': 'Nutrition & Fitness',
    'corporate-training': 'Corporate Training',
    'leadership': 'Leadership',
  };
  return categories[categoryId] || categoryId;
};

export const getCategoryColor = (categoryId) => {
  const colors = {
    'soft-skills': 'bg-blue-100 text-blue-700',
    'hr': 'bg-purple-100 text-purple-700',
    'posh': 'bg-red-100 text-red-700',
    'nutrition-fitness': 'bg-green-100 text-green-700',
    'corporate-training': 'bg-indigo-100 text-indigo-700',
    'leadership': 'bg-amber-100 text-amber-700',
  };
  return colors[categoryId] || 'bg-gray-100 text-gray-700';
};

export const getProgressColor = (progress) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-amber-500';
  return 'bg-red-500';
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
