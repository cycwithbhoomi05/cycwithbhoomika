import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, getLessons } from '../services/courseService';
import { getEnrollment } from '../services/enrollmentService';
import { useAuth } from '../hooks/useAuth';
import CourseCurriculum from '../components/courses/CourseCurriculum';
import PricingSection from '../components/courses/PricingSection';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { PageLoader } from '../components/ui/Loader';
import { formatPrice, getCategoryLabel, getCategoryColor, isProfileComplete } from '../utils/helpers';
import { HiClock, HiAcademicCap, HiUsers, HiStar, HiGlobeAlt, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { createPaymentRecord, createRazorpayOrderOnServer, initiateRazorpayPayment } from '../services/paymentService';
import { createEnrollment } from '../services/enrollmentService';
import { generateEnrollmentLetter } from '../utils/pdfService';
import ProfileSetupModal from '../components/profile/ProfileSetupModal';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const courseData = await getCourseById(id);
        if (!courseData) {
          navigate('/courses');
          return;
        }
        setCourse(courseData);

        const lessonData = await getLessons(id);
        setLessons(lessonData);

        if (user) {
          const enroll = await getEnrollment(user.uid, id);
          setEnrollment(enroll);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user, navigate]);

  const handleSelectPlan = async (planType) => {
    if (!user) {
      toast.error('Please sign in to enroll');
      navigate('/login');
      return;
    }

    if (enrollment) {
      toast.success('You are already enrolled in this course!');
      navigate('/dashboard');
      return;
    }

    if (!isProfileComplete(userData)) {
      setPendingPlan(planType);
      setShowProfileModal(true);
      return;
    }

    await processEnrollment(planType);
  };

  const processEnrollment = async (planType) => {
    let amount = course.price;
    if (planType === 'advance') amount = course.advanceAmount;
    if (planType === 'installment') amount = course.installmentPlan?.installmentAmount || course.price;

    const loadingToast = toast.loading('Initializing secure payment gateway...');

    try {
      // 1. Ask backend to generate Razorpay Secure Order
      const orderDataBlock = await createRazorpayOrderOnServer(amount, id, user.uid, planType);
      const generatedOrderId = orderDataBlock ? orderDataBlock.orderId : null;
      
      toast.dismiss(loadingToast);

      // 2. Open Razorpay Check Modal
      initiateRazorpayPayment(
        {
          amount,
          orderId: generatedOrderId,
          description: `Enrollment: ${course.title}`,
          userName: userData?.name || user.displayName || '',
          userEmail: userData?.email || user.email || '',
          userPhone: userData?.phone || '',
        },
        async (successResponse) => {
          // onSuccess Callback
          toast.loading('Payment successful! Processing enrollment...', { id: 'post-pay-load' });
          try {
            const enrollmentId = await createEnrollment({
              userId: user.uid,
              courseId: id,
              paymentStatus: 'active',
              paymentType: planType,
            });

            const paymentData = {
              userId: user.uid,
              courseId: id,
              enrollmentId,
              amount,
              razorpayOrderId: generatedOrderId || successResponse.razorpayOrderId,
              razorpayPaymentId: successResponse.razorpayPaymentId,
              razorpaySignature: successResponse.razorpaySignature || '',
              status: 'captured',
              paymentType: planType,
            };

            await createPaymentRecord(paymentData);
            generateEnrollmentLetter(userData, course, paymentData);

            toast.dismiss('post-pay-load');
            toast.success('Successfully enrolled! Enrollment Letter downloaded. 🎉');
            navigate('/dashboard');
          } catch (enrollErr) {
            console.error("Enrollment Registration failed:", enrollErr);
            toast.dismiss('post-pay-load');
            toast.error('Payment verified, but registration failed. Contact Support.');
          }
        },
        (errorReason) => {
          // onFailure Callback
          toast.error(errorReason);
        }
      );

    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };

  if (loading) return <PageLoader />;
  if (!course) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'pricing', label: 'Pricing' },
  ];

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Hero Section */}
      <section className="bg-primary-50 border-b border-dark-100 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className={`inline-block px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest mb-4 border bg-white ${getCategoryColor(course.category)}`}>
              {getCategoryLabel(course.category)}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
              {course.title}
            </h1>
            <p className="text-dark-600 text-lg mb-6 leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap gap-6 text-dark-500 text-sm font-medium">
              {course.duration && (
                <span className="flex items-center gap-2"><HiClock className="w-4 h-4 text-primary-500" />{course.duration}</span>
              )}
              {course.skillLevel && (
                <span className="flex items-center gap-2"><HiAcademicCap className="w-4 h-4 text-primary-500" />{course.skillLevel}</span>
              )}
              <span className="flex items-center gap-2"><HiUsers className="w-4 h-4 text-primary-500" />{lessons.length} Lessons</span>
              {course.isOffline && (
                <span className="flex items-center gap-2"><HiGlobeAlt className="w-4 h-4 text-primary-500" />Offline Available</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
              <div className="flex border-b border-dark-100">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-700 border-b-2 border-primary-600'
                        : 'text-dark-500 hover:text-dark-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-heading font-bold text-xl text-dark-800 mb-3">About This Course</h3>
                      <p className="text-dark-600 leading-relaxed">{course.description}</p>
                    </div>

                    {course.trainerInfo && (
                      <div>
                        <h3 className="font-heading font-bold text-xl text-dark-800 mb-3">Your Trainer</h3>
                        <div className="flex items-start gap-4 p-4 bg-dark-50 rounded-xl">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center text-white font-bold text-xl">
                            B
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-dark-800">Bhoomikaa</h4>
                            <p className="text-dark-500 text-sm mt-1">{course.trainerInfo}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-heading font-bold text-xl text-dark-800 mb-3">What You'll Learn</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Practical skills and frameworks', 'Industry best practices', 'Real-world case studies', 'Certification upon completion'].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-dark-600">
                            <HiCheck className="w-4 h-4 text-primary-500 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <CourseCurriculum lessons={lessons} />
                )}

                {activeTab === 'pricing' && (
                  <PricingSection course={course} onSelectPlan={handleSelectPlan} />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Sticky Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden shadow-xl">
                {/* Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-gold-50 flex items-center justify-center">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">📚</span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-heading font-bold text-dark-800">
                      {formatPrice(course.price)}
                    </span>
                    {course.installmentEnabled && (
                      <span className="text-sm text-dark-400">or EMI</span>
                    )}
                  </div>

                  {enrollment ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => navigate('/dashboard')}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      variant="gold"
                      size="lg"
                      className="w-full"
                      onClick={() => setActiveTab('pricing')}
                    >
                      Enroll Now
                    </Button>
                  )}

                  <div className="mt-6 space-y-3 text-sm">
                    {[
                      'Full Lifetime Access',
                      'Certificate of Completion',
                      'Downloadable Resources',
                      'Expert Support',
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-dark-600">
                        <HiCheck className="w-4 h-4 text-primary-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16" />
      
      <ProfileSetupModal 
        isOpen={showProfileModal} 
        onClose={() => {
          setShowProfileModal(false);
          setPendingPlan(null);
        }}
        onComplete={() => {
          if (pendingPlan) {
            processEnrollment(pendingPlan);
          }
        }}
      />
    </div>
  );
};

export default CourseDetailPage;
