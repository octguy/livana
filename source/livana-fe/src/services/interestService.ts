import api from "@/lib/axios";
import type { InterestResponse } from "@/types/response/interestResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const interestService = {
  getAllInterests: async (
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<InterestResponse[]>> => {
    const response = await api.get<ApiResponse<InterestResponse[]>>(
      `/interests`,
      {
        params: { page, size },
        withCredentials: true,
      }
    );
    return response.data;
  },

  getAllInterestsWithoutPagination: async (): Promise<
    ApiResponse<InterestResponse[]>
  > => {
    const response = await api.get<ApiResponse<InterestResponse[]>>(
      `/interests/all`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  createInterest: async (
    name: string,
    icon: string
  ): Promise<ApiResponse<InterestResponse>> => {
    const response = await api.post<ApiResponse<InterestResponse>>(
      `/interests`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  updateInterest: async (
    id: string,
    name: string,
    icon: string
  ): Promise<ApiResponse<InterestResponse>> => {
    const response = await api.put<ApiResponse<InterestResponse>>(
      `/interests/${id}`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  deleteInterest: async (id: string): Promise<ApiResponse<string>> => {
    const response = await api.delete<ApiResponse<string>>(
      `/interests/${id}/soft`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
