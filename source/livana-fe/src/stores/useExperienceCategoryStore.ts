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

    createExperienceCategory: async (name: string, icon: string) => {
      try {
        const response =
          await experienceCategoryService.createExperienceCategory(name, icon);
        return response;
      } catch (error) {
        console.error("Error creating experience category:", error);
        throw error;
      }
    },

    updateExperienceCategory: async (
      id: string,
      name: string,
      icon: string
    ) => {
      try {
        const response =
          await experienceCategoryService.updateExperienceCategory(
            id,
            name,
            icon
          );
        return response;
      } catch (error) {
        console.error("Error updating experience category:", error);
        throw error;
      }
    },

    deleteExperienceCategory: async (id: string) => {
      try {
        const response =
          await experienceCategoryService.deleteExperienceCategory(id);
        return response;
      } catch (error) {
        console.error("Error deleting experience category:", error);
        throw error;
      }
    },
  })
);
