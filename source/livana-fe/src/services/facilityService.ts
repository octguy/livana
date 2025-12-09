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
};
