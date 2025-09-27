import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../utils/api';
import { toast } from 'react-toastify'; // Assuming you have react-toastify for notifications

const SubmitHealthRecord = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({
    workerId: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    followUpDate: '',
    severity: 'normal',
    status: 'completed',
    prescriptions: [],
    tests: [],
    hospitalName: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      toast.error('Unauthorized access. Only doctors can submit health records.');
      navigate('/login');
    }

    const fetchWorkers = async () => {
      try {
        const res = await api.get('/workers'); // Assuming an endpoint to get all workers
        setWorkers(res.data || []);
      } catch (err) {
        console.error('Error fetching workers:', err);
        toast.error('Failed to load workers.');
      }
    };
    fetchWorkers();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()).filter(item => item !== '') });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.workerId) newErrors.workerId = 'Worker is required';
    if (!formData.diagnosis) newErrors.diagnosis = 'Diagnosis is required';
    if (!formData.treatment) newErrors.treatment = 'Treatment is required';
    if (!formData.hospitalName) newErrors.hospitalName = 'Hospital Name is required';
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
      await api.post('/health-records', formData);
      toast.success('Health record submitted successfully!');
      navigate('/health-records'); // Redirect to health records list or dashboard
    } catch (err) {
      console.error('Error submitting health record:', err);
      toast.error('Failed to submit health record.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'doctor') {
    return null; // Or a loading spinner, as navigation happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Submit Health Record</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="workerId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Worker *
            </label>
            <select
              id="workerId"
              name="workerId"
              value={formData.workerId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">-- Select a Worker --</option>
              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.firstName} {worker.lastName} (Aadhaar: {worker.aadhaar})
                </option>
              ))}
            </select>
            {errors.workerId && <p className="text-red-500 text-xs mt-1">{errors.workerId}</p>}
          </div>

          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms
            </label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Describe symptoms"
            ></textarea>
          </div>

          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis *
            </label>
            <textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter diagnosis"
            ></textarea>
            {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>}
          </div>

          <div>
            <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-1">
              Treatment *
            </label>
            <textarea
              id="treatment"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter treatment plan"
            ></textarea>
            {errors.treatment && <p className="text-red-500 text-xs mt-1">{errors.treatment}</p>}
          </div>

          <div>
            <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">
              Hospital Name *
            </label>
            <input
              id="hospitalName"
              name="hospitalName"
              type="text"
              value={formData.hospitalName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter hospital name"
            />
            {errors.hospitalName && <p className="text-red-500 text-xs mt-1">{errors.hospitalName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">
                Follow-up Date
              </label>
              <input
                id="followUpDate"
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="normal">Normal</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label htmlFor="prescriptions" className="block text-sm font-medium text-gray-700 mb-1">
                Prescriptions (comma-separated)
              </label>
              <input
                id="prescriptions"
                name="prescriptions"
                type="text"
                value={formData.prescriptions.join(', ')}
                onChange={handleArrayChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Paracetamol, Amoxicillin"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tests" className="block text-sm font-medium text-gray-700 mb-1">
              Tests (comma-separated)
            </label>
            <input
              id="tests"
              name="tests"
              type="text"
              value={formData.tests.join(', ')}
              onChange={handleArrayChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Blood Test, X-Ray"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Health Record'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitHealthRecord;