import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { DashboardController } from '../../controllers/dashboardController';
import clsx from 'clsx';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    DashboardController.getApplications().then(setApplications);
  }, []);

  const statuses = ['All', 'Applied', 'Shortlisted', 'Rejected'];

  const filteredApps = applications.filter(app => activeFilter === 'All' || app.status === activeFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Shortlisted': return 'bg-green-50 text-green-600 border border-green-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border border-red-100';
      default: return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-500 font-medium text-[15px]">Track application statuses across all registered candidates.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100 w-fit">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={clsx(
                "px-4 py-2 text-sm font-semibold rounded-md transition-all",
                activeFilter === status 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Applied On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">No applications match the current filter.</td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-gray-900">{app.studentName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white border border-gray-100 p-1.5 flex items-center justify-center flex-shrink-0">
                          <img src={app.logo} alt={app.company} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">{app.company}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-gray-700">{app.role}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm", getStatusColor(app.status))}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-medium text-gray-500">{app.date}</span>
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

export default Applications;
