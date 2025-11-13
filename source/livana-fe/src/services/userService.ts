import type { User } from "@/types/response/userResponse";
import type { ApiResponse } from "@/types/response/apiResponse";
import api from "@/lib/axios";
import type { UserInterestResponse } from "@/types/response/userInterestResponse";

export const userService = {
  update: async (
    id: string,
    updatedProfile: {
      fullName?: string;
      phoneNumber?: string;
      bio?: string;
      avatarUrl?: string;
      avatarPublicId?: string;
    }
  ): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(
      `/users/profiles/${id}`,
      updatedProfile,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  getUserInterests: async (): Promise<ApiResponse<UserInterestResponse>> => {
    const response = await api.get<ApiResponse<UserInterestResponse>>(
      `/users/me/interests`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  updateUserInterests: async (
    interestIds: string[]
  ): Promise<ApiResponse<UserInterestResponse>> => {
    const response = await api.put<ApiResponse<UserInterestResponse>>(
      `/users/me/interests`,
      { interestIds },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
