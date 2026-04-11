import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const userStr = localStorage.getItem('loggedInUser');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin) {
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        return <Navigate to="/home" replace />;
      }
    } catch (e) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
