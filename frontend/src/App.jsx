import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { NotificationProvider } from './context/NotificationContext';

// Student Auth & Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/Signup"; 
import ProfileWizard from './pages/ProfileWizard';
import Profile from './pages/Profile';
import StudentLayout from "./components/layouts/StudentLayout";
import PreparationCenter from "./pages/PreparationCenter";
import Notifications from "./pages/Notifications";

// Splitted Student Dashboard
import StudentDashboard from "./pages/student/Dashboard";
import StudentOpportunities from "./pages/student/Opportunities";
import StudentApplications from "./pages/student/Applications";

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOpportunities from './pages/admin/Opportunities';
import AdminApplications from './pages/admin/Applications';
import JobDetail from './pages/JobDetail';
import TaskDetail from './pages/TaskDetail';
import Tasks from './pages/Tasks';
import Interviews from './pages/Interviews';
import Coordinators from './pages/Coordinators';
import Analytics from './pages/Analytics';
import MessageDetails from './pages/MessageDetails';
import Students from './pages/Students';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Student Routes */}
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileWizard />} />
            <Route path="/student/opportunities" element={<StudentOpportunities />} />
            <Route path="/student/applications" element={<StudentApplications />} />
            <Route path="/student/prep-center" element={<PreparationCenter />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/opportunities" element={<ProtectedRoute><AdminOpportunities /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute><AdminApplications /></ProtectedRoute>} />
          
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
          <Route path="/coordinators" element={<ProtectedRoute><Coordinators /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          
          {/* Detail Routes */}
          <Route path="/job/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
          <Route path="/task/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
          <Route path="/messages/:id" element={<ProtectedRoute><MessageDetails /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
