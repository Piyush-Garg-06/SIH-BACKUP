import React from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import GovernmentSchemesComponent from '../components/GovernmentSchemes';

const GovernmentSchemesPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  // Only allow workers and patients to view this page
  if (!user || (user.role !== 'worker' && user.role !== 'patient')) {
    navigate('/login'); // Redirect to login or unauthorized page
    return null;
  }

  // Pass the profileId as workerId to the component
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <GovernmentSchemesComponent workerId={user.profileId} />
    </div>
  );
};

export default GovernmentSchemesPage;
