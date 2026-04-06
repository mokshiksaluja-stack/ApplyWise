import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ProfileWizard from './pages/ProfileWizard'
import Profile from './pages/Profile'
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import Applications from "./pages/Applications";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import PreparationCenter from "./pages/PreparationCenter";
import StudentLayout from "./components/layouts/StudentLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<StudentLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileWizard />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/student/prep-center" element={<PreparationCenter />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;