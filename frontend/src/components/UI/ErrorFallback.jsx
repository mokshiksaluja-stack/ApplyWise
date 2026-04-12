import React from 'react';
import { WifiOff, RotateCcw, Home, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorFallback = ({ 
  message = "We're having trouble connecting to the server.", 
  onRetry 
}) => {
  const navigate = useNavigate();

  // Determine dashboard path based on stored user role
  const getDashboardPath = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return '/login';
      switch (user.role) {
        case 'admin': return '/admin/dashboard';
        case 'coordinator': return '/coordinator/dashboard';
        case 'student': return '/student/dashboard';
        default: return '/login';
      }
    } catch (e) {
      return '/login';
    }
  };

  return (
    <div className="p-10 flex flex-col items-center text-center bg-white border border-gray-100 rounded-[48px] shadow-2xl shadow-gray-200/50 max-w-md animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 rounded-[32px] bg-rose-50 flex items-center justify-center mb-6 relative">
        <WifiOff className="text-rose-500" size={32} />
        <div className="absolute inset-0 rounded-[32px] bg-rose-500/10 animate-ping opacity-20"></div>
      </div>
      
      <h3 className="text-2xl font-black text-gray-900 tracking-tight">System Interruption</h3>
      <p className="mt-3 text-sm text-gray-500 font-medium leading-relaxed">
        {message} <br />
        Please check your connection or try again later.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-900/10"
          >
            <RotateCcw size={14} /> Retry Attempt
          </button>
        )}
        <button
          onClick={() => navigate(getDashboardPath())}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
        >
          <Home size={14} /> Dashboard
        </button>
      </div>

      <p className="mt-8 text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
        Placement Platform • Robustness v1.0
      </p>
    </div>
  );
};

export default ErrorFallback;
