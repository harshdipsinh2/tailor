import api from './api';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = '/auth'; 

// Login
// Login with query params instead of request body
export const login = async (email, password) => {
  try {
    const response = await api.post(`/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    const token = response.data.token;

    localStorage.setItem("token", token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const decoded = jwtDecode(token);
    const role = decoded?.role || response.data?.role;
    localStorage.setItem("role", role);

    return { ...response.data, role, token }; // include token in return value
  } catch (error) {
    throw new Error('Error logging in: ' + (error.response?.data?.message || error.message));
  }
};

// Register
export const register = async (name, email, password, mobileNo, address, roleName) => {
  try {
    const response = await api.post(`${API_BASE_URL}/register`, {
      name,
      email,
      password,
      mobileNo,
      address,
      roleName,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error registering: ' + (error.response?.data?.message || error.message));
  }
};
