import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useWebSocket } from '../hooks/useWebSocket';
import { Link } from 'react-router-dom';
import {
  MapPin,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users,
  Hospital,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Bell,
  Wifi,
  WifiOff,
  Map,
  List,
  Grid3X3
} from 'lucide-react';
// Import mapping components
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import api from '../utils/api';

const DiseaseOutbreakMonitoring = () => {
  const { user } = useAuth();
  const { alerts: realTimeAlerts, unreadAlerts, connected } = useWebSocket();
  const [outbreaks, setOutbreaks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'map', 'grid'
  const [filter, setFilter] = useState({
    disease: '',
    district: '',
    state: '',
    severity: ''
  });
  const [newOutbreak, setNewOutbreak] = useState({
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
    notes: ''
  });

  useEffect(() => {
    fetchOutbreaks();
    fetchAlerts();
  }, []);

  // Merge real-time alerts with fetched alerts
  useEffect(() => {
    if (realTimeAlerts.length > 0) {
      // Combine real-time alerts with existing alerts and remove duplicates
      setAlerts(prevAlerts => {
        const allAlerts = [...realTimeAlerts, ...prevAlerts];
        const uniqueAlerts = allAlerts.filter((alert, index, self) =>
          index === self.findIndex(a => a._id === alert._id)
        );
        return uniqueAlerts;
      });
    }
  }, [realTimeAlerts]);

  const fetchOutbreaks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/disease-outbreaks');
      setOutbreaks(response.outbreaks || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch disease outbreaks');
      console.error('Error fetching outbreaks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/disease-alerts');
      setAlerts(response.alerts || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateOutbreak = async (e) => {
    e.preventDefault();
    try {
      const outbreakData = {
        ...newOutbreak,
        casesReported: parseInt(newOutbreak.casesReported),
        coordinates: [
          parseFloat(newOutbreak.coordinates[0]),
          parseFloat(newOutbreak.coordinates[1])
        ]
      };

      await api.post('/disease-outbreaks', outbreakData);
      setShowCreateForm(false);
      setNewOutbreak({
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
        notes: ''
      });
      fetchOutbreaks();
    } catch (err) {
      setError('Failed to create outbreak report');
      console.error('Error creating outbreak:', err);
    }
  };

  const handleDelete = async (outbreakId) => {
    if (window.confirm('Are you sure you want to delete this outbreak report?')) {
      try {
        await api.delete(`/disease-outbreaks/${outbreakId}`);
        fetchOutbreaks(); // Refresh the list
      } catch (err) {
        setError('Failed to delete outbreak report');
        console.error('Error deleting outbreak:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOutbreak(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoordinatesChange = (index, value) => {
    const newCoordinates = [...newOutbreak.coordinates];
    newCoordinates[index] = value;
    setNewOutbreak(prev => ({
      ...prev,
      coordinates: newCoordinates
    }));
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

  const getSeverityIconColor = (severity) => {
    switch (severity) {
      case 'low': return 'green';
      case 'moderate': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const filteredOutbreaks = outbreaks.filter(outbreak => {
    return (
      (filter.disease === '' || outbreak.diseaseName.toLowerCase().includes(filter.disease.toLowerCase())) &&
      (filter.district === '' || outbreak.district.toLowerCase().includes(filter.district.toLowerCase())) &&
      (filter.state === '' || outbreak.state.toLowerCase().includes(filter.state.toLowerCase())) &&
      (filter.severity === '' || outbreak.severity === filter.severity)
    );
  });

  // Get center coordinates for the map
  const getMapCenter = () => {
    if (filteredOutbreaks.length > 0 && filteredOutbreaks[0].location) {
      return [
        filteredOutbreaks[0].location.coordinates[1],
        filteredOutbreaks[0].location.coordinates[0]
      ];
    }
    // Default to Kerala coordinates
    return [10.8505, 76.2711];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading disease outbreak data...</p>
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
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Disease Outbreak Monitoring</h1>
              <p className="text-gray-600 mt-1">Live tracking and management of disease outbreaks</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md ${viewMode === 'map' ? 'bg-white shadow' : ''}`}
                  title="Map View"
                >
                  <Map className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
              </div>
              
              {/* WebSocket Connection Status */}
              <div className="flex items-center">
                {connected ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span className="ml-1 text-sm text-gray-600">
                  {connected ? 'Live' : 'Offline'}
                </span>
              </div>
              {(user.role === 'doctor' || user.role === 'hospital_staff' || user.role === 'admin') && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Report Outbreak
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

        {/* Real-time Alerts Section */}
        {unreadAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-500" />
              Unread Alerts ({unreadAlerts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unreadAlerts.slice(0, 3).map(alert => (
                <div key={alert._id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <div className="flex items-center mt-2">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{alert.district}, {alert.state}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Active Alerts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert._id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <div className="flex items-center mt-2">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{alert.district}, {alert.state}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Disease Outbreaks</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="disease"
                  placeholder="Filter by disease..."
                  value={filter.disease}
                  onChange={handleFilterChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="district"
                  placeholder="Filter by district..."
                  value={filter.district}
                  onChange={handleFilterChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="severity"
                  value={filter.severity}
                  onChange={handleFilterChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Severities</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* View Content */}
        {viewMode === 'map' ? (
          // Map View
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-96 w-full">
              <MapContainer 
                center={getMapCenter()} 
                zoom={8} 
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredOutbreaks.map(outbreak => (
                  <Marker 
                    key={outbreak._id} 
                    position={[
                      outbreak.location.coordinates[1], 
                      outbreak.location.coordinates[0]
                    ]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg">{outbreak.diseaseName}</h3>
                        <p className="text-sm text-gray-600">{outbreak.area}, {outbreak.district}</p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Cases:</span> {outbreak.casesReported}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Severity:</span> 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getSeverityColor(outbreak.severity)}`}>
                            {outbreak.severity}
                          </span>
                        </p>
                        <div className="mt-2 flex space-x-2">
                          <Link 
                            to={`/disease-outbreaks/${outbreak._id}`} 
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Details
                          </Link>
                          {(user.role === 'doctor' || user.role === 'hospital_staff' || user.role === 'admin') && (
                            <Link 
                              to={`/disease-outbreaks/edit/${outbreak._id}`} 
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            
            {/* Outbreaks List Below Map */}
            <div className="p-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Outbreaks in View</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOutbreaks.slice(0, 3).map(outbreak => (
                  <div key={outbreak._id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{outbreak.diseaseName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(outbreak.severity)}`}>
                        {outbreak.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{outbreak.area}, {outbreak.district}</p>
                    <p className="text-sm mt-2">
                      <span className="font-semibold">Cases:</span> {outbreak.casesReported}
                    </p>
                    <div className="mt-3 flex space-x-2">
                      <Link 
                        to={`/disease-outbreaks/${outbreak._id}`} 
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Link>
                      {(user.role === 'doctor' || user.role === 'hospital_staff' || user.role === 'admin') && (
                        <Link 
                          to={`/disease-outbreaks/edit/${outbreak._id}`} 
                          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOutbreaks.map(outbreak => (
              <div key={outbreak._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{outbreak.diseaseName}</h3>
                      <p className="text-sm text-gray-500">{outbreak.diseaseCode}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(outbreak.severity)}`}>
                      {outbreak.severity}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{outbreak.area}, {outbreak.district}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{outbreak.casesReported} cases reported</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{new Date(outbreak.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Link 
                      to={`/disease-outbreaks/${outbreak._id}`} 
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Link>
                    {(user.role === 'doctor' || user.role === 'hospital_staff' || user.role === 'admin') && (
                      <>
                        <Link 
                          to={`/disease-outbreaks/edit/${outbreak._id}`} 
                          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Link>
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => handleDelete(outbreak._id)}
                            className="text-red-600 hover:text-red-800 text-sm flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredOutbreaks.length === 0 && (
              <div className="col-span-full bg-white rounded-lg shadow-sm border p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No outbreaks found</h3>
                <p className="mt-2 text-gray-500">No disease outbreaks match your current filters.</p>
              </div>
            )}
          </div>
        ) : (
          // List View (default)
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disease
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cases
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOutbreaks.length > 0 ? (
                    filteredOutbreaks.map((outbreak) => (
                      <tr key={outbreak._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{outbreak.diseaseName}</div>
                              <div className="text-sm text-gray-500">{outbreak.diseaseCode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{outbreak.area}</div>
                          <div className="text-sm text-gray-500">{outbreak.district}, {outbreak.state}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{outbreak.casesReported}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(outbreak.severity)}`}>
                            {outbreak.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(outbreak.outbreakStatus)}`}>
                            {outbreak.outbreakStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(outbreak.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/disease-outbreaks/${outbreak._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="w-5 h-5" />
                          </Link>
                          {(user.role === 'doctor' || user.role === 'hospital_staff' || user.role === 'admin') && (
                            <>
                              <Link to={`/disease-outbreaks/edit/${outbreak._id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                <Edit className="w-5 h-5" />
                              </Link>
                              {user.role === 'admin' && (
                                <button 
                                  onClick={() => handleDelete(outbreak._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No disease outbreaks found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Outbreaks</p>
                <p className="text-2xl font-semibold text-gray-900">{outbreaks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Cases</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {outbreaks.reduce((total, outbreak) => total + outbreak.casesReported, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Hospital className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Affected Areas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(outbreaks.map(o => `${o.district}, ${o.state}`)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Diseases Tracked</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(outbreaks.map(o => o.diseaseName)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Outbreak Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Report New Disease Outbreak</h3>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleCreateOutbreak}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disease Name *</label>
                    <input
                      type="text"
                      name="diseaseName"
                      value={newOutbreak.diseaseName}
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
                      value={newOutbreak.diseaseCode}
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
                      value={newOutbreak.area}
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
                      value={newOutbreak.district}
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
                      value={newOutbreak.state}
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
                      value={newOutbreak.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={newOutbreak.coordinates[0]}
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
                      value={newOutbreak.coordinates[1]}
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
                      value={newOutbreak.hospital}
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
                      value={newOutbreak.casesReported}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      name="severity"
                      value={newOutbreak.severity}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission Type</label>
                    <select
                      name="transmissionType"
                      value={newOutbreak.transmissionType}
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
                      value={newOutbreak.symptoms}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={newOutbreak.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Report Outbreak
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseOutbreakMonitoring;