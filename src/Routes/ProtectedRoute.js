import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token || !allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" />; // Or redirect to login
  }

  return children;
};

export default ProtectedRoute;