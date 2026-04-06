/// <reference types="vite/client" />
import axios from "axios";

const system_key = "medicway_system_key_2024"; // System key for API authentication
const URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1/";

const axiosInstance = axios.create({
  baseURL: URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "x-system-key": system_key,
  },
  withCredentials: true,
});

// Request interceptor to add the admin token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
