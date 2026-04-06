// src/services/studentService.js

/**
 * Service to handle student profile API requests.
 */

export const saveStudentProfile = async (profileData) => {
  try {
    const response = await fetch("/api/students/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error ? `${data.message} (${data.error})` : data.message;
      throw new Error(errorMessage || "Something went wrong while saving the profile.");
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the backend server. Please ensure it is running.");
    }
    throw error;
  }
};

/**
 * Fetch an existing student profile by ID
 */
export const fetchStudentProfile = async (id) => {
  try {
    const response = await fetch(`/api/students/profile/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch student profile.");
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the backend server.");
    }
    throw error;
  }
};

/**
 * Update an existing student profile
 */
export const updateStudentProfile = async (id, profileData) => {
  try {
    const response = await fetch(`/api/students/profile/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong while updating the profile.");
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the backend server.");
    }
    throw error;
  }
};
