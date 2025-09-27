import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { toast } from 'react-toastify';

const ScheduleAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [step, setStep] = useState(1); // 1: hospital selection, 2: doctor selection, 3: appointment details
  const [formData, setFormData] = useState({
    hospitalId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'Health Checkup',
    hospital: '',
    department: '',
    notes: '',
    contact: '',
    address: '',
    priority: 'normal',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || (user.role !== 'worker' && user.role !== 'patient')) {
      toast.error('Unauthorized access. Only workers and patients can schedule appointments.');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch hospitals with direct fetch to bypass any api.js issues
        console.log('Fetching hospitals...');
        const hospitalsResponse = await fetch('http://localhost:5000/api/hospitals');
        if (!hospitalsResponse.ok) {
          throw new Error(`HTTP error! status: ${hospitalsResponse.status}`);
        }
        const hospitalsData = await hospitalsResponse.json();
        console.log('Hospitals data:', hospitalsData);
        
        // Handle different response formats
        let hospitalsArray = [];
        if (Array.isArray(hospitalsData)) {
          hospitalsArray = hospitalsData;
        } else if (hospitalsData && hospitalsData.data && Array.isArray(hospitalsData.data)) {
          hospitalsArray = hospitalsData.data;
        }
        
        setHospitals(hospitalsArray);
        
        // Fetch all doctors
        console.log('Fetching doctors...');
        const doctorsResponse = await fetch('http://localhost:5000/api/doctors');
        if (!doctorsResponse.ok) {
          throw new Error(`HTTP error! status: ${doctorsResponse.status}`);
        }
        const doctorsData = await doctorsResponse.json();
        console.log('Doctors data:', doctorsData);
        
        // Handle different response formats
        let doctorsArray = [];
        if (Array.isArray(doctorsData)) {
          doctorsArray = doctorsData;
        } else if (doctorsData && doctorsData.data && Array.isArray(doctorsData.data)) {
          doctorsArray = doctorsData.data;
        }
        
        setDoctors(doctorsArray);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data.');
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleHospitalSelect = async (hospitalId) => {
    try {
      const selectedHospital = hospitals.find(h => h._id === hospitalId);
      setFormData({
        ...formData,
        hospitalId,
        hospital: selectedHospital ? selectedHospital.name : ''
      });
      
      // Fetch doctors for this hospital
      console.log(`Fetching doctors for hospital ${hospitalId}...`);
      const doctorsResponse = await fetch(`http://localhost:5000/api/hospitals/${hospitalId}/doctors`);
      if (!doctorsResponse.ok) {
        throw new Error(`HTTP error! status: ${doctorsResponse.status}`);
      }
      const doctorsData = await doctorsResponse.json();
      console.log('Doctors for hospital data:', doctorsData);
      
      // Handle different response formats
      let doctorsArray = [];
      if (Array.isArray(doctorsData)) {
        doctorsArray = doctorsData;
      } else if (doctorsData && doctorsData.data && Array.isArray(doctorsData.data)) {
        doctorsArray = doctorsData.data;
      }
      
      setFilteredDoctors(doctorsArray);
      
      setStep(2);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.message || 'Failed to load doctors for this hospital.');
      toast.error('Failed to load doctors for this hospital.');
    }
  };

  const handleDoctorSelect = (doctorId) => {
    const selectedDoctor = doctors.find(d => d._id === doctorId) || filteredDoctors.find(d => d._id === doctorId);
    setFormData({
      ...formData,
      doctorId,
      department: selectedDoctor ? selectedDoctor.specialization : ''
    });
    setStep(3);
  };

  const handleBackToHospitals = () => {
    setStep(1);
    setFormData({
      ...formData,
      hospitalId: '',
      hospital: '',
      doctorId: '',
      department: ''
    });
  };

  const handleBackToDoctors = () => {
    setStep(2);
    setFormData({
      ...formData,
      doctorId: '',
      department: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctorId) newErrors.doctorId = 'Doctor is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.hospital) newErrors.hospital = 'Hospital is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';
    if (!formData.address) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'x-auth-token': token })
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast.success('Appointment scheduled successfully!');
      navigate('/appointments');
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      setError(err.message || 'Failed to schedule appointment.');
      toast.error('Failed to schedule appointment.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) {
    return <div className="text-center p-8">Loading hospitals and doctors...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Error</h1>
          <p className="text-gray-700 mb-4">Failed to load data: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Schedule New Appointment</h1>
        
        {/* Progress indicator */}
        <div className="flex items-center mb-8">
          <div className={`flex-1 text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
            <div className="mt-2 text-sm">Select Hospital</div>
          </div>
          <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
            <div className="mt-2 text-sm">Select Doctor</div>
          </div>
          <div className={`flex-1 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 text-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
            <div className="mt-2 text-sm">Appointment Details</div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select a Hospital</h2>
            {hospitals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No hospitals available at the moment.</p>
                <p className="text-gray-500 text-sm mt-2">Debug: Hospitals array length: {hospitals.length}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitals.map((hospital) => (
                  <div 
                    key={hospital._id}
                    onClick={() => handleHospitalSelect(hospital._id)}
                    className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                    <p className="text-gray-600 mt-2">{hospital.location}</p>
                    <p className="text-gray-500 text-sm mt-1">{hospital.district}, {hospital.state}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={handleBackToHospitals}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                &larr; Back to Hospitals
              </button>
              <h2 className="text-xl font-semibold ml-4">Select a Doctor at {formData.hospital}</h2>
            </div>
            
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No doctors available at this hospital.</p>
                <button 
                  onClick={handleBackToHospitals}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Select a different hospital
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doctor) => (
                  <div 
                    key={doctor._id}
                    onClick={() => handleDoctorSelect(doctor._id)}
                    className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-gray-600 mt-2">{doctor.specialization}</p>
                    {doctor.experience && (
                      <p className="text-sm text-gray-500 mt-1">Experience: {doctor.experience} years</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={handleBackToDoctors}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                &larr; Back to Doctors
              </button>
              <h2 className="text-xl font-semibold ml-4">Appointment Details</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Selected Hospital & Doctor</h3>
                <p className="text-gray-700 mt-1">{formData.hospital}</p>
                <p className="text-gray-700">
                  {doctors.find(d => d._id === formData.doctorId)?.firstName} {doctors.find(d => d._id === formData.doctorId)?.lastName} 
                  <span className="text-gray-500"> ({formData.department})</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Health Checkup">Health Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Emergency Consultation">Emergency Consultation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Any specific notes for the doctor or appointment"
                ></textarea>
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your contact number"
                />
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your address for the appointment"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleBackToDoctors}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Requesting...' : 'Request new appointment'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleAppointment;