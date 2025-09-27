import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserData from '../hooks/useUserData';
import api from '../utils/api';
import {
  FileText, Calendar, Download, Eye, AlertCircle,
  CheckCircle, Clock, Stethoscope, Pill, Activity
} from 'lucide-react';

const HealthRecords = () => {
  const { user, userProfile, canAccessWorkerData, canAccessPatientData } = useAuth();
  const navigate = useNavigate();
  const { fetchUserHealthRecords, fetchUserAppointments, loading } = useUserData();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check authorization
    if (!canAccessWorkerData() && !canAccessPatientData()) {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch medical records
        const recordsData = await fetchUserHealthRecords();
        if (recordsData) {
          setMedicalRecords(recordsData);
        }

        // Fetch upcoming appointments
        const appointmentsData = await fetchUserAppointments();
        if (appointmentsData && appointmentsData.data) {
          setUpcomingAppointments(appointmentsData.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      }
    };

    fetchData();
  }, [user, navigate, canAccessWorkerData, canAccessPatientData, fetchUserHealthRecords, fetchUserAppointments]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'scheduled': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading Medical Records...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  const handleDownloadRecords = async () => {
    if (!user || !userProfile) {
      setError('User not logged in or profile not available.');
      return;
    }
    try {
      let endpoint = '';
      if (user.role === 'worker') {
        endpoint = `/health-records/download/worker/${userProfile._id}`;
      } else if (user.role === 'patient') {
        // For patients, we might need a different endpoint or adapt the worker one
        endpoint = `/health-records/download/worker/${userProfile._id}`;
      }

      const response = await api.get(endpoint, {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `health_records_${userProfile._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading health records:', err);
      setError('Failed to download health records.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Medical Records</h1>
              <p className="text-gray-600 mt-1">Access your complete health history and medical records</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Health ID:</span>
              <span className="font-mono bg-blue-100 px-3 py-1 rounded text-blue-800">
                {userProfile?.healthId || 'Not Generated'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{medicalRecords.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Checkups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {medicalRecords.filter(r => r.diagnosis).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Health Status</p>
                <p className="text-2xl font-bold text-gray-900">Good</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments && upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
            <div className="bg-white rounded-lg shadow-sm border">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 border-b last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{appointment.type}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.doctor.firstName} {appointment.doctor.lastName} ({appointment.doctor.specialization}) - {appointment.hospital}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {appointment.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical Records */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical History ({medicalRecords.length})</h2>
          <div className="space-y-6">
            {medicalRecords.map((record) => (
              <div key={record._id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(record.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{record.diagnosis}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleDateString()} • {record.doctor.firstName} {record.doctor.lastName} ({record.doctor.specialization})
                        </p>
                        <p className="text-sm text-gray-600">{record.hospitalName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(record.severity)}`}>
                        {record.severity || 'normal'}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Symptoms</h4>
                      <p className="text-gray-700">{record.symptoms}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Treatment</h4>
                      <p className="text-gray-700">{record.treatment}</p>
                    </div>
                  </div>

                  {record.prescriptions && record.prescriptions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Pill className="w-4 h-4 mr-2" />
                        Prescriptions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {record.prescriptions.map((prescription, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {prescription}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.tests && record.tests.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Tests Conducted
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {record.tests.map((test, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download All Records */}
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Complete Health Records</h3>
          <p className="text-gray-600 mb-4">
            Get a comprehensive PDF report of all your medical records and history
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors" onClick={handleDownloadRecords}>
            <Download className="w-5 h-5 inline mr-2" />
            Download All Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;