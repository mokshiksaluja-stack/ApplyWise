import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';
import TaskDetail from './pages/TaskDetail';
import Opportunities from './pages/Opportunities';
import Applications from './pages/Applications';
import Tasks from './pages/Tasks';
import Interviews from './pages/Interviews';
import Coordinators from './pages/Coordinators';
import Analytics from './pages/Analytics';
import MessageDetails from './pages/MessageDetails';
import Students from './pages/Students';

// Auth Imports
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Root Redirects to Dashboard which is protected */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected Dashboard/Main Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
        <Route path="/coordinators" element={<ProtectedRoute><Coordinators /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        
        {/* Detail Routes */}
        <Route path="/job/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
        <Route path="/task/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        <Route path="/messages/:id" element={<ProtectedRoute><MessageDetails /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
