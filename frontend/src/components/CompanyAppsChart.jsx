import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CompanyAppsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-gray-400 font-medium italic">No application data available for this selection.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Applications by Company</h3>
        <p className="text-xs text-gray-400 font-medium">Top 10 companies by volume</p>
      </div>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="company" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '12px', padding: '10px' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
            <Bar dataKey="applications" name="Applied" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="selected" name="Selected" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompanyAppsChart;
