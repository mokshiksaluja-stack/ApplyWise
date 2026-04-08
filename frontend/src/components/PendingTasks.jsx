import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const PendingTasks = ({ tasks }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'In Progress', 'Completed'];

  const filteredTasks = tasks.filter(task => activeTab === 'All' || task.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-yellow-700 bg-yellow-100';
      case 'Pending': return 'text-blue-700 bg-blue-100';
      case 'Completed': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-5 rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-200/60 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">Pending Tasks</h3>
        <button onClick={() => navigate('/tasks')} className="text-[13px] font-semibold text-gray-500 hover:text-gray-800 flex items-center transition-colors">
          View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
      
      <div className="flex gap-1 mb-4 bg-gray-100/50 p-1 rounded-lg w-fit border border-gray-200/50">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-3 py-1 text-[12px] font-semibold rounded-md transition-all",
              activeTab === tab 
                ? "bg-white text-gray-900 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-gray-200/50" 
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Task</th>
              <th className="pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Assigned To</th>
              <th className="pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Due Date</th>
              <th className="pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80">
            {filteredTasks.map((task) => (
              <tr 
                key={task.id} 
                onClick={() => navigate(`/task/${task.id}`)}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="py-2.5 pr-3 rounded-l-md pl-1">
                  <span className="text-[13px] font-semibold text-gray-800 block max-w-[200px] truncate group-hover:text-gray-900">{task.title}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-[13px] font-medium text-gray-500 group-hover:text-gray-700">{task.assignee}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-[12px] font-medium text-gray-400">{task.dueDate}</span>
                </td>
                <td className="py-2.5 pl-2 text-right rounded-r-md pr-1">
                  <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border", getStatusColor(task.status).includes('blue') ? 'bg-blue-50 text-blue-700 border-blue-100' : getStatusColor(task.status).includes('green') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : getStatusColor(task.status).includes('yellow') ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-gray-50 text-gray-700 border-gray-200')}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingTasks;
