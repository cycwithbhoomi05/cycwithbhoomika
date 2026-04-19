import { useState, useEffect } from 'react';
import { getTestimonials } from '../../services/cmsService';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const load = async () => {
      const data = await getTestimonials();
      setTestimonials(data);
    };
    load();
  }, []);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  if (!testimonials.length) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-white border border-dark-200 text-dark-600 shadow-sm text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
            Testimonials
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-900 mb-4 leading-tight">
            What Our <span className="text-primary-700">Learners</span> Say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial Card */}
            <div className="bg-primary-50 rounded-2xl border border-dark-100 p-10 md:p-14 text-center custom-shadow animate-fade-in" key={current}>
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(testimonials[current]?.rating || 5)].map((_, i) => (
                  <HiStar key={i} className="w-6 h-6 text-gold-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-dark-700 text-lg md:text-2xl leading-relaxed mb-10 font-bold font-heading">
                "{testimonials[current]?.text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold text-xl custom-shadow border-2 border-white">
                  {testimonials[current]?.name?.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-dark-900 font-bold text-lg">{testimonials[current]?.name}</p>
                  <p className="text-primary-700 font-medium text-sm">{testimonials[current]?.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-6 mt-8">
              <button
                onClick={prev}
                className="p-3 rounded-full border border-dark-200 bg-white hover:bg-primary-50 text-dark-600 hover:text-primary-700 transition-colors custom-shadow"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === current ? 'bg-primary-600 w-10' : 'bg-dark-200 w-2.5 hover:bg-dark-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-3 rounded-full border border-dark-200 bg-white hover:bg-primary-50 text-dark-600 hover:text-primary-700 transition-colors custom-shadow"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
