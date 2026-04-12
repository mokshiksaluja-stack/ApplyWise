import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Bell,
  LogOut,
  BookOpen,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Opportunities", path: "/student/opportunities", icon: Briefcase },
  { name: "My Applications", path: "/student/applications", icon: FileText },
  { name: "Preparation Center", path: "/student/prep-center", icon: BookOpen },
  { name: "Notifications", path: "/notifications", icon: Bell },
];

export default function Sidebar() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 pb-0 mb-10">
        <h1 className="text-2xl font-bold text-blue-600">
          ApplyWise
        </h1>
        <p className="text-sm text-gray-500">
          Student Portal
        </p>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
               <LogOut size={28} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
            <p className="mt-2 text-sm text-gray-500 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-700 hover:shadow-lg"
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