// src/utils/auth.js

/**
 * Retrieves the currently authenticated user payload from localStorage safely.
 * @returns {Object|null} User object or null if not authenticated.
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

/**
 * Retrieves the required jwt token from localStorage safely.
 * @returns {String|null} Token string or null
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Checks securely if a valid session exists.
 * @returns {Boolean}
 */
export const isAuthenticated = () => {
  return !!getCurrentUser() && !!getToken();
};
