import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, Save, X } from 'lucide-react';
import api from '../utils/api';

const AddNewUser = () => {
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

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    
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
    
    if (!patientData.firstName || !patientData.lastName || !patientData.gender || !patientData.dob || 
        !patientData.aadhaar || !patientData.mobile || !patientData.email || !patientData.nativeState || 
        !patientData.address || !patientData.district || !patientData.pincode || 
        !patientData.bloodGroup || !patientData.height || !patientData.weight) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    if (isNaN(patientData.height) || isNaN(patientData.weight)) {
      alert('Height and weight must be valid numbers');
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.post('/admin/patients', patientData);
      
      if (response && response.patient && response.patient.healthId) {
        alert(`Patient added successfully! Health ID: ${response.patient.healthId}`);
      } else {
        alert('Patient added successfully!');
      }
      
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
    
    if (!workerData.firstName || !workerData.lastName || !workerData.gender || !workerData.dob || 
        !workerData.aadhaar || !workerData.mobile || !workerData.email || !workerData.nativeState || 
        !workerData.address || !workerData.district || !workerData.pincode || 
        !workerData.bloodGroup || !workerData.height || !workerData.weight ||
        !workerData.employmentType || !workerData.employerName || !workerData.workLocation || !workerData.workAddress) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    if (isNaN(workerData.height) || isNaN(workerData.weight)) {
      alert('Height and weight must be valid numbers');
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.post('/admin/workers', workerData);
      
      if (response && response.worker && response.worker.healthId) {
        alert(`Worker added successfully! Health ID: ${response.worker.healthId}`);
      } else {
        alert('Worker added successfully!');
      }
      
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

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6 text-lg">Only administrators can access this page.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {!userType ? (
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">What type of user do you want to add?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                onClick={() => handleUserTypeSelect('patient')}
                className="bg-blue-500 text-white p-10 rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 flex flex-col items-center shadow-lg"
              >
                <User className="w-16 h-16 mb-4" />
                <span className="text-2xl font-bold">Patient</span>
                <p className="mt-2 text-blue-100">Add a regular patient to the system</p>
              </button>
              <button
                onClick={() => handleUserTypeSelect('worker')}
                className="bg-green-500 text-white p-10 rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105 flex flex-col items-center shadow-lg"
              >
                <Briefcase className="w-16 h-16 mb-4" />
                <span className="text-2xl font-bold">Migrant Worker</span>
                <p className="mt-2 text-green-100">Add a migrant worker to the system</p>
              </button>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="mt-10 text-gray-600 hover:text-gray-800 flex items-center justify-center mx-auto font-semibold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Cancel and return to dashboard
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-2xl">
            <div className={`bg-gradient-to-r ${userType === 'patient' ? 'from-blue-700 to-blue-500' : 'from-green-700 to-green-500'} text-white p-6 rounded-t-xl shadow-lg`}>
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Add New {userType === 'patient' ? 'Patient' : 'Migrant Worker'}</h2>
                <button
                  onClick={() => setUserType('')}
                  className="text-white hover:text-gray-200 flex items-center font-semibold"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Change User Type
                </button>
              </div>
            </div>
            <form onSubmit={userType === 'patient' ? handlePatientSubmit : handleWorkerSubmit} className="p-6">
              {userType === 'patient' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient form fields */}
                  <InputField label="First Name *" name="firstName" value={patientData.firstName} onChange={handlePatientInputChange} required />
                  <InputField label="Last Name *" name="lastName" value={patientData.lastName} onChange={handlePatientInputChange} required />
                  <SelectField label="Gender *" name="gender" value={patientData.gender} onChange={handlePatientInputChange} options={['Male', 'Female', 'Other']} required />
                  <InputField label="Date of Birth *" name="dob" type="date" value={patientData.dob} onChange={handlePatientInputChange} required />
                  <InputField label="Aadhaar Number *" name="aadhaar" value={patientData.aadhaar} onChange={handlePatientInputChange} required />
                  <InputField label="Mobile *" name="mobile" value={patientData.mobile} onChange={handlePatientInputChange} required />
                  <InputField label="Email *" name="email" type="email" value={patientData.email} onChange={handlePatientInputChange} required />
                  <InputField label="Native State *" name="nativeState" value={patientData.nativeState} onChange={handlePatientInputChange} required />
                  <InputField label="Address *" name="address" value={patientData.address} onChange={handlePatientInputChange} required className="md:col-span-2" />
                  <InputField label="District *" name="district" value={patientData.district} onChange={handlePatientInputChange} required />
                  <InputField label="Pincode *" name="pincode" value={patientData.pincode} onChange={handlePatientInputChange} required />
                  <InputField label="Blood Group *" name="bloodGroup" value={patientData.bloodGroup} onChange={handlePatientInputChange} required />
                  <InputField label="Height (cm) *" name="height" type="number" value={patientData.height} onChange={handlePatientInputChange} required />
                  <InputField label="Weight (kg) *" name="weight" type="number" value={patientData.weight} onChange={handlePatientInputChange} required />
                  <InputField label="Emergency Contact Name" name="emergencyContactName" value={patientData.emergencyContactName} onChange={handlePatientInputChange} />
                  <InputField label="Emergency Contact Number" name="emergencyContact" value={patientData.emergencyContact} onChange={handlePatientInputChange} />
                  <TextareaField label="Medical History" name="medicalHistory" value={patientData.medicalHistory} onChange={handlePatientInputChange} className="md:col-span-2" />
                  <InputField label="Allergies" name="allergies" value={patientData.allergies} onChange={handlePatientInputChange} />
                  <InputField label="Current Medications" name="medications" value={patientData.medications} onChange={handlePatientInputChange} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Worker form fields */}
                  <InputField label="First Name *" name="firstName" value={workerData.firstName} onChange={handleWorkerInputChange} required />
                  <InputField label="Last Name *" name="lastName" value={workerData.lastName} onChange={handleWorkerInputChange} required />
                  <SelectField label="Gender *" name="gender" value={workerData.gender} onChange={handleWorkerInputChange} options={['Male', 'Female', 'Other']} required />
                  <InputField label="Date of Birth *" name="dob" type="date" value={workerData.dob} onChange={handleWorkerInputChange} required />
                  <InputField label="Aadhaar Number *" name="aadhaar" value={workerData.aadhaar} onChange={handleWorkerInputChange} required />
                  <InputField label="Mobile *" name="mobile" value={workerData.mobile} onChange={handleWorkerInputChange} required />
                  <InputField label="Email *" name="email" type="email" value={workerData.email} onChange={handleWorkerInputChange} required />
                  <InputField label="Native State *" name="nativeState" value={workerData.nativeState} onChange={handleWorkerInputChange} required />
                  <InputField label="Address *" name="address" value={workerData.address} onChange={handleWorkerInputChange} required className="md:col-span-2" />
                  <InputField label="District *" name="district" value={workerData.district} onChange={handleWorkerInputChange} required />
                  <InputField label="Pincode *" name="pincode" value={workerData.pincode} onChange={handleWorkerInputChange} required />
                  <InputField label="Blood Group *" name="bloodGroup" value={workerData.bloodGroup} onChange={handleWorkerInputChange} required />
                  <InputField label="Height (cm) *" name="height" type="number" value={workerData.height} onChange={handleWorkerInputChange} required />
                  <InputField label="Weight (kg) *" name="weight" type="number" value={workerData.weight} onChange={handleWorkerInputChange} required />
                  <InputField label="Employment Type *" name="employmentType" value={workerData.employmentType} onChange={handleWorkerInputChange} required />
                  <InputField label="Employer Name *" name="employerName" value={workerData.employerName} onChange={handleWorkerInputChange} required />
                  <InputField label="Work Location *" name="workLocation" value={workerData.workLocation} onChange={handleWorkerInputChange} required className="md:col-span-2" />
                  <InputField label="Work Address *" name="workAddress" value={workerData.workAddress} onChange={handleWorkerInputChange} required className="md:col-span-2" />
                </div>
              )}
              <div className="flex items-center justify-end pt-6 space-x-4 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setUserType('')}
                  className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-semibold"
                >
                  <X className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center px-6 py-2 rounded-md text-white font-medium transition-colors shadow-md hover:shadow-lg ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : userType === 'patient' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : `Save ${userType === 'patient' ? 'Patient' : 'Worker'}`}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = 'text', value, onChange, required, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      required={required}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map(option => (
        <option key={option} value={option.toLowerCase()}>{option}</option>
      ))}
    </select>
  </div>
);

const TextareaField = ({ label, name, value, onChange, required, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows="3"
      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      required={required}
    />
  </div>
);

export default AddNewUser;