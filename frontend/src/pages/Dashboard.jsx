import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import OpportunityCard from '../components/OpportunityCard';
import PendingTasks from '../components/PendingTasks';
import ApplicationChart from '../components/ApplicationChart';
import TaskDistributionChart from '../components/TaskDistributionChart';
import CoordinatorList from '../components/CoordinatorList';
import { DashboardController } from '../controllers/dashboardController';
import { ChevronRight, Calendar as CalendarIcon, ChevronDown, ListFilter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    stats: [],
    opportunities: [],
    tasks: [],
    coordinators: [],
    taskDistribution: [],
    applicationOverview: []
  });

  const [timeFilter, setTimeFilter] = useState('Last 6 months');
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      const opps = await DashboardController.getOpportunities();
      setData({
        stats: DashboardController.filterDataByTime(timeFilter),
        opportunities: opps || [],
        tasks: DashboardController.getTasks(),
        coordinators: DashboardController.getCoordinators(),
        taskDistribution: DashboardController.getTaskDistribution(),
        applicationOverview: DashboardController.getApplicationOverview()
      });
    };
    loadData();
  }, [timeFilter]);

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
              <CalendarIcon className="w-4 h-4 text-gray-400" /> {timeFilter} <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
            </button>
            
            {isTimeFilterOpen && (
              <div className="absolute top-full right-[100px] mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-20">
                {['Last 7 days', 'Last 1 month', 'Last 3 months', 'Last 6 months'].map(range => (
                  <button 
                    key={range}
                    onClick={() => { setTimeFilter(range); setIsTimeFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors
                      ${timeFilter === range ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
              <ListFilter className="w-4 h-4 text-blue-500" /> Apply <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {data.stats.map((stat, idx) => {
              let linkTo = '/dashboard';
              if (idx === 0) linkTo = '/students';
              if (idx === 1) linkTo = '/applications';
              if (idx === 2) linkTo = '/interviews';
              return <StatCard key={stat.id} {...stat} linkTo={linkTo} />;
            })}
          </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 xl:gap-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-center mb-4 tracking-tight">
              <h3 className="text-[16px] font-bold text-gray-900">Latest Opportunities</h3>
              <button onClick={() => navigate('/opportunities')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center group cursor-pointer focus:outline-none">
                View All <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.opportunities.slice(0, 3).map(opp => (
                <OpportunityCard key={opp.id} {...opp} />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4 tracking-tight">
                <h3 className="text-[16px] font-bold text-gray-900">Latest Opportunities</h3>
                <button onClick={() => navigate('/opportunities')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center group cursor-pointer focus:outline-none">
                  View All <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[calc(100%-2.5rem)]">
                {data.opportunities.slice(0, 2).map((opp, idx) => (
                  <OpportunityCard key={`row2-${idx}`} {...opp} />
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1 flex flex-col">
              <CoordinatorList coordinators={data.coordinators} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <ApplicationChart data={data.applicationOverview} />
          <PendingTasks tasks={data.tasks} />
          <TaskDistributionChart data={data.taskDistribution} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
