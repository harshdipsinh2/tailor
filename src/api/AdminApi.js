import api from './api';

const API_BASE_URL = '/api/Admin';
const API_BASE_URL_PAYMENT = '/api/Plan';

// Summary
export const getSummary = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/summary`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching summary: ' + error.message);
    }
};


export const getAllCustomers = async (shopId = null, branchId = null) => {
  try {
    const role = localStorage.getItem("role");

    let endpoint = '';
    let params = {};

    if (role === "SuperAdmin") {
      endpoint = '/api/Admin/GetAllCustomersForSuperAdmin';
      params = { shopId, branchId };
    } else if (role === "Admin") {
      endpoint = '/api/Admin/GetAllCustomer-Admin';
      params = { shopId, branchId };
    } else {
      endpoint = '/api/Admin/GetAllCustomer-Manager';
      // For Manager, no params needed (ShopId/BranchId are read from token)
    }

    const response = await api.get(endpoint, { params });

    return response.data;
  } catch (error) {
    throw new Error("Error fetching customers: " + error.message);
  }
};


// export const getAllCustomers = async () => {
//     try {
//         const response = await api.get(`${API_BASE_URL}/GetAllCustomers`);
//         return response.data;
//     } catch (error) {
//         throw new Error('Error fetching fabric stocks: ' + error.message);
//     }
// };



export const getCustomer = async (customerId) => {
    try {
        const response = await api.get(`${API_BASE_URL}/GetCustomer`, { params: { customerId } });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching customer: ' + error.message);
    }
};

export const getCustomerByBranch = async (shopId, branchId) => {
    try {
        const params = { shopId, branchId };
        const response = await api.get('/api/Admin/GetAllCustomersForSuperAdmin', { params });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching users by branch: ' + error.message);
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
      console.log('Adding measurement for customer:', customerId, measurementData);
  
      const response = await api.post(
        `https://localhost:7252/api/Admin/AddMeasurement`, // ✅ Your endpoint
        measurementData,
        {
          params: { CustomerId: customerId }, // ✅ Pass as query param
        }
      );
  
      return response.data;
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
        const role = localStorage.getItem("role");

        const endpoint = role === "SuperAdmin"
            ? '/api/Admin/GetAllMeasurementForSuperAdmin'
            : '/api/Admin/GetAllMeasurements';

        const response = await api.get(endpoint);
        return response.data;
        } catch (error) {
        throw new Error("Error fetching measurements: " + error.message);
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
    try{
        const role = localStorage.getItem("role");

        const endpoint = role === "SuperAdmin"
            ? '/api/Admin/GetAllProductsForSuperAdmin'
            : '/api/Admin/GetAllProducts';
        const response = await api.get(endpoint);
        return response.data;
        } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
        }
    }


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

        const role = localStorage.getItem("role");
        const endpoint = role === "SuperAdmin"
            ? '/api/Admin/GetAllFabricTypeForSuperAdmin'
            : '/api/Admin/GetAllFabricTypes';
            const response = await api.get(endpoint);
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
// AdminApi.js
export const createOrder = async (orderData) => {
  const {
    CustomerId,
    ProductId,
    FabricTypeId,
    AssignedTo,
    Quantity,
    OrderDate,
    CompletionDate,
    OrderStatus,
    PaymentStatus
  } = orderData;

  const queryParams = new URLSearchParams({
    customerId: CustomerId,
    productId: ProductId,
    fabricTypeId: FabricTypeId,
    assignedTo: AssignedTo
  });

  const payload = {
    Quantity,
    OrderDate,
    CompletionDate,
    OrderStatus,
    PaymentStatus
  };

  console.log("Sending request to:", `/api/Admin/Create-Order?${queryParams.toString()}`);
  console.log("With body:", payload);

  const response = await api.post(
    `/api/Admin/Create-Order?${queryParams.toString()}`,
    payload
  );

  return response.data;
};



export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await api.put(`${API_BASE_URL}/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await api.put(`${API_BASE_URL}/UpdateOrderStatus/${orderId}`, {
      OrderStatus: statusData.OrderStatus,
      PaymentStatus: statusData.PaymentStatus,
      CompletionDate: statusData.CompletionDate // Add completion date support
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error.response?.data || error.message;
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

// Add new order endpoints
export const updateOrderApproval = async (orderId, approvalData) => {
  try {
    const response = await api.put(`${API_BASE_URL}/${orderId}/approval`, approvalData);
    return response.data;
  } catch (error) {
    console.error('Error updating order approval:', error);
    throw error.response?.data || error.message;
  }
};

export const getRejectedOrders = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/rejected`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rejected orders:', error);
    throw error.response?.data || error.message;
  }
};

export const reassignOrder = async (orderId, reassignData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/orders/${orderId}/reassign`,
      reassignData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to reassign order');
  }
};


//---------------------------------------------



export const addBranch = async (branchData) => {
    try {
        const response = await api.post(`${API_BASE_URL}/create-Branch`, branchData);
        return response.data;
    } catch (error) {
        throw new Error('Error adding branch: ' + error.message);
    }
}

// export const getAllCustomers = async () => {
//     try {
//         const response = await api.get(`${API_BASE_URL}/GetAllCustomers`);
//         return response.data;
//     } catch (error) {
//         throw new Error('Error fetching fabric stocks: ' + error.message);
//     }
// };


//     export const getAllBranches = async () => {
//         try {

//         const response = await api.get(`${API_BASE_URL}/all-branches`);
//         return response.data;
                                            
//     } catch (error) {
//         throw new Error('Error fetching branches: ' + error.message);
//     }
// }


    export const getAllBranches = async () => {
        try {
        const role = localStorage.getItem("role");

        let endpoint = '';

        if (role === "SuperAdmin") {
            endpoint = '/api/Admin/All-BranchesForSuperAdmin';
        } 
        else 
        {
            endpoint = '/api/Admin/all-branches';
        }
        const response = await api.get(endpoint);
        return response.data;
                                            
    } catch (error) {
        throw new Error('Error fetching branches: ' + error.message);
    }
}

// export const getUsersByShopAndBranch = async (shopId, branchId) => {                                                                      
//   try {
//     const response = await api.get(`/api/Admin/users-by-shop`, {
//       params: { shopId, branchId }
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error('Error fetching users for SuperAdmin: ' + error.message);
//   }
// };

// // For Admin - only uses branchId (shopId comes from JWT in backend)
// export const getUsersByBranch = async (branchId) => {
//   try {
//     const response = await api.get(`/api/Admin/users-by-branch`, {
//       params: { branchId }
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error('Error fetching users for Admin: ' + error.message);
//   }
// };


//------------------------------------

export const getAllPlans = async () => {
  try {
    const response = await api.get(`${API_BASE_URL_PAYMENT}/all`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch plans: ' + error.message);
  }
};

export const buyPlan = async (planId) => {
  try {
    const response = await api.post(`https://localhost:7252/api/Plan/buy`, null, {
      params: { planId }
    });
    return response.data.url; // ✅ Stripe session link
  } catch (error) {
    throw new Error('Failed to initiate payment: ' + error.message);
  }
};


export const createPlan = async (planData) => {
  try {
    const response = await api.post(`${API_BASE_URL_PAYMENT}/create`, planData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create plan: ' + error.message);
  }
};



export const registerUser = async (payload) => {
  try {
    const response = await api.post(`/admin/register/employee`, payload);
    return response.data;
  } catch (error) {
    throw new Error('Error registering employee: ' + error.message);
  }
};
