import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const HealthCheckups = () => {
  const { patientId } = useParams();
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    workerId: patientId || '', // Pre-select patient if patientId is provided
    date: new Date().toISOString().split('T')[0],
    findings: '',
    recommendations: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/doctors/patients');
        // The API returns the patients array directly, not wrapped in a data property
        const patientsData = res || [];
        setPatients(Array.isArray(patientsData) ? patientsData : []);
      } catch (error) {
        console.error('Failed to fetch patients', error);
        setPatients([]); // Set empty array on error
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  // Update workerId when patientId parameter changes
  useEffect(() => {
    if (patientId) {
      setFormData(prev => ({
        ...prev,
        workerId: patientId
      }));
    }
  }, [patientId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.workerId) {
      alert('Please select a patient');
      return;
    }
    
    if (!formData.findings.trim()) {
      alert('Please provide findings');
      return;
    }
    
    try {
      const response = await api.post('/doctors/health-checkups', formData);
      console.log('Health checkup response:', response);
      alert('Health checkup recorded successfully!');
      setFormData({
        workerId: '',
        date: new Date().toISOString().split('T')[0],
        findings: '',
        recommendations: ''
      });
    } catch (error) {
      console.error('Failed to record health checkup', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.msg || error.response?.data?.error || 'Failed to record health checkup. Please try again.';
      alert(errorMessage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Conduct Health Checkup</h1>
      
      {/* Debug information */}
      <div className="max-w-2xl mx-auto mb-4 p-3 bg-gray-100 rounded text-sm">
        <strong>Debug Info:</strong> Found {patients.length} patients
        {patients.length > 0 && (
          <ul className="mt-2">
            {patients.slice(0, 3).map(p => (
              <li key={p._id}>{p.firstName} {p.lastName} ({p.type})</li>
            ))}
            {patients.length > 3 && <li>... and {patients.length - 3} more</li>}
          </ul>
        )}
      </div>
      
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="workerId" className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
            <select
              id="workerId"
              name="workerId"
              value={formData.workerId}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">-- Select a patient --</option>
              {patients && patients.length > 0 ? (
                patients.map(patient => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName} ({patient.type === 'worker' ? 'Worker' : 'Patient'}) - {patient.mobile}
                  </option>
                ))
              ) : (
                <option disabled>No patients available</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="findings" className="block text-sm font-medium text-gray-700 mb-1">Findings</label>
            <textarea
              id="findings"
              name="findings"
              value={formData.findings}
              onChange={handleChange}
              required
              rows="4"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="recommendations" className="block text-sm font-medium text-gray-700 mb-1">Recommendations</label>
            <textarea
              id="recommendations"
              name="recommendations"
              value={formData.recommendations}
              onChange={handleChange}
              rows="4"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Record Health Checkup
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthCheckups;