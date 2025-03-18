const API_BASE_URL = "https://localhost:7252/api/Order";

export const getAllOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/GetAll`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    throw error;
  }
};

export const getOrder = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Get/${id}`);
    if (!response.ok) throw new Error("Failed to fetch order");
    return await response.json();
  } catch (error) {
    console.error("Error fetching order:", error.message);
    throw error;
  }
};

export const addOrder = async (orderData, customerId, productId, fabricId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Create?customerId=${customerId}&productId=${productId}&fabricId=${fabricId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }
    );
    if (!response.ok) throw new Error("Failed to add order");
    return await response.json();
  } catch (error) {
    console.error("Error adding order:", error.message);
    throw error;
  }
};

export const updateOrder = async (id, orderData, productId, fabricId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Update/${id}?productId=${productId}&fabricId=${fabricId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }
    );
    if (!response.ok) throw new Error("Failed to update order");
    return await response.json();
  } catch (error) {
    console.error("Error updating order:", error.message);
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete order");
    return await response.json();
  } catch (error) {
    console.error("Error deleting order:", error.message);
    throw error;
  }
};
