import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';
import bhoomiImg from '../../assets/images/anime_bhoomikaa_wb.png';

const HeroBanner = () => {
  return (
    <section className="relative pt-32 pb-20 bg-white overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Decorative Pattern */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-primary-50 rounded-l-[100px] opacity-60 -z-10 transform translate-x-32" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-widest mb-6 border border-primary-100">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
              Corporate Training Excellence
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl font-extrabold text-dark-900 leading-tight mb-6">
              Unlock Your <br />
              <span className="text-primary-700">True Potential</span>
            </h1>

            <p className="text-lg text-dark-600 leading-relaxed mb-8 max-w-xl">
              Elevate your career and organization with outcome-driven certification programs in Corporate Training, Leadership, POSH Compliance, and Soft Skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to={ROUTES.COURSES}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-700 text-white font-semibold text-base hover:bg-primary-800 transition-colors custom-shadow"
              >
                Browse Programs
                <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to={ROUTES.ABOUT}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white border-2 border-dark-200 text-dark-800 font-semibold text-base hover:border-dark-300 hover:bg-dark-50 transition-colors"
              >
                Our Methodology
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {[
                'Expert-Led Sessions',
                'Interactive Learning',
                'Industry Certification'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-gold-500" />
                  <span className="text-sm font-medium text-dark-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Image/Graphic */}
          <div className="relative justify-center lg:justify-end hidden lg:flex mt-10 lg:mt-0">
            {/* Main Image Frame - Transparent approach for Anime avatar */}
            <div className="relative w-full max-w-[500px] sm:h-[600px] flex items-end justify-center translate-y-4 lg:translate-y-0 bg-primary-100 rounded-b-[100px] rounded-t-full border border-primary-200 overflow-hidden custom-shadow">
              <img 
                src={bhoomiImg} 
                alt="Bhoomikaa" 
                className="w-[90%] h-auto object-contain object-bottom drop-shadow-xl z-10"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary-200/50 to-transparent pointer-events-none" />
            </div>

            {/* Floating Stat Card (Clean Corporate Style) */}
            <div className="absolute -left-6 lg:-left-12 top-20 lg:top-32 bg-white rounded-2xl p-4 lg:p-6 custom-shadow border border-dark-100 animate-float z-20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gold-50 flex items-center justify-center">
                  <span className="text-lg lg:text-xl">⭐</span>
                </div>
                <div>
                  <p className="font-heading text-xl lg:text-2xl font-bold text-dark-900">98%</p>
                  <p className="text-[10px] lg:text-xs font-semibold text-dark-500 uppercase tracking-wide">Satisfaction Rate</p>
                </div>
              </div>
            </div>

             {/* Floating Stat Card 2 */}
             <div className="absolute right-0 lg:right-12 bottom-0 lg:-bottom-8 bg-white rounded-2xl p-4 lg:p-6 custom-shadow border border-dark-100 animate-float z-20" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <span className="text-lg lg:text-xl">🏆</span>
                </div>
                <div>
                  <p className="font-heading text-xl lg:text-2xl font-bold text-dark-900">100+</p>
                  <p className="text-[10px] lg:text-xs font-semibold text-dark-500 uppercase tracking-wide">Workshops Delivered</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
