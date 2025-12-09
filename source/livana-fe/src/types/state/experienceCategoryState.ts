import type { ApiResponse } from "../response/apiResponse";
import type { ExperienceCategoryResponse } from "../response/experienceCategoryResponse";

export interface ExperienceCategoryState {
  loading: boolean;
  experienceCategories: ExperienceCategoryResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;

  clearState: () => void;
  setExperienceCategories: (categories: ExperienceCategoryResponse[]) => void;
  setPage: (page: number) => void;
  setPaginationInfo: (totalPages: number, totalElements: number) => void;
  getAllExperienceCategories: (
    page?: number,
    size?: number
  ) => Promise<ApiResponse<ExperienceCategoryResponse[]>>;
  createExperienceCategory: (
    name: string,
    icon: string
  ) => Promise<ApiResponse<ExperienceCategoryResponse>>;
  updateExperienceCategory: (
    id: string,
    name: string,
    icon: string
  ) => Promise<ApiResponse<ExperienceCategoryResponse>>;
  deleteExperienceCategory: (id: string) => Promise<ApiResponse<void>>;
}
