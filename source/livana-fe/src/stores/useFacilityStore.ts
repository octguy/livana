import { create } from "zustand";
import type { FacilityState } from "@/types/state/facilityState";
import { facilityService } from "@/services/facilityService";

export const useFacilityStore = create<FacilityState>((set, get) => ({
  loading: false,
  facilities: [],

  clearState: () => set({ loading: false, facilities: [] }),

  setFacilities: (facilities) => {
    set({ facilities });
  },

  getAllFacilities: async () => {
    try {
      set({ loading: true });
      const response = await facilityService.getAllFacilities();
      get().setFacilities(response.data);
      return response;
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
