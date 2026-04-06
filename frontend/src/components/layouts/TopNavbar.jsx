import { useState, useRef, useEffect } from "react";
import { Bell, Search, Calendar, FileText, Briefcase, MapPin, CheckCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";

export default function TopNavbar() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.isRead).slice(0, 5); // display up to 5 unread

  const getIcon = (type) => {
    switch (type) {
      case "interview": return <Calendar size={16} className="text-blue-500" />;
      case "opportunity": return <Briefcase size={16} className="text-emerald-500" />;
      case "update": return <MapPin size={16} className="text-amber-500" />;
      case "success": return <CheckCircle size={16} className="text-green-500" />;
      case "system": return <Info size={16} className="text-purple-500" />;
      default: return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between bg-white border-b border-gray-200 px-6 py-4">


      <div className="flex w-full md:w-auto items-center justify-end gap-4 md:ml-auto">
        {/* Notification Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative rounded-full p-2 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
               <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                 {unreadCount > 9 ? '9+' : unreadCount}
               </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-gray-100 bg-white shadow-xl z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
               <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3 bg-gray-50">
                 <h3 className="font-bold text-gray-900">Notifications</h3>
                 {unreadCount > 0 && (
                   <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 shadow-sm border border-blue-200 w-fit">
                     {unreadCount} new
                   </span>
                 )}
               </div>

               <div className="max-h-[300px] overflow-y-auto">
                 {unreadNotifications.length > 0 ? (
                   <div className="divide-y divide-gray-50">
                     {unreadNotifications.map(notification => (
                       <div 
                         key={notification.id} 
                         className="p-4 hover:bg-blue-50/50 transition flex gap-3 cursor-pointer group" 
                         onClick={() => markAsRead(notification.id)}
                       >
                          <div className="mt-1 flex-shrink-0">
                             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm group-hover:scale-110 transition duration-300">
                                {getIcon(notification.type)}
                             </div>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 leading-snug">{notification.title}</p>
                            <p className="mt-1 text-xs text-gray-600 line-clamp-2 leading-relaxed">{notification.message}</p>
                            <p className="mt-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider">{notification.timestamp}</p>
                          </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="p-8 text-center flex flex-col items-center">
                     <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <CheckCircle size={24} className="text-green-400" />
                     </div>
                     <p className="text-sm font-bold text-gray-900">You're all caught up!</p>
                     <p className="text-xs text-gray-500 mt-1">No new notifications.</p>
                   </div>
                 )}
               </div>

               <div className="border-t border-gray-50 p-3 bg-gray-50/50">
                 <Link 
                   to="/notifications" 
                   onClick={() => setIsDropdownOpen(false)}
                   className="block w-full rounded-xl bg-white border border-gray-200 py-2.5 text-center text-sm font-bold text-gray-700 transition hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm"
                 >
                   View All Notifications
                 </Link>
               </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 shadow-sm border border-blue-200">
            M
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-tight">Mokshik Saluja</p>
            <p className="text-xs font-semibold text-gray-500">Student</p>
          </div>
        </div>
      </div>
    </header>
  );
}