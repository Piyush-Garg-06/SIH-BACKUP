import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import api from '../utils/api';

const EditDiseaseOutbreak = () => {
  const { outbreakId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [outbreak, setOutbreak] = useState({
    diseaseName: '',
    diseaseCode: '',
    coordinates: ['', ''],
    area: '',
    district: '',
    state: '',
    pincode: '',
    hospital: '',
    casesReported: '',
    severity: 'moderate',
    symptoms: '',
    affectedAgeGroups: [],
    transmissionType: 'unknown',
    notes: '',
    outbreakStatus: 'investigating'
  });

  useEffect(() => {
    if (outbreakId) {
      fetchOutbreakDetails();
    } else {
      setLoading(false);
    }
  }, [outbreakId]);

  const fetchOutbreakDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/disease-outbreaks/${outbreakId}`);
      const data = response;
      
      // Format the data for the form
      setOutbreak({
        ...data,
        coordinates: data.location?.coordinates || ['', ''],
        casesReported: data.casesReported.toString()
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch disease outbreak details');
      console.error('Error fetching outbreak details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOutbreak(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoordinatesChange = (index, value) => {
    const newCoordinates = [...outbreak.coordinates];
    newCoordinates[index] = value;
    setOutbreak(prev => ({
      ...prev,
      coordinates: newCoordinates
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const outbreakData = {
        ...outbreak,
        casesReported: parseInt(outbreak.casesReported),
        coordinates: [
          parseFloat(outbreak.coordinates[0]),
          parseFloat(outbreak.coordinates[1])
        ]
      };

      if (outbreakId) {
        // Update existing outbreak
        await api.put(`/disease-outbreaks/${outbreakId}`, outbreakData);
      } else {
        // Create new outbreak
        await api.post('/disease-outbreaks', outbreakData);
      }
      
      navigate('/disease-outbreaks');
    } catch (err) {
      setError('Failed to save outbreak report: ' + (err.response?.data?.message || err.message));
      console.error('Error saving outbreak:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading outbreak details...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link 
              to="/disease-outbreaks" 
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">
                {outbreakId ? 'Edit Disease Outbreak' : 'Report New Disease Outbreak'}
              </h1>
              <p className="text-gray-600 mt-1">
                {outbreakId ? 'Update outbreak information' : 'Report a new disease outbreak'}
              </p>
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

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disease Name *</label>
                <input
                  type="text"
                  name="diseaseName"
                  value={outbreak.diseaseName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disease Code *</label>
                <input
                  type="text"
                  name="diseaseCode"
                  value={outbreak.diseaseCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                <input
                  type="text"
                  name="area"
                  value={outbreak.area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                <input
                  type="text"
                  name="district"
                  value={outbreak.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={outbreak.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={outbreak.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  value={outbreak.coordinates[0]}
                  onChange={(e) => handleCoordinatesChange(0, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  value={outbreak.coordinates[1]}
                  onChange={(e) => handleCoordinatesChange(1, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital ID *</label>
                <input
                  type="text"
                  name="hospital"
                  value={outbreak.hospital}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cases Reported *</label>
                <input
                  type="number"
                  name="casesReported"
                  value={outbreak.casesReported}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  name="severity"
                  value={outbreak.severity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outbreak Status</label>
                <select
                  name="outbreakStatus"
                  value={outbreak.outbreakStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="investigating">Investigating</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="contained">Contained</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission Type</label>
                <select
                  name="transmissionType"
                  value={outbreak.transmissionType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unknown">Unknown</option>
                  <option value="airborne">Airborne</option>
                  <option value="contact">Contact</option>
                  <option value="vector">Vector</option>
                  <option value="foodborne">Foodborne</option>
                  <option value="waterborne">Waterborne</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                <textarea
                  name="symptoms"
                  value={outbreak.symptoms}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={outbreak.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <Link
                to="/disease-outbreaks"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : (outbreakId ? 'Update Outbreak' : 'Report Outbreak')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDiseaseOutbreak;