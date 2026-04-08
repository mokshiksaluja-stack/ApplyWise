import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Briefcase, FileText, CheckSquare, Calendar, Users, BarChart2, LogOut } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { path: '/applications', icon: FileText, label: 'Applications' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/interviews', icon: Calendar, label: 'Interviews' },
  { path: '/coordinators', icon: Users, label: 'Coordinators' },
  { path: '/analytics', icon: BarChart2, label: 'Analytics' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="w-64 h-screen bg-white hidden md:flex flex-col border-r border-gray-100 flex-shrink-0 fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-md text-white flex items-center justify-center font-bold text-lg cursor-pointer" onClick={() => navigate('/dashboard')}>P</div>
        <h1 className="font-semibold text-gray-900 leading-tight cursor-pointer" onClick={() => navigate('/dashboard')}>
          Placement<br/><span className="text-sm font-normal text-gray-500">& Internship</span>
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
                      ? 'bg-green-50 text-green-700 border-green-500' 
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-green-600' : ''}`} /> {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mb-4">
        <button className="flex w-full items-center gap-3 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-lg">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
