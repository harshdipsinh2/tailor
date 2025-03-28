import api from './api';

const API_BASE_URL = '/api/Auth';

// Login
export const login = async (email, password) => {
    try {
        const response = await api.post(`${API_BASE_URL}/login`, null, { params: { email, password } });
        return response.data;
    } catch (error) {
        throw new Error('Error logging in: ' + error.message);
    }
};

// Register
export const register = async (name, email, password, mobileNo, address, roleName) => {
    try {
        const response = await api.post(`${API_BASE_URL}/register`, null, { params: { name, email, password, mobileNo, address, roleName } });
        return response.data;
    } catch (error) {
        throw new Error('Error registering: ' + error.message);
    }
};
