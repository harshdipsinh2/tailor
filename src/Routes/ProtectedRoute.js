import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, userRole }) => {
  return allowedRoles.includes(userRole) ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
