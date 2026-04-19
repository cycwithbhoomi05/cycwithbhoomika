import React from 'react';
import { HiScale, HiShieldCheck, HiCreditCard, HiAcademicCap } from 'react-icons/hi';
import { BRAND } from '../utils/constants';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-dark-50 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-dark-100">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-4 border border-primary-100">
              Legal & Compliance
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-dark-900 mb-4">Terms & Conditions</h1>
            <p className="text-dark-500">Website: {BRAND.name.toLowerCase().replace(/\s+/g, '')}.com</p>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-dark-800 prose-a:text-primary-600">
            <p className="lead text-lg text-dark-600 mb-10">
              Welcome to <strong>{BRAND.name}</strong>. By accessing or using this website, enrolling in courses, or making payments, you agree to comply with and be bound by the following Terms & Conditions.
            </p>

            <div className="space-y-8 text-dark-600">
              <section>
                <h3 className="text-xl font-bold text-dark-800 mb-3 flex items-center gap-2">
                  <HiScale className="text-primary-600" /> 1. Definitions
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>“Platform”</strong> refers to the website and services provided by CYC with Bhoomikaa.</li>
                  <li><strong>“User”</strong> refers to any individual accessing or using the platform.</li>
                  <li><strong>“Student”</strong> refers to a registered user who enrolls in courses.</li>
                  <li><strong>“Admin”</strong> refers to the platform owner/authorized personnel.</li>
                  <li><strong>“Courses”</strong> refer to online/offline training programs offered.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-dark-800 mb-3 flex items-center gap-2">
                  <HiShieldCheck className="text-primary-600" /> 2. Eligibility & Registration
                </h3>
                <p>Users must be at least 18 years old or have parental/guardian consent. By registering, you confirm that all information provided is accurate and complete.</p>
                <p className="mt-2">You are responsible for maintaining confidentiality of login credentials. Any activity under your account is your responsibility. The platform reserves the right to suspend or terminate accounts for misuse or false information.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-dark-800 mb-3 flex items-center gap-2">
                  <HiAcademicCap className="text-primary-600" /> 3. Course Enrollment
                </h3>
                <p>Enrollment is confirmed only after successful payment. Access to course content is granted based on the selected plan. Course access duration may be limited or lifetime depending on the course specifics.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-dark-800 mb-3 flex items-center gap-2">
                  <HiCreditCard className="text-primary-600" /> 4. Pricing & Payments
                </h3>
                <p>All prices are displayed in INR (₹) unless otherwise stated. Payments are processed securely via third-party gateway (Razorpay). We do not store sensitive payment card details.</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Full Payment:</strong> Complete course fee paid upfront.</li>
                  <li><strong>Installment Plan:</strong> Payment divided into scheduled installments. Failure to pay may result in suspension of course access.</li>
                  <li><strong>Advance Payment:</strong> Partial payment to reserve a seat; remaining balance must be paid within the specified time.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-dark-800 mb-3">5. Refund & Cancellation Policy</h3>
                <p>All payments are non-refundable, unless explicitly stated otherwise. No refunds will be provided for change of mind, partial completion, or failure to attend sessions. In exceptional technical cases, refunds may be processed at the sole discretion of the admin.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-dark-800 mb-3">6. Course Content Usage</h3>
                <p>All content (videos, PDFs, materials) is the intellectual property of CYC with Bhoomikaa. Users are strictly prohibited from sharing credentials, downloading, recording, or redistributing content. Violations may lead to legal action and account termination.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-dark-800 mb-3">7. Certification & Offline Training</h3>
                <p>Certificates are issued only upon successful completion. For offline training, attendance is mandatory for certification, and prior booking confirmation is required.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-dark-800 mb-3">8. User Conduct & Liability</h3>
                <p>Users agree not to use the platform for unlawful purposes, harass others, or upload malicious content. The platform is not liable for technical issues beyond our control, internet disruptions, or payment gateway failures. Training outcomes depend on individual effort; no guaranteed results are promised.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-dark-800 mb-3">9. Contact & Governance</h3>
                <p>These terms are governed by the laws of India. For any queries:</p>
                <ul className="list-none space-y-1 mt-2 font-medium">
                  <li>Phone: {BRAND.phone}</li>
                  <li>Email: {BRAND.email}</li>
                </ul>
              </section>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsPage;
