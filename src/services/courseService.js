import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COURSES_COL = 'courses';
const LESSONS_COL = 'lessons';

export const getCourses = async (filters = {}) => {
  let q = collection(db, COURSES_COL);
  const constraints = [];

  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters.isPublished !== undefined) {
    constraints.push(where('isPublished', '==', filters.isPublished));
  }

  q = query(q, ...constraints);
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  
  // Sort client-side to avoid composite index requirements
  return docs.sort((a, b) => {
    const timeA = a.createdAt?.toMillis() || 0;
    const timeB = b.createdAt?.toMillis() || 0;
    return timeB - timeA;
  });
};

export const getPublishedCourses = async () => {
  const q = query(
    collection(db, COURSES_COL),
    where('isPublished', '==', true)
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  
  // Sort client-side
  return docs.sort((a, b) => {
    const timeA = a.createdAt?.toMillis() || 0;
    const timeB = b.createdAt?.toMillis() || 0;
    return timeB - timeA;
  });
};

export const getCourseById = async (courseId) => {
  const docRef = doc(db, COURSES_COL, courseId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const createCourse = async (courseData) => {
  const docRef = await addDoc(collection(db, COURSES_COL), {
    ...courseData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateCourse = async (courseId, courseData) => {
  await updateDoc(doc(db, COURSES_COL, courseId), {
    ...courseData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCourse = async (courseId) => {
  await deleteDoc(doc(db, COURSES_COL, courseId));
};

// Lessons
export const getLessons = async (courseId) => {
  const q = query(
    collection(db, COURSES_COL, courseId, LESSONS_COL),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addLesson = async (courseId, lessonData) => {
  const docRef = await addDoc(collection(db, COURSES_COL, courseId, LESSONS_COL), {
    ...lessonData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateLesson = async (courseId, lessonId, lessonData) => {
  await updateDoc(doc(db, COURSES_COL, courseId, LESSONS_COL, lessonId), lessonData);
};

export const deleteLesson = async (courseId, lessonId) => {
  await deleteDoc(doc(db, COURSES_COL, courseId, LESSONS_COL, lessonId));
};

export const getCoursesCount = async () => {
  const snapshot = await getDocs(collection(db, COURSES_COL));
  return snapshot.size;
};

export const getRecentCourses = async (count = 6) => {
  const q = query(
    collection(db, COURSES_COL),
    where('isPublished', '==', true)
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  
  // Sort client-side and limit
  return docs.sort((a, b) => {
    const timeA = a.createdAt?.toMillis() || 0;
    const timeB = b.createdAt?.toMillis() || 0;
    return timeB - timeA;
  }).slice(0, count);
};
