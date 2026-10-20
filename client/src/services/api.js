import axios from "axios";

// Change from: const API_URL = "http://localhost:8000/api";
const API_URL = "https://cab-booking-system-server1.onrender.com/api" || "http://localhost:8000/api";

// ==================== AXIOS INSTANCE ====================
// const API = axios.create({
//   baseURL: API_URL, 
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const API = axios.create({
  // Fallback to localhost if the environment variable isn't set yet
  baseURL: API_URL,
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
});

// ==================== REQUEST INTERCEPTOR ====================
API.interceptors.request.use(
  (config) => {
    const isAdminRoute =
      config.url?.includes("/admin") ||
      window.location.pathname.startsWith("/admin");

    const token = isAdminRoute
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith("/admin");

      if (isAdminRoute) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        localStorage.removeItem("role");
        window.location.href = "/admin/login";
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;