import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-300">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-300">About Us</Link></li>
              <li><Link to="/services" className="hover:text-blue-300">Services</Link></li>
              <li><Link to="/healthcard" className="hover:text-blue-300">Health Card</Link></li>
              <li><Link to="/faq" className="hover:text-blue-300">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Workers</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="hover:text-blue-300">Register</Link></li>
              <li><Link to="/find-doctor" className="hover:text-blue-300">Find a Doctor</Link></li>
              <li><Link to="/schemes" className="hover:text-blue-300">Health Schemes</Link></li>
              <li><Link to="/health-tips" className="hover:text-blue-300">Health Tips</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Professionals</h3>
            <ul className="space-y-2">
              <li><Link to="/doctors" className="hover:text-blue-300">For Doctors</Link></li>
              <li><Link to="/employers" className="hover:text-blue-300">For Employers</Link></li>
              <li><Link to="/training" className="hover:text-blue-300">Training</Link></li>
              <li><Link to="/resources" className="hover:text-blue-300">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                0471-1234567
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                healthportal@kerala.gov.in
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Health Department, Government of Kerala, Thiruvananthapuram
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="hover:text-blue-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2023 Kerala Migrant Workers Health Portal. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-300 mr-4">Privacy Policy</a>
            <a href="#" className="hover:text-blue-300 mr-4">Terms of Service</a>
            <a href="#" className="hover:text-blue-300">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
