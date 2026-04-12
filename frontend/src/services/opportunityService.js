import API from './api';

export const fetchStudentOpportunities = async () => {
  try {
    const { data } = await API.get('/opportunities/student-visible');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch student opportunities:", error);
    throw error;
  }
};
