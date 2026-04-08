import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const TaskDistributionChart = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-200/60 flex flex-col h-full">
      <h3 className="text-[15px] font-bold text-gray-900 mb-4">Task Distribution</h3>
      
      <div className="flex items-center justify-between flex-1">
        <div className="flex flex-col gap-3">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <span 
                className="w-2.5 h-2.5 rounded border border-black/5" 
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-[13px] font-medium text-gray-600 w-24 leading-snug">{entry.name}</span>
              <span className="text-[13px] font-bold text-gray-900">{entry.value}%</span>
            </div>
          ))}
        </div>
        
        <div className="w-28 h-28 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={22}
                outerRadius={54}
                paddingAngle={0}
                dataKey="value"
                stroke="#fff"
                strokeWidth={3}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                  if (percent < 0.1) return null;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                  
                  return (
                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold">
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', fontSize: '11px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TaskDistributionChart;
