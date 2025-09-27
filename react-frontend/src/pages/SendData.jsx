import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Users, Stethoscope, FileText } from 'lucide-react';
import api from '../utils/api';

const SendData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState({
    workers: true,
    doctors: false,
    healthRecords: false
  });

  const handleCheckboxChange = (e) => {
    setSelectedData({
      ...selectedData,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real implementation, this would call an API to send selected data
      const response = await api.post('/admin/send-data', selectedData);
      console.log('Data sent:', response.data);
      alert(response.data.msg || 'Data sent to government successfully!');
    } catch (error) {
      console.error('Error sending data:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(`Error: ${error.response.data.msg}`);
      } else {
        alert('Error sending data to government');
      }
    } finally {
      setLoading(false);
    }
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">Only administrators can access this page.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Send Data to Government</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Data to Send</h2>
            <p className="text-gray-600">Choose which data to transmit to government systems</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="workers"
                  name="workers"
                  checked={selectedData.workers}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="workers" className="ml-3 flex items-center flex-1">
                  <Users className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <span className="block text-sm font-medium text-gray-900">Migrant Workers Data</span>
                    <span className="block text-xs text-gray-500">Personal, health, and employment information</span>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="doctors"
                  name="doctors"
                  checked={selectedData.doctors}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="doctors" className="ml-3 flex items-center flex-1">
                  <Stethoscope className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <span className="block text-sm font-medium text-gray-900">Doctors Data</span>
                    <span className="block text-xs text-gray-500">Medical professionals and their credentials</span>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="healthRecords"
                  name="healthRecords"
                  checked={selectedData.healthRecords}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="healthRecords" className="ml-3 flex items-center flex-1">
                  <FileText className="w-5 h-5 text-purple-500 mr-3" />
                  <div>
                    <span className="block text-sm font-medium text-gray-900">Health Records</span>
                    <span className="block text-xs text-gray-500">Medical records and health reports</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Upload className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Data Transmission</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Selected data will be securely transmitted to government health systems for compliance and monitoring purposes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!selectedData.workers && !selectedData.doctors && !selectedData.healthRecords)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                {loading ? 'Sending Data...' : 'Send to Government'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendData;