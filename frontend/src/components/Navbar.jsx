import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, MessageSquare, CheckCircle, Briefcase, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { DashboardController } from '../controllers/dashboardController';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ jobs: [], tasks: [] });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Messages State
  const [messages, setMessages] = useState([]);
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const msgRef = useRef(null);

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    setNotifications(DashboardController.getNotifications());
    setMessages(DashboardController.getMessages());
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target)) {
        setIsMsgOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search Data
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = DashboardController.searchAll(searchQuery);
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    if (DashboardController.markAsRead(id)) {
      setNotifications([...DashboardController.getNotifications()]);
    }
  };

  const handleNotifClick = (notif) => {
    handleMarkAsRead(notif.id, { stopPropagation: () => {} });
    setIsNotifOpen(false);
    if (notif.type === 'job') navigate(`/opportunities`);
    else if (notif.type === 'interview') navigate(`/interviews`);
    else navigate(`/applications`);
  };

  const handleMsgClick = (msg) => {
    if (DashboardController.markMessageAsRead(msg.id)) {
      setMessages([...DashboardController.getMessages()]);
    }
    setIsMsgOpen(false);
    navigate(`/messages/${msg.id}`);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMsgCount = messages.filter(m => m.unread).length;

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 w-full transition-all">
      {/* Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="flex bg-gray-50 items-center px-4 py-2.5 rounded-lg w-64 md:w-96 border border-gray-100 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search jobs, companies, tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setIsSearchOpen(true)}
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && (searchResults.jobs.length > 0 || searchResults.tasks.length > 0) && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto py-2 z-50">
            {searchResults.jobs.length > 0 && (
              <div className="mb-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-1.5">Opportunities</h4>
                {searchResults.jobs.map(job => (
                  <div key={`job-${job.id}`} onClick={() => { navigate(`/job/${job.id}`); setIsSearchOpen(false); setSearchQuery(''); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded bg-white border border-gray-100 p-1 flex-shrink-0 shadow-sm"><img src={job.logo} alt="" className="w-full h-full object-contain" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{job.role}</p>
                      <p className="text-xs text-gray-500 truncate">{job.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {searchResults.tasks.length > 0 && (
              <div className="border-t border-gray-50 pt-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-1.5">Tasks</h4>
                {searchResults.tasks.map(task => (
                  <div key={`task-${task.id}`} onClick={() => { navigate(`/task/${task.id}`); setIsSearchOpen(false); setSearchQuery(''); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100"><CheckCircle className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 truncate">Assigned to: {task.assignee}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Right Icons */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications Dropdown Container */}
        <div className="relative flex items-center gap-4" ref={notifRef}>
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative text-gray-400 hover:text-gray-600 transition-colors focus:outline-none bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
          
        {/* Messages Dropdown Container */}
        <div className="relative flex items-center gap-4 hidden sm:flex" ref={msgRef}>
          <button onClick={() => setIsMsgOpen(!isMsgOpen)} className="relative text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full focus:outline-none">
            <MessageSquare className="w-5 h-5" />
            {unreadMsgCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>

          {/* Messages Panel */}
          {isMsgOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 sm:w-[400px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Messages</h3>
                {unreadMsgCount > 0 && <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider border border-blue-200">{unreadMsgCount} New</span>}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="p-6 text-center text-gray-500 text-sm">No messages</p>
                ) : (
                  messages.map(msg => (
                    <div 
                      key={`msg-${msg.id}`} 
                      onClick={() => handleMsgClick(msg)}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-4 ${msg.unread ? 'bg-blue-50/20' : ''}`}
                    >
                      <img src={msg.avatar} alt={msg.sender} className="w-10 h-10 rounded-full border border-gray-200 object-cover flex-shrink-0 bg-white p-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className={`text-sm tracking-tight truncate ${msg.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{msg.sender}</p>
                          <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap ml-2 mt-0.5">{msg.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1 truncate">{msg.company}</p>
                        <p className={`text-[13px] line-clamp-2 leading-snug ${msg.unread ? 'font-medium text-gray-800' : 'text-gray-500'}`}>{msg.preview}</p>
                      </div>
                      {msg.unread && (
                        <div className="flex flex-col items-end justify-center ml-2">
                           <div className="w-2.5 h-2.5 bg-blue-600 rounded-full ring-4 ring-blue-50"></div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 text-center border-t border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                 <span className="text-xs font-bold text-blue-600 hover:text-blue-700">Open full inbox</span>
              </div>
            </div>
          )}
        </div>

          {/* Notifications Panel */}
          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider border border-blue-200">{unreadCount} New</span>}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-6 text-center text-gray-500 text-sm">No notifications</p>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => handleNotifClick(notif)}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-4 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${notif.type === 'job' ? 'bg-purple-50 text-purple-600 border-purple-100' : notif.type === 'interview' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                        {notif.type === 'job' ? <Briefcase className="w-4 h-4" /> : notif.type === 'interview' ? <CalendarIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm leading-tight ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>{notif.text}</p>
                        <p className="text-xs font-semibold text-gray-400 mt-1.5">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <button onClick={(e) => handleMarkAsRead(notif.id, e)} className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5 focus:outline-none ring-4 ring-blue-50 hover:bg-blue-700 transition-colors" title="Mark as read"></button>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 text-center border-t border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                 <span className="text-xs font-bold text-blue-600 hover:text-blue-700">View All Notifications</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4 md:pl-6 ml-2 cursor-pointer hover:opacity-80 transition-opacity">
          <span className="hidden md:block font-medium text-sm text-gray-700 font-semibold">Mohit Saluja</span>
          <img 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-gray-100"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
