
import { Link } from 'react-router-dom';
import React from 'react';
import MyPatients from './MyPatients';
import Reports from './Reports';

const Doctors = () => {
  console.log('=== Doctors component is rendering ===');
  
  // Test if this component is even loading
  React.useEffect(() => {
    console.log('=== Doctors component mounted ===');
    alert('Doctors component has loaded!');
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Doctor's Dashboard</h1>
      <div className="text-center mb-8">
        <Link to="/health-checkups" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors mr-4">
          Conduct Health Checkup
        </Link>
        <Link to="/reports" className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors mr-4">
          Medical Reports
        </Link>
        <Link to="/severity-assessment" className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors mr-4">
          Severity Assessment
        </Link>
        <Link 
          to="/add-new-patient" 
          className="bg-orange-600 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-700 transition-colors mr-4"
        >
          Add New User
        </Link>
        <Link to="/test-user" className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors mr-4">
          Test User Data
        </Link>
        <button 
          onClick={() => {
            console.log('=== Direct Navigation Button Clicked ===');
            console.log('About to navigate to /add-new-patient');
            alert('Direct button clicked! Navigating now...');
            window.location.href = '/add-new-patient';
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors mr-4"
        >
          Direct Navigate Test
        </button>
        <button 
          onClick={() => {
            console.log('=== Simple Test Button Clicked ===');
            alert('Simple test button works!');
          }}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-700 transition-colors"
        >
          Test Click
        </button>
      </div>
      <MyPatients />
    </div>
  );
};

export default Doctors;

