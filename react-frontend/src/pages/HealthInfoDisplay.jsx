import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HealthInfoDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { healthId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [healthInfo, setHealthInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if data came from QR scanner or direct URL access
  const { healthInfo: scannedHealthInfo, source } = location.state || {};

  useEffect(() => {
    const fetchHealthInfo = async () => {
      // If data already exists from QR scanner, use it
      if (scannedHealthInfo) {
        setHealthInfo(scannedHealthInfo);
        setLoading(false);
        return;
      }

      // If no data and no healthId in URL, show error
      if (!healthId) {
        setError('No health information available. Please scan a QR code or enter a Health ID.');
        setLoading(false);
        return;
      }

      // Fetch data using healthId from URL
      try {
        console.log('Fetching health info for ID:', healthId);
        console.log('API URL:', `/health-cards/verify/${healthId}`);
        
        const response = await api.get(`/health-cards/verify/${healthId}`);
        
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          setHealthInfo(response.data.data);
        } else {
          setError(`Health information not found for ID: ${healthId}`);
        }
      } catch (err) {
        console.error('Error fetching health info:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        if (err.response?.status === 404) {
          setError(`Health record not found for ID: ${healthId}`);
        } else if (err.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Failed to load health information. ${err.message}`);
        }
        toast.error('Failed to load health information');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthInfo();
  }, [healthId, scannedHealthInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading health information...</p>
        </div>
      </div>
    );
  }

  if (error || !healthInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || 'No Health Information Available'}</h2>
          <p className="text-gray-600 mb-4">Please scan a QR code or enter a valid Health ID</p>
          
          {/* Debug information */}
          {healthId && (
            <div className="bg-gray-100 p-3 rounded mb-4">
              <p className="text-sm text-gray-700">Attempted to load: <span className="font-mono">{healthId}</span></p>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/qr-scanner')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to QR Scanner
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
          
          {/* Network troubleshooting */}
          <div className="mt-4 text-left bg-yellow-50 p-3 rounded text-xs">
            <p className="font-medium text-yellow-800 mb-1">Troubleshooting:</p>
            <ul className="text-yellow-700 space-y-1">
              <li>• Ensure you're on the same WiFi network</li>
              <li>• Check if backend server is running</li>
              <li>• Try accessing directly via computer first</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const { personalInfo, emergencyInfo, healthSummary, recentRecords, workInfo } = healthInfo;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const printHealthInfo = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const shareHealthInfo = async () => {
    const shareData = {
      title: `Health Information - ${personalInfo.name}`,
      text: `Health ID: ${personalInfo.healthId}\nName: ${personalInfo.name}\nBlood Group: ${personalInfo.bloodGroup}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareData.text);
      toast.success('Health information copied to clipboard');
    }
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Scanner
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={printHealthInfo}
                className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <PrinterIcon className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={shareHealthInfo}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Patient Header Info */}
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{personalInfo.name}</h1>
              <p className="text-gray-600">Health ID: {personalInfo.healthId}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  personalInfo.type === 'Migrant Worker' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {personalInfo.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  healthSummary.overallStatus === 'Critical' ? 'bg-red-100 text-red-800' :
                  healthSummary.overallStatus === 'Stable' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {healthSummary.overallStatus}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Scanned At</p>
              <p className="font-medium">{new Date(healthInfo.scannedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            <TabButton 
              id="overview" 
              label="Overview" 
              isActive={activeTab === 'overview'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="emergency" 
              label="Emergency Info" 
              isActive={activeTab === 'emergency'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="records" 
              label="Medical Records" 
              isActive={activeTab === 'records'} 
              onClick={setActiveTab} 
            />
            {workInfo && (
              <TabButton 
                id="work" 
                label="Work Info" 
                isActive={activeTab === 'work'} 
                onClick={setActiveTab} 
              />
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{personalInfo.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{personalInfo.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Group:</span>
                    <span className="font-medium text-red-600">{personalInfo.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile:</span>
                    <span className="font-medium">{personalInfo.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">District:</span>
                    <span className="font-medium">{personalInfo.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-medium">{personalInfo.nativeState}</span>
                  </div>
                </div>
              </div>

              {/* Health Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <HeartIcon className="w-5 h-5 mr-2" />
                  Health Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Records:</span>
                    <span className="font-bold text-blue-600">{healthSummary.totalRecords}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Critical Records:</span>
                    <span className="font-bold text-red-600">{healthSummary.criticalRecords}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Checkup:</span>
                    <span className="font-medium">
                      {healthSummary.lastCheckup 
                        ? new Date(healthSummary.lastCheckup).toLocaleDateString()
                        : 'No records'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      healthSummary.overallStatus === 'Critical' ? 'bg-red-100 text-red-800' :
                      healthSummary.overallStatus === 'Stable' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {healthSummary.overallStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Info Tab */}
          {activeTab === 'emergency' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600" />
                Emergency Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Critical Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Blood Group:</span>
                        <span className="font-bold text-red-600">{emergencyInfo.bloodGroup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency Contact:</span>
                        <span className="font-medium">{emergencyInfo.emergencyContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contact Person:</span>
                        <span className="font-medium">{emergencyInfo.emergencyContactName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Allergies */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Allergies</h4>
                    {emergencyInfo.allergies && emergencyInfo.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {emergencyInfo.allergies.map((allergy, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No known allergies</p>
                    )}
                  </div>

                  {/* Chronic Conditions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Chronic Conditions</h4>
                    {emergencyInfo.chronicConditions && emergencyInfo.chronicConditions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {emergencyInfo.chronicConditions.map((condition, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                            {condition}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No chronic conditions</p>
                    )}
                  </div>

                  {/* Current Medications */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Current Medications</h4>
                    {emergencyInfo.medications && emergencyInfo.medications.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {emergencyInfo.medications.map((medication, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {medication}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No current medications</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Recent Medical Records ({recentRecords.length})
              </h3>

              {recentRecords.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No medical records found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRecords.map((record, index) => (
                    <div key={record._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{record.diagnosis}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(record.date).toLocaleDateString()} • 
                            {record.doctor ? ` Dr. ${record.doctor.name} (${record.doctor.specialization})` : ' Unknown Doctor'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(record.severity)}`}>
                          {record.severity || 'Normal'}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1"><strong>Treatment:</strong></p>
                          <p>{record.treatment}</p>
                        </div>
                        {record.symptoms && (
                          <div>
                            <p className="text-gray-600 mb-1"><strong>Symptoms:</strong></p>
                            <p>{record.symptoms}</p>
                          </div>
                        )}
                      </div>

                      {(record.prescriptions?.length > 0 || record.tests?.length > 0) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid md:grid-cols-2 gap-4">
                            {record.prescriptions?.length > 0 && (
                              <div>
                                <p className="text-gray-600 text-sm mb-1"><strong>Prescriptions:</strong></p>
                                <div className="flex flex-wrap gap-1">
                                  {record.prescriptions.map((prescription, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                      {prescription}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {record.tests?.length > 0 && (
                              <div>
                                <p className="text-gray-600 text-sm mb-1"><strong>Tests:</strong></p>
                                <div className="flex flex-wrap gap-1">
                                  {record.tests.map((test, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                                      {test}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {record.followUpDate && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            <CalendarIcon className="w-4 h-4 inline mr-1" />
                            <strong>Follow-up:</strong> {new Date(record.followUpDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Work Info Tab (for workers) */}
          {activeTab === 'work' && workInfo && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2" />
                Work Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employer:</span>
                    <span className="font-medium">{workInfo.employerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Location:</span>
                    <span className="font-medium">{workInfo.workLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employment Type:</span>
                    <span className="font-medium">{workInfo.employmentType}</span>
                  </div>
                  {workInfo.workStartDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(workInfo.workStartDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthInfoDisplay;