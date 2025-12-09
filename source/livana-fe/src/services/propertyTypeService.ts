import api from "@/lib/axios";
import type { PropertyTypeResponse } from "@/types/response/propertyTypeResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const propertyTypeService = {
  getAllPropertyTypes: async (
    page: number = 0,
    size: number = 15
  ): Promise<ApiResponse<PropertyTypeResponse[]>> => {
    const response = await api.get<ApiResponse<PropertyTypeResponse[]>>(
      `/property-types`,
      {
        params: { page, size },
        withCredentials: true,
      }
    );
    return response.data;
  },
};
