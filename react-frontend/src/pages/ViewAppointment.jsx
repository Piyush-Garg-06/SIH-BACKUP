import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../utils/api';
import { Calendar as CalendarIcon, Clock, Stethoscope, User, Hospital, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const ViewAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Make fetchAppointment available outside useEffect
  const fetchAppointment = async () => {
    try {
      setLoading(true);
      // Fetch the specific appointment by ID
      console.log('Fetching appointment with ID:', appointmentId);
      const res = await api.get(`/appointments/${appointmentId}`);
      console.log('Appointment data received:', res);
      setAppointment(res.data);
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError('Failed to load appointment details.');
      toast.error('Failed to load appointment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('ViewAppointment component mounted with appointmentId:', appointmentId);
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (appointmentId) {
      fetchAppointment();
    }
  }, [user, navigate, appointmentId]);

  const handleAcceptAppointment = async () => {
    try {
      await api.put(`/appointments/${appointmentId}/accept`);
      // Instead of setting the appointment directly, fetch the updated appointment data
      // This ensures we have the latest status from the server
      await fetchAppointment();
      toast.success('Appointment accepted successfully');
    } catch (err) {
      console.error('Error accepting appointment:', err);
      toast.error('Failed to accept appointment');
    }
  };

  const handleRejectAppointment = async () => {
    try {
      await api.put(`/appointments/${appointmentId}/reject`);
      // Instead of setting the appointment directly, fetch the updated appointment data
      // This ensures we have the latest status from the server
      await fetchAppointment();
      toast.success('Appointment rejected successfully');
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      toast.error('Failed to reject appointment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Not Found</h1>
            <p className="text-gray-600 mb-6">The requested appointment could not be found.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if the current user is a doctor and the appointment is pending
  const isDoctor = user && user.role === 'doctor';
  const isPending = appointment.status === 'pending';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Appointment Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to Appointments
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
              Appointment Request
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
              appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
              appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {appointment.status || 'Pending'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Appointment Date & Time</h3>
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                <span>{new Date(appointment.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-700 mt-1">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                <span>{appointment.time}</span>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Appointment Type</h3>
              <div className="flex items-center text-gray-700">
                <Stethoscope className="w-5 h-5 mr-2 text-green-600" />
                <span>{appointment.type}</span>
              </div>
              <div className="flex items-center text-gray-700 mt-1">
                <Hospital className="w-5 h-5 mr-2 text-green-600" />
                <span>{appointment.department}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Patient Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <User className="w-5 h-5 mr-2 text-gray-600" />
                  <span>
                    {appointment.worker?.firstName} {appointment.worker?.lastName}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-2 text-gray-600" />
                  <span>{appointment.contact}</span>
                </div>
                <div className="flex items-start text-gray-700">
                  <MapPin className="w-5 h-5 mr-2 text-gray-600 mt-0.5" />
                  <span>{appointment.address}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Hospital Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Hospital className="w-5 h-5 mr-2 text-gray-600" />
                  <span>{appointment.hospital}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Stethoscope className="w-5 h-5 mr-2 text-gray-600" />
                  <span>Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Stethoscope className="w-5 h-5 mr-2 text-gray-600" />
                  <span>{appointment.doctor?.specialization}</span>
                </div>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">Additional Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{appointment.notes}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => navigate('/doctor/appointments')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              View All Appointments
            </button>
            {/* Actual buttons */}
            {(isDoctor && isPending) && (
              <>
                <button
                  onClick={handleAcceptAppointment}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Accept Appointment
                </button>
                <button
                  onClick={handleRejectAppointment}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Reject Appointment
                </button>
              </>
            )}
            {/* Message when buttons are not shown */}
            {isDoctor && !isPending && (
              <div className="p-2 bg-gray-200 rounded">
                <p className="text-sm text-gray-600">Appointment is not pending (status: {appointment?.status})</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointment;