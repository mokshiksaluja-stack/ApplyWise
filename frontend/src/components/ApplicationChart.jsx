import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';

const ApplicationChart = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-200/60 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[15px] font-bold text-gray-900">Application Overview</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-[11px] font-semibold text-gray-500 cursor-pointer hover:text-gray-800 transition">
              <span className="w-2.5 h-2.5 rounded bg-gray-400 mr-1.5"></span>
              Applications <ChevronDown className="w-3 h-3 ml-0.5" />
            </div>
            <div className="flex items-center text-[11px] font-semibold text-gray-500">
              <span className="w-2.5 h-2.5 rounded bg-gray-900 mr-1.5"></span>
              Placements
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900 tracking-tight">45%</div>
        </div>
      </div>
      
      <div className="flex-1 w-full h-48 min-h-[160px] mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }} dy={8} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }} ticks={[0, 30, 60]} />
            <Tooltip 
              cursor={{ fill: '#F3F4F6', opacity: 0.4 }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', fontSize: '12px' }}
            />
            <Bar yAxisId="left" dataKey="applications" fill="#9CA3AF" radius={[3, 3, 0, 0]} barSize={16} />
            <Bar yAxisId="left" dataKey="placements" fill="#111827" radius={[3, 3, 0, 0]} barSize={16} />
            <Line yAxisId="left" type="monotone" dataKey="trend" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, strokeWidth: 2, fill: '#fff', stroke: '#3B82F6' }} activeDot={{ r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ApplicationChart;
