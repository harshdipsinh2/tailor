const API_BASE_URL = "https://localhost:7252/api/Fabric";

// Get All Fabrics
export const getAllFabrics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-fabrics`);
    if (!response.ok) throw new Error("Failed to fetch fabrics");
    return await response.json();
  } catch (error) {
    console.error("Error fetching fabrics:", error.message);
    throw error;
  }
};

// Get Fabric by ID
export const getFabric = async (fabricId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-fabric/${fabricId}`);
    if (!response.ok) throw new Error("Failed to fetch fabric details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching fabric details:", error.message);
    throw error;
  }
};

// Add New Fabric
export const addFabric = async (fabricData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add-fabric`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fabricData),
    });
    if (!response.ok) throw new Error("Failed to add fabric");
    return await response.json();
  } catch (error) {
    console.error("Error adding fabric:", error.message);
    throw error;
  }
};

// Delete Fabric
export const deleteFabric = async (fabricId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete?fabricId=${fabricId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete fabric");
    return await response.json();
  } catch (error) {
    console.error("Error deleting fabric:", error.message);
    throw error;
  }
};
