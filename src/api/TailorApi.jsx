import api from './api';

const API_BASE_URL = '/api/Tailor';

// Summary
export const getSummary = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/summary`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching summary: ' + error.message);
    }
};

// Measurements
export const addMeasurement = async (customerId, measurementData) => {
    try {
        await api.post(`${API_BASE_URL}/AddMeasurement`, measurementData, { params: { customerId } });
    } catch (error) {
        throw new Error('Error adding measurement: ' + error.message);
    }
};

export const getAllMeasurements = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllMeasurements`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching measurements: ' + error.message);
    }
};

// Products
export const getAllProducts = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllProducts`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
};

// Fabric Types
export const getAllFabricTypes = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllFabricTypes`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching fabric types: ' + error.message);
    }
};

// Fabric Stocks
export const getAllFabricStocks = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllFabricStocks`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching fabric stocks: ' + error.message);
    }
};

// Orders
export const getAllOrders = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAll-Order`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};