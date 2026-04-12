import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ReadinessDistributionChart = ({ data }) => {
  if (!data || data.length === 0 || (data.length === 1 && data[0].name === 'No Data')) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-gray-400 font-medium italic">No status distribution data.</p>
      </div>
    );
  }

  const COLORS = {
    'Applied': '#3b82f6',
    'Shortlisted': '#8b5cf6',
    'Scheduled': '#f59e0b',
    'Selected': '#10b981',
    'Rejected': '#ef4444',
    'Other': '#94a3b8'
  };

  const getStatusColor = (name) => COLORS[name] || COLORS['Other'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Status Distribution</h3>
      
      <div className="flex flex-col sm:flex-row items-center justify-between flex-1 gap-6">
        <div className="w-full sm:w-1/2 flex flex-col gap-2.5">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getStatusColor(entry.name) }}
                ></span>
                <span className="text-sm font-semibold text-gray-600 leading-none">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
        
        <div className="w-full sm:w-1/2 h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReadinessDistributionChart;
