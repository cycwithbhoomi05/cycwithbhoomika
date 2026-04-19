import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const submitContactForm = async (formData) => {
  const docRef = await addDoc(collection(db, 'contactSubmissions'), {
    ...formData,
    isRead: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};
