import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7252/api",
  headers: { "Content-Type": "application/json" },
});

// Add token from localStorage to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ Direct from localStorage

    if (token && !config.url.includes("/auth/register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiry or unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token"); 
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;
