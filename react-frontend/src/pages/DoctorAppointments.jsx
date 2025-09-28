import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../utils/api';
import { Calendar as CalendarIcon, Clock, Stethoscope, User, Hospital, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      toast.error('Unauthorized access. Only doctors can view this page.');
      navigate('/login');
      return;
    }

    const fetchAppointments = async () => {
      try {
        // Assuming the /api/appointments endpoint returns appointments for the logged-in doctor
        const res = await api.get('/appointments');
        setAppointments(res.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments.');
        toast.error('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, navigate]);

  if (loading) {
    return <div className="text-center p-8">Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Your Appointments</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Request new appointment
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-lg">No upcoming appointments found.</p>
            <p className="text-sm mt-2">Check back later or request new appointments.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-4">
                  <p className="flex items-center"><User className="w-4 h-4 mr-2" /> Patient: {appointment.worker?.firstName} {appointment.worker?.lastName}</p>
                  <p className="flex items-center"><Stethoscope className="w-4 h-4 mr-2" /> Type: {appointment.type}</p>
                  <p className="flex items-center"><Hospital className="w-4 h-4 mr-2" /> Hospital: {appointment.hospital}</p>
                  <p className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Department: {appointment.department}</p>
                  {appointment.notes && <p className="col-span-2">Notes: {appointment.notes}</p>}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/doctor/appointments/${appointment._id}`)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;