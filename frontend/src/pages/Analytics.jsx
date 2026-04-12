import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchDashboardAnalytics } from '../services/api';
import { TrendingUp, Users, CheckCircle, Clock, Loader2 } from 'lucide-react';

import CompanyAppsChart from '../components/CompanyAppsChart';
import RoleSuccessChart from '../components/RoleSuccessChart';
import ReadinessDistributionChart from '../components/ReadinessDistributionChart';
import CoordinatorPerformanceTable from '../components/CoordinatorPerformanceTable';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetchDashboardAnalytics();
        if (response.data.success) {
          setAnalytics(response.data);
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const topLevelStats = analytics?.topLevelStats || {};

  const summaryCards = [
    { title: "Total Students", value: topLevelStats.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Applications", value: topLevelStats.totalApplications, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { title: "Selection Rate", value: (topLevelStats.selectionRate || 0) + '%', icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Active Opportunities", value: topLevelStats.totalOpportunities, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" }
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
        <p className="text-gray-500 font-medium text-[15px]">Detailed insights into application metrics and placement trends.</p>
      </div>

      {loading || !analytics ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
          <p className="text-sm font-bold tracking-widest uppercase">Synthesizing Core Metrics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryCards.map((card, idx) => (
               <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                 <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${card.bg} ${card.color}`}>
                   <card.icon className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">{card.title}</p>
                   <h3 className="text-2xl font-black text-gray-900 mt-1">{card.value || 0}</h3>
                 </div>
               </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CompanyAppsChart data={analytics.applicationsByCompany} />
            <ReadinessDistributionChart data={analytics.statusDistribution} />
          </div>

          <div className="grid grid-cols-1 mb-6">
            <RoleSuccessChart data={analytics.successRateByRole} />
          </div>

          <div className="grid grid-cols-1 mb-6">
            <CoordinatorPerformanceTable data={analytics.coordinatorPerformance} />
          </div>
        </>
      )}
    </Layout>
  );
};

export default Analytics;
