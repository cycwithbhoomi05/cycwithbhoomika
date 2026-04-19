import { Link } from 'react-router-dom';
import { BRAND, ROUTES, CATEGORIES } from '../../utils/constants';
import { FaPhone, FaEnvelope, FaLinkedin, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-dark-900 to-dark-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
              <span className="font-heading font-bold text-lg">{BRAND.name}</span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed mb-6">
              {BRAND.mission}
            </p>
            <div className="flex gap-3">
              {[FaLinkedin, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-dark-800 hover:bg-primary-600 flex items-center justify-center text-dark-400 hover:text-white transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-dark-300 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: ROUTES.HOME },
                { label: 'All Courses', path: ROUTES.COURSES },
                { label: 'About Us', path: ROUTES.ABOUT },
                { label: 'Contact', path: ROUTES.CONTACT },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-dark-400 hover:text-gold-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-dark-300 mb-5">Training Areas</h3>
            <ul className="space-y-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link to={`${ROUTES.COURSES}?category=${cat.id}`} className="text-dark-400 hover:text-gold-400 text-sm transition-colors">
                    {cat.icon} {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-dark-300 mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${BRAND.phone}`} className="flex items-center gap-3 text-dark-400 hover:text-gold-400 text-sm transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center">
                    <FaPhone className="w-3.5 h-3.5" />
                  </div>
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 text-dark-400 hover:text-gold-400 text-sm transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center">
                    <FaEnvelope className="w-3.5 h-3.5" />
                  </div>
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-dark-500 text-xs">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-dark-500 hover:text-dark-300 text-xs transition-colors">Privacy Policy</a>
              <a href="#" className="text-dark-500 hover:text-dark-300 text-xs transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
