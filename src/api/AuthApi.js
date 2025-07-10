import api from './api';

const API_BASE_URL = 'https://tailorapi-xp7m.onrender.com';

// Login API
export const login = async (email, password) => {
  try {
    const response = await api.post(`${API_BASE_URL}/login`, null, {
      params: { email, password }
    });

    if (response.status === 200) {
      const token = response.data.Token;
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return {
        Token: token,
        roles: tokenPayload.roles
      };
    }
    throw new Error('Login failed');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Admin Registration
export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/register/admin`, adminData, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error('Admin registration failed with status: ' + response.status);
    }
  } catch (error) {
    if (error.response) {
      throw new Error('Admin registration error: ' + (error.response.data?.Message || error.message));
    } else if (error.request) {
      throw new Error('Network error during admin registration.');
    } else {
      throw new Error('Unexpected error: ' + error.message);
    }
  }
};

// Employee Registration (Manager or Tailor)
export const registerEmployee = async (employeeData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/register/employee`, employeeData, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error('Employee registration failed with status: ' + response.status);
    }
  } catch (error) {
    if (error.response) {
      throw new Error('Employee registration error: ' + (error.response.data?.Message || error.message));
    } else if (error.request) {
      throw new Error('Network error during employee registration.');
    } else {
      throw new Error('Unexpected error: ' + error.message);
    }
  }
};

// OTP Verification
export const verifyOTP = async (verificationData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/verify-otp`, verificationData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error('OTP verification failed');
  } catch (error) {
    if (error.response) {
      throw new Error('Error verifying OTP: ' + (error.response.data?.Message || error.message));
    } else if (error.request) {
      throw new Error('Network error. Please try again.');
    } else {
      throw new Error('Unexpected error: ' + error.message);
    }
  }
};
