const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const db = admin.firestore();

// ==========================================
// RAZORPAY INTEGRATION
// ==========================================

/**
 * Create Razorpay Order
 * Called from frontend before opening Razorpay checkout
 */
exports.createRazorpayOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { amount, courseId, userId, paymentType } = req.body;

      if (!amount || !courseId || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Initialize Razorpay - API keys to be configured
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: functions.config().razorpay?.key_id || 'rzp_test_placeholder',
        key_secret: functions.config().razorpay?.key_secret || 'placeholder_secret',
      });

      const order = await razorpay.orders.create({
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `order_${courseId}_${Date.now()}`,
        notes: {
          courseId,
          userId,
          paymentType: paymentType || 'full',
        },
      });

      // Store order in Firestore
      await db.collection('payments').add({
        userId,
        courseId,
        amount,
        razorpayOrderId: order.id,
        razorpayPaymentId: '',
        razorpaySignature: '',
        status: 'created',
        paymentType: paymentType || 'full',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      console.error('Create order error:', error);
      return res.status(500).json({ error: 'Failed to create order' });
    }
  });
});

/**
 * Razorpay Payment Webhook
 * Called by Razorpay after payment is processed
 */
exports.razorpayWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const crypto = require('crypto');
    const webhookSecret = functions.config().razorpay?.webhook_secret || 'webhook_placeholder';

    // Verify webhook signature
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payment = req.body.payload.payment?.entity;

    if (event === 'payment.captured' && payment) {
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Find and update payment record
      const paymentSnap = await db.collection('payments')
        .where('razorpayOrderId', '==', orderId)
        .limit(1)
        .get();

      if (!paymentSnap.empty) {
        const paymentDoc = paymentSnap.docs[0];
        const paymentData = paymentDoc.data();

        // Update payment status
        await paymentDoc.ref.update({
          razorpayPaymentId: paymentId,
          status: 'captured',
        });

        // Create or activate enrollment
        const existingEnrollment = await db.collection('enrollments')
          .where('userId', '==', paymentData.userId)
          .where('courseId', '==', paymentData.courseId)
          .limit(1)
          .get();

        if (existingEnrollment.empty) {
          await db.collection('enrollments').add({
            userId: paymentData.userId,
            courseId: paymentData.courseId,
            paymentStatus: 'active',
            paymentType: paymentData.paymentType,
            progress: 0,
            completedLessons: [],
            certificateUrl: '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          await existingEnrollment.docs[0].ref.update({
            paymentStatus: 'active',
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // If installment plan, create installment records
        if (paymentData.paymentType === 'installment') {
          const courseDoc = await db.collection('courses').doc(paymentData.courseId).get();
          if (courseDoc.exists) {
            const course = courseDoc.data();
            if (course.installmentPlan) {
              const { totalInstallments, installmentAmount } = course.installmentPlan;
              // First installment is already paid
              for (let i = 2; i <= totalInstallments; i++) {
                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + (i - 1));

                await db.collection('installments').add({
                  enrollmentId: existingEnrollment.empty ? '' : existingEnrollment.docs[0].id,
                  userId: paymentData.userId,
                  courseId: paymentData.courseId,
                  installmentNumber: i,
                  dueDate: admin.firestore.Timestamp.fromDate(dueDate),
                  amount: installmentAmount,
                  status: 'pending',
                  paymentId: '',
                  paidAt: null,
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });
              }
            }
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ==========================================
// AUTO-CERTIFICATION
// ==========================================

/**
 * Generate certificate when course is completed
 * Triggered by enrollment update (progress = 100%)
 */
exports.onEnrollmentUpdate = functions.firestore
  .document('enrollments/{enrollmentId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    const before = change.before.data();

    // Check if course was just completed
    if (after.progress >= 100 && before.progress < 100) {
      try {
        const courseDoc = await db.collection('courses').doc(after.courseId).get();
        const userDoc = await db.collection('users').doc(after.userId).get();

        if (!courseDoc.exists || !userDoc.exists) return;

        const course = courseDoc.data();
        const user = userDoc.data();

        // Generate certificate PDF using PDFKit
        const PDFDocument = require('pdfkit');
        const bucket = admin.storage().bucket();

        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        const fileName = `certificates/${after.userId}/${after.courseId}.pdf`;
        const file = bucket.file(fileName);
        const stream = file.createWriteStream({ contentType: 'application/pdf' });

        doc.pipe(stream);

        // Certificate Design
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).strokeColor('#1E3A8A').stroke();
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(1).strokeColor('#D4A843').stroke();

        doc.fontSize(16).fillColor('#D4A843').text('CYC WITH BHOOMIKAA', 0, 80, { align: 'center' });
        doc.fontSize(36).fillColor('#1E3A8A').text('Certificate of Completion', 0, 120, { align: 'center' });
        doc.fontSize(14).fillColor('#333').text('This is to certify that', 0, 200, { align: 'center' });
        doc.fontSize(28).fillColor('#1E3A8A').text(user.name || 'Student', 0, 230, { align: 'center' });
        doc.fontSize(14).fillColor('#333').text('has successfully completed the course', 0, 280, { align: 'center' });
        doc.fontSize(22).fillColor('#D4A843').text(course.title, 0, 310, { align: 'center' });
        doc.fontSize(12).fillColor('#666').text(`Completed on: ${new Date().toLocaleDateString('en-IN')}`, 0, 380, { align: 'center' });
        doc.fontSize(12).fillColor('#666').text('Trainer: Bhoomikaa', 0, 400, { align: 'center' });

        doc.end();

        await new Promise((resolve) => stream.on('finish', resolve));

        // Get download URL
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '03-17-2030',
        });

        // Update enrollment with certificate URL
        await change.after.ref.update({
          certificateUrl: url,
          paymentStatus: 'completed',
        });

        console.log(`Certificate generated for user ${after.userId}, course ${after.courseId}`);
      } catch (error) {
        console.error('Certificate generation error:', error);
      }
    }
  });

// ==========================================
// EMAIL NOTIFICATIONS
// ==========================================

/**
 * Send welcome email on user creation
 */
exports.onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const user = snap.data();
    try {
      const nodemailer = require('nodemailer');
      // Configure with your SMTP settings
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: functions.config().email?.user || 'cycwithbhoomi05@gmail.com',
          pass: functions.config().email?.pass || '',
        },
      });

      await transporter.sendMail({
        from: '"CYC with Bhoomikaa" <cycwithbhoomi05@gmail.com>',
        to: user.email,
        subject: 'Welcome to CYC with Bhoomikaa! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1E3A8A, #3B82F6); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0;">CYC with Bhoomikaa</h1>
              <p style="color: #93c5fd;">Empowering Growth and Success</p>
            </div>
            <div style="padding: 30px; background: white;">
              <h2>Welcome, ${user.name || 'Learner'}!</h2>
              <p>Thank you for joining CYC with Bhoomikaa. We're excited to have you on this learning journey.</p>
              <p>Explore our courses and start learning today!</p>
              <a href="https://cycwithbhoomikaa.web.app/courses" style="display: inline-block; background: #D4A843; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">Browse Courses</a>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Welcome email error:', error);
    }
  });

/**
 * Contact form notification to admin
 */
exports.onContactSubmission = functions.firestore
  .document('contactSubmissions/{submissionId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log('New contact submission:', data.name, data.email);
    // Email notification can be added here
  });
