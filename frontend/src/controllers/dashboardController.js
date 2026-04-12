import { dashboardData } from '../models/data';
import { fetchOpportunities, fetchOpportunityById, createOpportunityApi, fetchStudents, fetchApplications, fetchInterviews, createApplicationApi, fetchStudentApplications } from '../services/api';
import { opportunitiesList } from '../data/dummyOpportunities';

export const DashboardController = {
  getStats: () => dashboardData.stats,

  getOpportunities: async () => {
    try {
      const { data } = await fetchOpportunities();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  createOpportunity: async (jobData) => {
    try {
      const { data } = await createOpportunityApi(jobData);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  getOpportunityById: async (id) => {
    try {
      if (id && id.toString().length < 10) {
        const dummyJob = opportunitiesList.find(op => op.id.toString() === id.toString());
        if (dummyJob) return dummyJob;
      }
      const { data } = await fetchOpportunityById(id);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  
  applyToJob: async (id, studentId) => {
    try {
      const activeStudentId = studentId || localStorage.getItem('studentId');
      if (!activeStudentId || activeStudentId === 'null') {
         console.warn("No active student ID to submit application");
         return false;
      }
      const appData = { studentId: activeStudentId, jobId: id };
      await createApplicationApi(appData);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  getTasks: (filter = 'All') => {
    if (filter === 'All') return dashboardData.tasks;
    return dashboardData.tasks.filter(task => task.status === filter);
  },
  
  getTaskById: (id) => dashboardData.tasks.find(task => task.id === parseInt(id)),
  getCoordinators: () => dashboardData.coordinators,
  
  getStudents: async () => {
    try {
      const { data } = await fetchStudents();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },
  
  getApplications: async () => {
    try {
      const { data } = await fetchApplications();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getStudentApplications: async (studentId) => {
    if (!studentId || studentId === 'null') return [];
    try {
      const { data } = await fetchStudentApplications(studentId);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },
  
  getInterviews: async () => {
    try {
      const { data } = await fetchInterviews();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getTaskDistribution: () => dashboardData.taskDistribution,
  getApplicationOverview: () => dashboardData.applicationOverview,
  getAnalyticsSummary: () => dashboardData.analyticsSummary,
  getNotifications: () => dashboardData.notifications,
  
  markAsRead: (id) => {
    const notif = dashboardData.notifications.find(n => n.id === parseInt(id));
    if (notif) { notif.read = true; return true; }
    return false;
  },
  
  searchAll: (query) => {
    if (!query) return { jobs: [], tasks: [] };
    const q = query.toLowerCase();
    const matchedJobs = dashboardData.opportunities.filter(job => 
      job.company.toLowerCase().includes(q) || job.role.toLowerCase().includes(q)
    );
    const matchedTasks = dashboardData.tasks.filter(task => 
      task.title.toLowerCase().includes(q) || task.assignee.toLowerCase().includes(q)
    );
    return { jobs: matchedJobs, tasks: matchedTasks };
  },
  
  filterDataByTime: (range) => {
    let scale = 1;
    if (range === 'Last 7 days') scale = 0.1;
    if (range === 'Last 1 month') scale = 0.3;
    if (range === 'Last 3 months') scale = 0.6;
    return dashboardData.stats.map(stat => ({
      ...stat,
      value: Math.max(1, Math.round(parseInt(stat.value) * scale)).toString()
    }));
  },
  
  getMessages: () => dashboardData.messages,
  getMessageById: (id) => dashboardData.messages.find(msg => msg.id === parseInt(id)),
  
  markMessageAsRead: (id) => {
    const msg = dashboardData.messages.find(m => m.id === parseInt(id));
    if (msg) { msg.unread = false; return true; }
    return false;
  }
};
