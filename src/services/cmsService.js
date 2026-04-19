import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const CMS_COL = 'cms';

export const getHomepageContent = async () => {
  const docRef = doc(db, CMS_COL, 'homepage');
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return snapshot.data();
  return getDefaultHomepage();
};

export const updateHomepageContent = async (data) => {
  await setDoc(doc(db, CMS_COL, 'homepage'), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const getTestimonials = async () => {
  const docRef = doc(db, CMS_COL, 'testimonials');
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return snapshot.data().items || [];
  return getDefaultTestimonials();
};

export const updateTestimonials = async (items) => {
  await setDoc(doc(db, CMS_COL, 'testimonials'), {
    items,
    updatedAt: serverTimestamp(),
  });
};

export const getContactInfo = async () => {
  const docRef = doc(db, CMS_COL, 'contact');
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return snapshot.data();
  return {
    phone: '+91 9322520674',
    email: 'info@cycwithbhoomikaa.com',
    address: '',
  };
};

export const updateContactInfo = async (data) => {
  await setDoc(doc(db, CMS_COL, 'contact'), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const getAboutContent = async () => {
  const docRef = doc(db, CMS_COL, 'about');
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return snapshot.data();
  return getDefaultAbout();
};

export const updateAboutContent = async (data) => {
  await setDoc(doc(db, CMS_COL, 'about'), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

// Defaults
const getDefaultHomepage = () => ({
  bannerText: 'Empowering Growth and Success',
  bannerSubtext: 'Transform your career with expert-led training programs in Soft Skills, HR, POSH, Corporate Training, Nutrition & Fitness, and Leadership.',
  bannerImageUrl: '',
});

const getDefaultTestimonials = () => [
  {
    name: 'Priya Sharma',
    role: 'HR Manager, TechCorp',
    text: 'The POSH training was incredibly comprehensive and well-structured. Bhoomikaa made complex compliance topics easy to understand.',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Team Lead, InnovateTech',
    text: 'The leadership program transformed how I manage my team. The practical frameworks are invaluable for daily decision-making.',
    rating: 5,
  },
  {
    name: 'Anjali Desai',
    role: 'Entrepreneur',
    text: 'The nutrition and fitness coaching was life-changing. Bhoomikaa\'s holistic approach to wellness is exactly what I needed.',
    rating: 5,
  },
];

const getDefaultAbout = () => ({
  trainerName: 'Bhoomikaa',
  bio: 'Bhoomikaa is a certified trainer and consultant with expertise spanning Soft Skills, HR Management, POSH Compliance, Corporate Training, Nutrition & Fitness, and Leadership Development. With years of experience empowering professionals and organizations, she brings a unique blend of knowledge, passion, and practical wisdom to every training program.',
  credentials: [
    'Certified Corporate Trainer',
    'POSH Compliance Specialist',
    'Certified Nutritionist & Fitness Coach',
    'HR Management Expert',
    'Leadership Development Coach',
  ],
  mission: 'Empowering Growth and Success',
  photoUrl: '',
});
