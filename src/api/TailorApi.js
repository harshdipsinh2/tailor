import api from './api';

const API_BASE_URL = '/api/Tailor';

// ============================Summary
export const getSummary = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/summary`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching summary: ' + error.message);
    }
};

// ==========================Measurements
export const addMeasurement = async (customerId, measurementData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/AddMeasurement`, measurementData, { params: { customerId } });
        return response.data;
    } catch (error) {
        throw new Error('Error adding measurement: ' + error.message);
    }
};

export const getAllMeasurements = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllMeasurements`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all measurements: ' + error.message);
    }
};

// =================================Products
export const getAllProducts = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllProducts`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all products: ' + error.message);
    }
};

// ===============================Fabric Types
export const getAllFabricTypes = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllFabricTypes`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all fabric types: ' + error.message);
    }
};

//=================================== Fabric Stocks
export const getAllFabricStocks = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllFabricStocks`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all fabric stocks: ' + error.message);
    }
};

// =======================================Orders
export const getAllOrders = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAll-Order`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all orders: ' + error.message);
    }
};
