import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import {
  Home, Info, Heart, CreditCard, UserPlus, Briefcase, Mail,
  Stethoscope, Users, Shield, Bell, FileText, Calendar,
  LogOut, User, X, Building, Upload, AlertTriangle, AlertCircle, Hospital
} from 'lucide-react';

const Navigation = ({ isSidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Add CSS to hide scrollbar
  const scrollbarHideStyles = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .nav-container {
      mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
    }
  `;

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
      case 'patient':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/healthcard', label: 'My Health Card', icon: CreditCard },
          { path: '/health-records', label: 'Medical Records', icon: FileText },
          { path: '/appointments', label: 'Appointments', icon: Calendar },
          { path: '/worker-notifications', label: 'Notifications', icon: Bell },
        ];
      case 'doctor':
      case 'hospital_staff':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/patients', label: 'Patients', icon: Users },  // Shortened label
          { path: '/health-checkups', label: 'Checkups', icon: Stethoscope },  // Shortened label
          { path: '/reports', label: 'Reports', icon: FileText },
          { path: '/hospital-dashboard', label: 'Hospital', icon: Hospital },  // Shortened label
          { path: '/doctor-notifications', label: 'Notifications', icon: Bell },
          // Add new doctor option here if needed
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
          { path: '/hospital-dashboard', label: 'Hospital Dashboard', icon: Hospital },
          { path: '/admin-notifications', label: 'Notifications', icon: Bell },
        ];
      case 'emitra':
        return [
          { path: '/emitra/dashboard', label: 'Dashboard', icon: Home },
          { path: '/emitra/status', label: 'Check Status', icon: FileText },
          { path: '/emitra/profile', label: 'Profile', icon: User },
          { path: '/notifications', label: 'Notifications', icon: Bell },
        ];
      default:
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/hospital-dashboard', label: 'Hospital Dashboard', icon: Hospital },
          { path: '/notifications', label: 'Notifications', icon: Bell },
        ];
    }
  };

  const navItems = getNavItems();
  
  // Adjust spacing based on number of nav items
  const getNavSpacingClass = () => {
    const itemCount = navItems.length;
    if (itemCount > 6) {
      return 'space-x-0.5';
    } else if (itemCount > 4) {
      return 'space-x-1';
    } else {
      return 'space-x-2';
    }
  };
  
  // Adjust padding based on number of nav items
  const getNavItemPaddingClass = () => {
    const itemCount = navItems.length;
    if (itemCount > 6) {
      return 'px-1.5 py-1';
    } else if (itemCount > 5) {  // Changed from 4 to 5 to better accommodate 6 items
      return 'px-2 py-1.5';
    } else if (itemCount === 6) {  // Special case for exactly 6 items (doctor nav)
      return 'px-1.5 py-1.5';
    } else {
      return 'px-3 py-2';
    }
  };
  
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <>
      <style>{scrollbarHideStyles}</style>
      {/* Desktop Navigation */}
      <nav style={{ backgroundColor: '#00d5b1' }} className="text-white hidden md:block shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-nowrap justify-between items-center py-3">
            {/* Left: Logo and Portal Name */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="text-xl font-bold whitespace-nowrap">
                Kerala Health Portal
              </Link>
            </div>

            {/* Center: Navigation Links - Responsive based on item count */}
            {/* scrollbar-hide class hides the scrollbar while still allowing horizontal scrolling */}
            {/* nav-container provides fade effect at edges when content overflows */}
            <div className="flex-grow mx-4 overflow-x-hidden nav-container">
              <ul className={`flex flex-nowrap justify-center ${getNavSpacingClass()}`}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path} className="flex-shrink-0">
                      <Link
                        to={item.path}
                        className={`hover:bg-teal-700 rounded font-medium flex items-center transition-colors text-sm whitespace-nowrap ${
                          isActive ? 'bg-teal-700' : ''
                        } ${getNavItemPaddingClass()}`}
                      >
                        <Icon className="mr-1 w-4 h-4 flex-shrink-0" />
                        <span className="truncate max-w-[100px]">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {/* Visual indicator when there are many items */}
              {navItems.length > 6 && (
                <div className="text-center text-xs text-teal-100 mt-1 hidden lg:block">
                  ← → Scroll to see all options
                </div>
              )}
            </div>

            {/* Right: User Info & Logout */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {user && (
                <>
                  <div className="flex items-center space-x-1.5">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                    <span className="bg-teal-600 px-1.5 py-0.5 rounded text-xs capitalize whitespace-nowrap">
                      {user.userType}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded font-medium flex items-center transition-colors text-sm"
                  >
                    <LogOut className="mr-1 w-4 h-4" />
                    <span className="hidden lg:inline">Logout</span>
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
          className={`fixed top-0 left-0 h-full bg-white shadow-lg p-4 transition-transform duration-300 ease-in-out transform flex flex-col ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '280px' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-900">Menu</h2>
            <button onClick={handleCloseSidebar} className="text-gray-600 hover:text-red-500 p-1">
              <X size={24} />
            </button>
          </div>
          <ul className="flex flex-col space-y-1 flex-grow overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={handleCloseSidebar}
                    className={`flex items-center p-2.5 rounded-md text-base font-medium transition-colors ${
                      isActive ? 'bg-teal-100 text-teal-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-3 w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
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