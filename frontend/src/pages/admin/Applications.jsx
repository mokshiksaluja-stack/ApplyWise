import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/Layout';
import { fetchApplications } from '../../services/api';
import { Search, Filter, Users, Loader2 } from 'lucide-react';
import clsx from 'clsx';
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

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filterCompany, setFilterCompany] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRound, setFilterRound] = useState('');

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const { data } = await fetchApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  // Derived filter options
  const uniqueCompanies = useMemo(() => [...new Set(applications.map(resolveCompany))], [applications]);
  const uniqueRoles = useMemo(() => [...new Set(applications.map(resolveRole))], [applications]);
  const uniqueStatuses = useMemo(() => ['All', ...new Set(applications.map(a => a.status))], [applications]);
  const uniqueRounds = useMemo(() => [...new Set(applications.map(a => a.currentRound))], [applications]);

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      if (filterStatus !== 'All' && app.status !== filterStatus) return false;
      if (filterCompany && resolveCompany(app) !== filterCompany) return false;
      if (filterRole && resolveRole(app) !== filterRole) return false;
      if (filterRound && app.currentRound !== filterRound) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const name = resolveStudentName(app).toLowerCase();
        const company = resolveCompany(app).toLowerCase();
        const role = resolveRole(app).toLowerCase();
        if (!name.includes(q) && !company.includes(q) && !role.includes(q)) return false;
      }
      return true;
    });
  }, [applications, filterStatus, filterCompany, filterRole, filterRound, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Shortlisted': return 'bg-green-50 text-green-600 border border-green-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border border-red-100';
      case 'Selected': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'In Progress': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'Interview Scheduled': return 'bg-purple-50 text-purple-600 border border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-500 font-medium text-[15px]">Track application statuses across all registered candidates.</p>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, company, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              "flex items-center justify-center gap-2 px-5 py-3 border-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
              showFilters ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
            )}
          >
            <Filter size={14} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 mt-5 border-t border-gray-50 animate-in slide-in-from-top-4 duration-300">
            <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-lg text-xs font-bold p-2.5 focus:border-blue-500 outline-none">
              <option value="">All Companies</option>
              {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-lg text-xs font-bold p-2.5 focus:border-blue-500 outline-none">
              <option value="">All Roles</option>
              {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-lg text-xs font-bold p-2.5 focus:border-blue-500 outline-none">
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterRound} onChange={e => setFilterRound(e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-lg text-xs font-bold p-2.5 focus:border-blue-500 outline-none">
              <option value="">All Rounds</option>
              {uniqueRounds.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Skeleton className="h-[500px] w-full" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Degree / Branch</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">CGPA</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Round</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Applied On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-16">
                      <EmptyState
                        icon={Users}
                        title="No Applications Found"
                        message="No students have applied to any opportunities yet, or no results match your filters."
                        action={{ label: "Reset Filters", onClick: () => { setSearchTerm(''); setFilterCompany(''); setFilterRole(''); setFilterStatus('All'); setFilterRound(''); } }}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => {
                    const studentName = resolveStudentName(app);
                    const rollNo = resolveStudentField(app, 'enrollmentNumber');
                    const degree = resolveStudentField(app, 'degree');
                    const branch = resolveStudentField(app, 'branch');
                    const cgpa = resolveStudentField(app, 'cgpa');
                    const company = resolveCompany(app);
                    const role = resolveRole(app);

                    return (
                      <tr key={app._id || app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                              {studentName.charAt(0)}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-gray-900 block">{studentName}</span>
                              <span className="text-[11px] text-gray-400 font-semibold">{rollNo}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {app.logo && (
                              <div className="w-8 h-8 rounded bg-white border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                                <img src={app.logo} alt={company} className="max-w-full max-h-full object-contain" />
                              </div>
                            )}
                            <span className="text-sm font-bold text-gray-900">{company}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-gray-700">{role}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-gray-600">{degree} / {branch}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-bold text-gray-900">{cgpa}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm", getStatusColor(app.status))}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">{app.currentRound}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-sm font-medium text-gray-500">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : app.date || '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {filteredApps.length > 0 && (
            <div className="p-4 border-t border-gray-50 bg-gray-50/50 text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Showing {filteredApps.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Applications;
