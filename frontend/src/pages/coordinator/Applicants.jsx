import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, ChevronRight, X, Mail, Eye, MoreVertical, Download, Users, UserCheck, UserMinus, AlertCircle } from 'lucide-react';
import { usePlacementContext } from '../../context/PlacementContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../../components/UI/Skeleton';
import EmptyState from '../../components/UI/EmptyState';

export default function Applicants() {
  const { globalApplications, updateApplicationStatus, updateCurrentRound, markAttendance } = usePlacementContext();
  const { addNotification } = useNotifications();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [actionDropdown, setActionDropdown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for premium feel
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Selected': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getAttendanceStyle = (attendance) => {
    switch (attendance) {
      case 'Present': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Absent': return 'text-rose-700 bg-rose-50 border-rose-100';
      default: return 'text-amber-700 bg-amber-50 border-amber-100';
    }
  };

  const handleAction = (app, actionType) => {
    setActionDropdown(null);
    try {
      if (actionType === 'PRESENT') {
        markAttendance(app.id, 'Present');
        showToast(`Attendance marked: Present for ${app.studentName}`, "success");
      } else if (actionType === 'ABSENT') {
        markAttendance(app.id, 'Absent');
        showToast(`${app.studentName} marked as Absent.`, "info");
      } else if (actionType === 'NEXT_ROUND') {
        updateCurrentRound(app.id, `Advanced ${app.currentRound} (Cleared)`, 'Cleared');
        showToast(`${app.studentName} advanced to next round!`, "success");
        addNotification({ 
          title: 'Round Cleared!', 
          message: `You have cleared the ${app.currentRound} for ${app.company}. Good luck!`, 
          type: 'success' 
        });
      } else if (actionType === 'REJECT') {
        updateApplicationStatus(app.id, 'Rejected');
        showToast(`${app.studentName}'s application has been rejected.`, "error");
        addNotification({ 
          title: 'Application Update', 
          message: `Unfortunately your application for ${app.company} has been rejected. Keep trying!`, 
          type: 'update' 
        });
      }
    } catch (err) {
      showToast("Failed to update status. Try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  const filteredApplicants = globalApplications.filter(app => 
    app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Applicants Portal</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Operational control for student status tracking and drive management.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-900/10 hover:bg-blue-600 transition-all active:scale-95">
            <Download size={14} /> Export Manifest
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 premium-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter by name, roll number, or tech stack..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-[18px] text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner placeholder:text-gray-400"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-6 py-3 border-2 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : 'bg-white border-gray-50 text-gray-600 hover:border-gray-200'}`}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 mt-6 border-t border-gray-50 animate-in slide-in-from-top-4 duration-500">
            <select className="bg-gray-50 border-2 border-transparent rounded-xl text-xs font-bold p-3 focus:border-blue-500 outline-none cursor-pointer">
              <option value="">All Companies</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
            </select>
            <select className="bg-gray-50 border-2 border-transparent rounded-xl text-xs font-bold p-3 focus:border-blue-500 outline-none cursor-pointer">
              <option value="">All Roles</option>
            </select>
            <select className="bg-gray-50 border-2 border-transparent rounded-xl text-xs font-bold p-3 focus:border-blue-500 outline-none cursor-pointer">
              <option value="">Status: All</option>
              <option value="In Progress">In Progress</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select className="bg-gray-50 border-2 border-transparent rounded-xl text-xs font-bold p-3 focus:border-blue-500 outline-none cursor-pointer">
              <option value="">Round: All</option>
              <option value="OA">Online Assessment</option>
              <option value="TR1">Technical Round 1</option>
            </select>
            <select className="bg-gray-50 border-2 border-transparent rounded-xl text-xs font-bold p-3 focus:border-blue-500 outline-none cursor-pointer">
              <option value="">Attendance: All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden premium-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
            <thead className="bg-gray-50/50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Student Identity</th>
                <th className="px-8 py-5">Drive Context</th>
                <th className="px-8 py-5">Assessment Analytics</th>
                <th className="px-8 py-5">Process Control</th>
                <th className="px-8 py-5">Attendance Registry</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApplicants.length > 0 ? filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-blue-600/10">
                        {applicant.studentName ? applicant.studentName.charAt(0) : 'S'}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 leading-none">{applicant.studentName}</p>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight mt-1.5">{applicant.rollNo} • {applicant.branch}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-gray-900 leading-tight">{applicant.company}</p>
                    <p className="text-[11px] text-blue-500 font-black uppercase mt-1.5 opacity-60 tracking-wider font-mono">{applicant.role}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] uppercase font-black text-gray-300 w-10">CGPA</span>
                        <span className="font-black text-gray-900">{applicant.cgpa}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] uppercase font-black text-gray-300 w-10">Impact</span>
                        <div className="w-20 bg-gray-100 rounded-full h-1.5 flex overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full shadow-lg ${applicant.skillMatch > 85 ? 'bg-emerald-500' : applicant.skillMatch > 60 ? 'bg-blue-600' : 'bg-amber-500'}`} 
                            style={{ width: `${applicant.skillMatch}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-gray-900">{applicant.skillMatch}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-2">
                       <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest shadow-sm ${getStatusStyle(applicant.status)}`}>
                        {applicant.status}
                      </span>
                      <p className="text-[10px] text-gray-400 font-black uppercase flex items-center gap-2 opacity-60">
                        {applicant.currentRound}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${getAttendanceStyle(applicant.attendance)}`}>
                      {applicant.attendance === 'Present' ? <UserCheck className="w-3.5 h-3.5" /> : applicant.attendance === 'Absent' ? <UserMinus className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {applicant.attendance}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all border border-transparent shadow-sm hover:shadow-md" title="Message Center">
                         <Mail className="w-4.5 h-4.5" />
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all border border-transparent shadow-sm hover:shadow-md" title="Intelligence Report">
                         <Eye className="w-4.5 h-4.5" />
                      </button>

                      <div className="relative">
                        <button 
                          onClick={() => setActionDropdown(actionDropdown === applicant.id ? null : applicant.id)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all focus:outline-none shadow-sm hover:shadow-md border ${actionDropdown === applicant.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-50 hover:border-gray-200'}`}
                        >
                          <MoreVertical className="w-4.5 h-4.5" />
                        </button>
                        
                        {actionDropdown === applicant.id && (
                          <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[24px] overflow-hidden z-[50] animate-in fade-in zoom-in-95 origin-top-right p-1.5">
                            <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              Status Registry
                            </div>
                            <button 
                              onClick={() => handleAction(applicant, 'PRESENT')}
                              className="w-full text-left px-4 py-3 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-3"
                            >
                              <UserCheck size={16} /> Mark Present
                            </button>
                            <button 
                              onClick={() => handleAction(applicant, 'ABSENT')}
                              className="w-full text-left px-4 py-3 text-xs text-gray-700 hover:bg-rose-50 hover:text-rose-700 font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-3 mb-2"
                            >
                              <UserMinus size={16} /> Mark Absent
                            </button>
                            
                            <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 border-t border-gray-50 pt-3">
                              Pipeline Advance
                            </div>
                            <button 
                              onClick={() => handleAction(applicant, 'NEXT_ROUND')}
                              className="w-full text-left px-4 py-3 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-between"
                            >
                              Promote to Round <ChevronRight className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleAction(applicant, 'REJECT')}
                              className="w-full text-left px-4 py-3 text-xs text-rose-600 hover:bg-rose-50 font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-3"
                            >
                              Reject Pipeline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20">
                     <EmptyState 
                        icon={Users}
                        title="No Applicants Matched"
                        message="Broaden your search criteria or reset filters to see other applicants."
                        action={{ label: "Reset View", onClick: () => { setSearchTerm(""); setShowFilters(false); } }}
                     />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
           <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
             <AlertCircle size={14} className="text-blue-500" />
             Aggregating {filteredApplicants.length} applicants in this view
           </span>
           <div className="flex gap-2">
             <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-100 bg-white text-gray-300 cursor-not-allowed">Previous</button>
             <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
