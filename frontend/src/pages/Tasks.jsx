import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { fetchAllCoordinatorTasksApi, createTaskApi, fetchCoordinatorList } from '../services/api';
import { Plus, RefreshCw, CheckCircle, Clock, AlertCircle, X, Calendar, Users } from 'lucide-react';
import clsx from 'clsx';

const PRIORITY_COLORS = {
  High:   'text-red-700 bg-red-50 border-red-200',
  Medium: 'text-amber-700 bg-amber-50 border-amber-200',
  Low:    'text-green-700 bg-green-50 border-green-200',
};

const STATUS_COLORS = {
  Pending:   'text-blue-700 bg-blue-50 border-blue-200',
  Completed: 'text-green-700 bg-green-50 border-green-200',
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    coordinatorId: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium',
  });

  const tabs = ['All', 'Pending', 'Completed'];

  const loadData = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const [tasksRes, coordRes] = await Promise.all([
        fetchAllCoordinatorTasksApi(),
        fetchCoordinatorList(),
      ]);
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
      setCoordinators(Array.isArray(coordRes.data) ? coordRes.data : []);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredTasks = tasks.filter(t =>
    activeTab === 'All' || t.status === activeTab
  );

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSubmitError('');
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.coordinatorId) return setSubmitError('Please select a coordinator.');
    if (!form.title.trim()) return setSubmitError('Task title is required.');
    setSubmitting(true);
    setSubmitError('');
    try {
      const { data } = await createTaskApi({
        ...form,
        deadline: form.deadline || undefined,
      });
      setTasks(prev => [data, ...prev]);
      setShowModal(false);
      setForm({ coordinatorId: '', title: '', description: '', deadline: '', priority: 'Medium' });
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCoordinatorName = (task) => {
    if (task.coordinatorId?.name) return task.coordinatorId.name;
    if (task.coordinatorId?.email) return task.coordinatorId.email.split('@')[0];
    return '—';
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    high: tasks.filter(t => t.priority === 'High' && t.status === 'Pending').length,
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Tasks</h1>
          <p className="text-gray-500 text-[15px] font-medium">
            Assign and track coordination tasks. {tasks.length > 0 && <span className="text-blue-600 font-semibold">{tasks.length} total</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={clsx('w-4 h-4', refreshing && 'animate-spin')} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Assign Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: stats.total, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'High Priority', value: stats.high, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={clsx('rounded-lg p-2.5', bg)}>
              <Icon className={clsx('w-5 h-5', color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-1 p-4 border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-semibold transition',
                activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              {tab}
              <span className={clsx('ml-1.5 text-xs rounded-full px-1.5 py-0.5',
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              )}>
                {tab === 'All' ? tasks.length : tasks.filter(t => t.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-gray-400">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} tasks found.</p>
              <button onClick={() => setShowModal(true)} className="mt-4 text-sm text-blue-600 hover:underline font-medium">
                + Assign a task
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Task</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Deadline</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTasks.map(task => (
                  <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900 text-sm">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{task.description}</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-700">
                      {getCoordinatorName(task)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={clsx('inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border', PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium)}>
                        {task.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={clsx('inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border', STATUS_COLORS[task.status] || STATUS_COLORS.Pending)}>
                        {task.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Assign New Task</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              {/* Coordinator */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign To Coordinator <span className="text-red-500">*</span></label>
                <select
                  name="coordinatorId"
                  value={form.coordinatorId}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                >
                  <option value="">Select coordinator...</option>
                  {coordinators.map(c => (
                    <option key={c.id} value={c.id}>{c.name || c.email}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Task Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Schedule aptitude round for TCS drive"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Additional instructions or context..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 resize-none"
                />
              </div>

              {/* Deadline + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {submitError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-200">{submitError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {submitting ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Tasks;
