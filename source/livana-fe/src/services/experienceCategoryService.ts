import api from "@/lib/axios";
import type { ExperienceCategoryResponse } from "@/types/response/experienceCategoryResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const experienceCategoryService = {
  getAllExperienceCategories: async (
    page: number = 0,
    size: number = 15
  ): Promise<ApiResponse<ExperienceCategoryResponse[]>> => {
    const response = await api.get<ApiResponse<ExperienceCategoryResponse[]>>(
      `/experience-categories`,
      {
        params: { page, size },
        withCredentials: true,
      }
    );
    return response.data;
  },

  createExperienceCategory: async (
    name: string,
    icon: string
  ): Promise<ApiResponse<ExperienceCategoryResponse>> => {
    const response = await api.post<ApiResponse<ExperienceCategoryResponse>>(
      `/experience-categories`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  updateExperienceCategory: async (
    id: string,
    name: string,
    icon: string
  ): Promise<ApiResponse<ExperienceCategoryResponse>> => {
    const response = await api.put<ApiResponse<ExperienceCategoryResponse>>(
      `/experience-categories/${id}`,
      { name, icon },
      { withCredentials: true }
    );
    return response.data;
  },

  deleteExperienceCategory: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(
      `/experience-categories/${id}/soft`,
      { withCredentials: true }
    );
    return response.data;
  },
};
