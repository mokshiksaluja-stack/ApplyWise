import { useState } from "react";
import { Bell, Calendar, Briefcase, MapPin, CheckCircle, Info, FileText, Check, Search } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [filterTab, setFilterTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["All", "Unread", "Important"];

  const filteredNotifications = notifications.filter(n => {
    if (filterTab === "Unread" && n.isRead) return false;
    if (filterTab === "Important" && !n.isImportant) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }
    
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "interview": return <Calendar size={20} className="text-blue-500" />;
      case "opportunity": return <Briefcase size={20} className="text-emerald-500" />;
      case "update": return <MapPin size={20} className="text-amber-500" />;
      case "success": return <CheckCircle size={20} className="text-green-500" />;
      case "system": return <Info size={20} className="text-purple-500" />;
      default: return <FileText size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-500">
            Stay updated with your latest alerts, interview schedules, and placement news.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex w-fit items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            <Check size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs and Search */}
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setFilterTab(filter)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                filterTab === filter
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {filter} 
              {filter === "Unread" && unreadCount > 0 && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${filterTab === filter ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`relative flex flex-col gap-4 rounded-2xl border p-5 transition sm:flex-row sm:items-start sm:justify-between ${
                notification.isRead 
                  ? "border-gray-100 bg-white" 
                  : "border-blue-100 bg-blue-50/30 shadow-sm"
              }`}
            >
              {/* Unread Indicator Dot */}
              {!notification.isRead && (
                <div className="absolute top-6 left-2 h-2 w-2 rounded-full bg-blue-600"></div>
              )}

              <div className="flex gap-4 sm:ml-4">
                <div className={`mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border shadow-sm ${notification.isRead ? 'border-gray-100 bg-gray-50' : 'border-white bg-white'}`}>
                   {getIcon(notification.type)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold ${notification.isRead ? 'text-gray-800' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    {notification.isImportant && (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                        Important
                      </span>
                    )}
                  </div>
                  
                  <p className={`mt-1 text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                    {notification.message}
                  </p>
                  
                  <p className="mt-3 text-xs font-semibold text-gray-400">
                    {notification.timestamp}
                  </p>
                </div>
              </div>

              {!notification.isRead && (
                <div className="sm:ml-auto">
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 sm:w-auto"
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
             <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
               <Bell size={28} className="text-gray-300" />
             </div>
             <h3 className="text-lg font-bold text-gray-900">No {filterTab.toLowerCase()} notifications</h3>
             <p className="mt-1 max-w-sm text-sm text-gray-500">
               You are all caught up! New alerts on your placements will appear here.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
