import api from "@/lib/axios";
import type { AmenityResponse } from "@/types/response/amenityResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const amenityService = {
  getAllAmenities: async (): Promise<ApiResponse<AmenityResponse[]>> => {
    const response = await api.get<ApiResponse<AmenityResponse[]>>(
      `/amenities`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
