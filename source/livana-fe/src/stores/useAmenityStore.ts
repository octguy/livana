import { create } from "zustand";
import type { AmenityState } from "@/types/state/amenityState";
import { amenityService } from "@/services/amenityService";

export const useAmenityStore = create<AmenityState>((set, get) => ({
  loading: false,
  amenities: [],

  clearState: () => set({ loading: false, amenities: [] }),

  setAmenities: (amenities) => {
    set({ amenities });
  },

  getAllAmenities: async () => {
    try {
      set({ loading: true });
      const response = await amenityService.getAllAmenities();
      get().setAmenities(response.data);
      return response;
    } catch (error) {
      console.error("Failed to fetch amenities:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
