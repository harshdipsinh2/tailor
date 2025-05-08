import api from './api';

const API_BASE_URL = '/api/Admin';

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
        // Ensure we're returning an array, even if empty
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching customers:', error);
        return []; // Return empty array on error
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

// Add function to get customer details
export const getCustomerById = async (customerId) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetCustomer`, {
            params: { customerId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching customer:', error);
        throw error;
    }
};

// Measurements
export const addMeasurement = async (customerId, measurementData) => {
    try {
      // Log the data being sent
      console.log('Adding measurement for customer:', customerId, measurementData);
      
      const response = await api.post(
        `${API_BASE_URL}/AddMeasurement`,
        measurementData,
        {
          params: { customerId }
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      throw new Error(response.data?.message || 'Failed to add measurement');
    } catch (error) {
      console.error('Add measurement error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Failed to add measurement');
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

// AdminApi.jsx
export const deleteMeasurement = async (MeasurementID) => {
    try {
      const response = await api.delete(
        `https://localhost:7252/api/Admin/DeleteMeasurement`,
        {
          params: { MeasurementID } // 👈 Pass as query param
        }
      );
      return response.data;
    } catch (error) {
      console.error("Delete measurement error:", error);
      throw new Error(error.response?.data?.message || "Measurement not found.");
    }
  };
  

export const getAllMeasurements = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAllMeasurements`);
        if (!response.data) {
            throw new Error('No data received from the server');
        }
        // Log the response to check the data structure
        console.log('Measurements API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching measurements:', error);
        throw new Error('Error fetching measurements: ' + error.message);
    }
};

// Products
export const addProduct = async (productData) => {
    try {
        await api.post(`${API_BASE_URL}/AddProduct`, productData);
    } catch (error) {
        throw new Error('Error adding product: ' + error.message);
    }
};

export const updateProduct = async (id, productData) => {
    try {
        await api.put(`${API_BASE_URL}/UpdateProduct/${id}`, productData);
    } catch (error) {
        throw new Error('Error updating product: ' + error.message);
    }
};

export const deleteProduct = async (id) => {
    try {
        await api.delete(`${API_BASE_URL}/DeleteProduct/${id}`);
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
        throw new Error('Error fetching products: ' + error.message);
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
export const createOrder = async (orderData) => {
    try {
      // Include ID fields in query params and rest in request body
      const queryParams = {
        customerId: orderData.CustomerId,
        productId: orderData.ProductId,
        fabricTypeId: orderData.FabricTypeId,
        assignedTo: orderData.AssignedTo || 0
      };
  
      // Create request body for remaining data
      const requestBody = {
        FabricLength: orderData.FabricLength,
        Quantity: orderData.Quantity,
        OrderDate: orderData.OrderDate,
        CompletionDate: orderData.CompletionDate,
        OrderStatus: orderData.OrderStatus,
        PaymentStatus: orderData.PaymentStatus
      };
  
      const response = await api.post(`${API_BASE_URL}/Create-Order`, requestBody, {
        params: queryParams
      });
  
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
  
      throw new Error(response.data?.title || 'Error creating order');
    } catch (error) {
      console.error('API Error:', error.response?.data || error);
      const errorMessage = error.response?.data?.title || error.message;
      throw new Error(`Error creating order: ${errorMessage}`);
    }
  };

export const updateOrder = async (orderId, orderData) => {
    try {
        const response = await api.put(`${API_BASE_URL}/Order/${orderId}`, orderData);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response?.data);
        throw new Error('Error updating order: ' + (error.response?.data?.message || error.message));
    }
};

export const updateOrderStatus = async (orderId, statusData) => {
    try {
        await api.put(`${API_BASE_URL}/update-status/${orderId}`, statusData);
    } catch (error) {
        throw new Error('Error updating order status: ' + error.message);
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

export const getRevenue = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/revenue`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching revenue: ' + error.message);
    }
};

// Roles
export const getAllRoles = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetAll-Role`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching roles: ' + error.message);
    }
};

export const getRoleById = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetById-Role/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching role: ' + error.message);
    }
};

export const updateRole = async (id, roleName) => {
    try {
        await api.put(`${API_BASE_URL}/Update-Role${id}`, roleName);
    } catch (error) {
        throw new Error('Error updating role: ' + error.message);
    }
};

export const deleteRole = async (id) => {
    try {
        await api.delete(`${API_BASE_URL}/Delete-Role${id}`);
    } catch (error) {
        throw new Error('Error deleting role: ' + error.message);
    }
};