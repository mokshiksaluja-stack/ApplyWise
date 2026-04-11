import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';

const CoordinatorList = ({ coordinators, horizontal = false }) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-white p-5 rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-200/60 flex flex-col ${horizontal ? '' : 'h-full'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">Coordinators</h3>
        <button onClick={() => navigate('/coordinators')} className="text-[13px] font-semibold text-gray-500 hover:text-gray-800 flex items-center focus:outline-none transition-colors">
          View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
      
      <div className={horizontal ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3 flex-1 justify-center"}>
        {coordinators.map((coordinator) => (
          <div key={coordinator.id} className={`flex items-center group cursor-pointer hover:bg-gray-50/80 p-2.5 rounded-[10px] transition-colors ${horizontal ? 'border border-gray-100' : '-mx-1.5 p-1.5'}`}>
            <img 
              src={coordinator.avatar} 
              alt={coordinator.name} 
              className="w-10 h-10 rounded-full object-cover shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-white mr-3"
            />
            <div className="flex-1">
              <h4 className="text-[14px] font-bold text-gray-800 group-hover:text-gray-900">{coordinator.name}</h4>
              <p className="text-[11px] text-gray-500 font-medium">{coordinator.tasksCompleted} Tasks completed</p>
            </div>
            <div className="flex items-center text-[12px] font-bold text-gray-700 gap-1 bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100/80">
              <Star className="w-3 h-3 text-amber-400 fill-current" />
              {coordinator.rating}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoordinatorList;
