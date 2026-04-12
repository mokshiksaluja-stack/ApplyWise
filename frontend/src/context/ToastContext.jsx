import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Listen for global API errors
  useEffect(() => {
    const handleApiError = (event) => {
      const { message, type } = event.detail;
      showToast(message, type || 'error');
    };

    window.addEventListener('api-error', handleApiError);
    return () => window.removeEventListener('api-error', handleApiError);
  }, [showToast]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-emerald-500" size={18} />;
      case 'error': return <XCircle className="text-rose-500" size={18} />;
      case 'warning': return <AlertCircle className="text-amber-500" size={18} />;
      case 'info': return <Info className="text-blue-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-100 bg-emerald-50/90';
      case 'error': return 'border-rose-100 bg-rose-50/90';
      case 'warning': return 'border-amber-100 bg-amber-50/90';
      case 'info': return 'border-blue-100 bg-blue-50/90';
      default: return 'border-gray-100 bg-gray-50/90';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-4 px-5 py-4 rounded-[24px] border backdrop-blur-xl shadow-2xl 
              animate-in fade-in slide-in-from-right-8 duration-500 min-w-[320px] max-w-md
              ${getStyles(toast.type)}
            `}
          >
            <div className="shrink-0">{getIcon(toast.type)}</div>
            <p className="text-sm font-black text-gray-900 flex-1 leading-tight tracking-tight">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1.5 hover:bg-black/5 rounded-xl transition-all active:scale-90"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
