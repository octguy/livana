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

  createPropertyType: async (
    name: string,
    icon: string
  ): Promise<ApiResponse<PropertyTypeResponse>> => {
    const response = await api.post<ApiResponse<PropertyTypeResponse>>(
      `/property-types`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  updatePropertyType: async (
    id: string,
    name: string,
    icon: string
  ): Promise<ApiResponse<PropertyTypeResponse>> => {
    const response = await api.put<ApiResponse<PropertyTypeResponse>>(
      `/property-types/${id}`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  deletePropertyType: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(
      `/property-types/${id}/soft`,
      { withCredentials: true }
    );
    return response.data;
  },
};
