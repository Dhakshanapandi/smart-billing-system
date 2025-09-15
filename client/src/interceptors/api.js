import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "https://smart-billing-system.onrender.com/api",
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or get it from Redux/context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default api;
