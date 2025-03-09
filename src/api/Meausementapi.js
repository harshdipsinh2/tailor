const API_BASE_URL = "https://localhost:7252/api";

export const getAllMeasurement = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Measurement/GetAll`);
    if (!response.ok) throw new Error("Failed to fetch measurement");
    return await response.json();
  } catch (error) {
    console.error("Error fetching measurement:", error.message);
    throw error;
  }
};

export const addMeasurement = async (customerId, measurementData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Measurement/AddMeasurement?customerId=${customerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(measurementData)
    });
    if (!response.ok) throw new Error("Failed to add measurement");
    return await response.json();
  } catch (error) {
    console.error("Error adding measurement:", error.message);
    throw error;
  }
};

export const getMeasurementDetail = async (customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Measurement/Detail?customerId=${customerId}`);
    if (!response.ok) throw new Error("Failed to fetch measurement detail");
    return await response.json();
  } catch (error) {
    console.error("Error fetching measurement detail:", error.message);
    throw error;
  }
};

export const deleteMeasurement = async (measurementId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Measurement?measurementId=${measurementId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error("Failed to delete measurement");
    return await response.json();
  } catch (error) {
    console.error("Error deleting measurement:", error.message);
    throw error;
  }
};
