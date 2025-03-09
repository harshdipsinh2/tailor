const API_BASE_URL = "https://localhost:7252/api/Customer";

export const getAllCustomers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/GetAllCustomers`);
    if (!response.ok) throw new Error("Failed to fetch customers");
    return await response.json();
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    throw error;
  }
};

export const getCustomer = async (customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/GetCustomer?customerId=${customerId}`);
    if (!response.ok) throw new Error("Failed to fetch customer");
    return await response.json();
  } catch (error) {
    console.error("Error fetching customer:", error.message);
    throw error;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/AddCustomer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error("Failed to add customer");
    return await response.json();
  } catch (error) {
    console.error("Error adding customer:", error.message);
    throw error;
  }
};

export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}?customerId=${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error("Failed to update customer");
    return await response.json();
  } catch (error) {
    console.error("Error updating customer:", error.message);
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Delete?customerId=${customerId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete customer");
    return await response.json();
  } catch (error) {
    console.error("Error deleting customer:", error.message);
    throw error;
  }
};