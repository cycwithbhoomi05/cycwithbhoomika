import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { ADMIN_EMAIL } from '../utils/constants';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = userData?.role === 'admin';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUserData({ id: userDoc.id, ...userDoc.data() });
        } else {
          const role = firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'student';
          const newUserData = {
            name: firebaseUser.displayName || '',
            email: firebaseUser.email,
            phone: '',
            role,
            photoURL: firebaseUser.photoURL || '',
            createdAt: serverTimestamp(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
          setUserData({ id: firebaseUser.uid, ...newUserData });
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const register = async (email, password, name, phone) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });

    const role = email === ADMIN_EMAIL ? 'admin' : 'student';
    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      phone: phone || '',
      role,
      photoURL: '',
      createdAt: serverTimestamp(),
    });

    return result.user;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  const refreshUser = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData({ id: userDoc.id, ...userDoc.data() });
      }
    }
  };

  const value = {
    user,
    userData,
    loading,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
