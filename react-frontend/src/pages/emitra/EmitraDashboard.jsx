import { useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

const EmitraDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState(''); // 'patient' or 'worker'
  const [loading, setLoading] = useState(false);
  
  // Patient form state
  const [patientData, setPatientData] = useState({
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
    emergencyContact: '',
    emergencyContactName: '',
    medicalHistory: '',
    allergies: '',
    medications: ''
  });
  
  // Worker form state
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

  // Check if user is emitra
  if (user && user.role !== 'emitra') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">Only eMitra operators can access this page.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert height and weight to numbers when setting state
    if (name === 'height' || name === 'weight') {
      setPatientData({
        ...patientData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setPatientData({
        ...patientData,
        [name]: value
      });
    }
  };

  const handleWorkerInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert height and weight to numbers when setting state
    if (name === 'height' || name === 'weight') {
      setWorkerData({
        ...workerData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setWorkerData({
        ...workerData,
        [name]: value
      });
    }
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate required fields
    if (!patientData.firstName || !patientData.lastName || !patientData.gender || !patientData.dob || 
        !patientData.aadhaar || !patientData.mobile || !patientData.email || !patientData.nativeState || 
        !patientData.address || !patientData.district || !patientData.pincode || 
        !patientData.bloodGroup || !patientData.height || !patientData.weight) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    // Validate height and weight are numbers
    if (isNaN(patientData.height) || isNaN(patientData.weight)) {
      alert('Height and weight must be valid numbers');
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.post('/emitra/patients', patientData);
      
      if (response && response.patient && response.patient.healthId) {
        alert(`Patient added successfully! Health ID: ${response.patient.healthId}`);
      } else {
        alert('Patient added successfully!');
      }
      
      // Reset form
      setPatientData({
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
        emergencyContact: '',
        emergencyContactName: '',
        medicalHistory: '',
        allergies: '',
        medications: ''
      });
      
      // Reset user type selection
      setUserType('');
    } catch (error) {
      console.error('Error adding patient:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(`Error: ${error.response.data.msg}`);
      } else {
        alert('Error adding patient. Please check the console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate required fields
    if (!workerData.firstName || !workerData.lastName || !workerData.gender || !workerData.dob || 
        !workerData.aadhaar || !workerData.mobile || !workerData.email || !workerData.nativeState || 
        !workerData.address || !workerData.district || !workerData.pincode || 
        !workerData.bloodGroup || !workerData.height || !workerData.weight ||
        !workerData.employmentType || !workerData.employerName || !workerData.workLocation || !workerData.workAddress) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    // Validate height and weight are numbers
    if (isNaN(workerData.height) || isNaN(workerData.weight)) {
      alert('Height and weight must be valid numbers');
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.post('/emitra/workers', workerData);
      
      if (response && response.worker && response.worker.healthId) {
        alert(`Worker added successfully! Health ID: ${response.worker.healthId}`);
      } else {
        alert('Worker added successfully!');
      }
      
      // Reset form
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
      
      // Reset user type selection
      setUserType('');
    } catch (error) {
      console.error('Error adding worker:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(`Error: ${error.response.data.msg}`);
      } else {
        alert('Error adding worker. Please check the console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Simple SVG icons for the user type selection
  const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const WorkerIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!userType ? (
          // User type selection screen
          <div className="bg-white rounded-lg shadow-sm border p-8 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What type of user do you want to add?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleUserTypeSelect('patient')}
                className="bg-blue-600 text-white p-8 rounded-lg hover:bg-blue-700 transition-colors flex flex-col items-center"
              >
                <UserIcon className="w-12 h-12 mb-4" />
                <span className="text-xl font-semibold">Patient</span>
                <p className="mt-2 text-gray-200">Add a regular patient to the system</p>
              </button>
              <button
                onClick={() => handleUserTypeSelect('worker')}
                className="bg-green-600 text-white p-8 rounded-lg hover:bg-green-700 transition-colors flex flex-col items-center"
              >
                <WorkerIcon className="w-12 h-12 mb-4" />
                <span className="text-xl font-semibold">Migrant Worker</span>
                <p className="mt-2 text-gray-200">Add a migrant worker to the system</p>
              </button>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-8 text-gray-600 hover:text-gray-800 flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Cancel and return to dashboard
            </button>
          </div>
        ) : userType === 'patient' ? (
          // Patient form
          <div className="bg-white rounded-lg shadow-sm border p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
              <button
                onClick={() => setUserType('')}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Change User Type
              </button>
            </div>
            
            <form onSubmit={handlePatientSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={patientData.firstName}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={patientData.lastName}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={patientData.gender}
                    onChange={handlePatientInputChange}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={patientData.dob}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number *</label>
                  <input
                    type="text"
                    name="aadhaar"
                    value={patientData.aadhaar}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                  <input
                    type="text"
                    name="mobile"
                    value={patientData.mobile}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={patientData.email}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Native State *</label>
                  <input
                    type="text"
                    name="nativeState"
                    value={patientData.nativeState}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={patientData.address}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <input
                    type="text"
                    name="district"
                    value={patientData.district}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={patientData.pincode}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={patientData.bloodGroup}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) *</label>
                  <input
                    type="number"
                    name="height"
                    value={patientData.height}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={patientData.weight}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={patientData.emergencyContactName}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={patientData.emergencyContact}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                  <textarea
                    name="medicalHistory"
                    value={patientData.medicalHistory}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  <input
                    type="text"
                    name="allergies"
                    value={patientData.allergies}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                  <input
                    type="text"
                    name="medications"
                    value={patientData.medications}
                    onChange={handlePatientInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setUserType('')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Adding Patient...' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Worker form
          <div className="bg-white rounded-lg shadow-sm border p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Migrant Worker</h2>
              <button
                onClick={() => setUserType('')}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Change User Type
              </button>
            </div>
            
            <form onSubmit={handleWorkerSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={workerData.firstName}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={workerData.lastName}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={workerData.gender}
                    onChange={handleWorkerInputChange}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={workerData.dob}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number *</label>
                  <input
                    type="text"
                    name="aadhaar"
                    value={workerData.aadhaar}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                  <input
                    type="text"
                    name="mobile"
                    value={workerData.mobile}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={workerData.email}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Native State *</label>
                  <input
                    type="text"
                    name="nativeState"
                    value={workerData.nativeState}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={workerData.address}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <input
                    type="text"
                    name="district"
                    value={workerData.district}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={workerData.pincode}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={workerData.bloodGroup}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) *</label>
                  <input
                    type="number"
                    name="height"
                    value={workerData.height}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={workerData.weight}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                  <input
                    type="text"
                    name="employmentType"
                    value={workerData.employmentType}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name *</label>
                  <input
                    type="text"
                    name="employerName"
                    value={workerData.employerName}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Location *</label>
                  <input
                    type="text"
                    name="workLocation"
                    value={workerData.workLocation}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Address *</label>
                  <input
                    type="text"
                    name="workAddress"
                    value={workerData.workAddress}
                    onChange={handleWorkerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setUserType('')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Adding Worker...' : 'Add Worker'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmitraDashboard;