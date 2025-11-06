import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8080/api/v1"
      : "/api",
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

// handle 403 errors and refresh token logic
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Do not try to refresh token for these endpoints
    if (
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;
    console.log(error.response?.status);

    if (error.response?.status === 401 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      console.log("refreshing token...");

      try {
        const res = await api.post("/auth/refresh-token", {
          withCredentials: true,
        });

        const newAccessToken = res.data.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
