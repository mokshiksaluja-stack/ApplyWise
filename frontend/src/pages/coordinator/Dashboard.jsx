import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Calendar, AlertCircle, Clock, ArrowRight, CheckCircle, TrendingUp, Zap, Bell, ListChecks, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminCoordinatorContext } from '../../context/AdminCoordinatorContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import { fetchCoordinatorOpportunities, fetchCoordinatorTasksApi } from '../../services/api';
import Skeleton from '../../components/UI/Skeleton';
import EmptyState from '../../components/UI/EmptyState';
import clsx from 'clsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { sharedOpportunities, coordinators, logCoordinatorActivity } = useAdminCoordinatorContext();
  const { addNotification } = useNotifications();
  const { showToast } = useToast();
  
  // Read directly from localStorage — same pattern as Applicants/AssignedOpportunities
  const coordinatorId = localStorage.getItem('userId');

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = React.useState([]);
  const [assignedDrives, setAssignedDrives] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!coordinatorId) { setLoading(false); return; }
      try {
        const [drivesRes, tasksRes] = await Promise.all([
           fetchCoordinatorOpportunities(coordinatorId),
           fetchCoordinatorTasksApi(coordinatorId)
        ]);
        setAssignedDrives(Array.isArray(drivesRes.data) ? drivesRes.data : []);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
      } catch (err) {
        console.error("Failed to load coordinator dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [coordinatorId]);


  const assignedDrivesCount = assignedDrives.length;
  const myTracker = coordinators.find(c => c.id === currentCoordinatorId);

  const dynamicStats = [
    { title: 'Drives Managed', value: assignedDrivesCount, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
    { title: 'Tasks Finished', value: myTracker?.tasksCompleted || '0', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Audit Ready' },
    { title: 'Interviews', value: '12', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Today' },
    { title: 'Queue Count', value: tasks.length, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Priority' },
  ];

  const handleTaskComplete = (e, taskId) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== taskId));
    logCoordinatorActivity(currentCoordinatorId, 'TASK_COMPLETED');
    showToast("Task archived and logged to Admin", "success");
    addNotification({ title: 'Task Completed', message: 'Activity logged with Admin.', type: 'success' });
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 overflow-hidden">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-[32px]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-[40px]" />
          <Skeleton className="h-96 rounded-[40px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ops Intelligence</h1>
          <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             Operational Status: Active • Connected to Cloud
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 shadow-sm transition-all hover:shadow-md active:scale-95">
             <Bell size={20} />
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-gray-900/10 hover:bg-blue-600 transition-all active:scale-95">
             <Zap size={14} /> Quick Action
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[32px] p-7 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all relative overflow-hidden group premium-card">
            <div className="flex justify-between items-start mb-6">
              <div className={clsx("p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-sm", stat.bg)}>
                <stat.icon className={clsx("w-6 h-6", stat.color)} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">{stat.trend}</span>
            </div>
            <div>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{stat.value}</h3>
              <p className="text-[11px] font-black text-gray-400 mt-3 uppercase tracking-[0.1em]">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Task Center */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col premium-card">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                  <ListChecks size={24} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">Pending Registry</h2>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Queue Priority Management</p>
               </div>
            </div>
            <button className="text-[11px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl transition-all">Archived Tasks</button>
          </div>

          <div className="space-y-4 flex-1">
            {tasks.length === 0 ? (
              <EmptyState 
                icon={CheckCircle}
                title="Ghost Town!"
                message="All operational registry tasks have been completed. Enjoy the quiet."
                className="py-10 border-0 shadow-none bg-gray-50/50"
              />
            ) : (
                tasks.map(task => {
                  const taskId = task._id || task.id;
                  return (
                <div key={taskId} className="group relative flex items-center justify-between p-6 rounded-[24px] border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 hover:border-blue-100 transition-all cursor-pointer overflow-hidden">
                   <div className={clsx("absolute top-0 left-0 bottom-0 w-1.5", task.priority === 'High' ? 'bg-rose-500' : 'bg-amber-500')}></div>
                   <div className="flex flex-col gap-1">
                      <h4 className="text-base font-black text-gray-900 tracking-tight">{task.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                         <span className={clsx("flex items-center gap-1.5", task.priority === 'High' ? 'text-rose-600' : 'text-amber-600')}>
                           <AlertCircle size={12} /> {task.priority} Priority
                         </span>
                         <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                         <span className="flex items-center gap-1.5"><Clock size={12} /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</span>
                      </div>
                   </div>
                   <button 
                     onClick={(e) => handleTaskComplete(e, taskId)}
                     className="bg-white border border-gray-100 p-3 rounded-2xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all shadow-sm active:scale-90"
                   >
                     <CheckCircle size={20} />
                   </button>
                </div>
                )})
            )}
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="flex flex-col gap-8">
           {/* Upcoming Drive Hero */}
           <div className="bg-gray-900 rounded-[40px] shadow-2xl p-8 text-white relative overflow-hidden group flex-shrink-0">
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-10">
                   <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <TrendingUp className="text-blue-400" />
                   </div>
                   <div className="bg-emerald-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Live</div>
                </div>
                <h2 className="text-3xl font-black mb-3 tracking-tighter">Google <br/> SDE Drive</h2>
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-10 leading-relaxed max-w-[200px]">
                  Online Assessment Stage • 142 Active Registrations
                </p>
                <button 
                  onClick={() => navigate('/coordinator/opportunities')}
                  className="w-full bg-white text-gray-900 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 group/btn active:scale-95"
                >
                  Enter Mission Command <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
             </div>
             {/* Abstract decor */}
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
             <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-600 rounded-full blur-[120px] opacity-10"></div>
           </div>

           {/* Quick Actions Panel */}
           <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-xl shadow-blue-600/20">
              <h3 className="text-lg font-black tracking-tight mb-6">Execution Suite</h3>
              <div className="grid grid-cols-2 gap-3">
                 <button className="bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-3xl transition-all text-center flex flex-col items-center gap-3">
                    <Bell size={20} className="text-blue-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Blast Alerts</span>
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-3xl transition-all text-center flex flex-col items-center gap-3">
                    <Search size={20} className="text-blue-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Find Student</span>
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
