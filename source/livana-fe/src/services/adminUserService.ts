import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response/apiResponse";
import type {
  AdminUserResponse,
  PageResponse,
  UserRole,
  UserStatus,
} from "@/types/response/adminUserResponse";

export interface GetUsersParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: UserStatus;
}

export const adminUserService = {
  getAllUsers: async (
    params: GetUsersParams = {}
  ): Promise<ApiResponse<PageResponse<AdminUserResponse>>> => {
    const response = await api.get<
      ApiResponse<PageResponse<AdminUserResponse>>
    >(`/admin/users`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        keyword: params.keyword || undefined,
        status: params.status || undefined,
      },
      withCredentials: true,
    });
    return response.data;
  },

  getUserById: async (id: string): Promise<ApiResponse<AdminUserResponse>> => {
    const response = await api.get<ApiResponse<AdminUserResponse>>(
      `/admin/users/${id}`,
      { withCredentials: true }
    );
    return response.data;
  },

  updateUserRoles: async (
    id: string,
    roles: UserRole[]
  ): Promise<ApiResponse<AdminUserResponse>> => {
    const response = await api.put<ApiResponse<AdminUserResponse>>(
      `/admin/users/${id}/roles`,
      { roles },
      { withCredentials: true }
    );
    return response.data;
  },

  updateUserStatus: async (
    id: string,
    status: UserStatus
  ): Promise<ApiResponse<AdminUserResponse>> => {
    const response = await api.put<ApiResponse<AdminUserResponse>>(
      `/admin/users/${id}/status`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  },

  toggleUserEnabled: async (
    id: string
  ): Promise<ApiResponse<AdminUserResponse>> => {
    const response = await api.put<ApiResponse<AdminUserResponse>>(
      `/admin/users/${id}/toggle-enabled`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<string>> => {
    const response = await api.delete<ApiResponse<string>>(
      `/admin/users/${id}`,
      { withCredentials: true }
    );
    return response.data;
  },
};
