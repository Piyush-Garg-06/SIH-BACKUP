import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import useUserData from '../hooks/useUserData';
import { Calendar as CalendarIcon, Clock, Stethoscope, Hospital, PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Appointments = () => {
  const { user, canCreateAppointments } = useAuth();
  const navigate = useNavigate();
  const { fetchUserAppointments, loading, error } = useUserData();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!canCreateAppointments()) {
      toast.error('Unauthorized access. Only workers and patients can view this page.');
      navigate('/dashboard');
      return;
    }

    const fetchAppointments = async () => {
      try {
        const data = await fetchUserAppointments();
        if (data) {
          setAppointments(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        toast.error('Failed to load appointments.');
      }
    };

    fetchAppointments();
  }, [user, navigate, canCreateAppointments, fetchUserAppointments]);

  if (loading) {
    return <div className="text-center p-8">Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Your Appointments</h1>

        <div className="flex justify-end mb-6">
          <Link
            to="/schedule-appointment"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Request new appointment
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-lg">No upcoming appointments found.</p>
            <p className="text-sm mt-2">You can request a new appointment using the button above.</p>
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
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <p className="flex items-center"><Stethoscope className="w-4 h-4 mr-2" /> Doctor: {appointment.doctor.firstName} {appointment.doctor.lastName} ({appointment.doctor.specialization})</p>
                  <p className="flex items-center"><Hospital className="w-4 h-4 mr-2" /> Hospital: {appointment.hospital}</p>
                  <p className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Department: {appointment.department}</p>
                  {appointment.notes && <p className="col-span-2">Notes: {appointment.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;