import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Bell,
  LogOut,
  Calendar,
  FileText
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/coordinator/dashboard", icon: LayoutDashboard },
  { name: "Assigned Opportunities", path: "/coordinator/opportunities", icon: Briefcase },
  { name: "Applicants", path: "/coordinator/applicants", icon: Users },
  { name: "Interview Scheduler", path: "/coordinator/scheduler", icon: Calendar },
  { name: "Notifications", path: "/coordinator/notifications", icon: Bell },
  { name: "Reports", path: "/coordinator/reports", icon: FileText },
];

export default function CoordinatorSidebar() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-[#111827] text-white hidden md:flex flex-col border-r border-gray-800 flex-shrink-0 z-10 transition-all duration-300 shadow-xl">
      <div className="p-6 pb-0 mb-8 flex flex-col items-start">
         <div className="flex items-center gap-3 w-full mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-md text-white flex items-center justify-center font-bold text-lg shadow-lg">P</div>
            <h1 className="text-xl font-bold tracking-tight text-white">PlaceSync</h1>
         </div>
         <p className="text-[11px] text-gray-400 font-bold px-1 uppercase tracking-widest mt-2 border-b border-gray-800 pb-3 w-full">Coordinator Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-all text-red-400 hover:bg-gray-800 hover:text-red-300"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4 shadow-inner">
               <LogOut size={24} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
            <p className="mt-2 text-sm text-gray-500 mb-6">Are you sure you want to end your session?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsLogoutModalOpen(false)} 
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
