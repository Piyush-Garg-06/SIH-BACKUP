import { useState, useEffect } from 'react';
import api from '../utils/api';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/doctors/patients');
        // The API returns the patients array directly
        setPatients(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error('Failed to fetch patients', error);
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">My Patients</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {patients.length === 0 ? (
          <p>No patients assigned to you yet.</p>
        ) : (
          <div>
            <p className="mb-4">Showing {patients.length} patients:</p>
            <div className="grid gap-4">
              {patients.map(patient => (
                <div key={patient._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold">{patient.firstName} {patient.lastName}</h3>
                  <p className="text-sm text-gray-600">Type: {patient.type === 'worker' ? 'Migrant Worker' : 'Patient'}</p>
                  <p className="text-sm text-gray-600">Mobile: {patient.mobile}</p>
                  <p className="text-sm text-gray-600">Email: {patient.email}</p>
                  {patient.bloodGroup && (
                    <p className="text-sm text-gray-600">Blood Group: {patient.bloodGroup}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPatients;
