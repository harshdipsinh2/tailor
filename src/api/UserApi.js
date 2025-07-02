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

// Get users by shop (for Admin/SuperAdmin)
export const getUsersByShop = async (shopId, branchId = null) => {
    try {
        const params = { shopId };
        if (branchId !== null && branchId !== undefined) params.branchId = branchId;
        const response = await api.get('/api/Admin/admin/users', { params });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching users by shop: ' + error.message);
    }
};

// Get users by branch (for Manager)
export const getUsersByBranch = async (shopId, branchId) => {
    try {
        const params = { shopId, branchId };
        const response = await api.get('/api/Admin/manager/users', { params });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching users by branch: ' + error.message);
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

export const getAllTailors = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllTailor-User`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching tailors: ' + error.message);
    }
};