import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DashboardController } from '../controllers/dashboardController';
import { Star, MessageCircle, Mail } from 'lucide-react';

const Coordinators = () => {
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    setCoordinators(DashboardController.getCoordinators());
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Placement Coordinators</h1>
        <p className="text-gray-500 font-medium text-[15px]">Connect with the placement team for queries and assistance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {coordinators.map(coord => (
          <div key={coord.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center hover:shadow-md transition-shadow group text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            
            <img 
              src={coord.avatar} 
              alt={coord.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mb-4 z-10"
            />
            
            <h3 className="text-lg font-bold text-gray-900">{coord.name}</h3>
            <p className="text-sm font-medium text-blue-600 mb-4 bg-blue-50 px-3 py-1 rounded-full mt-1">Placement POC</p>
            
            <div className="flex gap-4 mb-6 w-full px-4 text-left">
              <div className="flex-1 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 flex items-center justify-center">Rating</p>
                 <p className="text-[15px] font-bold text-gray-900 flex items-center justify-center gap-1.5 leading-none">
                    {coord.rating} 
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                 </p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 flex items-center justify-center text-center">Tasks</p>
                 <p className="text-[15px] font-bold text-gray-900 flex items-center justify-center leading-none">
                    {coord.tasksCompleted}
                 </p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full mt-auto">
              <button onClick={() => alert('Opening generic message client...')} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg flex items-center justify-center text-sm transition-colors border border-gray-200 shadow-sm">
                <MessageCircle className="w-4 h-4 mr-2 text-gray-400" /> Ping
              </button>
              <button onClick={() => alert('Opening email client...')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center text-sm transition-colors shadow-sm">
                <Mail className="w-4 h-4 mr-2" /> Email
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Coordinators;
