import { create } from "zustand";
import type { PropertyTypeState } from "@/types/state/propertyTypeState";
import { propertyTypeService } from "@/services/propertyTypeService";

export const usePropertyTypeStore = create<PropertyTypeState>((set, get) => ({
  loading: false,
  propertyTypes: [],

  setPropertyTypes: (propertyTypes) => {
    set({ propertyTypes });
  },

  getAllPropertyTypes: async () => {
    try {
      set({ loading: true });
      const response = await propertyTypeService.getAllPropertyTypes();
      get().setPropertyTypes(response.data);
      return response;
    } catch (error) {
      console.error("Failed to fetch property types:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
