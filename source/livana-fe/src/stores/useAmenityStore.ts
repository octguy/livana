import { create } from "zustand";
import type { AmenityState } from "@/types/state/amenityState";
import { amenityService } from "@/services/amenityService";

export const useAmenityStore = create<AmenityState>((set, get) => ({
  loading: false,
  amenities: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,

  clearState: () =>
    set({
      loading: false,
      amenities: [],
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
    }),

  setAmenities: (amenities) => {
    set({ amenities });
  },

  setPage: (page) => {
    set({ currentPage: page });
  },

  setPaginationInfo: (totalPages, totalElements) => {
    set({ totalPages, totalElements });
  },

  getAllAmenities: async (page = 0, size = 15) => {
    try {
      set({ loading: true });
      const response = await amenityService.getAllAmenities(page, size);
      const paginatedData = response.data as any;
      get().setAmenities(paginatedData.content || []);
      get().setPage(paginatedData.number || page);
      get().setPaginationInfo(
        paginatedData.totalPages || 0,
        paginatedData.totalElements || 0
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch amenities:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
