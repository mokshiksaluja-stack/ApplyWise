import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, CheckCircle } from 'lucide-react';

const OpportunityCard = ({ id, company, role, salary, deadline, logo, tags, applied }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-200/60 p-4 sm:p-5 hover:shadow-md hover:border-gray-300 transition-all flex flex-col h-full group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg border border-gray-200/60 flex items-center justify-center p-1.5 shadow-sm">
            <img src={logo} alt={`${company} logo`} className="max-w-full max-h-full object-contain" />
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-[15px] leading-tight flex items-center gap-2">
              {company}
              {tags && tags.includes("Eligible") && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span> Eligible
                </span>
              )}
            </h3>
          </div>
        </div>
        <button onClick={() => navigate(`/job/${id}`)} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
      
      <div className="mb-3 flex-1 px-0.5">
        <h4 className="text-gray-800 font-semibold text-[14px] leading-snug">{role}</h4>
        {deadline && (
          <div className="text-[11px] text-amber-700 font-bold bg-amber-50/80 inline-block px-2 py-0.5 rounded mt-1.5 border border-amber-100/50">
            {deadline}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100/80">
        <div className="flex items-center text-[12px] font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded-md border border-gray-200/50">
          <IndianRupee className="w-3 h-3 mr-0.5 text-gray-500" />
          {salary}
        </div>
        <div className="text-[11px] text-gray-400 font-medium">
          {deadline ? 'Apply online now' : 'Apply today'}
        </div>
      </div>
      
      <button 
        onClick={() => navigate(`/job/${id}`)}
        className={`w-full mt-3 font-semibold py-1.5 rounded-lg transition-all text-[13px] shadow-sm flex items-center justify-center ${
          applied 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default' 
            : 'bg-gray-900 hover:bg-gray-800 text-white shadow-[0_2px_4px_-1px_rgba(0,0,0,0.1)]'
        }`}
      >
        {applied ? <><CheckCircle className="w-3.5 h-3.5 mr-1" /> Applied</> : 'View Details'}
      </button>
    </div>
  );
};

export default OpportunityCard;
