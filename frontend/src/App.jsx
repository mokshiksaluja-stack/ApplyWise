import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { NotificationProvider } from './context/NotificationContext';
import { PlacementProvider } from './context/PlacementContext';
import { AdminCoordinatorProvider } from './context/AdminCoordinatorContext';
import ErrorBoundary from './components/ErrorBoundary';

// Auth
import Login from './pages/auth/Login';
import Signup from './pages/Signup';

// Route guard
import ProtectedRoute from './components/ProtectedRoute';

// Student layouts & pages
import StudentLayout from './components/layouts/StudentLayout';
import ProfileWizard from './pages/ProfileWizard';
import Profile from './pages/Profile';
import PreparationCenter from './pages/PreparationCenter';
import Notifications from './pages/Notifications';
import StudentDashboard from './pages/student/Dashboard';
import StudentOpportunities from './pages/student/Opportunities';
import StudentOpportunityDetail from './pages/student/OpportunityDetail';
import StudentApplications from './pages/student/Applications';

// Coordinator layout & pages
import CoordinatorLayout from './components/coordinator/layout/CoordinatorLayout';
import CoordinatorDashboard from './pages/coordinator/Dashboard';
import CoordinatorOpportunities from './pages/coordinator/AssignedOpportunities';
import CoordinatorApplicants from './pages/coordinator/Applicants';
import CoordinatorScheduler from './pages/coordinator/Scheduler';
import CoordinatorNotifications from './pages/coordinator/Notifications';
import CoordinatorReports from './pages/coordinator/Reports';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOpportunities from './pages/admin/Opportunities';
import CreateOpportunity from './pages/admin/CreateOpportunity';
import AdminApplications from './pages/admin/Applications';
import TaskDetail from './pages/TaskDetail';
import Tasks from './pages/Tasks';
import Interviews from './pages/Interviews';
import Coordinators from './pages/Coordinators';
import Analytics from './pages/Analytics';
import MessageDetails from './pages/MessageDetails';
import Students from './pages/Students';
import CoordinatorMonitor from './pages/admin/CoordinatorMonitor';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <PlacementProvider>
          <AdminCoordinatorProvider>
            <BrowserRouter>
              <Routes>
                {/* ── Public ─────────────────────────────────── */}
                <Route path="/login"  element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* ── Student (role-gated) ────────────────────── */}
                <Route
                  element={
                    <ProtectedRoute allowedRole="student">
                      <StudentLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/student/dashboard"          element={<StudentDashboard />} />
                  <Route path="/student/opportunities"      element={<StudentOpportunities />} />
                  <Route path="/student/opportunities/:id"  element={<StudentOpportunityDetail />} />
                  <Route path="/student/applications"       element={<StudentApplications />} />
                  <Route path="/student/prep-center"        element={<PreparationCenter />} />
                  <Route path="/notifications"              element={<Notifications />} />
                  <Route path="/profile"                    element={<Profile />} />
                  <Route path="/profile/edit"               element={<ProfileWizard />} />
                </Route>

                {/* ── Coordinator (role-gated) ────────────────── */}
                <Route
                  element={
                    <ProtectedRoute allowedRole="coordinator">
                      <CoordinatorLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/coordinator/dashboard"      element={<CoordinatorDashboard />} />
                  <Route path="/coordinator/opportunities"  element={<CoordinatorOpportunities />} />
                  <Route path="/coordinator/applicants"     element={<CoordinatorApplicants />} />
                  <Route path="/coordinator/scheduler"      element={<CoordinatorScheduler />} />
                  <Route path="/coordinator/notifications"  element={<CoordinatorNotifications />} />
                  <Route path="/coordinator/reports"        element={<CoordinatorReports />} />
                </Route>

                {/* Admin pages individually guarded (existing pattern preserved) */}
                <Route path="/admin/dashboard"         element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/opportunities"     element={<ProtectedRoute allowedRole="admin"><AdminOpportunities /></ProtectedRoute>} />
                <Route path="/admin/opportunities/new" element={<ProtectedRoute allowedRole="admin"><CreateOpportunity /></ProtectedRoute>} />
                <Route path="/admin/applications"      element={<ProtectedRoute allowedRole="admin"><AdminApplications /></ProtectedRoute>} />
                <Route path="/tasks"                   element={<ProtectedRoute allowedRole="admin"><Tasks /></ProtectedRoute>} />
                <Route path="/task/:id"                element={<ProtectedRoute allowedRole="admin"><TaskDetail /></ProtectedRoute>} />
                <Route path="/interviews"              element={<ProtectedRoute allowedRole="admin"><Interviews /></ProtectedRoute>} />
                <Route path="/coordinators"            element={<ProtectedRoute allowedRole="admin"><Coordinators /></ProtectedRoute>} />
                <Route path="/analytics"               element={<ProtectedRoute allowedRole="admin"><Analytics /></ProtectedRoute>} />
                <Route path="/students"                element={<ProtectedRoute allowedRole="admin"><Students /></ProtectedRoute>} />
                <Route path="/messages/:id"            element={<ProtectedRoute allowedRole="admin"><MessageDetails /></ProtectedRoute>} />
                <Route path="/admin/coordinator-monitor" element={<ProtectedRoute allowedRole="admin"><CoordinatorMonitor /></ProtectedRoute>} />

                {/* ── 404 fallback ────────────────────────────── */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </AdminCoordinatorProvider>
        </PlacementProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
