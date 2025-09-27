import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut, User, FileText, Plus, Upload, Building,
  Users, Stethoscope, Shield, AlertTriangle, BarChart3, UserPlus
} from 'lucide-react';
import useUserData from '../hooks/useUserData';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { fetchUserDashboard, loading } = useUserData();
  const [dashboardData, setDashboardData] = useState(null);
  const [hospitalName, setHospitalName] = useState('');
  const [showAddWorkerForm, setShowAddWorkerForm] = useState(false);
  const [workerData, setWorkerData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    aadhaar: '',
    mobile: '',
    email: '',
    nativeState: '',
    address: '',
    district: '',
    pincode: '',
    bloodGroup: '',
    height: '',
    weight: '',
    employmentType: '',
    employerName: '',
    workLocation: '',
    workAddress: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const data = await fetchUserDashboard();
        if (data) {
          setDashboardData(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate, fetchUserDashboard]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/workers', workerData);
      console.log('Worker added:', response.data);
      alert(`Worker added successfully! Health ID: ${response.data.worker.healthId}`);
      setShowAddWorkerForm(false);
      setWorkerData({
        firstName: '',
        lastName: '',
        gender: '',
        dob: '',
        aadhaar: '',
        mobile: '',
        email: '',
        nativeState: '',
        address: '',
        district: '',
        pincode: '',
        bloodGroup: '',
        height: '',
        weight: '',
        employmentType: '',
        employerName: '',
        workLocation: '',
        workAddress: ''
      });
    } catch (error) {
      console.error('Error adding worker:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(`Error: ${error.response.data.msg}`);
      } else {
        alert('Error adding worker');
      }
    }
  };

  const handleSendToGovernment = async () => {
    try {
      const response = await api.post('/admin/send-to-government');
      console.log('Data sent to government:', response.data);
      alert(response.data.msg);
    } catch (error) {
      console.error('Error sending data to government:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(`Error: ${error.response.data.msg}`);
      } else {
        alert('Error sending data to government');
      }
    }
  };

  const handleInputChange = (e) => {
    setWorkerData({
      ...workerData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Error loading dashboard data.</div>;
  }

  // Remove the data structure validation that was causing issues
  // The dashboard should work even with empty cards array

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">{dashboardData.title}</h1>
              <p className="text-gray-600 mt-1">{dashboardData.subtitle}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Welcome,</span>
                <span className="text-lg font-semibold text-blue-800 ml-1">{user.name || 'Admin'}</span>
                <span className="ml-3 px-3 py-1 rounded-full text-xs font-semibold capitalize bg-red-100 text-red-800">
                  {user.userType}
                </span>
                {hospitalName && (
                  <span className="ml-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center">
                    <Building className="w-3 h-3 mr-1" />
                    {hospitalName}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 flex items-center transition-colors"
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
              Users, Stethoscope, Shield, User, AlertTriangle, BarChart3
            }[stat.icon] : Users;
            
            const getStatColor = (color) => {
              switch (color) {
                case 'blue': return 'bg-blue-100 text-blue-600';
                case 'green': return 'bg-green-100 text-green-600';
                case 'red': return 'bg-red-100 text-red-600';
                case 'orange': return 'bg-orange-100 text-orange-600';
                case 'purple': return 'bg-purple-100 text-purple-600';
                default: return 'bg-gray-100 text-gray-600';
              }
            };

            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
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

        {/* Admin Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/add-new-patient"
              className="bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add New User
            </Link>
            <Link 
              to="/admin/send-data"
              className="bg-green-600 text-white px-4 py-3 rounded-md font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Send Data to Government
            </Link>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter hospital/organization name"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={() => alert(`Hospital name set to: ${hospitalName}`)}
                className="bg-gray-600 text-white px-3 py-2 rounded-r-md font-medium hover:bg-gray-700 transition-colors"
              >
                Set
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          {dashboardData.cards && dashboardData.cards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.cards.map((card, index) => {
                // Filter out unwanted cards
                if (card.title === 'Doctors' || card.title === 'Employers' || card.title === 'Health Monitoring' || card.title === 'All Workers' || card.title === 'System Reports') {
                  return null;
                }
                
                const Icon = card.icon ? {
                  Users, Stethoscope, Shield, BarChart3
                }[card.icon] : Users;
                
                const getStatColor = (color) => {
                  switch (color) {
                    case 'blue': return 'bg-blue-100 text-blue-600';
                    case 'green': return 'bg-green-100 text-green-600';
                    case 'red': return 'bg-red-100 text-red-600';
                    case 'orange': return 'bg-orange-100 text-orange-600';
                    case 'purple': return 'bg-purple-100 text-purple-600';
                    default: return 'bg-gray-100 text-gray-600';
                  }
                };

                return (
                  <Link
                    key={index}
                    to={card.path}
                    className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow block"
                  >
                    <div className={`w-12 h-12 ${getStatColor(card.color)} rounded-lg flex items-center justify-center mb-4`}>
                      {Icon ? <Icon className="w-6 h-6" /> : <div className="w-6 h-6 bg-gray-200 rounded-full" />}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                  </Link>
                );
              })}
              {/* Add the new Patient Management card */}
              <Link
                to="/admin/patients"
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow block"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Management</h3>
                <p className="text-gray-600 text-sm">View and manage all patients and workers</p>
              </Link>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-500 text-center">No quick actions available</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Worker Modal */}
      {showAddWorkerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add New Migrant Worker</h3>
                <button 
                  onClick={() => setShowAddWorkerForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAddWorker}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={workerData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={workerData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={workerData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={workerData.dob}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                    <input
                      type="text"
                      name="aadhaar"
                      value={workerData.aadhaar}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input
                      type="text"
                      name="mobile"
                      value={workerData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={workerData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Native State</label>
                    <input
                      type="text"
                      name="nativeState"
                      value={workerData.nativeState}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={workerData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      name="district"
                      value={workerData.district}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={workerData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <input
                      type="text"
                      name="bloodGroup"
                      value={workerData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={workerData.height}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={workerData.weight}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                    <input
                      type="text"
                      name="employmentType"
                      value={workerData.employmentType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name</label>
                    <input
                      type="text"
                      name="employerName"
                      value={workerData.employerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                    <input
                      type="text"
                      name="workLocation"
                      value={workerData.workLocation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Address</label>
                    <input
                      type="text"
                      name="workAddress"
                      value={workerData.workAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddWorkerForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Worker
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;