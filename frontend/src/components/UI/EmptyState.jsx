import React from 'react';
import { Ghost, Search, Inbox, AlertTriangle, ArrowRight } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Ghost, 
  title = "No data found", 
  message = "There's nothing to show here yet.",
  action,
  secondaryAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-16 text-center rounded-[48px] border-2 border-dashed border-gray-100 bg-white shadow-sm overflow-hidden relative group animate-in fade-in zoom-in-95 duration-700 ${className}`}>
      {/* Decorative background circle */}
      <div className="absolute top-0 left-1/2 -ml-32 -mt-32 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-50 transition-all group-hover:bg-blue-50"></div>
      
      <div className="relative z-10 w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center mb-6 shadow-inner border border-gray-50/50">
        <Icon size={40} className="text-gray-300 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-500" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
        <p className="mt-3 text-sm text-gray-400 max-w-[280px] mx-auto font-bold uppercase tracking-tight leading-relaxed">
          {message}
        </p>
      </div>

      <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-center gap-3">
        {action && (
          <button
            onClick={action.onClick}
            className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-gray-900/10 hover:bg-blue-600 active:scale-95 transition-all flex items-center gap-2"
          >
            {action.label} <ArrowRight size={14} />
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="px-8 py-3.5 bg-gray-100 text-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 active:scale-95 transition-all"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
