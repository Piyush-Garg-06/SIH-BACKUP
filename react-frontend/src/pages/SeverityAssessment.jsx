import { useState, useEffect } from 'react';
import api from '../utils/api';

const SeverityAssessment = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    workerId: '',
    severityLevel: 'low'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/doctors/patients');
        // The API returns the patients array directly
        setPatients(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error('Failed to fetch patients', error);
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors/severity-assessment', formData);
      alert('Severity level updated successfully!');
      setFormData({
        workerId: '',
        severityLevel: 'low'
      });
    } catch (error) {
      console.error('Failed to update severity level', error);
      alert('Failed to update severity level. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Severity Assessment</h1>
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
                    {patient.firstName} {patient.lastName} ({patient.type === 'worker' ? 'Worker' : 'Patient'})
                  </option>
                ))
              ) : (
                <option disabled>No patients available</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="severityLevel" className="block text-sm font-medium text-gray-700 mb-1">Severity Level</label>
            <select
              id="severityLevel"
              name="severityLevel"
              value={formData.severityLevel}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Update Severity
          </button>
        </form>
      </div>
    </div>
  );
};

export default SeverityAssessment;