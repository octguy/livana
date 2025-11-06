import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8080/api/v1"
      : "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// assign the access token to the authorization header
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  // if access token exists, add it to the headers
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;
