import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const ENROLLMENTS_COL = 'enrollments';

export const getEnrollmentsByUser = async (userId) => {
  const q = query(
    collection(db, ENROLLMENTS_COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getEnrollment = async (userId, courseId) => {
  const q = query(
    collection(db, ENROLLMENTS_COL),
    where('userId', '==', userId),
    where('courseId', '==', courseId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const createEnrollment = async (enrollmentData) => {
  const docRef = await addDoc(collection(db, ENROLLMENTS_COL), {
    ...enrollmentData,
    progress: 0,
    completedLessons: [],
    certificateUrl: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateEnrollment = async (enrollmentId, data) => {
  await updateDoc(doc(db, ENROLLMENTS_COL, enrollmentId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const markLessonComplete = async (enrollmentId, lessonId, totalLessons) => {
  const enrollDoc = await getDoc(doc(db, ENROLLMENTS_COL, enrollmentId));
  if (!enrollDoc.exists()) return;

  const data = enrollDoc.data();
  const completedLessons = [...(data.completedLessons || [])];

  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
  }

  const progress = Math.round((completedLessons.length / totalLessons) * 100);
  const paymentStatus = progress >= 100 ? 'completed' : data.paymentStatus;

  await updateDoc(doc(db, ENROLLMENTS_COL, enrollmentId), {
    completedLessons,
    progress,
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
};

export const getAllEnrollments = async () => {
  const q = query(collection(db, ENROLLMENTS_COL), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getEnrollmentsCount = async () => {
  const snapshot = await getDocs(collection(db, ENROLLMENTS_COL));
  return snapshot.size;
};
