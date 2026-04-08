import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { DashboardController } from '../controllers/dashboardController';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import clsx from 'clsx';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    setTimeout(() => {
      const data = DashboardController.getTaskById(id);
      setTask(data);
      setLoading(false);
    }, 200);
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Pending': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'Completed': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">Return to Dashboard</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{task.title}</h1>
            <span className={clsx("inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border", getStatusColor(task.status))}>
              {task.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-5 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</p>
                <p className="text-[15px] font-bold text-gray-900">{task.assignee}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</p>
                <p className="text-[15px] font-bold text-gray-900">{task.dueDate}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-400" />
              Task Description
            </h3>
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <p className="text-gray-600 text-[15px] leading-relaxed">{task.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaskDetail;
