import api from './api';
import axios from 'axios';

const API_BASE_URL = '/api/Manager';

// Summary
export const getSummary = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/summary`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching summary: ' + error.message);
    }
};

// ------------------------------------------------Customers
export const getAllCustomers = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllCustomers`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all customers: ' + error.message);
    }
};

export const getCustomer = async (customerId) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetCustomer`, { params: { customerId } });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching customer: ' + error.message);
    }
};

export const addCustomer = async (customerData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/AddCustomer`, customerData);
        return response.data;
    } catch (error) {
        throw new Error('Error adding customer: ' + error.message);
    }
};

export const editCustomer = async (customerId, customerData) => {
    try {
        const response = await api.put(`${API_BASE_URL}/EditCustomer`, customerData, { params: { customerId } });
        return response.data;
    } catch (error) {
        throw new Error('Error editing customer: ' + error.message);
    }
};

export const deleteCustomer = async (customerId) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/DeleteCustomer`, { params: { customerId } });
        return response.data;
    } catch (error) {
        throw new Error('Error deleting customer: ' + error.message);
    }
};

// -----------------------------------------------Measurements
export const addMeasurement = async (customerId, measurementData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/AddMeasurement`, measurementData, { params: { customerId } });
        return response.data;
    } catch (error) {
        throw new Error('Error adding measurement: ' + error.message);
    }
};

export const getMeasurement = async (customerId) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetMeasurement`, { params: { customerId } });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching measurement: ' + error.message);
    }
};

export const deleteMeasurement = async (measurementId) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/DeleteMeasurement`, { params: { measurementId } });
        return response.data;
    } catch (error) {
        throw new Error('Error deleting measurement: ' + error.message);
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

// Products
export const addProduct = async (productData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/AddProduct`, productData);
        return response.data;
    } catch (error) {
        throw new Error('Error adding product: ' + error.message);
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`${API_BASE_URL}/UpdateProduct/${id}`, productData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating product: ' + error.message);
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/DeleteProduct/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error deleting product: ' + error.message);
    }
};

export const getProduct = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetProduct/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching product: ' + error.message);
    }
};

export const getAllProducts = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllProducts`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all products: ' + error.message);
    }
};

// ----------------------------------------Fabric Types
export const addFabricType = async (fabricTypeData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/AddFabricType`, fabricTypeData);
        return response.data;
    } catch (error) {
        throw new Error('Error adding fabric type: ' + error.message);
    }
};

export const updateFabricPrice = async (id, newPrice) => {
    try {
        const response = await api.put(`${API_BASE_URL}/UpdateFabricPrice`, null, { params: { id, newPrice } });
        return response.data;
    } catch (error) {
        throw new Error('Error updating fabric price: ' + error.message);
    }
};

export const getAllFabricTypes = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllFabricTypes`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all fabric types: ' + error.message);
    }
};

export const getFabricTypeById = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetFabricTypeById`, { params: { id } });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching fabric type by ID: ' + error.message);
    }
};

export const softDeleteFabricType = async (id) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/SoftDeleteFabricType`, { params: { id } });
        return response.data;
    } catch (error) {
        throw new Error('Error soft deleting fabric type: ' + error.message);
    }
};

//----------------------------------- Fabric Stocks
export const addFabricStock = async (fabricStockData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/AddFabricStock`, fabricStockData);
        return response.data;
    } catch (error) {
        throw new Error('Error adding fabric stock: ' + error.message);
    }
};

export const getAllFabricStocks = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllFabricStocks`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all fabric stocks: ' + error.message);
    }
};

export const getFabricStockById = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetFabricStockById`, { params: { id } });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching fabric stock by ID: ' + error.message);
    }
};

//---------------------------------- Orders
export const createOrder = async (customerId, productId, fabricTypeId, assignedTo, orderData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/Create-Order`, orderData, { params: { customerId, productId, fabricTypeId, assignedTo } });
        return response.data;
    } catch (error) {
        throw new Error('Error creating order: ' + error.message);
    }
};

export const updateOrder = async (id, productId, fabricTypeId, assignedTo, orderData) => {
    try {
        const response = await api.put(`${API_BASE_URL}/Update-Order/${id}`, orderData, { params: { productId, fabricTypeId, assignedTo } });
        return response.data;
    } catch (error) {
        throw new Error('Error updating order: ' + error.message);
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/Delete-Order/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error deleting order: ' + error.message);
    }
};

export const getOrder = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/Get-Order/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching order: ' + error.message);
    }
};

export const getAllOrders = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAll-Order`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching all orders: ' + error.message);
    }
};
