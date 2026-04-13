import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { fetchCoordinatorList } from '../services/api';
import { Star, MessageCircle, Mail, Users, RefreshCw, Search, UserCheck } from 'lucide-react';

const Coordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    try {
      const { data } = await fetchCoordinatorList();
      setCoordinators(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load coordinators', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = coordinators.filter(c =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Generate initials-based avatar colour
  const avatarColor = (name = '') => {
    const colors = [
      'bg-blue-500', 'bg-indigo-500', 'bg-violet-500',
      'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
      'bg-cyan-500', 'bg-teal-500',
    ];
    const idx = (name.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Placement Coordinators</h1>
          <p className="text-gray-500 font-medium text-[15px]">
            Manage and contact your placement team.
            {!loading && (
              <span className="ml-2 text-blue-600 font-semibold">{coordinators.length} registered</span>
            )}
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Loading skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
          <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {coordinators.length === 0 ? 'No Coordinators Found' : 'No Match'}
          </h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            {coordinators.length === 0
              ? 'No users with the coordinator role exist yet. Create coordinator accounts from the backend.'
              : 'Try adjusting your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(coord => (
            <div
              key={coord.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center hover:shadow-md transition-shadow group text-center relative overflow-hidden"
            >
              {/* Gradient banner */}
              <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10 group-hover:opacity-20 transition-opacity" />

              {/* Avatar */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-white text-2xl border-4 border-white shadow-md mb-4 z-10 ${avatarColor(coord.name)}`}>
                {initials(coord.name)}
              </div>

              {/* Name + badge */}
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{coord.name || coord.email?.split('@')[0]}</h3>
              <p className="text-sm font-medium text-blue-600 mb-1 bg-blue-50 px-3 py-1 rounded-full mt-1">Coordinator</p>
              <p className="text-xs text-gray-400 mb-4 truncate max-w-full px-2">{coord.email}</p>

              {/* Stats */}
              <div className="flex gap-4 mb-6 w-full px-1">
                <div className="flex-1 bg-gray-50 rounded-lg p-2.5 border border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Tasks</p>
                  <p className="text-[15px] font-bold text-gray-900 leading-none">
                    {coord.tasksCompleted ?? '—'}
                  </p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-2.5 border border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Status</p>
                  <p className="text-[11px] font-bold text-emerald-600 leading-none mt-1">Active</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full mt-auto">
                <a
                  href={`mailto:${coord.email}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center text-sm transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4 mr-2" /> Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Coordinators;
