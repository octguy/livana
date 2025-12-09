import { create } from "zustand";
import type { ExperienceCategoryState } from "@/types/state/experienceCategoryState";
import { experienceCategoryService } from "@/services/experienceCategoryService";

export const useExperienceCategoryStore = create<ExperienceCategoryState>(
  (set, get) => ({
    loading: false,
    experienceCategories: [],

    clearState: () => set({ loading: false, experienceCategories: [] }),

    setExperienceCategories: (categories) => {
      set({ experienceCategories: categories });
    },

    getAllExperienceCategories: async () => {
      try {
        set({ loading: true });
        const response =
          await experienceCategoryService.getAllExperienceCategories();
        get().setExperienceCategories(response.data);
        return response;
      } catch (error) {
        console.error("Failed to fetch experience categories:", error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },
  })
);
