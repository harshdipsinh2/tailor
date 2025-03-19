const API_BASE_URL = "https://localhost:7252/api/User";

export const registerEmployee = async (employeeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error("Failed to register employee");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const loginEmployee = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Login?email=${email}&password=${password}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to log in employee");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getAllEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/GetAll`);
    if (!response.ok) throw new Error("Failed to fetch employees");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/GetById/${id}`);
    if (!response.ok) throw new Error("Failed to fetch employee");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete employee");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error("Failed to update employee");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
