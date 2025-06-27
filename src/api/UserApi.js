import api from './api';

const API_BASE_URL = '/api/Admin';

export const registerUser = async (userData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/Register`, userData);
        return response.data;
    } catch (error) {
        throw new Error('Error registering user: ' + error.message);
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAll-User`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetUserById/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};

export const deleteUser = async (id) => {
    try {
        await api.delete(`${API_BASE_URL}/Delete-User/${id}`);
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
};

export const updateUser = async (id, userData) => {
    try {
        await api.put(`${API_BASE_URL}/Update-User/${id}`, userData);
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
};