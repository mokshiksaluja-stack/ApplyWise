import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { DashboardController } from '../controllers/dashboardController';
import clsx from 'clsx';

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'In Progress', 'Completed'];

  useEffect(() => {
    setTasks(DashboardController.getTasks('All'));
  }, []);

  const filteredTasks = tasks.filter(task => activeTab === 'All' || task.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Pending': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'Completed': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-500 font-medium text-[15px]">Manage and track your assigned placement coordination tasks.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
        <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-lg w-fit border border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-5 py-2 text-sm font-semibold rounded-md transition-all",
                activeTab === tab 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 px-4 pl-0 text-sm font-semibold text-gray-400 uppercase tracking-wider">Task Title</th>
                <th className="pb-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Assigned By</th>
                <th className="pb-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="pb-4 px-4 pr-0 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">No tasks found for this status.</td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr 
                    key={task.id} 
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-5 pr-4 pl-2 rounded-l-lg">
                      <span className="text-[15px] font-bold text-gray-800 block group-hover:text-blue-700 transition-colors leading-tight">{task.title}</span>
                      <span className="text-xs text-gray-500 mt-1 block truncate max-w-sm">{task.description}</span>
                    </td>
                    <td className="py-5 px-4 font-medium text-gray-600 text-sm">
                      {task.assignee}
                    </td>
                    <td className="py-5 px-4 font-medium text-gray-500 text-sm">
                      {task.dueDate}
                    </td>
                    <td className="py-5 pl-4 pr-2 text-right rounded-r-lg">
                      <span className={clsx("inline-flex items-center px-3 py-1 rounded border text-[11px] font-bold shadow-sm", getStatusColor(task.status))}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
