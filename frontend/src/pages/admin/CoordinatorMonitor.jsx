import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import {
  Users, Activity, TrendingUp, AlertCircle, ChevronRight,
  Calendar, CheckCircle, Clock, Search, Filter,
  Award, Zap, BarChart3, ShieldCheck, Star, X,
  ThumbsUp, CheckSquare, XSquare, RefreshCw
} from 'lucide-react';
import {
  fetchCoordinatorMonitoring,
  fetchCoordinatorList,
  fetchAllPerformanceApi,
  markCoordinatorAttendanceApi,
  assignCoordinatorBadgeApi
} from '../../services/api';
import Skeleton from '../../components/UI/Skeleton';
import clsx from 'clsx';

// ── Badge config ──────────────────────────────────────────────────────────────
const BADGES = [
  { label: 'Excellent', icon: '🌟', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', points: 10 },
  { label: 'Good',      icon: '👍', color: 'bg-blue-50 text-blue-700 border-blue-200',          points: 5  },
  { label: 'Needs Attention', icon: '⚠️', color: 'bg-rose-50 text-rose-700 border-rose-200',   points: 0  },
];

const badgeStyle = (badge) => {
  const b = BADGES.find(b => b.label === badge);
  return b ? b.color : 'bg-gray-100 text-gray-500 border-gray-200';
};

const today = () => new Date().toISOString().split('T')[0];

// ── Main Component ───────────────────────────────────────────────────────────
const CoordinatorMonitor = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [monitorData, setMonitorData] = useState({ leaderboard: [], fullMetrics: [], activityFeed: [], config: {} });
  const [coordinators, setCoordinators] = useState([]);     // [{id, name, email}]
  const [perfMap, setPerfMap] = useState({});               // { coordinatorId: performanceRecord }

  // Modal state
  const [modal, setModal] = useState(null); // { type: 'attendance'|'badge', coordinatorId, name }
  const [attendDate, setAttendDate] = useState(today());
  const [attendPresent, setAttendPresent] = useState(true);
  const [attendNote, setAttendNote] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [search, setSearch] = useState('');

  // ── Load all data ──────────────────────────────────────────────────────────
  const loadAll = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    try {
      const [monitorRes, coordRes, perfRes] = await Promise.all([
        fetchCoordinatorMonitoring(),
        fetchCoordinatorList(),
        fetchAllPerformanceApi(),
      ]);

      if (monitorRes.data.success) setMonitorData(monitorRes.data);
      if (Array.isArray(coordRes.data)) setCoordinators(coordRes.data);

      // Build perfMap keyed by coordinatorId string
      if (Array.isArray(perfRes.data)) {
        const map = {};
        perfRes.data.forEach(p => {
          const cid = p.coordinatorId?._id || p.coordinatorId;
          map[String(cid)] = p;
        });
        setPerfMap(map);
      }
    } catch (err) {
      console.error('Failed to load monitor data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Open modals ────────────────────────────────────────────────────────────
  const openAttendance = (coord) => {
    setAttendDate(today());
    setAttendPresent(true);
    setAttendNote('');
    setSaveMsg('');
    setModal({ type: 'attendance', coordinatorId: coord.id, name: coord.name });
  };

  const openBadge = (coord) => {
    const existing = perfMap[coord.id];
    setSelectedBadge(existing?.badge || '');
    setAdminNote(existing?.adminNote || '');
    setSaveMsg('');
    setModal({ type: 'badge', coordinatorId: coord.id, name: coord.name });
  };

  const closeModal = () => { setModal(null); setSaveMsg(''); };

  // ── Save handlers ──────────────────────────────────────────────────────────
  const saveAttendance = async () => {
    if (!attendDate) return;
    setSaving(true); setSaveMsg('');
    try {
      const { data } = await markCoordinatorAttendanceApi(modal.coordinatorId, attendDate, attendPresent, attendNote);
      setPerfMap(prev => ({ ...prev, [modal.coordinatorId]: data }));
      setSaveMsg(`✓ Marked ${attendPresent ? 'Present' : 'Absent'} for ${attendDate}`);
    } catch (err) {
      setSaveMsg('❌ ' + (err.response?.data?.error || 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  const saveBadge = async () => {
    if (!selectedBadge) return;
    setSaving(true); setSaveMsg('');
    try {
      const { data } = await assignCoordinatorBadgeApi(modal.coordinatorId, selectedBadge, adminNote);
      setPerfMap(prev => ({ ...prev, [modal.coordinatorId]: data }));
      const pts = BADGES.find(b => b.label === selectedBadge)?.points || 0;
      setSaveMsg(`✓ Badge "${selectedBadge}" saved. +${pts} pts → Total: ${data.score}`);
    } catch (err) {
      setSaveMsg('❌ ' + (err.response?.data?.error || 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const topPerformers = monitorData.fullMetrics.filter(m => m.tier === 'Top Performer').length;
  const needsAttention = monitorData.fullMetrics.filter(m => m.tier === 'Needs Attention').length;

  const stats = [
    { title: 'Registered Team',  value: monitorData.fullMetrics.length, icon: Users,       color: 'text-blue-600',    bg: 'bg-blue-50/50',    border: 'border-blue-100/50' },
    { title: 'Elite Performers', value: topPerformers,                   icon: Award,       color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100/50' },
    { title: 'Critical Watch',   value: needsAttention,                  icon: AlertCircle, color: 'text-rose-600',    bg: 'bg-rose-50/50',    border: 'border-rose-100/50' },
    { title: 'Window Tracking',  value: `${monitorData.config.windowDays || 7}d`, icon: Clock, color: 'text-slate-600', bg: 'bg-slate-50/50', border: 'border-slate-100/50' },
  ];

  const filteredCoords = coordinators.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
          <div className="mb-8 flex flex-col gap-2"><Skeleton className="h-8 w-64" /><Skeleton className="h-4 w-96" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-96 mb-10" />
          <Skeleton className="h-64" />
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
            <p className="text-gray-500 font-medium text-lg mt-1">Operational audit, attendance tracking, and performance badges.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadAll(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-50 shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw className={clsx('w-4 h-4', refreshing && 'animate-spin')} />
              Refresh
            </button>
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-2 shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className={clsx('p-6 rounded-[32px] border shadow-sm flex items-center justify-between group hover:shadow-lg transition-all', stat.bg, stat.border)}>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-white/50 group-hover:scale-110 transition-transform">
                <stat.icon className={clsx('w-7 h-7', stat.color)} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Attendance & Badge Management ─────────────────────────────── */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" /> Performance Management
              </h3>
              <p className="text-sm text-gray-400 font-medium mt-1">Mark attendance and assign performance badges. Score increases on each badge assignment.</p>
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search coordinators..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-5 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none rounded-2xl text-xs font-bold transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto p-4 pt-0">
            {filteredCoords.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-black uppercase tracking-widest text-sm">No coordinators found</p>
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Coordinator</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Badge</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Score</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Present</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Absent</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Attendance</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoords.map(coord => {
                    const perf = perfMap[coord.id] || {};
                    return (
                      <tr key={coord.id} className="group bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-600/5 hover:-translate-y-0.5 transition-all">
                        <td className="px-6 py-5 first:rounded-l-[24px]">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-black text-xs shadow-lg">
                              {(coord.name || coord.email || '?').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-900 leading-none">{coord.name || coord.email?.split('@')[0]}</p>
                              <p className="text-[10px] text-gray-400 mt-1 font-bold">{coord.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          {perf.badge ? (
                            <span className={clsx('px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border', badgeStyle(perf.badge))}>
                              {BADGES.find(b => b.label === perf.badge)?.icon} {perf.badge}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300 font-bold">—</span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-lg font-black text-gray-900">{perf.score ?? 0}</span>
                          <span className="text-[10px] text-gray-400 font-bold ml-1">pts</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-sm font-black text-emerald-600">{perf.totalPresent ?? 0}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-sm font-black text-rose-500">{perf.totalAbsent ?? 0}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => openAttendance(coord)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                          >
                            <Calendar className="w-3.5 h-3.5" /> Mark
                          </button>
                        </td>
                        <td className="px-6 py-5 text-right last:rounded-r-[24px]">
                          <button
                            onClick={() => openBadge(coord)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-amber-500/20"
                          >
                            <Award className="w-3.5 h-3.5" /> Badge
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Leaderboard + Activity Feed ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden h-full">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Impact Leaderboard</h3>
                  <p className="text-sm text-gray-400 font-medium mt-1">Top coordinators in the last {monitorData.config.windowDays || 7} days</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100"><Award className="text-amber-500 w-6 h-6" /></div>
              </div>
              <div className="p-8">
                {monitorData.leaderboard.length > 0 ? (
                  <div className="space-y-4">
                    {monitorData.leaderboard.map((coord, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 bg-gray-50/30 rounded-3xl hover:bg-white border-2 border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-600/5 transition-all group cursor-pointer">
                        <div className="flex items-center gap-5">
                          <div className={clsx(
                            'w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm border',
                            idx === 0 ? 'bg-amber-500 text-white border-amber-400' :
                            idx === 1 ? 'bg-slate-400 text-white border-slate-300' :
                            idx === 2 ? 'bg-orange-400 text-white border-orange-300' : 'bg-white text-gray-400 border-gray-100'
                          )}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-base font-black text-gray-900 leading-tight">{coord.name}</p>
                            <p className="text-xs text-gray-400 font-bold tracking-tight mt-0.5">{coord.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          {/* Show performance badge from perfMap */}
                          {(() => {
                            const cid = Object.keys(perfMap).find(k => {
                              const p = perfMap[k];
                              return (p.coordinatorId?.email === coord.email || p.coordinatorId?.name === coord.name);
                            });
                            const perf = cid ? perfMap[cid] : null;
                            return perf?.badge ? (
                              <span className={clsx('px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border', badgeStyle(perf.badge))}>
                                {perf.badge}
                              </span>
                            ) : null;
                          })()}
                          <div className="hidden sm:block text-right">
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">Score</p>
                            <p className="text-lg font-black text-gray-900 leading-none">{coord.stats.totalActions}</p>
                          </div>
                          <div className={clsx(
                            'px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm',
                            coord.tier === 'Top Performer' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            coord.tier === 'Needs Attention' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'
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

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm h-full flex flex-col overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Audit Stream</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <Activity className="text-blue-500 w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px] p-8 space-y-8 scrollbar-hide">
                {monitorData.activityFeed.length > 0 ? (
                  <div className="space-y-8">
                    {monitorData.activityFeed.map((log, idx) => (
                      <div key={idx} className="flex gap-5 relative group">
                        {idx !== monitorData.activityFeed.length - 1 && (
                          <div className="absolute left-[13px] top-10 w-0.5 h-[calc(100%+8px)] bg-gray-50 group-hover:bg-blue-100 transition-colors" />
                        )}
                        <div className="w-7 h-7 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center shrink-0 z-10 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600" />
                        </div>
                        <div className="group-hover:translate-x-1 transition-all">
                          <p className="text-xs font-black text-gray-900 flex items-center gap-2">
                            {log.coordinatorId?.email?.split('@')[0]}
                            <span className="px-1.5 py-0.5 bg-gray-100 text-[8px] font-black uppercase text-gray-500 rounded border border-gray-200">{log.actionType}</span>
                          </p>
                          <p className="text-[12px] text-gray-500 mt-1.5 font-medium leading-relaxed">{log.details}</p>
                          <p className="text-[9px] font-black text-blue-400 uppercase mt-2.5 flex items-center gap-1.5 opacity-60">
                            <Clock size={10} strokeWidth={3} />
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 grayscale opacity-30">
                    <Clock className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-loose">Audit Stream<br />Silent</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Detailed Metrics Table ────────────────────────────────────── */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="p-8 border-b border-gray-50">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Operational Granularity</h3>
            <p className="text-sm text-gray-400 font-medium mt-1">Deep-dive into individual performance metrics</p>
          </div>
          <div className="overflow-x-auto p-4 pt-0">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Coordinator</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Interviews</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Drives</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Velocity</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Recent 7d</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Standing</th>
                </tr>
              </thead>
              <tbody>
                {monitorData.fullMetrics.length > 0 ? monitorData.fullMetrics.map((row, idx) => (
                  <tr key={idx} className="group bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-600/5 hover:-translate-y-0.5 transition-all">
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
                    <td className="px-6 py-4 text-center"><span className="text-sm font-black text-gray-700">{row.stats.interviewsScheduled}</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-sm font-black text-gray-700">{row.stats.jobsManaged}</span></td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-gray-900">{row.stats.totalActions}</span>
                        <div className="w-14 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden shadow-inner">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(row.stats.totalActions * 1.5, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <Zap size={14} className={clsx(row.recentActivityCount > 0 ? 'text-amber-500 animate-pulse' : 'text-gray-200')} />
                        <span className="text-sm font-black text-gray-900">{row.recentActivityCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right last:rounded-r-[24px]">
                      <div className="flex flex-col items-end">
                        <span className={clsx(
                          'px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm',
                          row.tier === 'Top Performer' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          row.tier === 'Needs Attention' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        )}>
                          {row.tier}
                        </span>
                        <p className="text-[9px] text-gray-400 mt-2 font-black uppercase tracking-widest opacity-60">
                          Active: {new Date(row.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center opacity-30">
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

      {/* ── ATTENDANCE MODAL ────────────────────────────────────────────── */}
      {modal?.type === 'attendance' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900">Mark Attendance</h2>
                <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-wider">{modal.name}</p>
              </div>
              <button onClick={closeModal} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Date */}
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Date</label>
                <input
                  type="date"
                  value={attendDate}
                  onChange={e => setAttendDate(e.target.value)}
                  max={today()}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              {/* Present / Absent */}
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Status</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setAttendPresent(true)}
                    className={clsx(
                      'flex-1 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 border-2 transition-all',
                      attendPresent ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'
                    )}
                  >
                    <CheckSquare className="w-4 h-4" /> Present
                  </button>
                  <button
                    onClick={() => setAttendPresent(false)}
                    className={clsx(
                      'flex-1 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 border-2 transition-all',
                      !attendPresent ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-500 border-gray-200 hover:border-rose-300'
                    )}
                  >
                    <XSquare className="w-4 h-4" /> Absent
                  </button>
                </div>
              </div>
              {/* Note */}
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Note (optional)</label>
                <input
                  type="text"
                  value={attendNote}
                  onChange={e => setAttendNote(e.target.value)}
                  placeholder="e.g. WFH, On leave..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              {saveMsg && (
                <p className={clsx('text-sm font-semibold px-3 py-2 rounded-lg', saveMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
                  {saveMsg}
                </p>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-black hover:bg-gray-200 transition-all">Cancel</button>
              <button
                onClick={saveAttendance}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gray-900 hover:bg-blue-600 text-white text-sm font-black transition-all shadow-lg disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BADGE MODAL ──────────────────────────────────────────────────── */}
      {modal?.type === 'badge' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Assign Badge</h2>
                <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-wider">{modal.name}</p>
              </div>
              <button onClick={closeModal} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-3">Performance Badge</label>
                <div className="flex flex-col gap-3">
                  {BADGES.map(b => (
                    <button
                      key={b.label}
                      onClick={() => setSelectedBadge(b.label)}
                      className={clsx(
                        'w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 font-black text-sm transition-all',
                        selectedBadge === b.label ? `${b.color} border-current shadow-md` : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <span className="flex items-center gap-3">{b.icon} {b.label}</span>
                      <span className="text-[10px] uppercase tracking-widest opacity-70">+{b.points} pts</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wider">Score increases each time a badge is saved — it never decreases.</p>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Admin Note (optional)</label>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  rows={2}
                  placeholder="Feedback or reason for this badge..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>
              {saveMsg && (
                <p className={clsx('text-sm font-semibold px-3 py-2 rounded-lg', saveMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
                  {saveMsg}
                </p>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-black hover:bg-gray-200 transition-all">Cancel</button>
              <button
                onClick={saveBadge}
                disabled={saving || !selectedBadge}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-black transition-all shadow-lg disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Assign Badge'}
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default CoordinatorMonitor;
