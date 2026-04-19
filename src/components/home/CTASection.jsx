import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { HiArrowRight } from 'react-icons/hi';

const CTASection = () => {
  return (
    <section className="py-24 bg-primary-900 relative overflow-hidden">
      {/* Subtle Glow Background */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-700 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
          Ready to Elevate Your{' '}
          <span className="text-primary-300">Organization?</span>
        </h2>
        <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Partner with CYC to deliver exceptional training programs tailored to your organizational goals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={ROUTES.COURSES}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-primary-600 text-white font-bold text-lg hover:bg-primary-500 shadow-lg shadow-black/20 hover:shadow-xl transition-all"
          >
            Browse Programs
            <HiArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to={ROUTES.CONTACT}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl border border-primary-400 text-white font-semibold text-lg hover:bg-primary-800 transition-all"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
