import axios from "axios";

// ─── Spring Boot API (port 20007) ────────────────────────────────────────────
// Handles: /auth/login, /auth/register, /expenses, /categories, /admin/users
const API = axios.create({
  baseURL: "http://localhost:2000",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure Content-Type is set for all requests
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ─── Node / MongoDB API (port 5001) ──────────────────────────────────────────
// Handles: /api/logs, /api/activity, /api/embeddings
const NODE_API = axios.create({
  baseURL: "http://localhost:5001",
});

NODE_API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { NODE_API };
export default API;