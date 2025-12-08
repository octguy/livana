import type { ApiResponse } from "../response/apiResponse";
import type { ExperienceCategoryResponse } from "../response/experienceCategoryResponse";

export interface ExperienceCategoryState {
  loading: boolean;
  experienceCategories: ExperienceCategoryResponse[];

  setExperienceCategories: (categories: ExperienceCategoryResponse[]) => void;
  getAllExperienceCategories: () => Promise<
    ApiResponse<ExperienceCategoryResponse[]>
  >;
}
