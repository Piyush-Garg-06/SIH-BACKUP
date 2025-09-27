import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../utils/api';
import { User, Shield, Activity, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const EmployerWorkerHealth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      toast.error('Unauthorized access. Only employers can view this page.');
      navigate('/login');
      return;
    }

    const fetchWorkersHealth = async () => {
      try {
        // Assuming an endpoint to get workers associated with the logged-in employer
        const res = await api.get('/employers/my-workers-health'); 
        setWorkers(res.data);
      } catch (err) {
        console.error('Error fetching worker health data:', err);
        setError('Failed to load worker health data.');
        toast.error('Failed to load worker health data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkersHealth();
  }, [user, navigate]);

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
    return <div className="text-center p-8">Loading worker health data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Worker Health Status</h1>

        {workers.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-lg">No workers found or no health data available.</p>
            <p className="text-sm mt-2">Ensure your workers are registered and have submitted health records.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {workers.map((worker) => (
              <div key={worker._id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    {worker.firstName} {worker.lastName}
                  </h2>
                  <span className="text-sm text-gray-600">Health ID: {worker.healthId || 'N/A'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <p className="flex items-center"><FileText className="w-4 h-4 mr-2" /> Aadhaar: {worker.aadhaar}</p>
                  <p className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Last Checkup: {worker.lastCheckupDate ? new Date(worker.lastCheckupDate).toLocaleDateString() : 'N/A'}</p>
                  <p className="flex items-center"><Shield className="w-4 h-4 mr-2" /> Overall Health: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(worker.overallHealthSeverity)}`}>
                      {worker.overallHealthSeverity || 'Normal'}
                    </span>
                  </p>
                  <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Compliance: {worker.isCompliant ? 'Yes' : 'No'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerWorkerHealth;