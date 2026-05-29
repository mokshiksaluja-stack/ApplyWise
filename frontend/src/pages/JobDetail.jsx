import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import StudentOpportunityDetail from './student/OpportunityDetail';
import CoordinatorDriveDetail from './coordinator/DriveDetail';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * Unified role-aware Job Detail view.
 * Routes/renders the correct detailed opportunity layout based on active user role:
 *   - Student     → Redirect to /student/opportunities/:id
 *   - Coordinator → Redirect to /coordinator/opportunities/:id
 *   - Admin       → Render StudentOpportunityDetail wrapped in the Admin Layout
 */
export default function JobDetail() {
  const { id } = useParams();
  const userRole = localStorage.getItem('userRole');

  if (userRole === 'student') {
    return <Navigate to={`/student/opportunities/${id}`} replace />;
  }

  if (userRole === 'coordinator') {
    return <Navigate to={`/coordinator/opportunities/${id}`} replace />;
  }

  if (userRole === 'admin') {
    return (
      <Layout>
        <StudentOpportunityDetail />
      </Layout>
    );
  }

  return <Navigate to="/login" replace />;
}
