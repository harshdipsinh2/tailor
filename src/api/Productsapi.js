const API_BASE_URL = "https://localhost:7252/api/Product";

export const addProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding product:", errorData);
      throw new Error(errorData.message || "Failed to add product");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding product:", error.message);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw error;
  }
};
