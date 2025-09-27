import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, User, MapPin, Calendar,
  AlertTriangle, CheckCircle, Clock, Phone, Mail,
  Stethoscope, FileText, Eye, Edit, Plus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminPatients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [diseaseFilter, setDiseaseFilter] = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Include filters in the API request
        const params = new URLSearchParams();
        if (severityFilter && severityFilter !== 'all') params.append('severity', severityFilter);
        if (diseaseFilter && diseaseFilter !== 'all') params.append('disease', diseaseFilter);
        
        const response = await api.get(`/admin/patients?${params.toString()}`);
        if (Array.isArray(response)) {
          setPatients(response);
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.error('Failed to fetch patients', err);
        setError('Failed to load patients. Please try again.');
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user, navigate, severityFilter, diseaseFilter]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === '' ||
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.mobile && patient.mobile.includes(searchTerm));

    return matchesSearch;
  });

  const stats = {
    total: patients.length,
    workers: patients.filter(p => p.type === 'worker').length,
    patients: patients.filter(p => p.type === 'patient').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-2">Manage all patients and migrant workers in the system</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Migrant Workers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.workers}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Regular Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.patients}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Severity:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Disease:</span>
                <select
                  value={diseaseFilter}
                  onChange={(e) => setDiseaseFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Diseases</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="hypertension">Hypertension</option>
                  <option value="asthma">Asthma</option>
                  <option value="cardiac">Cardiac Issues</option>
                  <option value="respiratory">Respiratory</option>
                  <option value="skin">Skin Conditions</option>
                  <option value="injury">Injuries</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div key={patient._id} className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {patient.age ? `${patient.age} years` : 'Age N/A'} • {patient.type === 'worker' ? 'Migrant Worker' : 'Patient'} • {patient.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(patient.severity)}`}>
                      {patient.severity || 'normal'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {patient.type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1"><strong>Mobile:</strong> {patient.mobile}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Blood Group:</strong> {patient.bloodGroup || 'N/A'}</p>
                    {patient.type === 'worker' && (
                      <>
                        <p className="text-sm text-gray-600 mb-1"><strong>Employer:</strong> {patient.employerName || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Work Location:</strong> {patient.workLocation || 'N/A'}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-gray-600">
              {searchTerm || severityFilter !== 'all' || diseaseFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'There are no patients in the system.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPatients;