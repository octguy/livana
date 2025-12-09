import { create } from "zustand";
import type { ExperienceCategoryState } from "@/types/state/experienceCategoryState";
import { experienceCategoryService } from "@/services/experienceCategoryService";

export const useExperienceCategoryStore = create<ExperienceCategoryState>(
  (set, get) => ({
    loading: false,
    experienceCategories: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,

    clearState: () =>
      set({
        loading: false,
        experienceCategories: [],
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
      }),

    setExperienceCategories: (categories) => {
      set({ experienceCategories: categories });
    },

    setPage: (page) => {
      set({ currentPage: page });
    },

    setPaginationInfo: (totalPages, totalElements) => {
      set({ totalPages, totalElements });
    },

    getAllExperienceCategories: async (page = 0, size = 15) => {
      try {
        set({ loading: true });
        const response =
          await experienceCategoryService.getAllExperienceCategories(
            page,
            size
          );
        const paginatedData = response.data as any;
        get().setExperienceCategories(paginatedData.content || []);
        get().setPage(paginatedData.number || page);
        get().setPaginationInfo(
          paginatedData.totalPages || 0,
          paginatedData.totalElements || 0
        );
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
