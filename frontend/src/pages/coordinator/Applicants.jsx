import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, CheckCircle, XCircle, ChevronRight, Mail, Eye, MoreVertical, Download, Users, UserCheck, UserMinus, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useAdminCoordinatorContext } from '../../context/AdminCoordinatorContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import { fetchCoordinatorApplicationsApi, updateAppStatusApi, markAttendanceApi, advanceRoundApi } from '../../services/api';
import Skeleton from '../../components/UI/Skeleton';
import EmptyState from '../../components/UI/EmptyState';

// ── Helpers ─────────────────────────────────────────────────────────────────
const resolveStudentName = (app) => {
  if (app.studentId && typeof app.studentId === 'object') {
    return app.studentId.fullName || app.studentId.name || 'Unknown';
  }
  return app.studentName || 'Unknown';
};

const resolveStudentField = (app, field) => {
  if (app.studentId && typeof app.studentId === 'object') {
    return app.studentId[field] || '—';
  }
  return app[field] || '—';
};

const resolveCompany = (app) => {
  if (app.jobId && typeof app.jobId === 'object') return app.jobId.company || app.company;
  return app.company || '—';
};

const resolveRole = (app) => {
  if (app.jobId && typeof app.jobId === 'object') return app.jobId.role || app.role;
  return app.role || '—';
};

