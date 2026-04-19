export const CATEGORIES = [
  { id: 'soft-skills', label: 'Soft Skills', icon: '💬', color: 'bg-blue-100 text-blue-700' },
  { id: 'hr', label: 'HR & Leadership', icon: '👥', color: 'bg-purple-100 text-purple-700' },
  { id: 'posh', label: 'POSH', icon: '🛡️', color: 'bg-red-100 text-red-700' },
  { id: 'nutrition-fitness', label: 'Nutrition & Fitness', icon: '🏋️', color: 'bg-green-100 text-green-700' },
  { id: 'corporate-training', label: 'Corporate Training', icon: '🏢', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'leadership', label: 'Leadership', icon: '🎯', color: 'bg-amber-100 text-amber-700' },
];

export const SKILL_LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export const ADMIN_EMAIL = 'cycwithbhoomi05@gmail.com';

export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TERMS: '/terms',
  ADMIN: '/admin',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_CMS: '/admin/cms',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_ANALYTICS: '/admin/analytics',
};

export const PAYMENT_STATUS = {
  CREATED: 'created',
  CAPTURED: 'captured',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const ENROLLMENT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BRAND = {
  name: 'CYC with Bhoomikaa',
  tagline: 'Empowering Growth and Success',
  phone: '+91 9322520674',
  email: 'info@cycwithbhoomikaa.com',
  mission: 'Empowering individuals and organizations to achieve their full potential through comprehensive training and development programs.',
};

export const EXPERTISE_AREAS = [
  {
    title: 'Nutrition & Fitness',
    description: 'Transform your health with personalized nutrition plans and fitness coaching designed for sustainable wellness.',
    icon: '🥗',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Corporate Training',
    description: 'Elevate your organization with tailored corporate training programs that drive performance and culture.',
    icon: '🏢',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Soft Skills',
    description: 'Master communication, teamwork, and interpersonal skills essential for professional and personal growth.',
    icon: '💬',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    title: 'POSH Compliance',
    description: 'Ensure workplace safety with comprehensive POSH training, certification, and compliance programs.',
    icon: '🛡️',
    gradient: 'from-red-500 to-rose-600',
  },
  {
    title: 'HR & People Management',
    description: 'Build effective HR strategies, talent management frameworks, and people-first organizational culture.',
    icon: '👥',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Leadership Development',
    description: 'Develop visionary leaders who inspire teams, drive innovation, and create lasting impact.',
    icon: '🎯',
    gradient: 'from-cyan-500 to-teal-600',
  },
];
