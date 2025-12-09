import api from "@/lib/axios";
import type { AmenityResponse } from "@/types/response/amenityResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const amenityService = {
  getAllAmenities: async (
    page: number = 0,
    size: number = 15
  ): Promise<ApiResponse<AmenityResponse[]>> => {
    const response = await api.get<ApiResponse<AmenityResponse[]>>(
      `/amenities`,
      {
        params: { page, size },
        withCredentials: true,
      }
    );
    return response.data;
  },

  createAmenity: async (
    name: string,
    icon: string
  ): Promise<ApiResponse<AmenityResponse>> => {
    const response = await api.post<ApiResponse<AmenityResponse>>(
      `/amenities`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  updateAmenity: async (
    id: string,
    name: string,
    icon: string
  ): Promise<ApiResponse<AmenityResponse>> => {
    const response = await api.put<ApiResponse<AmenityResponse>>(
      `/amenities/${id}`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  deleteAmenity: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(
      `/amenities/${id}/soft`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
