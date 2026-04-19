import {
  collection, doc, getDocs, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const PAYMENTS_COL = 'payments';
const INSTALLMENTS_COL = 'installments';

export const createPaymentRecord = async (paymentData) => {
  const docRef = await addDoc(collection(db, PAYMENTS_COL), {
    ...paymentData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getPaymentsByUser = async (userId) => {
  const q = query(
    collection(db, PAYMENTS_COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllPayments = async () => {
  const q = query(collection(db, PAYMENTS_COL), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updatePayment = async (paymentId, data) => {
  await updateDoc(doc(db, PAYMENTS_COL, paymentId), data);
};

// Installments
export const createInstallments = async (enrollmentId, userId, courseId, plan) => {
  const installments = [];
  for (let i = 1; i <= plan.totalInstallments; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i);

    const docRef = await addDoc(collection(db, INSTALLMENTS_COL), {
      enrollmentId,
      userId,
      courseId,
      installmentNumber: i,
      dueDate: dueDate,
      amount: plan.installmentAmount,
      status: 'pending',
      paymentId: '',
      paidAt: null,
      createdAt: serverTimestamp(),
    });
    installments.push(docRef.id);
  }
  return installments;
};

export const getInstallmentsByEnrollment = async (enrollmentId) => {
  const q = query(
    collection(db, INSTALLMENTS_COL),
    where('enrollmentId', '==', enrollmentId),
    orderBy('installmentNumber', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getInstallmentsByUser = async (userId) => {
  const q = query(
    collection(db, INSTALLMENTS_COL),
    where('userId', '==', userId),
    orderBy('dueDate', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateInstallment = async (installmentId, data) => {
  await updateDoc(doc(db, INSTALLMENTS_COL, installmentId), data);
};

export const getTotalRevenue = async () => {
  const q = query(
    collection(db, PAYMENTS_COL),
    where('status', '==', 'captured')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);
};

// Razorpay integration
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (orderData, onSuccess, onFailure) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure('Failed to load Razorpay. Please try again.');
    return;
  }

  const options = {
    key: 'rzp_test_placeholder', // Replace with actual key
    amount: orderData.amount * 100,
    currency: 'INR',
    name: 'CYC with Bhoomikaa',
    description: orderData.description || 'Course Payment',
    order_id: orderData.orderId,
    handler: (response) => {
      onSuccess({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      });
    },
    prefill: {
      name: orderData.userName || '',
      email: orderData.userEmail || '',
      contact: orderData.userPhone || '',
    },
    theme: {
      color: '#1E3A8A',
    },
    modal: {
      ondismiss: () => {
        onFailure('Payment cancelled by user.');
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
