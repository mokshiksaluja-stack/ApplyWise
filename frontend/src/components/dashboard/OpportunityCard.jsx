import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertTriangle, XCircle, MapPin, Briefcase, Calendar, Lock } from "lucide-react";

export default function OpportunityCard({
  id = "test-id", // Ensure id is passed down
  company,
  logo,
  role,
  jobType = "Full-time",
  location = "Bangalore, India",
  stipend,
  deadline = "2024-08-30",
  dynamicStatus = "Not Eligible",
  readinessScore = 0,
  matchedCount = 0,
  totalCount = 0,
  missingSkills = [],
  tags = []
}) {
  const navigate = useNavigate();

  let statusStyle = "bg-green-100 text-green-700 border-green-200";
  let StatusIcon = CheckCircle;
  let actionButton = (
    <button onClick={() => navigate(`/student/opportunities/${id}`)} className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
      Apply Now
    </button>
  );

  if (dynamicStatus === "Applied") {
    statusStyle = "bg-emerald-100 text-emerald-800 border-emerald-300";
    StatusIcon = CheckCircle;
    actionButton = (
      <button disabled className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-700 cursor-not-allowed">
        <CheckCircle size={14}/> Applied
      </button>
    );
  } else if (dynamicStatus === "Partially Ready") {
    statusStyle = "bg-yellow-100 text-yellow-700 border-yellow-200";
    StatusIcon = AlertTriangle;
    actionButton = (
      <button onClick={() => navigate(`/student/opportunities/${id}`)} className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
        Review Missing Skills
      </button>
    );
  }

  if (dynamicStatus === "Not Eligible") {
    statusStyle = "bg-red-50 text-red-600 border-red-100";
    StatusIcon = XCircle;
    actionButton = (
      <button disabled className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-100 border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-400 cursor-not-allowed">
        <Lock size={14}/> Locked
      </button>
    );
  }

  return (
    <div className="flex flex-col rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-blue-100 group">
      
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3 items-center">
           <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center p-1.5 shadow-sm">
             {logo ? <img src={logo} alt={company} className="object-contain w-full h-full" /> : <div className="text-gray-400 text-xs font-bold">{company?.slice(0,2).toUpperCase()}</div>}
           </div>
           <div>
              <h3 className="text-[17px] font-bold text-gray-900 leading-tight">{role}</h3>
              <p className="mt-0.5 text-sm font-medium text-gray-500">{company}</p>
           </div>
        </div>
      </div>

      {/* Meta tags */}
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-600">
         <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-0.5"><Briefcase size={12}/> {jobType}</span>
         {location && <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-0.5"><MapPin size={12}/> {location}</span>}
         {stipend && <span className="flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 rounded px-2 py-0.5">{stipend}</span>}
         {tags.includes('Remote') && <span className="flex items-center gap-1 bg-purple-50 border border-purple-100 text-purple-700 rounded px-2 py-0.5">Remote</span>}
         {tags.includes('PPO') && <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded px-2 py-0.5">PPO</span>}
      </div>

      {/* Readiness & Matching Engine Core */}
      <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-100 p-4 flex-1">
        
        <div className="flex justify-between items-end mb-3">
           <div>
             <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${statusStyle} uppercase tracking-wide`}>
                <StatusIcon size={12}/> {dynamicStatus}
             </div>
           </div>
           <div className="text-right">
              <span className="text-2xl font-black text-gray-900 leading-none">{readinessScore}%</span>
              <p className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">Readiness Score</p>
           </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, readinessScore)}%` }}></div>
        </div>
        
        <div className="text-xs">
           <p className="font-semibold text-gray-700 flex justify-between">
              <span>Skills Matched</span> 
              <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">{matchedCount} / {totalCount}</span>
           </p>
           
           {missingSkills.length > 0 && (
             <div className="mt-2.5 pt-2 border-t border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Missing Requirements ({missingSkills.length})</p>
                <div className="flex flex-wrap gap-1">
                  {missingSkills.slice(0, 3).map(skill => (
                     <span key={skill} className="bg-white border border-gray-200 text-gray-600 rounded px-1.5 py-0.5 font-medium shadow-sm">{skill}</span>
                  ))}
                  {missingSkills.length > 3 && <span className="text-gray-400 font-semibold px-1">+ {missingSkills.length - 3}</span>}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between gap-3">
         {actionButton}
         <button onClick={() => navigate(`/student/opportunities/${id}`)} className="flex-[0.6] rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            Details
         </button>
      </div>

    </div>
  );
}