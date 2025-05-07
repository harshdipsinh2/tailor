import api from './api';

const API_BASE_URL = '/api/Auth';

export const login = async (email, password) => {
  try {
    const response = await api.post(`${API_BASE_URL}/login`, null, {
      params: { email, password }
    });
    
    if (response.status === 200) {
      // Extract JWT claims
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

// Register
export const register = async (name, email, password, mobileNo, address, roleName) => {
  try {
    const response = await api.post(`${API_BASE_URL}/register?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&mobileNo=${encodeURIComponent(mobileNo)}&address=${encodeURIComponent(address)}&roleName=${encodeURIComponent(roleName)}`);
    
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error('Registration failed with unexpected status: ' + response.status);
    }
  } catch (error) {
    if (error.response) {
      // Error response from the server
      throw new Error('Error registering: ' + (error.response.data?.message || error.message));
    } else if (error.request) {
      // No response received (e.g., network error)
      throw new Error('Network error. Please try again.');
    } else {
      // Other errors
      throw new Error('Unexpected error: ' + error.message);
    }
  }
};
