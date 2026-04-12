import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function CoordinatorTopNavbar() {
  return (
    <header className="flex flex-wrap items-center justify-end bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-10 w-full transition-all">
      <div className="flex items-center gap-4">
        {/* Placeholder Notification Button */}
        <button className="relative rounded-full p-2 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-100">
          <Bell size={20} className="text-gray-500 hover:text-gray-800" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 shadow-sm border border-indigo-100">
            C
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-tight">Coordinator</p>
            <p className="text-xs font-semibold text-indigo-500">Staff Portal</p>
          </div>
        </div>
      </div>
    </header>
  );
}
