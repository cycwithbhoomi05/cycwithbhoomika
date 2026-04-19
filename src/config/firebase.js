import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyASQBK_ZkmU3d2J-_WaPhTMW5xmgsaF-Rk",
  authDomain: "cycwithbhoomikaa.firebaseapp.com",
  projectId: "cycwithbhoomikaa",
  storageBucket: "cycwithbhoomikaa.firebasestorage.app",
  messagingSenderId: "125091030670",
  appId: "1:125091030670:web:d2d461fca3a685ee7e8bdf",
  measurementId: "G-ZCR7VG923V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };
export default app;
