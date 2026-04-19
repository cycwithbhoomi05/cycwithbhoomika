import { useState, useEffect } from 'react';
import { getAboutContent } from '../services/cmsService';
import { BRAND, EXPERTISE_AREAS } from '../utils/constants';
import { HiCheck, HiStar, HiAcademicCap, HiHeart } from 'react-icons/hi';
import bhoomiImg from '../assets/images/anime_bhoomikaa_wb.png';

const AboutPage = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getAboutContent();
      setAbout(data);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-dark-100 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-50 -z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-widest mb-6">
                About Us
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dark-900 mb-6">
                Meet{' '}
                <span className="text-primary-700">
                  {about?.trainerName || 'Bhoomikaa'}
                </span>
              </h1>
              <p className="text-dark-600 text-lg leading-relaxed">
                {about?.bio || BRAND.mission}
              </p>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-96 rounded-3xl bg-primary-100 flex items-end justify-center custom-shadow overflow-hidden border border-primary-200">
                  <img 
                    src={about?.photoUrl || bhoomiImg} 
                    alt={about?.trainerName || 'Bhoomikaa'} 
                    className="w-[90%] h-auto object-contain object-bottom drop-shadow-xl" 
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 border border-dark-100 custom-shadow animate-float">
                  <p className="text-dark-900 text-sm font-bold">500+ Lives Transformed ✨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-dark-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HiHeart className="w-12 h-12 text-gold-500 mx-auto mb-6" />
          <h2 className="font-heading text-3xl font-bold text-dark-800 mb-4">Our Mission</h2>
          <p className="text-xl text-dark-600 leading-relaxed italic">
            "{about?.mission || BRAND.tagline}"
          </p>
          <p className="text-dark-500 mt-6 max-w-2xl mx-auto">
            We believe in empowering individuals and organizations to unlock their full potential through transformative training experiences that combine knowledge, practice, and inspiration.
          </p>
        </div>
      </section>

      {/* Credentials */}
      {about?.credentials && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-dark-800 mb-4">
                Credentials & <span className="gradient-text">Expertise</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {about.credentials.map((cred, i) => (
                <div key={i} className="flex items-center gap-3 p-5 bg-dark-50 rounded-2xl border border-dark-100 hover:border-primary-200 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <HiAcademicCap className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-dark-700">{cred}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Areas of Expertise */}
      <section className="py-20 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-dark-800 mb-4">
              Areas of <span className="gradient-text">Expertise</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {EXPERTISE_AREAS.map((area, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-2xl border border-dark-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <span className="text-4xl mb-4 block">{area.icon}</span>
                <h3 className="font-heading font-bold text-dark-800">{area.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
