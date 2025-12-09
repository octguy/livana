import api from "@/lib/axios";
import type { FacilityResponse } from "@/types/response/facilityResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const facilityService = {
  getAllFacilities: async (
    page: number = 0,
    size: number = 15
  ): Promise<ApiResponse<FacilityResponse[]>> => {
    const response = await api.get<ApiResponse<FacilityResponse[]>>(
      `/facilities`,
      {
        params: { page, size },
        withCredentials: true,
      }
    );
    return response.data;
  },

  createFacility: async (
    name: string,
    icon: string
  ): Promise<ApiResponse<FacilityResponse>> => {
    const response = await api.post<ApiResponse<FacilityResponse>>(
      `/facilities`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  updateFacility: async (
    id: string,
    name: string,
    icon: string
  ): Promise<ApiResponse<FacilityResponse>> => {
    const response = await api.put<ApiResponse<FacilityResponse>>(
      `/facilities/${id}`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  deleteFacility: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(
      `/facilities/${id}/soft`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
