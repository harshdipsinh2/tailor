import axios from "axios";
import store from "../store"; 

const api = axios.create({
  baseURL: "https://localhost:7252/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState(); 
    const token = state.auth.token; 
    
    // Add token if available and endpoint requires it
    if (token && !config.url.includes("/users/register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Failed to fetch user details. Please log in again.");
      store.dispatch({ type: "auth/logout" }); // Dispatch logout action
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
