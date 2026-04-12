import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { 
  Users, Activity, TrendingUp, AlertCircle, ChevronRight, 
  Calendar, CheckCircle, Clock, Search, Filter,
  ArrowUpRight, ArrowDownRight, Award, Zap, BarChart3, ShieldCheck
} from 'lucide-react';
import { fetchCoordinatorMonitoring } from '../../services/api';
import Skeleton from '../../components/UI/Skeleton';
import clsx from 'clsx';

const CoordinatorMonitor = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    leaderboard: [],
    fullMetrics: [],
    activityFeed: [],
    config: {}
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchCoordinatorMonitoring();
        if (response.data.success) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Failed to load monitoring data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const topPerformers = data.fullMetrics.filter(m => m.tier === 'Top Performer').length;
  const needsAttention = data.fullMetrics.filter(m => m.tier === 'Needs Attention').length;

  const stats = [
    { title: 'Registered Team', value: data.fullMetrics.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100/50' },
    { title: 'Elite Performers', value: topPerformers, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100/50' },
    { title: 'Critical Watch', value: needsAttention, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100/50' },
    { title: 'Window Tracking', value: `${data.config.windowDays || 7}d`, icon: Clock, color: 'text-slate-600', bg: 'bg-slate-50/50', border: 'border-slate-100/50' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <Skeleton className="lg:col-span-2 h-[500px]" />
            <Skeleton className="lg:col-span-1 h-[500px]" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
               Coordinator Intelligence
               <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-200">System Live</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg mt-1">Operational audit and team impact analytics for placement drives.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white border border-gray-100 rounded-2xl px-5 py-2 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Since: 12:00 AM</span>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className={clsx("p-6 rounded-[32px] border shadow-sm flex items-center justify-between group hover:shadow-lg transition-all active:scale-95", stat.bg, stat.border)}>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-white/50 group-hover:scale-110 transition-transform">
                <stat.icon className={clsx("w-7 h-7", stat.color)} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Leaderboard Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden h-full premium-card">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Impact Leaderboard</h3>
                  <p className="text-sm text-gray-400 font-medium mt-1">Most effective coordinators in the last {data.config.windowDays || 7} days</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                   <Award className="text-amber-500 w-6 h-6" />
                </div>
              </div>
              
              <div className="p-8">
                {data.leaderboard.length > 0 ? (
                  <div className="space-y-4">
                    {data.leaderboard.map((coord, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 bg-gray-50/30 rounded-3xl hover:bg-white border-2 border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-600/5 transition-all group cursor-pointer">
                        <div className="flex items-center gap-5">
                          <div className={clsx(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm border",
                            idx === 0 ? "bg-amber-500 text-white border-amber-400" : 
                            idx === 1 ? "bg-slate-400 text-white border-slate-300" :
                            idx === 2 ? "bg-orange-400 text-white border-orange-300" : "bg-white text-gray-400 border-gray-100"
                          )}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-base font-black text-gray-900 leading-tight">{coord.name}</p>
                            <p className="text-xs text-gray-400 font-bold tracking-tight mt-0.5">{coord.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-10">
                          <div className="hidden sm:block text-right">
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">Total Score</p>
                            <p className="text-lg font-black text-gray-900 leading-none">{coord.stats.totalActions}</p>
                          </div>
                          <div className={clsx(
                            "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                            coord.tier === 'Top Performer' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            coord.tier === 'Needs Attention' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
                          )}>
                            {coord.tier}
                          </div>
                          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors">
                             <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                    <Activity className="w-16 h-16 text-gray-300 mb-6 animate-pulse" />
                    <p className="text-lg font-black text-gray-400 uppercase tracking-widest">No Activity Data Detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm h-full flex flex-col overflow-hidden premium-card">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Audit Stream</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                   <Activity className="text-blue-500 w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[600px] p-8 space-y-8 scrollbar-hide">
                {data.activityFeed.length > 0 ? (
                  <div className="space-y-8">
                    {data.activityFeed.map((log, idx) => (
                      <div key={idx} className="flex gap-5 relative group">
                        {idx !== data.activityFeed.length - 1 && (
                          <div className="absolute left-[13px] top-10 w-0.5 h-[calc(100%+8px)] bg-gray-50 group-hover:bg-blue-100 transition-colors"></div>
                        )}
                        <div className="w-7 h-7 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center shrink-0 z-10 transition-all group-hover:border-blue-500 group-hover:bg-blue-50">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600"></div>
                        </div>
                        <div className="transition-all group-hover:translate-x-1">
                          <p className="text-xs font-black text-gray-900 flex items-center gap-2">
                            {log.coordinatorId?.email?.split('@')[0]}
                            <span className="px-1.5 py-0.5 bg-gray-100 text-[8px] font-black uppercase text-gray-500 rounded border border-gray-200">{log.actionType}</span>
                          </p>
                          <p className="text-[12px] text-gray-500 mt-1.5 font-medium leading-relaxed">{log.details}</p>
                          <p className="text-[9px] font-black text-blue-400 uppercase mt-2.5 flex items-center gap-1.5 opacity-60">
                            <Clock size={10} strokeWidth={3} /> {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 grayscale opacity-30">
                    <Clock className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-loose text-center">Audit Stream<br/>Silent</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mb-12 premium-card">
          <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Operational Granularity</h3>
              <p className="text-sm text-gray-400 font-medium mt-1">Deep-dive into individual performance metrics</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Filter team members..." 
                  className="w-full pl-11 pr-5 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:outline-none rounded-2xl text-xs font-bold transition-all placeholder:text-gray-400 shadow-inner"
                />
              </div>
              <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                <Filter className="w-5 h-5 border-2 border-transparent" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto p-4 pt-0">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Executioner</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Interviews</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Attendance</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Drives</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Velocity</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Recent (7d)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Standing</th>
                </tr>
              </thead>
              <tbody className="">
                {data.fullMetrics.length > 0 ? data.fullMetrics.map((row, idx) => (
                  <tr key={idx} className="group bg-gray-50/50 hover:bg-white transition-all hover:shadow-xl hover:shadow-blue-600/5 hover:-translate-y-0.5">
                    <td className="px-6 py-5 first:rounded-l-[24px]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-900 to-slate-800 flex items-center justify-center text-white font-black text-xs uppercase shadow-lg shadow-gray-900/10">
                          {row.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none">{row.name}</p>
                          <p className="text-[9px] text-blue-500 mt-1.5 uppercase font-black tracking-widest opacity-60 flex items-center gap-1.5">
                             <ShieldCheck size={10} /> Certified
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-gray-700">{row.stats.interviewsScheduled}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-gray-700">{row.stats.attendanceUpdates}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-gray-700">{row.stats.jobsManaged}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-gray-900">{row.stats.totalActions}</span>
                        <div className="w-14 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-blue-600 rounded-full shadow-lg" 
                            style={{ width: `${Math.min(row.stats.totalActions * 1.5, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <Zap size={14} className={clsx(row.recentActivityCount > 0 ? "text-amber-500 animate-pulse" : "text-gray-200")} />
                        <span className="text-sm font-black text-gray-900">{row.recentActivityCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right last:rounded-r-[24px]">
                      <div className="flex flex-col items-end">
                        <span className={clsx(
                          "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                          row.tier === 'Top Performer' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          row.tier === 'Needs Attention' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {row.tier}
                        </span>
                        <p className="text-[9px] text-gray-400 mt-2 font-black uppercase tracking-widest opacity-60">Active: {new Date(row.lastActive).toLocaleDateString()}</p>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center opacity-30">
                       <BarChart3 className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                       <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Operational Data Stream Empty</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoordinatorMonitor;
