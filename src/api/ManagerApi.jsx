import api from './api';

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

// Customers
export const getAllCustomers = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllCustomers`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching customers: ' + error.message);
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
        await api.put(`${API_BASE_URL}/EditCustomer`, customerData, { params: { customerId } });
    } catch (error) {
        throw new Error('Error editing customer: ' + error.message);
    }
};

export const deleteCustomer = async (customerId) => {
    try {
        await api.delete(`${API_BASE_URL}/DeleteCustomer`, { params: { customerId } });
    } catch (error) {
        throw new Error('Error deleting customer: ' + error.message);
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
        await api.delete(`${API_BASE_URL}/DeleteMeasurement`, { params: { measurementId } });
    } catch (error) {
        throw new Error('Error deleting measurement: ' + error.message);
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

// Fabric Types
export const addFabricType = async (fabricTypeData) => {
    try {
        await api.post(`${API_BASE_URL}/AddFabricType`, fabricTypeData);
    } catch (error) {
        throw new Error('Error adding fabric type: ' + error.message);
    }
};

export const updateFabricPrice = async (id, newPrice) => {
    try {
        await api.put(`${API_BASE_URL}/UpdateFabricPrice`, null, { params: { id, newPrice } });
    } catch (error) {
        throw new Error('Error updating fabric price: ' + error.message);
    }
};

export const getAllFabricTypes = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllFabricTypes`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching fabric types: ' + error.message);
    }
};

export const getFabricTypeById = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetFabricTypeById`, { params: { id } });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching fabric type: ' + error.message);
    }
};

export const softDeleteFabricType = async (id) => {
    try {
        await api.delete(`${API_BASE_URL}/SoftDeleteFabricType`, { params: { id } });
    } catch (error) {
        throw new Error('Error deleting fabric type: ' + error.message);
    }
};

// Fabric Stocks
export const addFabricStock = async (fabricStockData) => {
    try {
        await api.post(`${API_BASE_URL}/AddFabricStock`, fabricStockData);
    } catch (error) {
        throw new Error('Error adding fabric stock: ' + error.message);
    }
};

export const getAllFabricStocks = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllFabricStocks`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching fabric stocks: ' + error.message);
    }
};

export const getFabricStockById = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetFabricStockById`, { params: { id } });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching fabric stock: ' + error.message);
    }
};

// Orders
export const createOrder = async (customerId, productId, fabricTypeId, assignedTo, orderData) => {
    try {
        await api.post(`${API_BASE_URL}/Create-Order`, orderData, {
            params: { customerId, productId, fabricTypeId, assignedTo }
        });
    } catch (error) {
        throw new Error('Error creating order: ' + error.message);
    }
};

export const updateOrder = async (id, productId, fabricTypeId, assignedTo, orderData) => {
    try {
        await api.put(`${API_BASE_URL}/Update-Ordre/${id}`, orderData, {
            params: { productId, fabricTypeId, assignedTo }
        });
    } catch (error) {
        throw new Error('Error updating order: ' + error.message);
    }
};

export const deleteOrder = async (id) => {
    try {
        await api.delete(`${API_BASE_URL}/Delete-Order/${id}`);
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
        throw new Error('Error fetching orders: ' + error.message);
    }
};