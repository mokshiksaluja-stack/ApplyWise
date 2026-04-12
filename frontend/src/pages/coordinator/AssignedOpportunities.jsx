import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Users, Calendar, ArrowRight, Activity, Clock, SlidersHorizontal, Info, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCoordinatorOpportunities } from '../../services/api';

const getCoordinatorId = () => localStorage.getItem('userId') || null;

const getStatusColor = (status) => {
  switch (status) {
    case 'Open':      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Ongoing':   return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Completed': return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'Closed':    return 'bg-red-50 text-red-600 border-red-200';
    default:          return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

export default function AssignedOpportunities() {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(null);

  const coordinatorId = getCoordinatorId();

  const loadDrives = useCallback(async (showRefreshIndicator = false) => {
    if (!coordinatorId) { setLoading(false); return; }
    if (showRefreshIndicator) setRefreshing(true);
    try {
      const { data } = await fetchCoordinatorOpportunities(coordinatorId);
      setDrives(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch assigned drives', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [coordinatorId]);

  // Initial load
  useEffect(() => { loadDrives(); }, [loadDrives]);

  // Poll every 30 seconds for new assignments
  useEffect(() => {
    const interval = setInterval(() => loadDrives(false), 30000);
    return () => clearInterval(interval);
  }, [loadDrives]);

  const filtered = drives.filter(d => {
    const matchSearch = !search ||
      d.company?.toLowerCase().includes(search.toLowerCase()) ||
      d.role?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = drives.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Assigned Opportunities</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage, track, and update all placement drives assigned to you.
            {lastUpdated && (
              <span className="ml-2 text-[11px] text-gray-400">
                · Last synced {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadDrives(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {!loading && drives.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Assigned', value: drives.length, color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Open', value: statusCounts['Open'] || 0, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Ongoing', value: statusCounts['Ongoing'] || 0, color: 'text-blue-600 bg-blue-50' },
            { label: 'Completed', value: statusCounts['Completed'] || 0, color: 'text-gray-600 bg-gray-100' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies or roles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Open', 'Ongoing', 'Completed', 'Closed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center">
            <Info className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">
              {drives.length === 0 ? 'No Assignments Yet' : 'No Matches Found'}
            </h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">
              {drives.length === 0
                ? 'The placement admin has not assigned any company drives to your account. Stay tuned!'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          filtered.map((drive) => (
            <div key={drive._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden p-5 flex flex-col md:flex-row gap-5 md:items-center group">

              {/* Company Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                  {drive.logo
                    ? <img src={drive.logo} alt={drive.company} className="max-w-full max-h-full object-contain" />
                    : <span className="text-gray-400 font-black text-sm">{drive.company?.slice(0, 2).toUpperCase()}</span>
                  }
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{drive.company}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wide ${getStatusColor(drive.status)}`}>
                      {drive.status}
                    </span>
                    {drive.opportunityType && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-50 text-gray-500 border border-gray-100 uppercase">
                        {drive.opportunityType}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-600">{drive.role}</h4>
                  {drive.location && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {drive.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-shrink-0">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Applicants</span>
                  <span className="text-sm font-bold text-gray-900">
                    {drive.applicantCount ?? '—'}
                    <span className="text-xs text-gray-400 font-normal ml-1">total</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Stipend</span>
                  <span className="text-sm font-bold text-indigo-700">{drive.stipend || drive.salary || 'Competitive'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Deadline</span>
                  <span className="text-sm font-bold text-gray-900">
                    {drive.deadline ? new Date(drive.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Mode</span>
                  <span className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{drive.employmentMode || 'TBD'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full md:w-auto pt-4 md:pt-0 border-t border-gray-100 md:border-none md:pl-4 flex gap-2">
                <button
                  onClick={() => navigate(`/coordinator/applicants`)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden lg:inline">Applicants</span>
                </button>
                <button
                  onClick={() => navigate(`/coordinator/opportunities/${drive._id}`)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 transition-all group"
                >
                  Manage <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
