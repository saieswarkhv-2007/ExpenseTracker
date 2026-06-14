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
    return config;
  },
  (error) => Promise.reject(error)
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