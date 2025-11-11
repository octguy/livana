import type { User } from "@/types/response/userResponse";
import type { ApiResponse } from "@/types/response/apiResponse";
import api from "@/lib/axios";

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
};
