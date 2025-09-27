import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../utils/api';
import {
  FileText, Calendar, User, Stethoscope, ArrowLeft,
  Download, Eye, Activity, Pill, AlertCircle
} from 'lucide-react';

const ReportDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate('/login');
      return;
    }

    const fetchPatientReports = async () => {
      try {
        // First, get patient details
        const allPatients = await api.get('/doctors/patients');
        const foundPatient = Array.isArray(allPatients) ? allPatients.find(p => p._id === patientId) : null;
        
        if (!foundPatient) {
          setError('Patient not found');
          setLoading(false);
          return;
        }
        
        setPatient(foundPatient);

        // Then get all reports and filter for this patient
        const allReports = await api.get('/doctors/reports');
        const patientReports = Array.isArray(allReports) ? allReports.filter(report => 
          (report.worker && report.worker._id === patientId) ||
          (report.patient && report.patient._id === patientId)
        ) : [];
        
        setReports(patientReports);
      } catch (err) {
        console.error('Error fetching patient reports:', err);
        setError('Failed to load patient reports');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientReports();
  }, [patientId, user, navigate]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading patient reports...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/patients')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-600 mb-4">Patient not found</div>
        <button
          onClick={() => navigate('/patients')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/patients')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Patients
              </button>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">
                  {patient.firstName} {patient.lastName} - Medical Reports
                </h1>
                <p className="text-gray-600 mt-1">
                  {patient.type === 'worker' ? 'Migrant Worker' : 'Patient'} • {patient.mobile}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Reports Found:</span>
              <span className="font-bold text-blue-800">{reports.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Patient Information
                </h3>
                <p className="text-sm text-gray-600">Name: {patient.firstName} {patient.lastName}</p>
                <p className="text-sm text-gray-600">Type: {patient.type === 'worker' ? 'Migrant Worker' : 'Patient'}</p>
                <p className="text-sm text-gray-600">Mobile: {patient.mobile}</p>
                <p className="text-sm text-gray-600">Email: {patient.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Health Information
                </h3>
                <p className="text-sm text-gray-600">Blood Group: {patient.bloodGroup || 'Not specified'}</p>
                {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Conditions: {patient.chronicConditions.join(', ')}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Report Summary
                </h3>
                <p className="text-sm text-gray-600">Total Reports: {reports.length}</p>
                <p className="text-sm text-gray-600">
                  Last Report: {reports.length > 0 ? new Date(reports[0].date).toLocaleDateString() : 'No reports'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Medical Reports ({reports.length})</h2>
          
          {reports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
              <p className="text-gray-600">No medical reports have been created for this patient yet.</p>
              <button
                onClick={() => navigate(`/health-checkups`)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Health Checkup
              </button>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report._id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.diagnosis || 'Medical Report'}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(report.date).toLocaleDateString()} • 
                          Dr. {report.doctor?.firstName} {report.doctor?.lastName} ({report.doctor?.specialization})
                        </p>
                        <p className="text-sm text-gray-600">{report.hospitalName || 'Health Center'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.severity && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                      )}
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Symptoms</h4>
                      <p className="text-gray-700">{report.symptoms || 'No symptoms recorded'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Treatment</h4>
                      <p className="text-gray-700">{report.treatment || 'No treatment specified'}</p>
                    </div>
                  </div>

                  {report.prescriptions && report.prescriptions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Pill className="w-4 h-4 mr-2" />
                        Prescriptions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {report.prescriptions.map((prescription, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {prescription}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.tests && report.tests.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Tests Conducted
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {report.tests.map((test, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.followUpDate && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-yellow-800">
                          Follow-up scheduled for: {new Date(report.followUpDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/health-checkups')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            <Stethoscope className="w-4 h-4 inline mr-2" />
            New Health Checkup
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Create Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;