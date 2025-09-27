import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 opacity-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4"style={{color: '#00d5b1'}}>Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/"><span style={{color: 'yellow'}}>&gt;</span>Home</Link></li>
              <li><Link to="/about"><span style={{color: 'yellow'}}>&gt;</span>About Us</Link></li>
              <li><Link to="/services"><span style={{color: 'yellow'}}>&gt;</span>Services</Link></li>
              <li><Link to="/healthcard"><span style={{color: 'yellow'}}>&gt;</span>Health Card</Link></li>
              <li><Link to="/faq"><span style={{color: 'yellow'}}>&gt;</span>FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4"style={{color: '#00d5b1'}}>For Workers</h3>
            <ul className="space-y-2">
              <li><Link to="/register" ><span style={{color: 'yellow'}}>&gt;</span>Register</Link></li>
              <li><Link to="/find-doctor"><span style={{color: 'yellow'}}>&gt;</span>Find a Doctor</Link></li>
              <li><Link to="/schemes"><span style={{color: 'yellow'}}>&gt;</span>Health Schemes</Link></li>
              <li><Link to="/health-tips"><span style={{color: 'yellow'}}>&gt;</span>Health Tips</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4"style={{color: '#00d5b1'}}>For Professionals</h3>
            <ul className="space-y-2">
              <li><Link to="/doctors"><span style={{color: 'yellow'}}>&gt;</span>For Doctors</Link></li>
              <li><Link to="/employers"><span style={{color: 'yellow'}}>&gt;</span>For Employers</Link></li>
              <li><Link to="/training"><span style={{color: 'yellow'}}>&gt;</span>Training</Link></li>
              <li><Link to="/resources"><span style={{color: 'yellow'}}>&gt;</span>Resources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4"style={{color: '#00d5b1'}}>Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" style={{color: 'yellow'}} />
                0471-1234567
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2"style={{color: 'yellow'}}/>
                <a href="mailto:healthportal@kerala.gov.in" className="hover:underline">healthportal@kerala.gov.in</a>
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
              <a href="#" className="hover:text-red-600">
                <Youtube className="w-5 h-5"/>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 Kerala Migrant Workers Health Portal. All rights reserved.</p>
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
