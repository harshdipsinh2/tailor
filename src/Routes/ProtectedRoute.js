import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  // Check if user is authenticated
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  const userRole = auth.role?.toLowerCase();
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
