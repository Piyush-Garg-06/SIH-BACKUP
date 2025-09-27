import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import {
  Home, Info, Heart, CreditCard, UserPlus, Briefcase, Mail,
  Stethoscope, Users, Shield, Bell, FileText, Calendar,
  LogOut, User, X, Building, Upload
} from 'lucide-react';

const Navigation = ({ isSidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    if (!user) {
      // Public navigation
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/about', label: 'About', icon: Info },
        { path: '/services', label: 'Services', icon: Heart },
        { path: '/contact', label: 'Contact', icon: Mail },
      ];
    }

    switch (user.userType) {
      case 'worker':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/healthcard', label: 'My Health Card', icon: CreditCard },
          { path: '/health-records', label: 'Medical Records', icon: FileText },
          { path: '/appointments', label: 'Appointments', icon: Calendar },
          { path: '/notifications', label: 'Notifications', icon: Bell },
        ];
      case 'doctor':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/patients', label: 'My Patients', icon: Users },
          { path: '/health-checkups', label: 'Health Checkups', icon: Stethoscope },
          { path: '/reports', label: 'Medical Reports', icon: FileText },
          { path: '/notifications', label: 'Notifications', icon: Bell },
        ];
      case 'employer':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/workers', label: 'My Workers', icon: Users },
          { path: '/health-compliance', label: 'Health Compliance', icon: Shield },
          { path: '/reports', label: 'Reports', icon: FileText },
          { path: '/notifications', label: 'Notifications', icon: Bell },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
          { path: '/add-new-patient', label: 'Add New Patient', icon: UserPlus },
          { path: '/admin/send-data', label: 'Send Data', icon: Upload },
          { path: '/admin/notifications', label: 'Notifications', icon: Bell },
        ];
      case 'emitra':
        return [
          { path: '/emitra/dashboard', label: 'Dashboard', icon: Home },
          { path: '/emitra/status', label: 'Check Status', icon: FileText },
          { path: '/emitra/profile', label: 'Profile', icon: User },
          { path: '/notifications', label: 'Notifications', icon: Bell },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav style={{ backgroundColor: '#00d5b1' }} className="text-white hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Left: Logo */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="text-xl font-bold">
                Kerala Health Portal
              </Link>
            </div>

            {/* Center: Navigation Links */}
            <div className="flex-1 flex justify-center pl-20">
              <ul className="flex space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`hover:bg-teal-700 px-3 py-2 rounded-md font-medium flex items-center transition-colors ${
                          isActive ? 'bg-teal-700' : ''
                        }`}
                      >
                        <Icon className="mr-1 w-4 h-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right: User Info & Logout */}
            <div className="flex-1 flex justify-end items-center space-x-4">
              {user && (
                <>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.name}</span>
                    <span className="bg-teal-600 px-2 py-1 rounded text-xs capitalize">
                      {user.userType}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-medium flex items-center transition-colors"
                  >
                    <LogOut className="mr-1 w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCloseSidebar}
      >
        <div
          className={`fixed top-0 left-0 h-full bg-white w-72 shadow-lg p-6 transition-transform duration-300 ease-in-out transform flex flex-col ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-blue-900">Menu</h2>
            <button onClick={handleCloseSidebar} className="text-gray-600 hover:text-red-500 p-1">
              <X size={24} />
            </button>
          </div>
          <ul className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={handleCloseSidebar}
                    className={`flex items-center p-3 rounded-md text-lg font-medium transition-colors ${
                      isActive ? 'bg-teal-100 text-teal-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-4 w-6 h-6" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto pt-6 border-t">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center p-2 rounded-md bg-gray-100">
                  <User className="w-5 h-5 mr-3 text-gray-600"/>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.userType}</p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); handleCloseSidebar(); }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                >
                  <LogOut className="mr-2 w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link to="/login" onClick={handleCloseSidebar} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors text-lg">
                  <User className="mr-2 w-5 h-5" />
                  Login
                </Link>
                <Link to="/register" onClick={handleCloseSidebar} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors text-lg">
                  <UserPlus className="mr-2 w-5 h-5" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;