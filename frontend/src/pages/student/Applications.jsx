import { useState, useMemo, useEffect } from "react";
import { Clock, CheckCircle, XCircle, ChevronRight, X, User, Building, MapPin, Calendar, FileText, Info, Search, Inbox, ArrowRight, ShieldCheck, Zap, Loader2, AlertCircle } from "lucide-react";
import { fetchStudentApplications } from "../../services/api";
import Skeleton from "../../components/UI/Skeleton";
import EmptyState from "../../components/UI/EmptyState";
import { useToast } from "../../context/ToastContext";
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

// ── Helpers ──────────────────────────────────────────────────────────────────
const resolveCompany = (app) => {
  if (app.jobId && typeof app.jobId === 'object') return app.jobId.company || app.company;
  return app.company || '—';
};

const resolveRole = (app) => {
  if (app.jobId && typeof app.jobId === 'object') return app.jobId.role || app.role;
  return app.role || '—';
};

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Fetch real student applications from backend
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const studentId = localStorage.getItem('studentId') || localStorage.getItem('userId');
        // Guard against missing or literal "null" string stored during stale sessions
        if (!studentId || studentId === 'null' || studentId === 'undefined') {
          setLoading(false);
          return;
        }
        const { data } = await fetchStudentApplications(studentId);
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load student applications:', err);
        // Do NOT show toast for empty states — just silently show empty list
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const company = resolveCompany(app).toLowerCase();
        const role = resolveRole(app).toLowerCase();
        return company.includes(query) || role.includes(query);
      }
      return true;
    });
  }, [searchQuery, applications]);

  // Status Badge styling helper
  const getStatusConfig = (status) => {
    if (status?.includes('Cleared')) return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: CheckCircle };
    switch (status) {
      case "Applied": return { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: Clock };
      case "Shortlisted": return { color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", icon: ShieldCheck };
      case "Interview Scheduled": return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: Calendar };
      case "In Progress": return { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: ChevronRight };
      case "Selected": return { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: ShieldCheck };
      case "Rejected": return { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", icon: XCircle };
      case "Absent": return { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100", icon: AlertCircle };
      default: return { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-100", icon: Info };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in duration-700 pb-20">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Application Ledger</h1>
        <p className="mt-3 text-gray-400 font-bold text-lg uppercase tracking-tight">
          Verifying your career transitions in real-time.
        </p>
      </div>

      <div className="mb-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[24px] border-2 border-gray-50 bg-gray-50 py-4.5 pl-14 pr-6 text-sm font-black focus:border-blue-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-300 shadow-inner"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <Zap size={16} className="text-amber-500" />
            <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{filteredApplications.length} Entries</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-[32px]" />)
        ) : filteredApplications.length > 0 ? (
          filteredApplications.map((app) => {
            const config = getStatusConfig(app.status);
            const Icon = config.icon;
            const company = resolveCompany(app);
            const role = resolveRole(app);
            const interviewDate = app.interviewDate;
            const reportingTime = app.reportingTime;
            const venue = app.venue;
            const hasSchedule = interviewDate && app.status === 'Interview Scheduled';

            return (
              <div key={app._id || app.id} className="flex flex-col rounded-[40px] border border-gray-50 bg-white p-8 shadow-sm premium-card lg:flex-row lg:items-center lg:justify-between gap-8 animate-in slide-in-from-bottom-4 duration-500 group">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{company}</h3>
                    <div className={clsx("flex items-center rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border shadow-sm", config.bg, config.color, config.border)}>
                      <Icon size={12} className="mr-2" />
                      {app.status}
                    </div>
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{role}</p>

                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Submission</span>
                      <span className="text-[11px] font-black text-gray-600 flex items-center gap-2 uppercase">
                        <Calendar size={14} className="text-blue-500" /> {formatDate(app.createdAt)}
                      </span>
                    </div>

                    {hasSchedule && (
                      <>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Interview Date</span>
                          <span className="text-[11px] font-black text-amber-600 flex items-center gap-2 uppercase">
                            <Clock size={14} /> {formatDate(interviewDate)} @ {reportingTime || 'TBD'}
                          </span>
                        </div>
                        {venue && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Venue</span>
                            <span className="text-[11px] font-black text-gray-500 flex items-center gap-2 uppercase">
                              <MapPin size={14} className="text-gray-300" /> {venue}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Coordinator notes banner */}
                  {app.coordinatorNotes && (
                    <div className="mt-6 rounded-2xl border border-amber-100/50 bg-amber-50/30 px-5 py-3">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Coordinator Note</p>
                      <p className="text-[12px] font-bold text-amber-800 leading-relaxed">{app.coordinatorNotes}</p>
                    </div>
                  )}
                </div>

                  <div className="flex items-center justify-between lg:justify-end gap-10 pt-6 border-t border-gray-50 lg:border-0 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Last Checkpoint</p>
                    <div className="flex flex-col lg:items-end gap-1">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{app.currentRound}</p>
                      {app.roundResult === 'Cleared' && (
                        <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase w-fit">
                           <CheckCircle size={12} /> Cleared
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="rounded-2xl bg-gray-900 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-blue-600 shadow-xl shadow-gray-900/10 active:scale-95 flex items-center gap-2 group-hover:px-10"
                  >
                    Audit Trace <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            icon={Inbox}
            title="Registry Void"
            message="No active application trails found. Apply to opportunities to see your progress here."
            action={{
              label: "Explore Opportunities",
              onClick: () => navigate("/student/opportunities")
            }}
            secondaryAction={{
              label: "Clear Filter",
              onClick: () => setSearchQuery("")
            }}
          />
        )}
      </div>

      {/* Trace Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[48px] bg-white shadow-[0_32px_128px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500 flex flex-col">

            <div className="flex items-center justify-between border-b border-gray-50 bg-white/50 px-10 py-8 backdrop-blur-sm">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{resolveCompany(selectedApp)}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{resolveRole(selectedApp)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="group w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-90"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
              {/* Metadata Stripe */}
              <div className="mb-12 grid grid-cols-2 gap-4 rounded-[32px] border border-gray-50 bg-gray-50/50 p-7 sm:grid-cols-4 shadow-inner">
                <div>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Interview Date</p>
                  <p className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none">{formatDate(selectedApp.interviewDate) || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Timing</p>
                  <p className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none">{selectedApp.reportingTime || 'TBD'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Venue</p>
                  <p className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-tight">{selectedApp.venue || 'TBD'}</p>
                </div>
              </div>

              {/* Status Info */}
              <div className="mb-10 grid grid-cols-2 gap-4">
                <div className="rounded-[24px] border border-gray-50 p-6 bg-white">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">Status</p>
                  <div className={clsx("inline-flex items-center rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border shadow-sm", getStatusConfig(selectedApp.status).bg, getStatusConfig(selectedApp.status).color, getStatusConfig(selectedApp.status).border)}>
                    {selectedApp.status}
                  </div>
                </div>
                <div className="rounded-[24px] border border-gray-50 p-6 bg-white">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">Current Round</p>
                  <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{selectedApp.currentRound}</p>
                </div>
              </div>

              {/* Coordinator Notes */}
              {selectedApp.coordinatorNotes && (
                <div className="mb-10 rounded-[32px] border border-amber-100/50 p-8 bg-amber-50/30">
                  <h3 className="mb-4 flex items-center gap-3 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                      <Info size={16} />
                    </div>
                    Coordinator Notes
                  </h3>
                  <p className="text-[12px] font-bold text-amber-800 leading-relaxed">{selectedApp.coordinatorNotes}</p>
                </div>
              )}

              {/* Attendance */}
              {selectedApp.attendance && selectedApp.attendance !== 'Pending' && (
                <div className="mb-10 rounded-[24px] border border-gray-50 p-6 bg-white">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">Attendance</p>
                  <span className={clsx(
                    "inline-flex items-center rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border shadow-sm",
                    selectedApp.attendance === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  )}>
                    {selectedApp.attendance === 'Present' ? <CheckCircle size={12} className="mr-2" /> : <XCircle size={12} className="mr-2" />}
                    {selectedApp.attendance}
                  </span>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-gray-50 bg-gray-50/20 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-10 py-4 bg-gray-900 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-gray-900/10 hover:bg-blue-600 transition-all active:scale-95"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
