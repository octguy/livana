import { create } from "zustand";
import type { AmenityState } from "@/types/state/amenityState";
import { amenityService } from "@/services/amenityService";
import type { AmenityResponse } from "@/types/response/amenityResponse";

interface PaginatedResponse {
  content: AmenityResponse[];
  number: number;
  totalPages: number;
  totalElements: number;
}

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
      const paginatedData = response.data as unknown as PaginatedResponse;
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

  getAllAmenitiesComplete: async () => {
    try {
      set({ loading: true });
      const allAmenities: AmenityResponse[] = [];
      let currentPage = 0;
      let totalPages = 1;

      // Fetch all pages
      while (currentPage < totalPages) {
        const response = await amenityService.getAllAmenities(currentPage, 100);
        const paginatedData = response.data as unknown as PaginatedResponse;
        allAmenities.push(...(paginatedData.content || []));
        totalPages = paginatedData.totalPages || 1;
        currentPage++;
      }

      get().setAmenities(allAmenities);
      get().setPaginationInfo(totalPages, allAmenities.length);
      // console.log(
      //   `Loaded ${allAmenities.length} amenities from ${totalPages} pages`
      // );
      return allAmenities;
    } catch (error) {
      console.error("Failed to fetch all amenities:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createAmenity: async (name: string, icon: string) => {
    try {
      const response = await amenityService.createAmenity(name, icon);
      return response;
    } catch (error) {
      console.error("Error creating amenity:", error);
      throw error;
    }
  },

  updateAmenity: async (id: string, name: string, icon: string) => {
    try {
      const response = await amenityService.updateAmenity(id, name, icon);
      return response;
    } catch (error) {
      console.error("Error updating amenity:", error);
      throw error;
    }
  },

  deleteAmenity: async (id: string) => {
    try {
      const response = await amenityService.deleteAmenity(id);
      return response;
    } catch (error) {
      console.error("Error deleting amenity:", error);
      throw error;
    }
  },
}));
