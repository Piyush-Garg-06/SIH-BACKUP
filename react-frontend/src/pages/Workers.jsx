import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, User, MapPin, Calendar, Phone, Eye, Edit, Mail } from 'lucide-react';
import { useState } from 'react';

const Workers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  if (!user || user.userType !== 'employer') {
    navigate('/login');
    return null;
  }

  const workers = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      employeeId: 'EMP001',
      healthId: 'KL2024001',
      age: 32,
      department: 'Construction',
      location: 'Site A - Thiruvananthapuram',
      joinDate: '2023-06-15',
      lastCheckup: '2024-01-20',
      nextCheckup: '2024-01-25',
      compliance: 85,
      status: 'active',
      severity: 'moderate',
      conditions: ['Hypertension', 'Vitamin D Deficiency'],
      phone: '+91-9876543210'
    },
    {
      id: 2,
      name: 'Suresh Patel',
      employeeId: 'EMP002',
      healthId: 'KL2024002',
      age: 28,
      department: 'Manufacturing',
      location: 'Factory B - Kochi',
      joinDate: '2023-08-20',
      lastCheckup: '2024-01-18',
      nextCheckup: '2024-02-01',
      compliance: 95,
      status: 'active',
      severity: 'normal',
      conditions: ['Normal Health'],
      phone: '+91-9876543212'
    }
  ];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = searchTerm === '' ||
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.healthId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || worker.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: workers.length,
    active: workers.filter(w => w.status === 'active').length,
    goodCompliance: workers.filter(w => w.compliance >= 80).length,
    averageCompliance: workers.reduce((sum, w) => sum + w.compliance, 0) / workers.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Worker Management</h1>
              <p className="text-gray-600 mt-1">Monitor and manage migrant worker health compliance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Workers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Good Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.goodCompliance}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageCompliance.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredWorkers.map((worker) => (
            <div key={worker.id} className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                      <p className="text-sm text-gray-600">
                        Employee ID: {worker.employeeId} • Health ID: {worker.healthId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Age: {worker.age} • Department: {worker.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${worker.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {worker.status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{worker.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Joined: {worker.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{worker.phone}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Health Compliance:</span>
                    <span className={`text-sm font-medium ${worker.compliance >= 80 ? 'text-green-600' : worker.compliance >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {worker.compliance}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${worker.compliance >= 80 ? 'bg-green-600' : worker.compliance >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                      style={{ width: `${worker.compliance}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2"><strong>Medical Conditions:</strong></p>
                  <div className="flex flex-wrap gap-1">
                    {worker.conditions.map((condition, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <strong>Last Checkup:</strong> {worker.lastCheckup}<br />
                    <strong>Next Checkup:</strong> {worker.nextCheckup}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/workers/${worker.id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/workers/${worker.id}/edit`)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Workers Found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You have no registered workers at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workers;
