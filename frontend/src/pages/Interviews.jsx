import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DashboardController } from '../controllers/dashboardController';
import { Calendar, Clock, Video, MapPin, Play } from 'lucide-react';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    DashboardController.getInterviews().then(setInterviews);
  }, []);

  const statuses = ['All', 'Upcoming', 'Completed'];

  const filteredInterviews = interviews.filter(int => activeFilter === 'All' || int.status === activeFilter);

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Interviews</h1>
          <p className="text-gray-500 font-medium text-[15px]">Manage and join scheduled technical and HR interview rounds.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100 w-fit">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                activeFilter === status 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredInterviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          No interviews match the current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map(interview => (
            <div key={interview.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
               <div className="flex items-start justify-between mb-5 border-b border-gray-50 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 p-2 flex items-center justify-center">
                      <img src={interview.logo} alt={interview.company} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-0.5">{interview.studentName}</h3>
                      <p className="text-[13px] font-semibold text-gray-600 mb-0.5">{interview.company}</p>
                      <p className="text-[12px] font-medium text-gray-400">{interview.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    interview.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {interview.status}
                  </span>
               </div>

               <div className="space-y-4 mb-6">
                 <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                   <Calendar className="w-4 h-4 mr-3 text-blue-500" /> {interview.date}
                 </div>
                 <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                   <Clock className="w-4 h-4 mr-3 text-yellow-500" /> {interview.time}
                 </div>
                 <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                   {interview.mode === 'Online' ? <Video className="w-4 h-4 mr-3 text-green-500" /> : <MapPin className="w-4 h-4 mr-3 text-red-500" />}
                   {interview.mode} Meeting
                 </div>
               </div>

               <button 
                  onClick={() => alert('Starting meeting... (Dummy functionality)')}
                  disabled={interview.mode === 'Offline'}
                  className={`w-full py-2.5 font-bold rounded-lg text-sm transition-colors flex items-center justify-center ${
                    interview.mode === 'Online'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  {interview.mode === 'Online' ? <><Play className="w-4 h-4 mr-2 fill-current" /> Join Interview</> : 'In-Person Only'}
               </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Interviews;
