import { jsPDF } from 'jspdf';
import { formatDate, formatPrice } from './helpers';
import { BRAND } from './constants';

export const generateEnrollmentLetter = (userData, course, paymentData) => {
  const doc = new jsPDF();
  
  // Set dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header / Branding
  doc.setFillColor(30, 58, 138); // Primary 800 (Dark Blue)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(BRAND.name, 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Enrollment Confirmation', pageWidth - 20, 25, { align: 'right' });

  // Reset text color for body
  doc.setTextColor(30, 41, 59); // Dark 800
  
  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Enrollment Letter', 20, 60);
  
  // Date and ID
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(new Date())}`, pageWidth - 20, 60, { align: 'right' });
  doc.text(`Reference ID: ${paymentData?.enrollmentId || 'ENR-'+Date.now()}`, pageWidth - 20, 65, { align: 'right' });
  
  // Separator
  doc.setDrawColor(226, 232, 240); // Dark 200
  doc.line(20, 75, pageWidth - 20, 75);

  // Student Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Profile', 20, 90);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Official Name: ${userData.name}`, 20, 100);
  doc.text(`Email Address: ${userData.email}`, 20, 107);
  doc.text(`Contact Number: ${userData.countryCode || '+91'} ${userData.phone}`, 20, 114);
  if (userData.profession) {
    doc.text(`Profession: ${userData.profession}`, 20, 121);
  }

  // Course Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Course Details', 20, 140);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Program Title: ${course.title}`, 20, 150);
  if (course.duration) doc.text(`Duration: ${course.duration}`, 20, 157);
  
  // Payment Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Summary', 20, 175);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Amount Paid: ${formatPrice(paymentData?.amount || course.price)}`, 20, 185);
  doc.text(`Payment Type: ${paymentData?.paymentType?.toUpperCase() || 'FULL'}`, 20, 192);
  doc.text(`Status: ${paymentData?.status?.toUpperCase() || 'SUCCESS'}`, 20, 199);

  // Separator
  doc.line(20, 215, pageWidth - 20, 215);

  // Footer / Terms
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Text soft
  const termsText = [
    'This is a computer-generated document and does not require a physical signature.',
    `Access to the course "${course.title}" is proudly provided by ${BRAND.name}.`,
    'Please adhere to our official code of conduct and standard Terms & Conditions.',
    '',
    `Contact: ${BRAND.email} | ${BRAND.phone}`
  ];
  
  let y = 230;
  termsText.forEach(line => {
    doc.text(line, pageWidth / 2, y, { align: 'center' });
    y += 6;
  });

  // Save the PDF
  doc.save(`Enrollment_Letter_${userData.name.replace(/\s+/g, '_')}_${paymentData?.enrollmentId || 'ENR'}.pdf`);
};
