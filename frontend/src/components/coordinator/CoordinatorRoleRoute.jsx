import React from 'react';
import { Navigate } from 'react-router-dom';

export default function CoordinatorRoleRoute({ children }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); 
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole || (userRole !== 'coordinator' && userRole !== 'admin')) {
     if (userRole === 'student') return <Navigate to="/student/dashboard" replace />;
     return <Navigate to="/login" replace />;
  }

  return children;
}
