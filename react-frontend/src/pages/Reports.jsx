import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import api from '../utils/api';

const Reports = () => {
  const { user } = useAuth();
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
        console.log('=== Fetching Reports Data ===');
        const reportsRes = await api.get('/doctors/reports');
        console.log('Reports response:', reportsRes);
        // The API returns arrays directly
        setReports(Array.isArray(reportsRes) ? reportsRes : []);
        
        console.log('=== Fetching Patients Data ===');
        const patientsRes = await api.get('/doctors/patients');
        console.log('Patients response:', patientsRes);
        console.log('Patients data:', patientsRes);
        console.log('Patients data type:', typeof patientsRes);
        console.log('Is patients data array?', Array.isArray(patientsRes));
        
        // The API returns the patients array directly, not wrapped in a data property
        setPatients(Array.isArray(patientsRes) ? patientsRes : []);
      } catch (error) {
        console.error('Failed to fetch data', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        // Set empty arrays on error to prevent crashes
        setReports([]);
        setPatients([]);
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
      console.log('Submitting form data:', formData);
      
      // Validate form data
      if (!formData.workerId) {
        alert('Please select a patient');
        return;
      }
      
      if (!formData.findings.trim()) {
        alert('Please provide findings');
        return;
      }
      
      const res = await api.post('/doctors/reports', formData);
      console.log('Report creation response:', res);
      
      // Backend returns the report object directly, not wrapped in data
      setReports([res, ...reports]);
      alert('Medical report created successfully!');
      setFormData({
        workerId: '',
        date: new Date().toISOString().split('T')[0],
        findings: '',
        recommendations: ''
      });
    } catch (error) {
      console.error('Failed to create medical report', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        formData: formData
      });
      
      const errorMessage = error.response?.data?.msg || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to create medical report. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>
      
      <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Medical Reports</h1>
      
      {/* Debug Information - Remove this section after testing */}
      <div className="bg-blue-50 border border-blue-200 p-4 mb-4 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">📊 Dashboard Status</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <p className="font-semibold text-gray-700">User</p>
            <p className="text-blue-600">{user ? `${user.firstName || user.name} ${user.lastName || ''} (${user.role})` : 'Not logged in'}</p>
          </div>
          <div className="bg-white p-3 rounded border">
            <p className="font-semibold text-gray-700">Authentication</p>
            <p className={localStorage.getItem('token') ? 'text-green-600' : 'text-red-600'}>
              {localStorage.getItem('token') ? '✓ Token Present' : '✗ Token Missing'}
            </p>
          </div>
          <div className="bg-white p-3 rounded border">
            <p className="font-semibold text-gray-700">Patients Available</p>
            <p className="text-blue-600">{patients ? patients.length : 'Loading...'}</p>
          </div>
          <div className="bg-white p-3 rounded border">
            <p className="font-semibold text-gray-700">Reports Available</p>
            <p className="text-blue-600">{reports ? reports.length : 'Loading...'}</p>
          </div>
        </div>
      </div>
      
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
                <label htmlFor="findings" className="block text-sm font-medium text-gray-700 mb-1">Findings *</label>
                <textarea
                  id="findings"
                  name="findings"
                  value={formData.findings}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter medical findings and diagnosis..."
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
                  placeholder="Enter treatment recommendations..."
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
          <div className="bg-white rounded-lg shadow-md">
            {!reports || reports.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">No reports found</p>
                <p className="text-gray-400 text-sm mt-1">Create your first medical report to get started</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">{reports.length}</span> {reports.length === 1 ? 'report' : 'reports'} found
                  </p>
                  <div className="text-xs text-gray-500">
                    Sorted by most recent
                  </div>
                </div>
                
                {/* Scrollable Reports Container */}
                <div className="max-h-96 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {reports.map((report, index) => {
                    // Get patient info from either worker or patient field
                    const patient = report.worker || report.patient;
                    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
                    const patientType = report.worker ? 'Worker' : 'Patient';
                    
                    return (
                      <div key={report._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{patientName}</h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                patientType === 'Worker' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {patientType}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(report.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              report.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {report.severity || 'Normal'}
                            </span>
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Diagnosis</label>
                              <p className="text-sm text-gray-900 mt-1 bg-white p-2 rounded border">
                                {report.diagnosis || 'N/A'}
                              </p>
                            </div>
                            
                            {report.symptoms && (
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Symptoms</label>
                                <p className="text-sm text-gray-900 mt-1 bg-white p-2 rounded border">
                                  {report.symptoms}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Treatment</label>
                              <p className="text-sm text-gray-900 mt-1 bg-white p-2 rounded border">
                                {report.treatment || 'N/A'}
                              </p>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                                <p className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  report.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {report.status || 'Completed'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Information */}
                        {(report.prescriptions?.length > 0 || report.tests?.length > 0 || report.followUpDate) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              {report.prescriptions && report.prescriptions.length > 0 && (
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prescriptions</label>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {report.prescriptions.map((prescription, idx) => (
                                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                        {prescription}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {report.tests && report.tests.length > 0 && (
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tests</label>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {report.tests.map((test, idx) => (
                                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                                        {test}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {report.followUpDate && (
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Follow-up</label>
                                  <p className="text-sm text-gray-900 mt-1">
                                    {new Date(report.followUpDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Reports;