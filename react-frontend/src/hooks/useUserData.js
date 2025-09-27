import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import api from '../utils/api';

export const useUserData = () => {
  const { user, userProfile, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserHealthRecords = useCallback(async () => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/health-records/my-records');
      return response.data; // Return the data directly
    } catch (err) {
      console.error('Error fetching user health records:', err);
      setError(err.message || 'Failed to fetch health records');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserAppointments = useCallback(async () => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/appointments');
      return response;
    } catch (err) {
      console.error('Error fetching user appointments:', err);
      setError(err.message || 'Failed to fetch appointments');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserDashboard = useCallback(async () => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      switch (user.role) {
        case 'worker':
          endpoint = '/dashboard/worker';
          break;
        case 'patient':
          endpoint = '/dashboard/patient';
          break;
        case 'doctor':
          endpoint = '/dashboard/doctor';
          break;
        case 'employer':
          endpoint = '/dashboard/employer';
          break;
        case 'admin':
          endpoint = '/dashboard/admin';
          break;
        default:
          throw new Error('Invalid user role');
      }

      const response = await api.get(endpoint);
      return response;
    } catch (err) {
      console.error('Error fetching user dashboard:', err);
      setError(err.message || 'Failed to fetch dashboard data');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      switch (user.role) {
        case 'worker':
          endpoint = '/workers/profile';
          break;
        case 'patient':
          endpoint = '/patients/profile';
          break;
        case 'doctor':
          endpoint = '/doctors/profile';
          break;
        case 'employer':
          endpoint = '/employers/profile';
          break;
        case 'admin':
          return user; // Admin doesn't have a specific profile
        default:
          throw new Error('Invalid user role');
      }

      const response = await api.get(endpoint);
      return response.profile;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to fetch user profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateUserProfile = useCallback(async (updatedData) => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      switch (user.role) {
        case 'worker':
          endpoint = '/workers/profile';
          break;
        case 'patient':
          endpoint = '/patients/profile';
          break;
        case 'doctor':
          endpoint = '/doctors/profile';
          break;
        case 'employer':
          endpoint = '/employers/profile';
          break;
        default:
          throw new Error('Cannot update profile for this user type');
      }

      await api.put(endpoint, updatedData);
      await refreshUserData(); // Refresh the context data
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, refreshUserData]);

  return {
    user,
    userProfile,
    loading,
    error,
    fetchUserHealthRecords,
    fetchUserAppointments,
    fetchUserDashboard,
    fetchUserProfile,
    updateUserProfile,
    refreshUserData,
  };
};

export default useUserData;
