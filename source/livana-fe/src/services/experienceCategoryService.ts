import api from "@/lib/axios";
import type { ExperienceCategoryResponse } from "@/types/response/experienceCategoryResponse";
import type { ApiResponse } from "@/types/response/apiResponse";

export const experienceCategoryService = {
  getAllExperienceCategories: async (): Promise<
    ApiResponse<ExperienceCategoryResponse[]>
  > => {
    const response = await api.get<ApiResponse<ExperienceCategoryResponse[]>>(
      `/experience-categories`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
