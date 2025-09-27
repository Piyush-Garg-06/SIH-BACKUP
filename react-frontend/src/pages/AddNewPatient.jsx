import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { UserPlus, Users, Heart, FileText, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';

const AddNewPatient = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patientType, setPatientType] = useState('worker'); // worker or patient
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: '',
    dob: '',
    aadhaar: '',
    address: '',
    nativeState: '',
    district: '',
    pincode: '',
    emergencyContact: '',
    emergencyContactName: '',
    bloodGroup: '',
    
    // Worker specific fields
    workLocation: '',
    employerName: '',
    jobType: '',
    workStartDate: '',
    
    // Health information
    medicalHistory: '',
    allergies: '',
    medications: '',
    vaccinations: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('AddNewPatient component mounted', { user });
    if (!user || user.role !== 'doctor') {
      console.log('Access denied - user:', user);
      toast.error('Unauthorized access. Only doctors can add new patients.');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePatientTypeChange = (type) => {
    setPatientType(type);
    // Clear worker-specific fields when switching to patient
    if (type === 'patient') {
      setFormData(prev => ({
        ...prev,
        workLocation: '',
        employerName: '',
        jobType: '',
        workStartDate: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields for both types
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.aadhaar.trim()) newErrors.aadhaar = 'Aadhaar number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.nativeState.trim()) newErrors.nativeState = 'Native state is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    
    // Worker-specific validations
    if (patientType === 'worker') {
      if (!formData.workLocation.trim()) newErrors.workLocation = 'Work location is required';
      if (!formData.employerName.trim()) newErrors.employerName = 'Employer name is required';
      if (!formData.jobType.trim()) newErrors.jobType = 'Job type is required';
    }
    
    // Validation patterns
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar.replace(/\D/g, ''))) {
      newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
    }
    
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        patientType: patientType,
        role: patientType, // Set role based on patient type
        password: 'TempPass123!' // Temporary password - should be changed on first login
      };

      const response = await api.post('/doctors/add-patient', submitData);
      
      if (response.data.success) {
        toast.success(`${patientType === 'worker' ? 'Migrant Worker' : 'Patient'} added successfully!`);
        toast.success(`Health ID generated: ${response.data.healthId}`);
        navigate('/doctors'); // Navigate back to doctor dashboard
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add patient. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'doctor') {
    console.log('Rendering null - user access check failed');
    return null;
  }

  console.log('Rendering AddNewPatient component');
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Add New Patient</h1>
                <p className="text-blue-100">Register a new migrant worker or patient</p>
              </div>
            </div>
          </div>

          {/* Patient Type Selection */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Type</h2>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handlePatientTypeChange('worker')}
                className={`flex items-center px-6 py-3 rounded-lg border-2 transition-colors ${
                  patientType === 'worker' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Migrant Worker
              </button>
              <button
                type="button"
                onClick={() => handlePatientTypeChange('patient')}
                className={`flex items-center px-6 py-3 rounded-lg border-2 transition-colors ${
                  patientType === 'patient' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <Heart className="w-5 h-5 mr-2" />
                Regular Patient
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter mobile number"
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dob ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    id="aadhaar"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.aadhaar ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 12-digit Aadhaar number"
                    maxLength="12"
                  />
                  {errors.aadhaar && <p className="text-red-500 text-xs mt-1">{errors.aadhaar}</p>}
                </div>

                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="nativeState" className="block text-sm font-medium text-gray-700 mb-1">
                    Native State *
                  </label>
                  <input
                    type="text"
                    id="nativeState"
                    name="nativeState"
                    value={formData.nativeState}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nativeState ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter native state"
                  />
                  {errors.nativeState && <p className="text-red-500 text-xs mt-1">{errors.nativeState}</p>}
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.district ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter district"
                  />
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact person name"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter emergency contact number"
                  />
                </div>
              </div>
            </div>

            {/* Worker-specific fields */}
            {patientType === 'worker' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Work Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="workLocation" className="block text-sm font-medium text-gray-700 mb-1">
                      Work Location *
                    </label>
                    <input
                      type="text"
                      id="workLocation"
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.workLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter work location"
                    />
                    {errors.workLocation && <p className="text-red-500 text-xs mt-1">{errors.workLocation}</p>}
                  </div>

                  <div>
                    <label htmlFor="employerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Employer Name *
                    </label>
                    <input
                      type="text"
                      id="employerName"
                      name="employerName"
                      value={formData.employerName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.employerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter employer name"
                    />
                    {errors.employerName && <p className="text-red-500 text-xs mt-1">{errors.employerName}</p>}
                  </div>

                  <div>
                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type *
                    </label>
                    <input
                      type="text"
                      id="jobType"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.jobType ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter job type"
                    />
                    {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType}</p>}
                  </div>

                  <div>
                    <label htmlFor="workStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Work Start Date
                    </label>
                    <input
                      type="date"
                      id="workStartDate"
                      name="workStartDate"
                      value={formData.workStartDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Health Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Health Information (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter any relevant medical history"
                  />
                </div>

                <div>
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter any known allergies"
                  />
                </div>

                <div>
                  <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Medications
                  </label>
                  <textarea
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current medications"
                  />
                </div>

                <div>
                  <label htmlFor="vaccinations" className="block text-sm font-medium text-gray-700 mb-1">
                    Vaccination History
                  </label>
                  <textarea
                    id="vaccinations"
                    name="vaccinations"
                    value={formData.vaccinations}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter vaccination history"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/doctors')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Adding Patient...' : `Add ${patientType === 'worker' ? 'Migrant Worker' : 'Patient'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewPatient;