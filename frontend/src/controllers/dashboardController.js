import { fetchOpportunities, fetchOpportunityById, createOpportunityApi, fetchStudents, fetchApplications, fetchInterviews, createApplicationApi, fetchStudentApplications } from '../services/api';

export const DashboardController = {
  getStats: () => [],

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

  getTasks: (filter = 'All') => [],
  
  getTaskById: (id) => null,
  getCoordinators: () => [],
  
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

  getTaskDistribution: () => [],
  getApplicationOverview: () => [],
  getAnalyticsSummary: () => null,
  getNotifications: () => [],
  
  markAsRead: (id) => false,
  
  searchAll: (query) => {
    return { jobs: [], tasks: [] };
  },
  
  filterDataByTime: (range) => [],
  
  getMessages: () => [],
  getMessageById: (id) => null,
  
  markMessageAsRead: (id) => false
};
