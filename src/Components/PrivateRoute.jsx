import { Navigate } from 'react-router-dom';
 // Adjust path as needed

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;