const API_BASE_URL = "https://localhost:7252/api/product";

export const addProduct = async (productData) => {
  try {
    const queryParams = new URLSearchParams(productData).toString();
    const response = await fetch(`${API_BASE_URL}/add-product?${queryParams}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding product:", errorData);
      throw new Error("Failed to add product");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding product:", error.message);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${productId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw error;
  }
};