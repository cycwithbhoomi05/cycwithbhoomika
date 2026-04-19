import { HiCheckCircle, HiBriefcase, HiUserGroup, HiAcademicCap, HiOfficeBuilding, HiSparkles, HiLightBulb } from 'react-icons/hi';

const benefits = [
  { title: 'Expert-Led Training', desc: 'Learn from certified professionals with real-world experience' },
  { title: 'Flexible Learning', desc: 'Online and offline modes to suit your schedule' },
  { title: 'Certification Programs', desc: 'Earn industry-recognized certificates upon completion' },
  { title: 'Corporate Solutions', desc: 'Tailored training programs for your organization' },
  { title: 'Practical Approach', desc: 'Hands-on exercises and real-world case studies' },
  { title: 'Lifetime Access', desc: 'Access course materials anytime, anywhere' },
  { title: 'Community Support', desc: 'Join a network of like-minded professionals' },
  { title: 'Affordable Pricing', desc: 'Flexible payment options including installments' },
];

const audiences = [
  { label: 'Working Professionals', icon: HiBriefcase },
  { label: 'Corporate Teams', icon: HiOfficeBuilding },
  { label: 'Fresh Graduates', icon: HiAcademicCap },
  { label: 'HR Professionals', icon: HiUserGroup },
  { label: 'Aspiring Leaders', icon: HiLightBulb },
  { label: 'Individuals', icon: HiSparkles },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Benefits */}
          <div>
            <span className="inline-block px-3 py-1 bg-white border border-dark-200 text-dark-600 shadow-sm text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
              Why Choose Us
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-900 mb-10 leading-tight">
              Benefits of Training with <br />
              <span className="text-primary-700">CYC Platform</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary-600 transition-colors">
                    <HiCheckCircle className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-dark-900 text-sm mb-1">{benefit.title}</h4>
                    <p className="text-dark-600 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <span className="inline-block px-3 py-1 bg-white border border-dark-200 text-dark-600 shadow-sm text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
              Who Is This For
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-900 mb-10 leading-tight">
              Designed for <br />
              <span className="text-primary-700">Everyone</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {audiences.map((audience, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 bg-white rounded-xl border border-dark-200 hover:border-primary-400 custom-shadow hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-dark-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                     <audience.icon className="w-5 h-5 text-dark-600 group-hover:text-primary-600 transition-colors" />
                  </div>
                  <span className="font-semibold text-sm text-dark-800 group-hover:text-primary-700 transition-colors">
                    {audience.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
