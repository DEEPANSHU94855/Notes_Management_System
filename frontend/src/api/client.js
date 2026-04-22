import axios from "axios";

const api = axios.create({
  // In dev, leave blank so Vite proxy (/api -> localhost:5000) is used.
  // In production, VITE_API_BASE_URL can point to deployed backend.
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 10000,
});

// Attach token for protected routes.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
