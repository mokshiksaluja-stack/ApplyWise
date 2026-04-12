import React from 'react';
import { Calendar, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

export default function NotificationCard({ title, message, type, createdAt, isRead }) {
  const getIcon = () => {
    switch (type) {
      case 'Interview': return <Calendar className="text-amber-600" size={18} />;
      case 'Result': return <CheckCircle className="text-emerald-600" size={18} />;
      case 'Alert': return <AlertCircle className="text-rose-600" size={18} />;
      default: return <Bell className="text-blue-600" size={18} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'Interview': return 'bg-amber-50 border-amber-100';
      case 'Result': return 'bg-emerald-50 border-emerald-100';
      case 'Alert': return 'bg-rose-50 border-rose-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px] overflow-hidden ${isRead ? 'opacity-80' : ''}`}>
      {!isRead && (
        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
      )}
      
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${getBgColor()}`}>
          {getIcon()}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-[13px] font-black text-gray-900 leading-tight line-clamp-1">{title}</h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md shrink-0">
              {formatTime(createdAt)}
            </span>
          </div>
          <p className="text-[12px] font-medium text-gray-500 leading-relaxed line-clamp-2 italic">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}