import React, { useState } from 'react';
import { Bell, Briefcase, Info, Clock, Calendar, CheckCircle, Search, Filter } from 'lucide-react';

const dummyNotifications = [
  {
    id: 1,
    type: 'assignment',
    title: 'New Drive Assignment',
    message: 'Admin has assigned the Google Software Engineer Intern drive to you.',
    time: '2 hours ago',
    read: false,
    icon: Briefcase,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100'
  },
  {
    id: 2,
    type: 'instruction',
    title: 'Admin Instruction',
    message: 'Please ensure all attendance sheets for yesterday\'s Amazon drive are verified and finalized by 4:00 PM today.',
    time: '5 hours ago',
    read: false,
    icon: Info,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100'
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Student Update Reminder',
    message: '12 students from the Microsoft SDE 1 pool still require Round 1 results. Please process them soon.',
    time: '1 day ago',
    read: true,
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100'
  },
  {
    id: 4,
    type: 'schedule',
    title: 'Schedule Change Request',
    message: 'Atlassian requested pushing their backend engineer drive by 1 hour due to panel unavailability.',
    time: '1 day ago',
    read: true,
    icon: Calendar,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100'
  },
  {
    id: 5,
    type: 'alert',
    title: 'Pending Action Alert',
    message: 'You have 3 unassigned students in the ongoing interview schedule for Google. Assign them to a timeslot.',
    time: '2 days ago',
    read: true,
    icon: Bell,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100'
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [activeFilter, setActiveFilter] = useState('All');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'Unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" /> Notifications Feed
          </h1>
          <p className="text-sm text-gray-500 mt-1">Stay updated with assignments, schedules, and alerts.</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
          >
            <CheckCircle className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row justify-between gap-4">
         <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 inline-flex w-fit">
            <button 
              onClick={() => setActiveFilter('All')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeFilter === 'All' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
               All
            </button>
            <button 
              onClick={() => setActiveFilter('Unread')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeFilter === 'Unread' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
               Unread
               {unreadCount > 0 && <span className="bg-indigo-100 text-indigo-700 px-1.5 rounded text-[10px]">{unreadCount}</span>}
            </button>
         </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
               <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">You're all caught up!</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">There are no notifications matching your current filter. You have zero pending alerts.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => markAsRead(notif.id)}
              className={`bg-white rounded-2xl border ${notif.read ? 'border-gray-100' : 'border-indigo-200 shadow-md ring-1 ring-indigo-50/50'} shadow-sm p-5 hover:shadow-md transition-all flex gap-4 cursor-pointer relative overflow-hidden group`}
            >
              {!notif.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
              )}
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${notif.bg} ${notif.color} ${notif.border}`}>
                <notif.icon className="w-6 h-6" strokeWidth={2} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-[15px] font-bold ${notif.read ? 'text-gray-800' : 'text-gray-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs font-semibold text-gray-400 whitespace-nowrap ml-4 block">{notif.time}</span>
                </div>
                <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-gray-600 font-medium'} leading-relaxed`}>{notif.message}</p>
                
                {notif.type === 'assignment' && !notif.read && (
                  <button className="mt-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 border border-transparent px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                    View Drive Assignment
                  </button>
                )}
                {notif.type === 'alert' && !notif.read && (
                  <button className="mt-3 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-200 border border-transparent px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                    Resolve Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
