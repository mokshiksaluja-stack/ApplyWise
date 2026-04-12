import { loginAPI } from './api';

// Dummy credentials matrix mapping specifically to RBAC arrays
const DUMMY_USERS = {
  'student@example.com': { id: 's1001', name: 'Student Demo', email: 'student@example.com', role: 'student' },
  'admin@example.com': { id: 'a1001', name: 'Admin Demo', email: 'admin@example.com', role: 'admin' },
  'coordinator@example.com': { id: 'c1001', name: 'Coordinator Demo', email: 'coordinator@example.com', role: 'coordinator' }
};

const DUMMY_PASSWORD = 'password123';

/**
 * Executes login workflow. Attempts to contact live backend first.
 * If API fails, triggers development-only fallback dictionary.
 */
export const loginUser = async (credentials) => {
  try {
    // 1. Attempt Live API Connection
    const response = await loginAPI(credentials);
    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    // 2. Intercept Error Payload
    const isDevelopment = import.meta.env.DEV;
    
    // 3. Fallback Trigger (Only activated in dev mode)
    if (isDevelopment) {
      console.warn("Backend Auth Failed. Entering Development Mock Service Payload...");
      const { email, password } = credentials;

      const matchedUser = DUMMY_USERS[email];
      
      // Enforce strict password validation even in mock environment 
      if (matchedUser && password === DUMMY_PASSWORD) {
         // Return matching structured payload guaranteeing routing pipeline stays clean
         return {
            success: true,
            user: matchedUser,
            token: `mock_jwt_development_token_${matchedUser.role}_77301`
         };
      }
      
      throw new Error("Invalid credentials. Please verify demo accounts.");
    }

    // 4. If production or unhandled error, toss it upwards to UI
    throw new Error(error.response?.data?.message || 'Authentication system off-line.');
  }
};
