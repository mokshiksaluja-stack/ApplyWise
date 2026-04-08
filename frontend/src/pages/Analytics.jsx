import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ApplicationChart from '../components/ApplicationChart';
import TaskDistributionChart from '../components/TaskDistributionChart';
import { DashboardController } from '../controllers/dashboardController';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState({
    applicationOverview: [],
    taskDistribution: [],
    summary: {}
  });

  useEffect(() => {
    setData({
      applicationOverview: DashboardController.getApplicationOverview(),
      taskDistribution: DashboardController.getTaskDistribution(),
      summary: DashboardController.getAnalyticsSummary()
    });
  }, []);

  const summaryCards = [
    { title: "Total Applications", value: data.summary.totalApplied, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Selected", value: data.summary.totalSelected, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { title: "Success Rate", value: data.summary.successRate, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Active Interviews", value: data.summary.activeInterviews, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" }
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
        <p className="text-gray-500 font-medium text-[15px]">Detailed insights into application metrics and placement trends.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${card.bg} ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[400px]">
        <div className="lg:col-span-2 flex flex-col">
          <ApplicationChart data={data.applicationOverview} />
        </div>
        <div className="flex flex-col">
          <TaskDistributionChart data={data.taskDistribution} />
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
