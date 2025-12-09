import { create } from "zustand";
import type { FacilityState } from "@/types/state/facilityState";
import { facilityService } from "@/services/facilityService";

export const useFacilityStore = create<FacilityState>((set, get) => ({
  loading: false,
  facilities: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,

  clearState: () =>
    set({
      loading: false,
      facilities: [],
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
    }),

  setFacilities: (facilities) => {
    set({ facilities });
  },

  setPage: (page) => {
    set({ currentPage: page });
  },

  setPaginationInfo: (totalPages, totalElements) => {
    set({ totalPages, totalElements });
  },

  getAllFacilities: async (page = 0, size = 15) => {
    try {
      set({ loading: true });
      const response = await facilityService.getAllFacilities(page, size);
      const paginatedData = response.data as any;
      get().setFacilities(paginatedData.content || []);
      get().setPage(paginatedData.number || page);
      get().setPaginationInfo(
        paginatedData.totalPages || 0,
        paginatedData.totalElements || 0
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createFacility: async (name: string, icon: string) => {
    try {
      const response = await facilityService.createFacility(name, icon);
      return response;
    } catch (error) {
      console.error("Error creating facility:", error);
      throw error;
    }
  },

  updateFacility: async (id: string, name: string, icon: string) => {
    try {
      const response = await facilityService.updateFacility(id, name, icon);
      return response;
    } catch (error) {
      console.error("Error updating facility:", error);
      throw error;
    }
  },

  deleteFacility: async (id: string) => {
    try {
      const response = await facilityService.deleteFacility(id);
      return response;
    } catch (error) {
      console.error("Error deleting facility:", error);
      throw error;
    }
  },
}));