export default function Applicants() {
  const { currentCoordinatorId } = useAdminCoordinatorContext();
  const { addNotification } = useNotifications();
  const { showToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [actionDropdown, setActionDropdown] = useState(null);

  // Filter state
  const [filterCompany, setFilterCompany] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRound, setFilterRound] = useState("");

  const loadApplications = useCallback(async () => {
    if (!currentCoordinatorId) return;
    try {
      const { data } = await fetchCoordinatorApplicationsApi(currentCoordinatorId);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load coordinator applications", err);
      showToast("Failed to load applicants. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  }, [currentCoordinatorId, showToast]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // ── Derived filter options ──────────────────────────────────────────────
  const uniqueCompanies = useMemo(() => [...new Set(applications.map(resolveCompany))], [applications]);
  const uniqueRoles = useMemo(() => [...new Set(applications.map(resolveRole))], [applications]);
  const uniqueStatuses = useMemo(() => [...new Set(applications.map(a => a.status))], [applications]);
  const uniqueRounds = useMemo(() => [...new Set(applications.map(a => a.currentRound))], [applications]);

  // ── Filtering ───────────────────────────────────────────────────────────
  const filteredApplicants = useMemo(() => {
    return applications.filter(app => {
      const name = resolveStudentName(app).toLowerCase();
      const rollNo = resolveStudentField(app, 'enrollmentNumber').toLowerCase();
      if (searchTerm && !name.includes(searchTerm.toLowerCase()) && !rollNo.includes(searchTerm.toLowerCase())) return false;
      if (filterCompany && resolveCompany(app) !== filterCompany) return false;
      if (filterRole && resolveRole(app) !== filterRole) return false;
      if (filterStatus && app.status !== filterStatus) return false;
      if (filterRound && app.currentRound !== filterRound) return false;
      return true;
    });
  }, [applications, searchTerm, filterCompany, filterRole, filterStatus, filterRound]);

  // ── Status styles ───────────────────────────────────────────────────────
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Selected': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Applied': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Interview Scheduled': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Absent': return 'bg-amber-50 text-amber-700 border-amber-200';
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

  // ── Actions ─────────────────────────────────────────────────────────────
  const handleAction = async (applicant, actionType) => {
    setActionDropdown(null);
    const appId = applicant._id || applicant.id;
    const studentName = resolveStudentName(applicant);
    const company = resolveCompany(applicant);

    // Guard: Prevent actions if application is in a terminal state
    if (['Rejected', 'Absent'].includes(applicant.status) && ['NEXT_ROUND', 'SELECT', 'SHORTLIST'].includes(actionType)) {
      showToast(`Cannot proceed: Applicant is currently ${applicant.status}`, "warning");
      return;
    }

    try {
      if (actionType === 'PRESENT') {
        await markAttendanceApi(appId, 'Present');
        showToast(`${studentName} marked as Present.`, "success");
      } else if (actionType === 'ABSENT') {
        await markAttendanceApi(appId, 'Absent');
        showToast(`${studentName} marked as Absent.`, "error");
      } else if (actionType === 'NEXT_ROUND') {
        const roundNum = applicant.currentRound?.match(/\d+/) ? parseInt(applicant.currentRound.match(/\d+/)[0]) : 0;
        const nextRound = `Round ${roundNum + 1}`;
        await advanceRoundApi(appId, { nextRound, previousRoundResult: 'Cleared' });
        showToast(`${studentName} promoted to ${nextRound}.`, "success");
      } else if (actionType === 'SHORTLIST') {
        await updateAppStatusApi(appId, { status: 'Shortlisted' });
        showToast(`${studentName} shortlisted for ${company}.`, "success");
      } else if (actionType === 'SELECT') {
        await updateAppStatusApi(appId, { status: 'Selected' });
        showToast(`Final Selection Confirmed: ${studentName}`, "success");
      } else if (actionType === 'REJECT') {
        await updateAppStatusApi(appId, { status: 'Rejected' });
        showToast(`${studentName}'s application has been rejected.`, "error");
      }
    } catch (err) {
      showToast("Failed to update status. Try again.", "error");
    }
  };

  // ── Loading state ───────────────────────────────────────────────────────
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

  // ── Render ──────────────────────────────────────────────────────────────
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
              placeholder="Filter by name, roll number..." 
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-6 border-t border-gray-50 animate-in slide-in-from-top-4 duration-500">
            <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-xl text-xs font-bold p-3 focus:border-blue-500 outline-none cursor-pointer">
              <option value="">All Companies</option>
              {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-xl text-xs font-bold p-3 focus:border-blue-500 outline-none cursor-pointer">
              <option value="">All Roles</option>
              {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-xl text-xs font-bold p-3 focus:border-blue-500 outline-none cursor-pointer">
              <option value="">Status: All</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterRound} onChange={e => setFilterRound(e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-xl text-xs font-bold p-3 focus:border-blue-500 outline-none cursor-pointer">
              <option value="">Round: All</option>
              {uniqueRounds.map(r => <option key={r} value={r}>{r}</option>)}
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
              {filteredApplicants.length > 0 ? filteredApplicants.map((applicant) => {
                const studentName = resolveStudentName(applicant);
                const rollNo = resolveStudentField(applicant, 'enrollmentNumber');
                const branch = resolveStudentField(applicant, 'branch');
                const cgpa = resolveStudentField(applicant, 'cgpa');
                const company = resolveCompany(applicant);
                const role = resolveRole(applicant);
                const appId = applicant._id || applicant.id;

                return (
                <tr key={appId} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-blue-600/10">
                        {studentName ? studentName.charAt(0) : 'S'}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 leading-none">{studentName}</p>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight mt-1.5">{rollNo} • {branch}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-gray-900 leading-tight">{company}</p>
                    <p className="text-[11px] text-blue-500 font-black uppercase mt-1.5 opacity-60 tracking-wider font-mono">{role}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] uppercase font-black text-gray-300 w-10">CGPA</span>
                        <span className="font-black text-gray-900">{cgpa}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] uppercase font-black text-gray-300 w-10">Match</span>
                        <div className="w-20 bg-gray-100 rounded-full h-1.5 flex overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full shadow-lg ${cgpa >= 8 ? 'bg-emerald-500' : cgpa >= 6.5 ? 'bg-blue-600' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(Number(cgpa) * 10, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-gray-900">{cgpa !== '—' ? `${Math.round(Number(cgpa) * 10)}%` : '—'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-2">
                       <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest shadow-sm ${getStatusStyle(applicant.status)}`}>
                        {applicant.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-gray-400 font-black uppercase flex items-center gap-2 opacity-60">
                          {applicant.currentRound}
                        </p>
                        {applicant.roundResult === 'Cleared' && (
                          <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase">
                             <CheckCircle size={10} /> Cleared
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${getAttendanceStyle(applicant.attendance)}`}>
                      {applicant.attendance === 'Present' ? <UserCheck className="w-3.5 h-3.5" /> : applicant.attendance === 'Absent' ? <UserMinus className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {applicant.attendance || 'Pending'}
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
                          onClick={() => setActionDropdown(actionDropdown === appId ? null : appId)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all focus:outline-none shadow-sm hover:shadow-md border ${actionDropdown === appId ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-50 hover:border-gray-200'}`}
                        >
                          <MoreVertical className="w-4.5 h-4.5" />
                        </button>
                        
                        {actionDropdown === appId && (
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
                              disabled={['Rejected', 'Selected', 'Absent'].includes(applicant.status)}
                              onClick={() => handleAction(applicant, 'NEXT_ROUND')}
                              className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-between ${['Rejected', 'Selected', 'Absent'].includes(applicant.status) ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                            >
                              Promote to {applicant.currentRound?.match(/\d+/) ? `Round ${parseInt(applicant.currentRound.match(/\d+/)[0]) + 1}` : 'Next Round'}
                              {!['Rejected', 'Selected', 'Absent'].includes(applicant.status) && <ChevronRight className="w-4 h-4" />}
                            </button>
                            <button 
                              disabled={!['Applied', 'Shortlisted', 'Interview Scheduled'].includes(applicant.status)}
                              onClick={() => handleAction(applicant, 'SHORTLIST')}
                              className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-3 ${!['Applied', 'Shortlisted', 'Interview Scheduled'].includes(applicant.status) ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'}`}
                            >
                              <ShieldCheck size={16} /> Shortlist Pipeline
                            </button>
                            <button 
                              disabled={!['In Progress', 'Interview Scheduled'].includes(applicant.status)}
                              onClick={() => handleAction(applicant, 'SELECT')}
                              className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-3 ${!['In Progress', 'Interview Scheduled'].includes(applicant.status) ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                            >
                              <CheckCircle size={16} /> Final Selection
                            </button>
                            <button 
                              disabled={['Rejected', 'Selected'].includes(applicant.status)}
                              onClick={() => handleAction(applicant, 'REJECT')}
                              className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-3 ${applicant.status === 'Rejected' ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-rose-600 hover:bg-rose-50'}`}
                            >
                              <XCircle size={16} /> Reject Pipeline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20">
                     <EmptyState 
                        icon={Users}
                        title="No Applicants Found"
                        message="No students have applied to your assigned opportunities yet, or no results match your filters."
                        action={{ label: "Reset Filters", onClick: () => { setSearchTerm(""); setFilterCompany(""); setFilterRole(""); setFilterStatus(""); setFilterRound(""); setShowFilters(false); } }}
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
             Aggregating {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''} in this view
           </span>
        </div>
      </div>
    </div>
  );
}
