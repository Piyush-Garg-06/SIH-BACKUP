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
  Clock,
  UserCheck,
  Stethoscope,
  Activity,
  Map
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

const HospitalDashboard = () => {
  const { user, userProfile } = useAuth();
  const { alerts: realTimeAlerts, unreadAlerts, connected } = useWebSocket();
  const [outbreaks, setOutbreaks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalOutbreaks: 0,
    activeCases: 0,
    affectedAreas: 0,
    diseasesTracked: 0,
    unreadAlerts: 0
  });

  useEffect(() => {
    fetchDashboardData();
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

  // Update stats when data changes
  useEffect(() => {
    setStats({
      totalOutbreaks: outbreaks.length,
      activeCases: outbreaks.reduce((total, outbreak) => total + outbreak.casesReported, 0),
      affectedAreas: new Set(outbreaks.map(o => `${o.district}, ${o.state}`)).size,
      diseasesTracked: new Set(outbreaks.map(o => o.diseaseName)).size,
      unreadAlerts: unreadAlerts.length
    });
  }, [outbreaks, unreadAlerts]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch outbreaks for this hospital
      const outbreaksResponse = await api.get(`/disease-outbreaks?hospital=${userProfile?.hospital || user._id}`);
      setOutbreaks(outbreaksResponse.outbreaks || []);
      
      // Fetch alerts
      const alertsResponse = await api.get('/disease-alerts');
      setAlerts(alertsResponse.alerts || []);
      
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
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

  // Get center coordinates for the map
  const getMapCenter = () => {
    if (outbreaks.length > 0 && outbreaks[0].location) {
      return [
        outbreaks[0].location.coordinates[1],
        outbreaks[0].location.coordinates[0]
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
          <p className="mt-4 text-gray-600">Loading hospital dashboard...</p>
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
              <h1 className="text-3xl font-bold text-blue-900">Hospital Dashboard</h1>
              <p className="text-gray-600 mt-1">Rapid health action and outbreak monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
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
                <Link
                  to="/disease-outbreaks/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Report Outbreak
                </Link>
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

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Outbreaks</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOutbreaks}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.activeCases}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.affectedAreas}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.diseasesTracked}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unread Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.unreadAlerts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map View of Outbreaks */}
        {outbreaks.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Map className="w-5 h-5 mr-2" />
                  Disease Outbreaks Map
                </h2>
                <Link to="/disease-outbreaks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="h-80 w-full">
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
                {outbreaks.map(outbreak => (
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
          </div>
        )}

        {/* Real-time Alerts Section */}
        {unreadAlerts.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-500" />
                Unread Alerts ({unreadAlerts.length})
              </h2>
              <Link to="/disease-outbreaks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
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
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                    <Link 
                      to={`/disease-outbreaks/${alert.outbreak?._id}`} 
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Outbreaks */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Outbreaks</h2>
              <Link to="/disease-outbreaks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
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
                {outbreaks.length > 0 ? (
                  outbreaks.slice(0, 5).map((outbreak) => (
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
                          <Link to={`/disease-outbreaks/edit/${outbreak._id}`} className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="w-5 h-5" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No disease outbreaks reported yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/disease-outbreaks/new" 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
            >
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Report Outbreak</h3>
              <p className="text-sm text-gray-500 mt-1">Report a new disease outbreak</p>
            </Link>
            <Link 
              to="/disease-outbreaks" 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
            >
              <div className="p-3 bg-green-100 rounded-full mb-3">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Monitor Outbreaks</h3>
              <p className="text-sm text-gray-500 mt-1">View all disease outbreaks</p>
            </Link>
            <Link 
              to="/patients" 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
            >
              <div className="p-3 bg-purple-100 rounded-full mb-3">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Patient Records</h3>
              <p className="text-sm text-gray-500 mt-1">Access patient health records</p>
            </Link>
            <Link 
              to="/appointments" 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
            >
              <div className="p-3 bg-orange-100 rounded-full mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900">Appointments</h3>
              <p className="text-sm text-gray-500 mt-1">Manage patient appointments</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;