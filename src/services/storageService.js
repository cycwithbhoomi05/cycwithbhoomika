import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

export const uploadCourseImage = async (courseId, file) => {
  const path = `courses/images/${courseId}/${file.name}`;
  return uploadFile(file, path);
};

export const uploadCourseVideo = async (courseId, lessonId, file) => {
  const path = `courses/videos/${courseId}/${lessonId}_${file.name}`;
  return uploadFile(file, path);
};

export const uploadCoursePDF = async (courseId, lessonId, file) => {
  const path = `courses/pdfs/${courseId}/${lessonId}_${file.name}`;
  return uploadFile(file, path);
};

export const uploadCMSImage = async (folder, file) => {
  const path = `cms/${folder}/${Date.now()}_${file.name}`;
  return uploadFile(file, path);
};

export const uploadProfilePhoto = async (userId, file) => {
  const path = `users/${userId}/profile.jpg`;
  return uploadFile(file, path);
};

export const deleteFile = async (fileUrl) => {
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
