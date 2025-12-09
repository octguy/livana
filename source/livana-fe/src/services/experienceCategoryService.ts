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
};
