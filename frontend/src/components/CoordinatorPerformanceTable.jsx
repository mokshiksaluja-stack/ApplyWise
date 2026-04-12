import React from 'react';
import { User, CheckCircle, Calendar, ClipboardCheck } from 'lucide-react';

const CoordinatorPerformanceTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-gray-400 font-medium italic">No coordinator activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Coordinator Performance</h3>
        <p className="text-xs text-gray-400 font-medium mt-1">Operational activity breakdown</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Coordinator</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Tasks</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Interviews</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((coord, idx) => (
              <tr key={coord.coordinatorId || idx} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-none">{coord.name.split('@')[0]}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{coord.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[13px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    <ClipboardCheck size={12} className="text-blue-500" /> {coord.tasksCompleted}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[13px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    <Calendar size={12} className="text-orange-500" /> {coord.interviewsScheduled}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[13px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    <CheckCircle size={12} className="text-emerald-500" /> {coord.attendanceHandled}
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

export default CoordinatorPerformanceTable;
