import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Unified role-aware ProtectedRoute.
 *
 * Usage:
 *   <ProtectedRoute allowedRole="student">...</ProtectedRoute>
 *   <ProtectedRoute allowedRole="admin">...</ProtectedRoute>
 *   <ProtectedRoute allowedRole="coordinator">...</ProtectedRoute>
 *
 * Behaviour:
 *   - Not logged in          → redirect to /login
 *   - Wrong role             → redirect to their own portal
 *   - Correct role           → render children
 */

const ROLE_HOME = {
  student: '/student/dashboard',
  admin: '/admin/dashboard',
  coordinator: '/coordinator/dashboard',
};

export default function ProtectedRoute({ children, allowedRole }) {
  const token    = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // 1. Not authenticated at all → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. No specific role required → just auth-gated (legacy fallback)
  if (!allowedRole) {
    return children;
  }

  // 3. Role mismatch → redirect to their own home
  if (userRole !== allowedRole) {
    const redirectTo = ROLE_HOME[userRole] || '/login';
    return <Navigate to={redirectTo} replace />;
  }

  // 4. All checks passed
  return children;
}
