import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is admin and trying to access the general dashboard, redirect to admin dashboard
  if (user && user.role === 'admin' && location.pathname === '/dashboard') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If user is not admin and trying to access admin dashboard, redirect to general dashboard
  if (user && user.role !== 'admin' && location.pathname === '/admin/dashboard') {
    return <Navigate to="/dashboard" replace />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;