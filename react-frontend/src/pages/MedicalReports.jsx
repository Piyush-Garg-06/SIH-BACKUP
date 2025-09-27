import { useState, useEffect } from 'react';
import api from '../utils/api';

const MedicalReports = () => {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    workerId: '',
    date: new Date().toISOString().split('T')[0],
    findings: '',
    recommendations: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsRes = await api.get('/doctors/reports');
        // The API returns arrays directly
        setReports(Array.isArray(reportsRes) ? reportsRes : []);
        const patientsRes = await api.get('/doctors/patients');
        setPatients(Array.isArray(patientsRes) ? patientsRes : []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/doctors/reports', formData);
      setReports([res.data, ...reports]);
      alert('Medical report created successfully!');
      setFormData({
        workerId: '',
        date: new Date().toISOString().split('T')[0],
        findings: '',
        recommendations: ''
      });
    } catch (error) {
      console.error('Failed to create medical report', error);
      alert('Failed to create medical report. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Medical Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create New Report</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
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
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>{patient.firstName} {patient.lastName}</option>
                  ))}
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
                Create Report
              </button>
            </form>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Existing Reports</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {reports.length === 0 ? (
              <p>No reports found.</p>
            ) : (
              <ul>
                {reports.map(report => (
                  <li key={report._id} className="mb-4 pb-4 border-b">
                    <p><strong>Patient:</strong> {report.worker.firstName} {report.worker.lastName}</p>
                    <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
                    <p><strong>Findings:</strong> {report.findings}</p>
                    <p><strong>Recommendations:</strong> {report.recommendations}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReports;
