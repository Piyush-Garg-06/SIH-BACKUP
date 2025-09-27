import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut, User, FileText, Bell, Award, Calendar, QrCode,
  Stethoscope, Users, Shield, AlertTriangle, CheckCircle,
  Clock, Activity, TrendingUp, BarChart3
} from 'lucide-react';
import useUserData from '../hooks/useUserData';

const Dashboard = () => {
  const { user, logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const { fetchUserDashboard, loading } = useUserData();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect admin users to admin dashboard
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const data = await fetchUserDashboard();
        if (data) {
          console.log('Dashboard data received:', data);
          console.log('Dashboard data stats:', data.stats);
          console.log('Dashboard data cards:', data.cards);
          console.log('Dashboard data alerts:', data.alerts);
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, [user, navigate, fetchUserDashboard]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dashboardData) {
    return <div>Error loading dashboard data.</div>;
  }

  // Add safety checks for required properties
  if (!dashboardData.stats || !Array.isArray(dashboardData.stats)) {
    console.error('Invalid dashboard data structure - stats:', dashboardData.stats);
    return <div>Error loading dashboard data.</div>;
  }

  if (!dashboardData.cards || !Array.isArray(dashboardData.cards)) {
    console.error('Invalid dashboard data structure - cards:', dashboardData.cards);
    return <div>Error loading dashboard data.</div>;
  }

  // Ensure alerts is an array
  if (!dashboardData.alerts) {
    dashboardData.alerts = [];
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 border-red-500 text-red-800';
      case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'info': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getStatColor = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'red': return 'bg-red-100 text-red-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{dashboardData.title}</h1>
              <p className="text-blue-200 mt-1">{dashboardData.subtitle}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-blue-300">Welcome,</span>
                {user && user.name ? (
                  <span className="text-lg font-semibold ml-1">{user.name}</span>
                ) : (
                  <span className="text-lg font-semibold ml-1">User</span>
                )}
                {user && user.userType ? (
                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold capitalize
                    ${user.userType === 'worker' ? 'bg-blue-100 text-blue-800' :
                      user.userType === 'doctor' ? 'bg-green-100 text-green-800' :
                      user.userType === 'employer' ? 'bg-purple-100 text-purple-800' :
                      user.userType === 'patient' ? 'bg-yellow-100 text-yellow-800' : // Added patient color
                      user.userType === 'admin' ? 'bg-red-100 text-red-800' : // Added admin color
                      'bg-gray-100 text-gray-800'}`}>
                    {user.userType}
                  </span>
                ) : (
                  <span className="ml-3 px-3 py-1 rounded-full text-xs font-semibold capitalize bg-gray-100 text-gray-800">
                    Unknown
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 flex items-center transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {dashboardData.stats.map((stat, index) => {
            const Icon = stat.icon ? {
              Activity, Calendar, QrCode, CheckCircle, Users, Stethoscope, FileText, AlertTriangle, Clock, TrendingUp, BarChart3, User
            }[stat.icon] : Activity; // Added User icon
            
            // Debugging: Check if Icon is undefined
            if (!Icon) {
              console.error('Undefined icon for stat:', stat);
            }
            
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${getStatColor(stat.color)}`}>
                    {Icon ? <Icon className="w-6 h-6" /> : <div className="w-6 h-6 bg-gray-200 rounded-full" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alerts */}
        {dashboardData.alerts && dashboardData.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Alerts</h2>
            <div className="space-y-3">
              {dashboardData.alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)} shadow-md`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-3" />
                      <span className="font-medium">{alert.message}</span>
                    </div>
                    <button className="bg-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm border border-gray-300">
                      {alert.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardData.cards.map((card, index) => {
              const Icon = card.icon ? {
                QrCode, FileText, Calendar, Bell, Users, Stethoscope, Shield, BarChart3, User
              }[card.icon] : User; // Added User icon
              
              // Debugging: Check if Icon is undefined
              if (!Icon) {
                console.error('Undefined icon for card:', card);
              }
              
              return (
                <Link
                  key={index}
                  to={card.path}
                  className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
                >
                  <div className={`w-12 h-12 ${getStatColor(card.color)} rounded-lg flex items-center justify-center mb-4`}>
                    {Icon ? <Icon className="w-6 h-6" /> : <div className="w-6 h-6 bg-gray-200 rounded-full" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </Link>
              );
            })}
          </div>
        </div>


      </div>
    </div>
  );
};

export default Dashboard;