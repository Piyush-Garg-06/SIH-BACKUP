import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import webSocketService from '../utils/webSocketService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.user);

          // Connect to WebSocket service
          if (res.user) {
            webSocketService.connect(res.user._id);
            
            // Load user profile based on role
            await loadUserProfile(res.user);
          }
        } catch (err) {
          console.error('Failed to load user from token:', err);
          localStorage.removeItem('token');
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    };

    loadUser();

    // Cleanup function
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const loadUserProfile = async (userData) => {
    try {
      let profileEndpoint = '';

      switch (userData.role) {
        case 'worker':
          profileEndpoint = '/workers/profile';
          break;
        case 'patient':
          profileEndpoint = '/patients/profile';
          break;
        case 'doctor':
          profileEndpoint = '/doctors/profile';
          break;
        case 'employer':
          profileEndpoint = '/employers/profile';
          break;
        case 'emitra':
          profileEndpoint = '/emitra/profile';
          break;
        case 'admin':
          // Admin doesn't need a specific profile
          return;
        default:
          console.warn('Unknown user role:', userData.role);
          return;
      }

      if (profileEndpoint) {
        const profileRes = await api.get(profileEndpoint);
        setUserProfile(profileRes.profile);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      // Don't fail completely if profile loading fails
    }
  };

  const login = async (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData.user);

    // Connect to WebSocket service
    if (userData.user) {
      webSocketService.connect(userData.user._id);
      
      // Load user profile after login
      await loadUserProfile(userData.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserProfile(null);
    
    // Disconnect from WebSocket service
    webSocketService.disconnect();
  };

  const updateUserProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  const refreshUserData = async () => {
    if (user) {
      try {
        const res = await api.get('/auth/me');
        setUser(res.user);
        await loadUserProfile(res.user);
      } catch (err) {
        console.error('Failed to refresh user data:', err);
      }
    }
  };

  // Role-based utility functions
  const isWorker = () => user?.role === 'worker';
  const isPatient = () => user?.role === 'patient';
  const isDoctor = () => user?.role === 'doctor';
  const isEmployer = () => user?.role === 'employer';
  const isEmitra = () => user?.role === 'emitra';
  const isAdmin = () => user?.role === 'admin';

  const canAccessWorkerData = () => isAdmin() || isDoctor() || isWorker();
  const canAccessPatientData = () => isAdmin() || isDoctor() || isPatient();
  const canCreateAppointments = () => isWorker() || isPatient();
  const canViewAllUsers = () => isAdmin() || isDoctor();

  const value = {
    user,
    userProfile,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    updateUserProfile,
    refreshUserData,
    // Role-based utilities
    isWorker,
    isPatient,
    isDoctor,
    isEmployer,
    isEmitra,
    isAdmin,
    canAccessWorkerData,
    canAccessPatientData,
    canCreateAppointments,
    canViewAllUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};