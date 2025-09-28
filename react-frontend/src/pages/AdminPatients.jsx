import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, User, MapPin, Calendar,
  AlertTriangle, CheckCircle, Clock, Phone, Mail,
  Stethoscope, FileText, Eye, Edit, Plus, UserPlus, UserMinus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminPatients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [diseaseFilter, setDiseaseFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigning, setAssigning] = useState({});

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchDoctors = async () => {
      try {
        const response = await api.get('/admin/doctors');
        setDoctors(response.data || []);
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      }
    };

    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Include filters in the API request
        const params = new URLSearchParams();
        if (severityFilter && severityFilter !== 'all') params.append('severity', severityFilter);
        if (diseaseFilter && diseaseFilter !== 'all') params.append('disease', diseaseFilter);
        if (doctorFilter && doctorFilter !== 'all') params.append('doctorId', doctorFilter);
        
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

    fetchDoctors();
    fetchPatients();
  }, [user, navigate, severityFilter, diseaseFilter, doctorFilter]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
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

  const handleAssignDoctor = async (patientId, doctorId) => {
    if (!doctorId) return;
    
    setAssigning(prev => ({ ...prev, [patientId]: true }));
    
    try {
      await api.post('/admin/assign-patient', { patientId, doctorId });
      
      // Update the patient in the state
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient._id === patientId 
            ? { ...patient, doctors: [...(patient.doctors || []), doctorId] }
            : patient
        )
      );
    } catch (err) {
      console.error('Failed to assign doctor', err);
      alert('Failed to assign doctor. Please try again.');
    } finally {
      setAssigning(prev => ({ ...prev, [patientId]: false }));
    }
  };

  const handleUnassignDoctor = async (patientId, doctorId) => {
    if (!doctorId) return;
    
    setAssigning(prev => ({ ...prev, [patientId]: true }));
    
    try {
      await api.post('/admin/unassign-patient', { patientId, doctorId });
      
      // Update the patient in the state
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient._id === patientId 
            ? { ...patient, doctors: (patient.doctors || []).filter(id => id !== doctorId) }
            : patient
        )
      );
    } catch (err) {
      console.error('Failed to unassign doctor', err);
      alert('Failed to unassign doctor. Please try again.');
    } finally {
      setAssigning(prev => ({ ...prev, [patientId]: false }));
    }
  };

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
                <span className="text-sm text-gray-600">Doctor:</span>
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Doctors</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Severity:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
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
                  <option value="infectious">Infectious</option>
                  <option value="non infectious">Non Infectious</option>
                  <option value="communicable">Communicable</option>
                  <option value="non communicable">Non Communicable</option>
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
                  <div>
                    <p className="text-sm text-gray-600 mb-1"><strong>Assigned Doctors:</strong></p>
                    {patient.doctors && patient.doctors.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {patient.doctors.map((doctorId, index) => {
                          const doctor = doctors.find(d => d._id === doctorId);
                          return doctor ? (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No doctors assigned</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <select
                    onChange={(e) => handleAssignDoctor(patient._id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    disabled={assigning[patient._id]}
                  >
                    <option value="">Assign Doctor</option>
                    {doctors.map(doctor => (
                      <option 
                        key={doctor._id} 
                        value={doctor._id}
                        disabled={patient.doctors && patient.doctors.includes(doctor._id)}
                      >
                        Dr. {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                  </select>
                  {patient.doctors && patient.doctors.length > 0 && (
                    <select
                      onChange={(e) => handleUnassignDoctor(patient._id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      disabled={assigning[patient._id]}
                    >
                      <option value="">Unassign Doctor</option>
                      {patient.doctors.map((doctorId, index) => {
                        const doctor = doctors.find(d => d._id === doctorId);
                        return doctor ? (
                          <option key={index} value={doctor._id}>
                            Dr. {doctor.firstName} {doctor.lastName}
                          </option>
                        ) : null;
                      })}
                    </select>
                  )}
                  {assigning[patient._id] && (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
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