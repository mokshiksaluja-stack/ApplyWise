import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Calendar, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

const iconMap = {
  'users': Users,
  'file-text': FileText,
  'calendar': Calendar,
};

const StatCard = ({ title, value, subtext, trend, isPositive, iconType, linkTo }) => {
  const Icon = iconMap[iconType] || Users;
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => linkTo && navigate(linkTo)}
      className="bg-white rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-200/60 p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all cursor-pointer relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-gray-100 transition-colors duration-300 border border-gray-100/50">
            <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-gray-500 leading-snug">
              {title}
            </h3>
          </div>
        </div>
        
        {trend && (
          <div className={clsx("flex items-center text-[11px] font-bold px-2 py-1 rounded-md", isPositive ? "text-emerald-600 bg-emerald-50/80" : "text-rose-600 bg-rose-50/80")}>
            {trend} <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-end mt-2">
        <div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          <div className="flex items-center mt-1.5 text-[11px] font-semibold text-gray-400">
            <Icon className="w-3 h-3 mr-1 text-gray-300" strokeWidth={2} />
            {subtext}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
