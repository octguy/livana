import api from "@/lib/axios";
import type { ApiResponse } from "@/types/apiResponse";
import type { AuthResponse } from "@/types/authResponse";

export const authService = {
  login: async (
    username: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  signUp: async (
    username: string,
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  logOut: async () => {
    const response = await api.post("/auth/logout", {
      withCredentials: true,
    });
    return response.data;
  },

  fetchMe: async () => {
    const response = await api.get("/users/me", {
      withCredentials: true,
    });
    return response.data;
  },

  refresh: async () => {
    const response = await api.post("/auth/refresh-token", {
      withCredentials: true,
    });
    return response.data.data.accessToken;
  },
};
