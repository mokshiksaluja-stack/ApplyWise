import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5001/api' });

// Intercept requests to attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginAPI = (formData) => API.post('/auth/login', formData);
export const signupAPI = (formData) => API.post('/auth/signup', formData);

export const fetchOpportunities = () => API.get('/jobs');
export const fetchOpportunityById = (id) => API.get(`/jobs/${id}`);
export const createOpportunityApi = (data) => API.post('/jobs', data);
export const fetchStudents = () => API.get('/students');
export const fetchApplications = () => API.get('/applications');
export const fetchInterviews = () => API.get('/interviews');
export const createApplicationApi = (data) => API.post('/applications', data);

export default API;
