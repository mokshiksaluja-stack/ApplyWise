import { useState, useMemo, useEffect } from "react";
import { Clock, CheckCircle, XCircle, ChevronRight, X, User, Building, MapPin, Calendar, FileText, Info, Search, Inbox, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { usePlacementContext } from "../../context/PlacementContext";
import Skeleton from "../../components/UI/Skeleton";
import EmptyState from "../../components/UI/EmptyState";
import { useToast } from "../../context/ToastContext";
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function Applications() {
  const navigate = useNavigate();
  const { myApplications } = usePlacementContext();
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredApplications = useMemo(() => {
    return myApplications.filter((app) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          app.company.toLowerCase().includes(query) ||
          app.role.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery, myApplications]);

  // Status Badge styling helper - Normalized with Admin/Coordinator
  const getStatusConfig = (status) => {
    switch (status) {
      case "Applied": return { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: Clock };
      case "Shortlisted": return { color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", icon: ChevronRight };
      case "Interview Scheduled": return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: Calendar };
      case "Selected": return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: ShieldCheck };
      case "Rejected": return { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", icon: XCircle };
      default: return { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-100", icon: Info };
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
            return (
              <div key={app.id} className="flex flex-col rounded-[40px] border border-gray-50 bg-white p-8 shadow-sm premium-card lg:flex-row lg:items-center lg:justify-between gap-8 animate-in slide-in-from-bottom-4 duration-500 group">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{app.company}</h3>
                    <div className={clsx("flex items-center rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border shadow-sm", config.bg, config.color, config.border)}>
                      <Icon size={12} className="mr-2" />
                      {app.status}
                    </div>
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{app.role}</p>
                  
                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Submission</span>
                       <span className="text-[11px] font-black text-gray-600 flex items-center gap-2 uppercase"><Calendar size={14} className="text-blue-500" /> {app.appliedDate}</span>
                    </div>
                    {(app.interviewDate !== "TBD") && (
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Milestone Date</span>
                          <span className="text-[11px] font-black text-amber-600 flex items-center gap-2 uppercase"><Clock size={14} /> {app.interviewDate} @ {app.reportingTime}</span>
                       </div>
                    )}
                    {app.roomNumber !== "TBD" && (
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Logic/Venue</span>
                          <span className="text-[11px] font-black text-gray-500 flex items-center gap-2 uppercase"><MapPin size={14} className="text-gray-300" /> {app.roomNumber}</span>
                       </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-10 pt-6 border-t border-gray-50 lg:border-0 lg:pt-0">
                    <div className="text-left lg:text-right">
                       <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-1.5">Last Checkpoint</p>
                       <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{app.currentRound}</p>
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
            message="No active application trails found matching your current query parameters." 
            action={{
              label: "Explore Market",
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
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{selectedApp.company}</h2>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{selectedApp.role}</p>
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
                     <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Checkpoint</p>
                     <p className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none">{selectedApp.interviewDate}</p>
                  </div>
                  <div>
                     <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Timing</p>
                     <p className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none">{selectedApp.reportingTime}</p>
                  </div>
                  <div className="col-span-2">
                     <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Logic Node / Venue</p>
                     <p className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-tight">{selectedApp.roomNumber}</p>
                  </div>
               </div>

               {/* Timeline */}
               <div className="mb-14 px-4">
                  <h3 className="mb-10 flex items-center gap-3 text-[11px] font-black text-gray-900 uppercase tracking-widest group">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover:rotate-12">
                       <Clock size={16} />
                    </div>
                    Application Trace Timeline
                  </h3>
                  
                  <div className="relative border-l-4 border-gray-50 ml-4 pl-10 space-y-12">
                      {selectedApp.roundHistory.map((round, idx) => (
                          <div key={idx} className="relative group/item">
                              <div className={clsx(
                                "absolute -left-[54px] top-0 h-8 w-8 rounded-xl border-4 border-white shadow-lg flex items-center justify-center transition-all group-hover/item:scale-110",
                                round.result === 'Cleared' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              )}>
                                {round.result === 'Cleared' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                              </div>
                              <div className="flex flex-col gap-1">
                                <p className="text-base font-black text-gray-900 tracking-tight leading-none uppercase">{round.name}</p>
                                <div className="flex items-center gap-3 mt-2">
                                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{round.date}</span>
                                   <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                   <span className={clsx(
                                     "text-[10px] font-black uppercase tracking-widest",
                                     round.result === 'Cleared' ? 'text-emerald-600' : 'text-rose-500'
                                   )}>{round.result}</span>
                                </div>
                              </div>
                          </div>
                      ))}
                      
                      {selectedApp.status !== "Rejected" && selectedApp.status !== "Selected" && (
                         <div className="relative">
                            <div className="absolute -left-[54px] top-0 h-8 w-8 rounded-xl border-4 border-white bg-blue-600 shadow-lg flex items-center justify-center animate-pulse">
                               <div className="w-2.5 h-2.5 rounded-sm bg-white rotate-45"></div>
                            </div>
                            <div className="flex flex-col gap-1">
                               <p className="text-base font-black text-blue-600 tracking-tight leading-none uppercase">{selectedApp.currentRound}</p>
                               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2">Current Active Logic Node</p>
                            </div>
                         </div>
                      )}
                  </div>
               </div>

               <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[32px] border border-gray-50 p-8 bg-white shadow-sm hover:border-blue-100 transition-all group/box">
                    <h3 className="mb-6 flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm transition-transform group-hover/box:rotate-12">
                         <FileText size={16} />
                      </div>
                      Asset Requirements
                    </h3>
                    <ul className="space-y-3">
                       {selectedApp.documents.length > 0 ? selectedApp.documents.map(doc => (
                          <li key={doc} className="flex items-center gap-3 text-[12px] font-black text-gray-700 uppercase tracking-tight">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {doc}
                          </li>
                       )) : <li className="text-gray-300 italic text-[12px] font-black uppercase tracking-widest">No specific requirements</li>}
                    </ul>
                  </div>

                  <div className="rounded-[32px] border border-amber-100/50 p-8 bg-amber-50/30 group/box">
                    <h3 className="mb-4 flex items-center gap-3 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm transition-transform group-hover/box:rotate-12">
                        <Info size={16} />
                      </div>
                      Mission Guidance
                    </h3>
                    <p className="text-[12px] font-bold text-amber-800 leading-relaxed uppercase tracking-tight">{selectedApp.instructions}</p>
                  </div>
               </div>
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
