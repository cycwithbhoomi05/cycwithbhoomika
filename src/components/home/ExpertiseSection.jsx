import { EXPERTISE_AREAS } from '../../utils/constants';

const ExpertiseSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4">
            Our Expertise
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark-800 mb-4">
            Comprehensive Training{' '}
            <span className="gradient-text">Programs</span>
          </h2>
          <p className="text-dark-500 max-w-2xl mx-auto text-lg">
            From personal development to corporate excellence — we offer specialized training across six key domains.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXPERTISE_AREAS.map((area, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-dark-200 p-8 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
            >
              <div className="text-4xl mb-5 text-primary-600 group-hover:scale-105 transition-transform duration-300">
                {area.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-dark-800 mb-3 group-hover:text-primary-700 transition-colors">
                {area.title}
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed">
                {area.description}
              </p>
              <div className="mt-5 flex items-center gap-2 text-primary-600 text-sm font-semibold group-hover:text-primary-700 transition-colors">
                Learn More
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
