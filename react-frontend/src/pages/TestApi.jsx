import React, { useState, useEffect } from 'react';

const TestApi = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawHospitals, setRawHospitals] = useState(null);
  const [rawDoctors, setRawDoctors] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching hospitals...');
        
        // Make a direct fetch call to see what we get
        const hospitalsResponse = await fetch('http://localhost:5000/api/hospitals');
        console.log('Hospitals response object:', hospitalsResponse);
        
        // Check if response is OK
        if (!hospitalsResponse.ok) {
          throw new Error(`HTTP error! status: ${hospitalsResponse.status}`);
        }
        
        // Try to parse the response
        const hospitalsData = await hospitalsResponse.json();
        console.log('Parsed hospitals data:', hospitalsData);
        setRawHospitals(hospitalsData);
        
        // Handle different response formats
        let hospitalsArray = [];
        if (Array.isArray(hospitalsData)) {
          hospitalsArray = hospitalsData;
        } else if (hospitalsData && hospitalsData.data && Array.isArray(hospitalsData.data)) {
          hospitalsArray = hospitalsData.data;
        }
        
        setHospitals(hospitalsArray);
        
        // Fetch doctors
        console.log('Fetching doctors...');
        const doctorsResponse = await fetch('http://localhost:5000/api/doctors');
        console.log('Doctors response object:', doctorsResponse);
        
        // Check if response is OK
        if (!doctorsResponse.ok) {
          throw new Error(`HTTP error! status: ${doctorsResponse.status}`);
        }
        
        // Try to parse the response
        const doctorsData = await doctorsResponse.json();
        console.log('Parsed doctors data:', doctorsData);
        setRawDoctors(doctorsData);
        
        // Handle different response formats
        let doctorsArray = [];
        if (Array.isArray(doctorsData)) {
          doctorsArray = doctorsData;
        } else if (doctorsData && doctorsData.data && Array.isArray(doctorsData.data)) {
          doctorsArray = doctorsData.data;
        }
        
        setDoctors(doctorsArray);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">API Test - Error</h1>
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Raw Hospitals Response</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify(rawHospitals, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Processed Hospitals ({hospitals.length})</h2>
        {hospitals.length === 0 ? (
          <p className="text-gray-600">No hospitals found</p>
        ) : (
          hospitals.map((hospital, index) => (
            <div key={hospital._id || index} className="border p-4 mb-2 rounded">
              <p><strong>Name:</strong> {hospital.name}</p>
              <p><strong>Location:</strong> {hospital.location}</p>
              <p><strong>District:</strong> {hospital.district}</p>
              <p><strong>State:</strong> {hospital.state}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Raw Doctors Response</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify(rawDoctors, null, 2)}
        </pre>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Processed Doctors ({doctors.length})</h2>
        {doctors.length === 0 ? (
          <p className="text-gray-600">No doctors found</p>
        ) : (
          doctors.map((doctor, index) => (
            <div key={doctor._id || index} className="border p-4 mb-2 rounded">
              <p><strong>Name:</strong> {doctor.firstName} {doctor.lastName}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Hospital:</strong> {doctor.hospital?.name || 'N/A'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestApi;