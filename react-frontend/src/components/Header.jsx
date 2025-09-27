import { Link } from 'react-router-dom';
import GovernmentBanner from './GovernmentBanner';
import Navigation from './Navigation';
import { useAuth } from '../contexts/useAuth';
import { User, UserPlus, Menu } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <GovernmentBanner />
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center py-3">
          {/* Logo - leftmost */}
          <img
            src="http://static.photos/government/120x120/1"
            alt="Kerala Government Logo"
            className="h-12 md:h-16"
          />

          {/* Text - centered */}
          <div className="flex-grow text-center">
            <h1 className="text-xl md:text-2xl font-bold text-blue-900">Kerala Migrant Workers</h1>
            <h2 className="text-md md:text-lg font-semibold text-blue-800">
              Digital Health Record Management System
            </h2>
          </div>

          {/* Right side: Login/Register and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {!user && (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
                >
                  <User className="mr-2 w-5 h-5" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
                >
                  <UserPlus className="mr-2 w-5 h-5" />
                  Register
                </Link>
              </div>
            )}
            <div className="md:hidden">
              <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-blue-500 p-2">
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <Navigation isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
    </>
  );
};

export default Header;