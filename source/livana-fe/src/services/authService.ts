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

  verifyEmail: async (
    email: string,
    verificationCode: string
  ): Promise<ApiResponse<string>> => {
    const response = await api.post<ApiResponse<string>>(
      "/auth/verify",
      {
        email,
        verificationCode,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  resendVerificationCode: async (
    email: string
  ): Promise<ApiResponse<string>> => {
    const response = await api.post<ApiResponse<string>>(
      "/auth/resend-verification",
      null,
      {
        params: { email },
        withCredentials: true,
      }
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<string>> => {
    const response = await api.post<ApiResponse<string>>(
      "/auth/forgot-password",
      {
        email,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<string>> => {
    const response = await api.post<ApiResponse<string>>(
      "/auth/reset-password",
      {
        token,
        newPassword,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
