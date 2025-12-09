import api from "@/lib/axios";
import type { FacilityResponse } from "@/types/response/facilityResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const facilityService = {
  getAllFacilities: async (): Promise<ApiResponse<FacilityResponse[]>> => {
    const response = await api.get<ApiResponse<FacilityResponse[]>>(
      `/facilities`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
