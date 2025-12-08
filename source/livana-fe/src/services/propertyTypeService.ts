import api from "@/lib/axios";
import type { PropertyTypeResponse } from "@/types/response/propertyTypeResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const propertyTypeService = {
  getAllPropertyTypes: async (): Promise<
    ApiResponse<PropertyTypeResponse[]>
  > => {
    const response = await api.get<ApiResponse<PropertyTypeResponse[]>>(
      `/property-types`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
