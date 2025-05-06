import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7252/api",
  headers: { "Content-Type": "application/json" },
});

// Add token to request headers unless the endpoint is public
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/auth/login", "/auth/register"];

    if (token && !publicRoutes.some(route => config.url.includes(route))) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
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
