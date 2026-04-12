import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import OpportunityCard from '../../components/OpportunityCard';
import PendingTasks from '../../components/PendingTasks';
import ApplicationChart from '../../components/ApplicationChart';
import TaskDistributionChart from '../../components/TaskDistributionChart';
import CoordinatorList from '../../components/CoordinatorList';
import { DashboardController } from '../../controllers/dashboardController';
import { ChevronRight, Calendar as CalendarIcon, ChevronDown, ListFilter, Briefcase, UserCheck, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminCoordinatorContext } from '../../context/AdminCoordinatorContext';
import { fetchDashboardAnalytics, fetchAllCoordinatorTasksApi } from '../../services/api';

// New specialized components
import CompanyAppsChart from '../../components/CompanyAppsChart';
import RoleSuccessChart from '../../components/RoleSuccessChart';
import ReadinessDistributionChart from '../../components/ReadinessDistributionChart';
import CoordinatorPerformanceTable from '../../components/CoordinatorPerformanceTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const { coordinators } = useAdminCoordinatorContext();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: [],
    opportunities: [],
    tasks: [],
    taskDistribution: [],
    applicationOverview: []
  });
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    time: 'Last 6 months'
  });
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const [showAdvanceFilters, setShowAdvanceFilters] = useState(false);

  const getTimeRange = (filter) => {
    const to = new Date();
    let from = new Date();
    if (filter === 'Last 7 days') from.setDate(to.getDate() - 7);
    else if (filter === 'Last 1 month') from.setMonth(to.getMonth() - 1);
    else if (filter === 'Last 3 months') from.setMonth(to.getMonth() - 3);
    else if (filter === 'Last 6 months') from.setMonth(to.getMonth() - 6);
    else return {}; 
    return { from: from.toISOString(), to: to.toISOString() };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const dates = getTimeRange(filters.time);
      const apiFilters = {
        ...dates,
        company: filters.company,
        role: filters.role
      };
      
      const [analyticsDataRes, opps, tasksRes] = await Promise.all([
         fetchDashboardAnalytics(apiFilters),
         DashboardController.getOpportunities(),
         fetchAllCoordinatorTasksApi()
      ]);
      
      setAnalytics(analyticsDataRes.data);
      
      setData({
        stats: [], // handled by analytics now
        opportunities: opps || [],
        tasks: tasksRes.data || [],
        taskDistribution: [], // handled by analytics now
        applicationOverview: DashboardController.getApplicationOverview()
      });
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const topStats = analytics ? [
    { title: 'Total Students', value: analytics.topLevelStats.totalStudents, subtext: 'Registered Users', iconType: 'users', trend: '+12%', isPositive: true },
    { title: 'Total Applications', value: analytics.topLevelStats.totalApplications, subtext: 'Drive Applications', iconType: 'file-text', trend: '+18%', isPositive: true },
    { title: 'Selection Rate', value: `${analytics.topLevelStats.selectionRate}%`, subtext: 'Successful Placements', iconType: 'calendar', trend: '+5%', isPositive: true },
  ] : [];

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2 tracking-tight">
          Welcome back, Mohit! <span className="text-2xl animate-wave origin-bottom-right inline-block" style={{animation: 'wave 2s infinite', transformOrigin: '70% 70%'}}>👋</span>
        </h2>
        <style>{`
          @keyframes wave {
            0% { transform: rotate( 0.0deg) }
            10% { transform: rotate(14.0deg) }  
            20% { transform: rotate(-8.0deg) }
            30% { transform: rotate(14.0deg) }
            40% { transform: rotate(-4.0deg) }
            50% { transform: rotate(10.0deg) }
            60% { transform: rotate( 0.0deg) }  
            100% { transform: rotate( 0.0deg) }
          }
        `}</style>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1">
          <p className="text-gray-500 font-medium text-[15px]">Here's what's happening at a glance:</p>
          
          <div className="flex gap-3 mt-4 sm:mt-0 relative">
            <button 
              onClick={() => setIsTimeFilterOpen(!isTimeFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <CalendarIcon className="w-4 h-4 text-gray-400" /> {filters.time} <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
            </button>
            
            {isTimeFilterOpen && (
              <div className="absolute top-full right-[100px] mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-20">
                {['Last 7 days', 'Last 1 month', 'Last 3 months', 'Last 6 months'].map(range => (
                  <button 
                    key={range}
                    onClick={() => { setFilters({...filters, time: range}); setIsTimeFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors
                      ${filters.time === range ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => setShowAdvanceFilters(!showAdvanceFilters)}
              className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-[13px] font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 ${showAdvanceFilters ? 'border-blue-300 text-blue-600 ring-2 ring-blue-50' : 'border-gray-200 text-gray-600'}`}
            >
              <ListFilter className={`w-4 h-4 ${showAdvanceFilters ? 'text-blue-600' : 'text-blue-500'}`} /> Filter <ChevronDown className={`w-4 h-4 ml-1 text-gray-400 transition-transform ${showAdvanceFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Advance Filters */}
        {showAdvanceFilters && (
          <div className="mt-4 p-4 bg-white border border-blue-50 rounded-xl shadow-sm flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Company</label>
              <input 
                type="text" 
                placeholder="Search company..." 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-300 focus:outline-none transition-all"
                value={filters.company}
                onChange={(e) => setFilters({...filters, company: e.target.value})}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Role / Profile</label>
              <input 
                type="text" 
                placeholder="Search role..." 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-300 focus:outline-none transition-all"
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
              />
            </div>
            <div className="flex items-end mb-0.5">
              <button 
                onClick={() => setFilters({ company: '', role: '', time: 'Last 6 months' })}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2 py-1"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)
        ) : (
          topStats.map((stat, idx) => {
            let linkTo = '/dashboard';
            if (idx === 0) linkTo = '/students';
            if (idx === 1) linkTo = '/admin/applications';
            if (idx === 2) linkTo = '/placements';
            return <StatCard key={idx} {...stat} linkTo={linkTo} />;
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {loading ? (
               <div className="col-span-2 h-80 bg-gray-50 rounded-2xl animate-pulse mb-6" />
             ) : (
               <>
                 <CompanyAppsChart data={analytics?.applicationsByCompany} />
                 <ReadinessDistributionChart data={analytics?.statusDistribution} />
               </>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {loading ? null : (
               <>
                 <RoleSuccessChart data={analytics?.successRateByRole} />
                 <div className="flex flex-col gap-5">
                   {/* Horizontal Coordinator List */}
                   <CoordinatorList coordinators={coordinators.slice(0, 3)} horizontal={true} />
                   <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
                      <TrendingUp className="absolute top-0 right-0 p-8 opacity-20" size={120} />
                      <h4 className="text-xl font-bold mb-1 relative z-10">Drive Performance</h4>
                      <p className="text-sm text-blue-100 opacity-90 mb-4 relative z-10">Real-time placement efficiency tracking enabled.</p>
                      <button 
                        onClick={() => navigate('/admin/reports')}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold transition-all relative z-10"
                      >
                        Deep Dive Analysis
                      </button>
                   </div>
                 </div>
               </>
             )}
          </div>

          {/* Coordinator Performance Table */}
          {!loading && <CoordinatorPerformanceTable data={analytics?.coordinatorPerformance} />}
        </div>

        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Pending Tasks Taking Up Right Column */}
          <PendingTasks tasks={data.tasks} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
