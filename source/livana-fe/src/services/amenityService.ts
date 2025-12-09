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
};
