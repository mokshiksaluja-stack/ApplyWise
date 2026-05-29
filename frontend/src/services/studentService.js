// src/services/studentService.js
import API from './api';

/**
 * Service to handle student profile API requests using the central API Axios instance.
 * This guarantees the backend base URL and Authorization headers are automatically applied.
 */

/**
 * Save a new student profile
 */
export const saveStudentProfile = async (profileData) => {
  try {
    const response = await API.post('/students/profile', profileData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(errorMessage || "Something went wrong while saving the profile.");
  }
};

/**
 * Fetch an existing student profile by ID
 */
export const fetchStudentProfile = async (id) => {
  try {
    const response = await API.get(`/students/profile/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(errorMessage || "Failed to fetch student profile.");
  }
};

/**
 * Fetch an existing student profile by User ID (linked auth account)
 */
export const fetchStudentProfileByUserId = async (userId) => {
  try {
    const response = await API.get(`/students/user/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(errorMessage || "Failed to fetch student profile.");
  }
};

/**
 * Update an existing student profile
 */
export const updateStudentProfile = async (id, profileData) => {
  try {
    const response = await API.put(`/students/profile/${id}`, profileData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(errorMessage || "Something went wrong while updating the profile.");
  }
};
