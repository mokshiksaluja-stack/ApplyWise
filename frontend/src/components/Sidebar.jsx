import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Briefcase, FileText, CheckSquare, Calendar, Users, BarChart2, LogOut } from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/admin/opportunities', icon: Briefcase, label: 'Opportunities' },
  { path: '/admin/applications', icon: FileText, label: 'Applications' },
  { path: '/admin/coordinator-monitor', icon: BarChart2, label: 'Coordinator Monitor' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/interviews', icon: Calendar, label: 'Interviews' },
  { path: '/coordinators', icon: Users, label: 'Coordinators' },
  { path: '/analytics', icon: BarChart2, label: 'Analytics' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('studentId');
    navigate('/login', { replace: true });
  };

  return (
    <>
      <aside className="w-64 h-screen bg-white hidden md:flex flex-col border-r border-gray-100 flex-shrink-0 fixed left-0 top-0 z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-md text-white flex items-center justify-center font-bold text-lg cursor-pointer" onClick={() => navigate('/admin/dashboard')}>A</div>
          <h1 className="font-semibold text-gray-900 leading-tight cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
            ApplyWise<br/><span className="text-sm font-normal text-gray-500">Admin Portal</span>
          </h1>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-4 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-blue-500' 
                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} /> {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mb-4 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 px-6 py-3 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
              <LogOut size={28} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
            <p className="mt-2 text-sm text-gray-500 mb-6">
              Are you sure you want to logout from the Admin Portal?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
