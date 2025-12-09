import { create } from "zustand";
import type { PropertyTypeState } from "@/types/state/propertyTypeState";
import { propertyTypeService } from "@/services/propertyTypeService";

export const usePropertyTypeStore = create<PropertyTypeState>((set, get) => ({
  loading: false,
  propertyTypes: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,

  clearState: () =>
    set({
      loading: false,
      propertyTypes: [],
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
    }),

  setPropertyTypes: (propertyTypes) => {
    set({ propertyTypes });
  },

  setPage: (page) => {
    set({ currentPage: page });
  },

  setPaginationInfo: (totalPages, totalElements) => {
    set({ totalPages, totalElements });
  },

  getAllPropertyTypes: async (page = 0, size = 15) => {
    try {
      set({ loading: true });
      const response = await propertyTypeService.getAllPropertyTypes(
        page,
        size
      );
      const paginatedData = response.data as any;
      get().setPropertyTypes(paginatedData.content || []);
      get().setPage(paginatedData.number || page);
      get().setPaginationInfo(
        paginatedData.totalPages || 0,
        paginatedData.totalElements || 0
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch property types:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
