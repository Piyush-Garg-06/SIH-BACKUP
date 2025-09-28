import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import {
  MapPin,
  AlertTriangle,
  Calendar,
  Users,
  Hospital,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';
import api from '../utils/api';

const DiseaseOutbreakDetail = () => {
  const { outbreakId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [outbreak, setOutbreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOutbreakDetails();
  }, [outbreakId]);

  const fetchOutbreakDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/disease-outbreaks/${outbreakId}`);
      setOutbreak(response || null);
      setError('');
    } catch (err) {
      setError('Failed to fetch disease outbreak details');
      console.error('Error fetching outbreak details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this outbreak report?')) {
      try {
        await api.delete(`/disease-outbreaks/${outbreakId}`);
        navigate('/disease-outbreaks');
      } catch (err) {
        setError('Failed to delete outbreak report');
        console.error('Error deleting outbreak:', err);
      }
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'contained': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading disease outbreak details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 text-center">{error}</p>
          <div className="mt-4 text-center">
            <Link 
              to="/disease-outbreaks" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Outbreaks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!outbreak) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md">
          <p className="text-gray-800 text-center">Disease outbreak not found</p>
          <div className="mt-4 text-center">
            <Link 
              to="/disease-outbreaks" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Outbreaks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link 
                to="/disease-outbreaks" 
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">{outbreak.diseaseName}</h1>
                <p className="text-gray-600 mt-1">{outbreak.diseaseCode} - Outbreak Details</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {(user.role === 'doctor' || user.role === 'hospital_staff' || user.role === 'admin') && (
                <Link
                  to={`/disease-outbreaks/edit/${outbreak._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center transition-colors"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit
                </Link>
              )}
              {user.role === 'admin' && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 flex items-center transition-colors"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Outbreak Information</h2>
                  <p className="text-gray-600 mt-1">Details about the disease outbreak</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(outbreak.severity)}`}>
                    {outbreak.severity} severity
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(outbreak.outbreakStatus)}`}>
                    {outbreak.outbreakStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Disease Name</p>
                      <p className="font-medium">{outbreak.diseaseName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Disease Code</p>
                      <p className="font-medium">{outbreak.diseaseCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cases Reported</p>
                      <p className="font-medium">{outbreak.casesReported}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transmission Type</p>
                      <p className="font-medium capitalize">{outbreak.transmissionType}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-medium">{outbreak.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">District</p>
                      <p className="font-medium">{outbreak.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-medium">{outbreak.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pincode</p>
                      <p className="font-medium">{outbreak.pincode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Symptoms</p>
                      <p className="font-medium">{outbreak.symptoms || 'No symptoms specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="font-medium">{outbreak.notes || 'No additional notes'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Reported By</p>
                      <p className="font-medium">{outbreak.reportedBy?.name || 'Unknown'} ({outbreak.reportedBy?.role || 'Unknown'})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hospital</p>
                      <p className="font-medium">{outbreak.hospital?.name || outbreak.hospital || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Affected Demographics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Age Groups</h3>
                  {outbreak.affectedAgeGroups && outbreak.affectedAgeGroups.length > 0 ? (
                    <ul className="space-y-1">
                      {outbreak.affectedAgeGroups.map((group, index) => (
                        <li key={index} className="text-sm">{group}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No age group data available</p>
                  )}
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gender Distribution</h3>
                  <p className="text-sm text-gray-500">Data not available</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Risk Factors</h3>
                  <p className="text-sm text-gray-500">Data not available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-200 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-900">Reported</p>
                  <p className="text-sm text-gray-500">
                    {new Date(outbreak.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="border-l-2 border-gray-200 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-sm text-gray-500">
                    {new Date(outbreak.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{outbreak.area}</p>
                    <p className="text-sm text-gray-600">{outbreak.district}, {outbreak.state}</p>
                    <p className="text-sm text-gray-600">{outbreak.pincode}</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-500">Map visualization would appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseOutbreakDetail;