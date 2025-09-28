import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Users, Stethoscope, FileText, ShieldCheck, Server } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6 text-lg">Only administrators can access this page.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white p-6 rounded-t-xl shadow-lg">
            <div className="flex items-center space-x-4">
              <Upload className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">Send Data to Government</h1>
                <p className="text-green-100">Securely transmit data for compliance</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Select Data to Send</h2>
              <p className="text-gray-600">Choose which datasets to transmit to government systems.</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <DataItem 
                name="workers" 
                label="Migrant Workers Data" 
                description="Personal, health, and employment information" 
                icon={<Users className="w-6 h-6 text-blue-500" />} 
                checked={selectedData.workers} 
                onChange={handleCheckboxChange} 
              />
              <DataItem 
                name="doctors" 
                label="Doctors Data" 
                description="Medical professionals and their credentials" 
                icon={<Stethoscope className="w-6 h-6 text-green-500" />} 
                checked={selectedData.doctors} 
                onChange={handleCheckboxChange} 
              />
              <DataItem 
                name="healthRecords" 
                label="Health Records" 
                description="Anonymized medical records and health reports" 
                icon={<FileText className="w-6 h-6 text-purple-500" />} 
                checked={selectedData.healthRecords} 
                onChange={handleCheckboxChange} 
              />
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 mb-8 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ShieldCheck className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold">Secure Data Transmission</h3>
                  <p className="mt-1 text-sm">Selected data will be securely transmitted to government health systems for compliance and monitoring purposes. All data is encrypted during transmission.</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end pt-6 space-x-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!selectedData.workers && !selectedData.doctors && !selectedData.healthRecords)}
                className={`flex items-center px-6 py-2 rounded-md text-white font-medium transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700`}
              >
                <Server className="w-5 h-5 mr-2" />
                {loading ? 'Sending Data...' : 'Send to Government'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DataItem = ({ name, label, description, icon, checked, onChange }) => (
  <label 
    htmlFor={name} 
    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${checked ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
    <div className="mr-4">
      {icon}
    </div>
    <div className="flex-1">
      <span className="block text-lg font-bold text-gray-800">{label}</span>
      <span className="block text-sm text-gray-600">{description}</span>
    </div>
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-6 w-6 text-blue-600 rounded-full focus:ring-blue-500 border-gray-300 shadow-sm"
    />
  </label>
);

export default SendData;