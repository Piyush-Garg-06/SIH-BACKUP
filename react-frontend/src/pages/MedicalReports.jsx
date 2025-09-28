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
      <div className="grid grid-cols-1 gap-8">

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
